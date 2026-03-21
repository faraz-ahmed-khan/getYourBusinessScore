'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { IntakePayload } from '@/lib/types';
import { getEmptyIntakePayload } from '@/lib/mock-data';
import { ASSESSMENT_STEP_COUNT } from '@/lib/constants';
import { validateStep, validateFullIntake } from '@/lib/validation';
import { AssessmentFlow } from '@/components/assessment/AssessmentFlow';
import { Step1Identity } from '@/components/assessment/steps/Step1Identity';
import { Step2Permissions } from '@/components/assessment/steps/Step2Permissions';
import { Step3Communication } from '@/components/assessment/steps/Step3Communication';
import { Step4Intent } from '@/components/assessment/steps/Step4Intent';
import { Step5Readiness } from '@/components/assessment/steps/Step5Readiness';
import { Step6Opportunity } from '@/components/assessment/steps/Step6Opportunity';
import { Step7Representation } from '@/components/assessment/steps/Step7Representation';
import { Step8Documents } from '@/components/assessment/steps/Step8Documents';

const STEPS: { title: string; component: React.ComponentType<{ data: IntakePayload; onChange: (data: Partial<IntakePayload>) => void; errors: Record<string, string> }> }[] = [
  { title: 'Identity', component: Step1Identity },
  { title: 'Permissions', component: Step2Permissions },
  { title: 'Communication', component: Step3Communication },
  { title: 'Intent', component: Step4Intent },
  { title: 'Readiness', component: Step5Readiness },
  { title: 'Opportunity', component: Step6Opportunity },
  { title: 'Representation', component: Step7Representation },
  { title: 'Documents', component: Step8Documents },
];

export default function AssessmentPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<IntakePayload>(() => getEmptyIntakePayload());
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = useCallback((partial: Partial<IntakePayload>) => {
    setPayload((p) => ({
      ...p,
      ...partial,
      pack1_identity: { ...p.pack1_identity, ...(partial.pack1_identity ?? {}) },
      pack2_permissions: { ...p.pack2_permissions, ...(partial.pack2_permissions ?? {}) },
      pack3_communication: { ...p.pack3_communication, ...(partial.pack3_communication ?? {}) },
      pack4_intent: { ...p.pack4_intent, ...(partial.pack4_intent ?? {}) },
      pack5_readiness: { ...p.pack5_readiness, ...(partial.pack5_readiness ?? {}) },
      pack6_opportunity: { ...p.pack6_opportunity, ...(partial.pack6_opportunity ?? {}) },
      pack7_representation: { ...p.pack7_representation, ...(partial.pack7_representation ?? {}) },
      pack8_documents: { ...p.pack8_documents, ...(partial.pack8_documents ?? {}) },
    }));
    setErrors({});
  }, []);

  const goNext = () => {
    const errs = validateStep(payload, step);
    if (errs.length > 0) {
      const map: Record<string, string> = {};
      errs.forEach((e) => { map[e.field] = e.message; });
      setErrors(map);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const fieldToStep: Record<string, number> = {
    businessName: 1, primaryContact: 1, email: 1, phone: 1, businessAddress: 1, naicsCode: 1,
    permissionCommunicate: 2, permissionUploadStore: 2, permissionActAsAgent: 2, permissionRepresentOpportunity: 2,
    contactPreference: 3, communicationFrequency: 3,
    whatLookingFor: 4, whatLookingForOther: 4,
    howPreparedFeel: 5, howImproveReadiness: 5,
    opportunityType: 6, timeline: 6, describeOpportunity: 6, attemptedBefore: 6, attemptedBeforeWhatHappened: 6, biggestChallenge: 6,
    authorizeReviewOpportunity: 7, authorizeMatchSuppliersLendersPrograms: 7, authorizeCommunicateOnBehalf: 7,
  };

  const handleSubmit = async () => {
    const errs = validateFullIntake(payload);
    if (errs.length > 0) {
      const map: Record<string, string> = {};
      let firstStep = step;
      errs.forEach((e) => {
        map[e.field] = e.message;
        const s = fieldToStep[e.field];
        if (s !== undefined && s < firstStep) firstStep = s;
      });
      setErrors(map);
      setStep(firstStep);
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errs: Record<string, string> = {};
        (data.errors || []).forEach((e: { field: string; message: string }) => { errs[e.field] = e.message; });
        setErrors(errs);
        setSubmitting(false);
        return;
      }
      sessionStorage.setItem('gybs_record_id', data.record_id);
      router.push('/results');
    } catch {
      setErrors({ _form: 'Something went wrong. Please try again.' });
      setSubmitting(false);
    }
  };

  const StepComponent = STEPS[step - 1]?.component;
  const stepTitle = STEPS[step - 1]?.title ?? '';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 pb-20">
      <AssessmentFlow
        step={step}
        totalSteps={ASSESSMENT_STEP_COUNT}
        stepTitle={stepTitle}
        onPrevious={step > 1 ? () => setStep((s) => s - 1) : undefined}
        onNext={step < ASSESSMENT_STEP_COUNT ? goNext : undefined}
        onSubmit={step === ASSESSMENT_STEP_COUNT ? handleSubmit : undefined}
        submitting={submitting}
        errors={errors}
      >
        {StepComponent && (
          <StepComponent data={payload} onChange={update} errors={errors} />
        )}
      </AssessmentFlow>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GYBS_SELECTED_PATHWAY_KEY,
  GYBS_SCORE_RESULT_KEY,
  isPathwayId,
  pathwayBadgeLabel,
  PATHWAY_TITLE,
  type PathwayId,
} from '@/lib/pathways';
import { type IntakeAnswers } from '@/lib/scoring-engine';

type Step = 0 | 1 | 2 | 3;

function PillOption<T extends string>({
  name,
  value,
  current,
  label,
  onPick,
}: {
  name: string;
  value: T;
  current: T | undefined;
  label: string;
  onPick: (v: T) => void;
}) {
  const selected = current === value;
  return (
    <label
      className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-center text-sm font-medium transition-all duration-gybs ease-in-out md:text-base ${
        selected
          ? 'border-gybs-blue bg-[#EFF6FF] text-gybs-navy'
          : 'border-gybs-border bg-white text-gybs-body hover:border-gybs-blue/40'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onPick(value)}
        className="sr-only"
      />
      {label}
    </label>
  );
}

function QuestionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gybs-border bg-white p-5 shadow-sm md:p-6">
      <p className="text-base font-bold text-gybs-ink">{title}</p>
      <div className="mt-4 flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

const defaultPathway: PathwayId = 'business';

type ZohoSubmitResponse = {
  success?: boolean;
  recordId?: string | number;
  businessId?: string;
  error?: string;
  details?: unknown;
};

type ZohoResultResponse = {
  success?: boolean;
  result?: {
    businessReadinessScore: number | string;
    level: string;
    lane: string;
    assignedPack: string;
    corrections: string;
    upgradePathway: string;
  };
  error?: string;
  details?: unknown;
};

export function AssessmentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [pathway, setPathway] = useState<PathwayId>(defaultPathway);
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Partial<IntakeAnswers>>({});
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerBusinessName, setCustomerBusinessName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [introError, setIntroError] = useState<string | null>(null);

  useEffect(() => {
    const q = searchParams.get('pathway');
    if (isPathwayId(q)) {
      sessionStorage.setItem(GYBS_SELECTED_PATHWAY_KEY, q);
      setPathway(q);
      return;
    }

    const stored = sessionStorage.getItem(GYBS_SELECTED_PATHWAY_KEY);
    if (isPathwayId(stored)) {
      setPathway(stored);
    }
  }, [searchParams]);

  const patch = useCallback(
    <K extends keyof IntakeAnswers>(key: K, value: IntakeAnswers[K]) => {
      setAnswers((a) => ({ ...a, [key]: value }));
    },
    []
  );

  const step1Ok = useMemo(() => {
    const a = answers;
    return (
      a.hasEIN !== undefined &&
      a.hasBusinessBankAccount !== undefined &&
      a.hasBookKeeping !== undefined &&
      a.hasFinancialStatements !== undefined
    );
  }, [answers]);

  const step2Ok = useMemo(() => {
    const a = answers;
    return (
      a.hasDefinedOffers !== undefined &&
      a.hasPricingDefined !== undefined &&
      a.hasWrittenDescriptions !== undefined
    );
  }, [answers]);

  const step3Ok = useMemo(() => {
    const a = answers;
    return (
      a.hasCustomers !== undefined &&
      a.hasRepeatCustomers !== undefined &&
      a.hasPartners !== undefined
    );
  }, [answers]);

  const introStepOk = useMemo(() => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim());
    return customerName.trim().length > 0 && emailOk && customerBusinessName.trim().length > 0;
  }, [customerBusinessName, customerEmail, customerName]);

  const continueFromIntro = () => {
    if (introStepOk) {
      setIntroError(null);
      setStep(1);
      return;
    }

    if (!customerName.trim()) {
      setIntroError('Please enter customer name.');
      return;
    }

    if (!customerEmail.trim()) {
      setIntroError('Please enter customer email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail.trim())) {
      setIntroError('Please enter a valid customer email.');
      return;
    }

    if (!customerBusinessName.trim()) {
      setIntroError('Please enter customer business name.');
      return;
    }
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const full = answers as IntakeAnswers;

      const businessId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `gybs-${Date.now()}`;

      const submitPayload = {
        businessId,
        intakeVersion: '1.0',
        Name: customerName.trim(),
        Email: customerEmail.trim(),
        Business_Name: customerBusinessName.trim(),
        hasEIN: full.hasEIN,
        hasBusinessBankAccount: full.hasBusinessBankAccount,
        hasBookKeeping: full.hasBookKeeping,
        hasFinancialStatements: full.hasFinancialStatements,
        hasDefinedOffers: full.hasDefinedOffers,
        hasPricingDefined: full.hasPricingDefined,
        hasWrittenDescriptions: full.hasWrittenDescriptions,
        hasCustomers: full.hasCustomers,
        hasRepeatCustomers: full.hasRepeatCustomers,
        hasPartners: full.hasPartners,
      };

      const submitRes = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitPayload),
      });

      const submitData = (await submitRes.json()) as ZohoSubmitResponse;

      if (!submitRes.ok || !submitData.recordId) {
        throw new Error(submitData.error || 'Failed to submit intake to Zoho');
      }

      const readinessUrl = new URL(
        `/api/readiness/result/${submitData.recordId}`,
        window.location.origin
      );

      if (submitData.businessId) {
        readinessUrl.searchParams.set('businessId', submitData.businessId);
      }

      let resultData: ZohoResultResponse | null = null;
      const resultFetchAttempts = 4;

      for (let attempt = 0; attempt < resultFetchAttempts; attempt += 1) {
        const resultRes = await fetch(readinessUrl.toString(), {
          method: 'GET',
          cache: 'no-store',
        });

        resultData = (await resultRes.json()) as ZohoResultResponse;

        if (resultRes.ok && resultData.result) {
          break;
        }

        if (attempt < resultFetchAttempts - 1) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }

      if (!resultData?.result) {
        throw new Error(resultData?.error || 'Failed to fetch scored result from Zoho');
      }

      const payload = {
        score: Number(resultData.result.businessReadinessScore),
        readinessLevel: resultData.result.level,
        recommendedLane: resultData.result.lane,
        assignedPack: resultData.result.assignedPack,
        corrections: resultData.result.corrections,
        upgradePathway: resultData.result.upgradePathway,
        pathway,
        pathwayLabel: pathwayBadgeLabel(pathway),
        pathwayTitle: PATHWAY_TITLE[pathway],
      };

      sessionStorage.setItem(GYBS_SCORE_RESULT_KEY, JSON.stringify(payload));
      router.push('/results');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong while submitting your assessment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const pathwayLabel = PATHWAY_TITLE[pathway];

  return (
    <div className="min-h-screen bg-gybs-light pb-20">
      <div className="border-b border-gybs-border bg-white">
        <div className="mx-auto flex max-w-content items-center gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="text-sm font-medium text-gybs-blue hover:text-gybs-navy">
            ← Back
          </Link>
          <div className="flex flex-1 justify-center">
            <div className="relative h-10 w-[100px]">
              <Image src="/images/logo.png" alt="GYBS" fill className="object-contain" />
            </div>
          </div>
          <div className="w-14" aria-hidden />
        </div>
        <div className="mx-auto max-w-content px-4 pb-4 md:px-6">
          <div className="flex gap-2">
            {([1, 2, 3] as const).map((n) => (
              <div
                key={n}
                className={`h-2 flex-1 rounded-full transition-colors duration-gybs ${
                  step >= n ? 'bg-gybs-blue' : 'bg-gybs-border'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-gybs-muted">
            {step === 0
              ? 'Before you start — Customer details'
              : `Step ${step} of 3 — ${step === 1 ? 'Operations' : step === 2 ? 'Your Offers' : 'Your Market'}`}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[680px] px-4">
        <div className="rounded-xl border border-gybs-border bg-white p-8 shadow-gybs-card md:p-10">
          <div className="mb-8 inline-flex rounded-full bg-gybs-navy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">
            Selected Pathway: {pathwayLabel}
          </div>

          {step === 0 && (
            <div className="space-y-6">
              <p className="text-sm font-semibold text-gybs-muted">Customer Details</p>
              <div className="rounded-xl border border-gybs-border bg-white p-5 shadow-sm md:p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="customer-name" className="text-sm font-semibold text-gybs-ink">
                      Name
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(event) => {
                        setCustomerName(event.target.value);
                        if (introError) setIntroError(null);
                      }}
                      className="w-full rounded-lg border border-gybs-border px-4 py-3 text-sm text-gybs-ink outline-none transition focus:border-gybs-blue focus:ring-2 focus:ring-gybs-blue/20"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="customer-email" className="text-sm font-semibold text-gybs-ink">
                      Email
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={(event) => {
                        setCustomerEmail(event.target.value);
                        if (introError) setIntroError(null);
                      }}
                      className="w-full rounded-lg border border-gybs-border px-4 py-3 text-sm text-gybs-ink outline-none transition focus:border-gybs-blue focus:ring-2 focus:ring-gybs-blue/20"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="customer-business-name" className="text-sm font-semibold text-gybs-ink">
                      Business Name
                    </label>
                    <input
                      id="customer-business-name"
                      type="text"
                      value={customerBusinessName}
                      onChange={(event) => {
                        setCustomerBusinessName(event.target.value);
                        if (introError) setIntroError(null);
                      }}
                      className="w-full rounded-lg border border-gybs-border px-4 py-3 text-sm text-gybs-ink outline-none transition focus:border-gybs-blue focus:ring-2 focus:ring-gybs-blue/20"
                      placeholder="Enter your business name"
                    />
                  </div>
                </div>
              </div>
              {introError && <p className="text-sm text-red-600">{introError}</p>}
              <button
                type="button"
                disabled={submitting}
                onClick={continueFromIntro}
                className="gybs-btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <p className="text-sm font-semibold text-gybs-muted">Step 1 of 3 — Operations</p>
              <QuestionCard title="Do you have an EIN (Employer Identification Number)?">
                <PillOption name="ein" value="yes" current={answers.hasEIN} label="Yes" onPick={(v) => patch('hasEIN', v)} />
                <PillOption name="ein" value="no" current={answers.hasEIN} label="No" onPick={(v) => patch('hasEIN', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have a dedicated business bank account?">
                <PillOption name="bank" value="yes" current={answers.hasBusinessBankAccount} label="Yes" onPick={(v) => patch('hasBusinessBankAccount', v)} />
                <PillOption name="bank" value="no" current={answers.hasBusinessBankAccount} label="No" onPick={(v) => patch('hasBusinessBankAccount', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have active bookkeeping?">
                <PillOption name="book" value="yes" current={answers.hasBookKeeping} label="Yes" onPick={(v) => patch('hasBookKeeping', v)} />
                <PillOption name="book" value="outsourced" current={answers.hasBookKeeping} label="Outsourced" onPick={(v) => patch('hasBookKeeping', v)} />
                <PillOption name="book" value="no" current={answers.hasBookKeeping} label="No" onPick={(v) => patch('hasBookKeeping', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have financial statements (P&L, balance sheet)?">
                <PillOption name="fin" value="yes" current={answers.hasFinancialStatements} label="Yes" onPick={(v) => patch('hasFinancialStatements', v)} />
                <PillOption name="fin" value="partial" current={answers.hasFinancialStatements} label="Partial" onPick={(v) => patch('hasFinancialStatements', v)} />
                <PillOption name="fin" value="no" current={answers.hasFinancialStatements} label="No" onPick={(v) => patch('hasFinancialStatements', v)} />
              </QuestionCard>
              <button
                type="button"
                disabled={!step1Ok}
                onClick={() => setStep(2)}
                className="gybs-btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue to Step 2 →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <p className="text-sm font-semibold text-gybs-muted">Step 2 of 3 — Your Offers</p>
              <QuestionCard title="Do you have clearly defined products or services?">
                <PillOption name="offers" value="yes" current={answers.hasDefinedOffers} label="Yes" onPick={(v) => patch('hasDefinedOffers', v)} />
                <PillOption name="offers" value="in-progress" current={answers.hasDefinedOffers} label="In Progress" onPick={(v) => patch('hasDefinedOffers', v)} />
                <PillOption name="offers" value="no" current={answers.hasDefinedOffers} label="No" onPick={(v) => patch('hasDefinedOffers', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have pricing defined for your offers?">
                <PillOption name="price" value="yes" current={answers.hasPricingDefined} label="Yes" onPick={(v) => patch('hasPricingDefined', v)} />
                <PillOption name="price" value="tiered" current={answers.hasPricingDefined} label="Tiered" onPick={(v) => patch('hasPricingDefined', v)} />
                <PillOption name="price" value="no" current={answers.hasPricingDefined} label="No" onPick={(v) => patch('hasPricingDefined', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have written descriptions for your products or services?">
                <PillOption name="written" value="yes" current={answers.hasWrittenDescriptions} label="Yes" onPick={(v) => patch('hasWrittenDescriptions', v)} />
                <PillOption name="written" value="partial" current={answers.hasWrittenDescriptions} label="Partial" onPick={(v) => patch('hasWrittenDescriptions', v)} />
                <PillOption name="written" value="no" current={answers.hasWrittenDescriptions} label="No" onPick={(v) => patch('hasWrittenDescriptions', v)} />
              </QuestionCard>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(1)} className="gybs-btn-secondary flex-1">
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!step2Ok}
                  onClick={() => setStep(3)}
                  className="gybs-btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to Step 3 →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <p className="text-sm font-semibold text-gybs-muted">Step 3 of 3 — Your Market</p>
              <QuestionCard title="Do you have paying customers?">
                <PillOption name="cust" value="yes" current={answers.hasCustomers} label="Yes" onPick={(v) => patch('hasCustomers', v)} />
                <PillOption name="cust" value="no" current={answers.hasCustomers} label="No" onPick={(v) => patch('hasCustomers', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have repeat customers?">
                <PillOption name="repeat" value="yes" current={answers.hasRepeatCustomers} label="Yes" onPick={(v) => patch('hasRepeatCustomers', v)} />
                <PillOption name="repeat" value="unknown" current={answers.hasRepeatCustomers} label="Unknown" onPick={(v) => patch('hasRepeatCustomers', v)} />
                <PillOption name="repeat" value="no" current={answers.hasRepeatCustomers} label="No" onPick={(v) => patch('hasRepeatCustomers', v)} />
              </QuestionCard>
              <QuestionCard title="Do you have business partners, vendors, or suppliers?">
                <PillOption name="part" value="yes" current={answers.hasPartners} label="Yes" onPick={(v) => patch('hasPartners', v)} />
                <PillOption name="part" value="informal" current={answers.hasPartners} label="Informal" onPick={(v) => patch('hasPartners', v)} />
                <PillOption name="part" value="no" current={answers.hasPartners} label="No" onPick={(v) => patch('hasPartners', v)} />
              </QuestionCard>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => setStep(2)} className="gybs-btn-secondary flex-1">
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={!step3Ok}
                  onClick={submit}
                  className="gybs-btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Get My Score →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

const OPPORTUNITY_TYPE_OPTIONS: { value: IntakePayload['pack6_opportunity']['opportunityType']; label: string }[] = [
  { value: 'Purchase', label: 'Purchase' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Loan', label: 'Loan' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Program', label: 'Program' },
  { value: 'Other', label: 'Other' },
];

const TIMELINE_OPTIONS: { value: IntakePayload['pack6_opportunity']['timeline']; label: string }[] = [
  { value: 'Immediately', label: 'Immediately' },
  { value: '30 days', label: '30 days' },
  { value: '60 days', label: '60 days' },
  { value: '90+ days', label: '90+ days' },
];

/** PACK 6 — Opportunity Pack. "If yes, what happened?" only when Yes selected. */
export function Step6Opportunity({ data, onChange, errors }: Props) {
  const p = data.pack6_opportunity;
  const showWhatHappened = p.attemptedBefore === 'Yes';
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          What type of opportunity are you pursuing?
        </label>
        <div className="mt-2 space-y-2">
          {OPPORTUNITY_TYPE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="opportunityType"
                value={opt.value}
                checked={p.opportunityType === opt.value}
                onChange={() => onChange({ pack6_opportunity: { ...p, opportunityType: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.opportunityType && (
          <p className="mt-1 text-sm text-red-600">{errors.opportunityType}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          What is your timeline?
        </label>
        <div className="mt-2 space-y-2">
          {TIMELINE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="timeline"
                value={opt.value}
                checked={p.timeline === opt.value}
                onChange={() => onChange({ pack6_opportunity: { ...p, timeline: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.timeline && <p className="mt-1 text-sm text-red-600">{errors.timeline}</p>}
      </div>
      <div>
        <label htmlFor="describeOpportunity" className="block text-sm font-medium text-neutral-700">
          Describe your opportunity in your own words.
        </label>
        <textarea
          id="describeOpportunity"
          rows={3}
          value={p.describeOpportunity}
          onChange={(e) => onChange({ pack6_opportunity: { ...p, describeOpportunity: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.describeOpportunity && (
          <p className="mt-1 text-sm text-red-600">{errors.describeOpportunity}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Have you attempted this opportunity before?
        </label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attemptedBefore"
              value="Yes"
              checked={p.attemptedBefore === 'Yes'}
              onChange={() => onChange({ pack6_opportunity: { ...p, attemptedBefore: 'Yes' } })}
              className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">Yes</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attemptedBefore"
              value="No"
              checked={p.attemptedBefore === 'No'}
              onChange={() => onChange({ pack6_opportunity: { ...p, attemptedBefore: 'No' } })}
              className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">No</span>
          </label>
        </div>
        {errors.attemptedBefore && (
          <p className="mt-1 text-sm text-red-600">{errors.attemptedBefore}</p>
        )}
      </div>
      {showWhatHappened && (
        <div>
          <label htmlFor="attemptedBeforeWhatHappened" className="block text-sm font-medium text-neutral-700">
            If yes, what happened?
          </label>
          <textarea
            id="attemptedBeforeWhatHappened"
            rows={2}
            value={p.attemptedBeforeWhatHappened ?? ''}
            onChange={(e) =>
              onChange({ pack6_opportunity: { ...p, attemptedBeforeWhatHappened: e.target.value } })
            }
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {errors.attemptedBeforeWhatHappened && (
            <p className="mt-1 text-sm text-red-600">{errors.attemptedBeforeWhatHappened}</p>
          )}
        </div>
      )}
      <div>
        <label htmlFor="biggestChallenge" className="block text-sm font-medium text-neutral-700">
          What is the biggest challenge you're facing right now?
        </label>
        <textarea
          id="biggestChallenge"
          rows={2}
          value={p.biggestChallenge}
          onChange={(e) => onChange({ pack6_opportunity: { ...p, biggestChallenge: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.biggestChallenge && (
          <p className="mt-1 text-sm text-red-600">{errors.biggestChallenge}</p>
        )}
      </div>
    </div>
  );
}

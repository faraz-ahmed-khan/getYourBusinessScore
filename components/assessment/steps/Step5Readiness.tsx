'use client';

import type { IntakePayload, DocumentOption } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

const DOCUMENT_OPTIONS: { value: IntakePayload['pack5_readiness']['documentsHave'][number]; label: string }[] = [
  { value: 'Business license', label: 'Business license' },
  { value: 'EIN', label: 'EIN' },
  { value: 'Bank statements', label: 'Bank statements' },
  { value: 'Tax returns', label: 'Tax returns' },
  { value: 'Financial statements', label: 'Financial statements' },
  { value: 'Other', label: 'Other' },
];

const PREPARED_OPTIONS: { value: IntakePayload['pack5_readiness']['howPreparedFeel']; label: string }[] = [
  { value: 'Not prepared', label: 'Not prepared' },
  { value: 'Somewhat prepared', label: 'Somewhat prepared' },
  { value: 'Prepared', label: 'Prepared' },
  { value: 'Very prepared', label: 'Very prepared' },
];

const IMPROVE_OPTIONS: { value: IntakePayload['pack5_readiness']['howImproveReadiness']; label: string }[] = [
  { value: 'Self-guided', label: 'Self-guided' },
  { value: 'Assisted', label: 'Assisted' },
  { value: 'Subscription', label: 'Subscription' },
];

/** PACK 5 — Readiness Pack. Intake-level metadata only, not readiness actions. */
export function Step5Readiness({ data, onChange, errors }: Props) {
  const p = data.pack5_readiness;

  const toggleDoc = (doc: DocumentOption) => {
    const have = p.documentsHave || [];
    const next = have.includes(doc) ? have.filter((d) => d !== doc) : [...have, doc];
    onChange({ pack5_readiness: { ...p, documentsHave: next } });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          Which documents do you already have?
        </label>
        <div className="mt-2 space-y-2">
          {DOCUMENT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(p.documentsHave || []).includes(opt.value)}
                onChange={() => toggleDoc(opt.value)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="documentsNeed" className="block text-sm font-medium text-neutral-700">
          Which documents do you still need?
        </label>
        <textarea
          id="documentsNeed"
          rows={2}
          value={p.documentsNeed}
          onChange={(e) => onChange({ pack5_readiness: { ...p, documentsNeed: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          How prepared do you feel right now?
        </label>
        <div className="mt-2 space-y-2">
          {PREPARED_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="howPreparedFeel"
                value={opt.value}
                checked={p.howPreparedFeel === opt.value}
                onChange={() => onChange({ pack5_readiness: { ...p, howPreparedFeel: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.howPreparedFeel && (
          <p className="mt-1 text-sm text-red-600">{errors.howPreparedFeel}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          How would you like to improve your readiness?
        </label>
        <div className="mt-2 space-y-2">
          {IMPROVE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="howImproveReadiness"
                value={opt.value}
                checked={p.howImproveReadiness === opt.value}
                onChange={() => onChange({ pack5_readiness: { ...p, howImproveReadiness: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.howImproveReadiness && (
          <p className="mt-1 text-sm text-red-600">{errors.howImproveReadiness}</p>
        )}
      </div>
    </div>
  );
}

'use client';

import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

const INTENT_OPTIONS: { value: IntakePayload['pack4_intent']['whatLookingFor']; label: string }[] = [
  { value: 'Marketplace products', label: 'Marketplace products' },
  { value: 'Distribution support', label: 'Distribution support' },
  { value: 'Contracting support', label: 'Contracting support' },
  { value: 'SBA support', label: 'SBA support' },
  { value: 'AI readiness', label: 'AI readiness' },
  { value: 'Other', label: 'Other' },
];

/** PACK 4 — Intent Pack. If Other is selected, show text field. */
export function Step4Intent({ data, onChange, errors }: Props) {
  const p = data.pack4_intent;
  const showOther = p.whatLookingFor === 'Other';
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          What are you looking for today?
        </label>
        <div className="mt-2 space-y-2">
          {INTENT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="whatLookingFor"
                value={opt.value}
                checked={p.whatLookingFor === opt.value}
                onChange={() => onChange({ pack4_intent: { ...p, whatLookingFor: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.whatLookingFor && (
          <p className="mt-1 text-sm text-red-600">{errors.whatLookingFor}</p>
        )}
      </div>
      {showOther && (
        <div>
          <label htmlFor="whatLookingForOther" className="block text-sm font-medium text-neutral-700">
            Please describe (Other)
          </label>
          <input
            id="whatLookingForOther"
            type="text"
            value={p.whatLookingForOther ?? ''}
            onChange={(e) => onChange({ pack4_intent: { ...p, whatLookingForOther: e.target.value } })}
            className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          {errors.whatLookingForOther && (
            <p className="mt-1 text-sm text-red-600">{errors.whatLookingForOther}</p>
          )}
        </div>
      )}
    </div>
  );
}

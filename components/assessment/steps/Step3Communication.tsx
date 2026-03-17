'use client';

import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

const CONTACT_OPTIONS: { value: IntakePayload['pack3_communication']['contactPreference']; label: string }[] = [
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Phone', label: 'Phone' },
];

const FREQUENCY_OPTIONS: { value: IntakePayload['pack3_communication']['communicationFrequency']; label: string }[] = [
  { value: 'As needed', label: 'As needed' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
];

/** PACK 3 — Communication Pack. */
export function Step3Communication({ data, onChange, errors }: Props) {
  const p = data.pack3_communication;
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          How do you prefer to be contacted?
        </label>
        <div className="mt-2 space-y-2">
          {CONTACT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="contactPreference"
                value={opt.value}
                checked={p.contactPreference === opt.value}
                onChange={() => onChange({ pack3_communication: { ...p, contactPreference: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.contactPreference && (
          <p className="mt-1 text-sm text-red-600">{errors.contactPreference}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">
          What is your preferred communication frequency?
        </label>
        <div className="mt-2 space-y-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="communicationFrequency"
                value={opt.value}
                checked={p.communicationFrequency === opt.value}
                onChange={() => onChange({ pack3_communication: { ...p, communicationFrequency: opt.value } })}
                className="h-4 w-4 border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.communicationFrequency && (
          <p className="mt-1 text-sm text-red-600">{errors.communicationFrequency}</p>
        )}
      </div>
    </div>
  );
}

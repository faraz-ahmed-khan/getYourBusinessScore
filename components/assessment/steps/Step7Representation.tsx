'use client';

import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

/** PACK 7 — Representation Pack. Required affirmative controls before completion. */
export function Step7Representation({ data, onChange, errors }: Props) {
  const p = data.pack7_representation;
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        All three authorizations below are required to complete your intake.
      </p>
      <div className="space-y-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.authorizeReviewOpportunity}
            onChange={(e) =>
              onChange({ pack7_representation: { ...p, authorizeReviewOpportunity: e.target.checked } })
            }
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you authorize Misconi USA to review your opportunity?
          </span>
        </label>
        {errors.authorizeReviewOpportunity && (
          <p className="text-sm text-red-600">{errors.authorizeReviewOpportunity}</p>
        )}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.authorizeMatchSuppliersLendersPrograms}
            onChange={(e) =>
              onChange({
                pack7_representation: {
                  ...p,
                  authorizeMatchSuppliersLendersPrograms: e.target.checked,
                },
              })
            }
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you authorize Misconi USA to match you with suppliers, lenders, or programs?
          </span>
        </label>
        {errors.authorizeMatchSuppliersLendersPrograms && (
          <p className="text-sm text-red-600">{errors.authorizeMatchSuppliersLendersPrograms}</p>
        )}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.authorizeCommunicateOnBehalf}
            onChange={(e) =>
              onChange({ pack7_representation: { ...p, authorizeCommunicateOnBehalf: e.target.checked } })
            }
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you authorize Misconi USA to communicate on your behalf when needed?
          </span>
        </label>
        {errors.authorizeCommunicateOnBehalf && (
          <p className="text-sm text-red-600">{errors.authorizeCommunicateOnBehalf}</p>
        )}
      </div>
    </div>
  );
}

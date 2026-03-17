'use client';

import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

/** PACK 2 — Permissions Pack. All four must be TRUE or intake cannot complete. */
export function Step2Permissions({ data, onChange, errors }: Props) {
  const p = data.pack2_permissions;
  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-600">
        All four permissions below are required to complete your intake.
      </p>
      <div className="space-y-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.permissionCommunicate}
            onChange={(e) => onChange({ pack2_permissions: { ...p, permissionCommunicate: e.target.checked } })}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you give permission for Misconi USA to communicate with you?
          </span>
        </label>
        {errors.permissionCommunicate && (
          <p className="text-sm text-red-600">{errors.permissionCommunicate}</p>
        )}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.permissionUploadStore}
            onChange={(e) => onChange({ pack2_permissions: { ...p, permissionUploadStore: e.target.checked } })}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you give permission to upload and store documents?
          </span>
        </label>
        {errors.permissionUploadStore && (
          <p className="text-sm text-red-600">{errors.permissionUploadStore}</p>
        )}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.permissionActAsAgent}
            onChange={(e) => onChange({ pack2_permissions: { ...p, permissionActAsAgent: e.target.checked } })}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you give permission for Misconi USA to act as your agent?
          </span>
        </label>
        {errors.permissionActAsAgent && (
          <p className="text-sm text-red-600">{errors.permissionActAsAgent}</p>
        )}
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={p.permissionRepresentOpportunity}
            onChange={(e) => onChange({ pack2_permissions: { ...p, permissionRepresentOpportunity: e.target.checked } })}
            className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm font-medium text-neutral-700">
            Do you give permission for Misconi USA to represent your opportunity?
          </span>
        </label>
        {errors.permissionRepresentOpportunity && (
          <p className="text-sm text-red-600">{errors.permissionRepresentOpportunity}</p>
        )}
      </div>
    </div>
  );
}

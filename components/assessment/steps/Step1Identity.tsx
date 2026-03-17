'use client';

import type { IntakePayload } from '@/lib/types';

interface Props {
  data: IntakePayload;
  onChange: (data: Partial<IntakePayload>) => void;
  errors: Record<string, string>;
}

/** PACK 1 — Identity Pack. Creates the UBID, business version only. */
export function Step1Identity({ data, onChange, errors }: Props) {
  const p = data.pack1_identity;
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-neutral-700">
          What is your business name?
        </label>
        <input
          id="businessName"
          type="text"
          value={p.businessName}
          onChange={(e) => onChange({ pack1_identity: { ...p, businessName: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          autoComplete="organization"
        />
        {errors.businessName && <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>}
      </div>
      <div>
        <label htmlFor="primaryContact" className="block text-sm font-medium text-neutral-700">
          Who is the primary contact?
        </label>
        <input
          id="primaryContact"
          type="text"
          value={p.primaryContact}
          onChange={(e) => onChange({ pack1_identity: { ...p, primaryContact: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          autoComplete="name"
        />
        {errors.primaryContact && <p className="mt-1 text-sm text-red-600">{errors.primaryContact}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
          What is your email address?
        </label>
        <input
          id="email"
          type="email"
          value={p.email}
          onChange={(e) => onChange({ pack1_identity: { ...p, email: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          autoComplete="email"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
          What is your phone number?
        </label>
        <input
          id="phone"
          type="tel"
          value={p.phone}
          onChange={(e) => onChange({ pack1_identity: { ...p, phone: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          autoComplete="tel"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label htmlFor="businessAddress" className="block text-sm font-medium text-neutral-700">
          What is your business address?
        </label>
        <textarea
          id="businessAddress"
          rows={2}
          value={p.businessAddress}
          onChange={(e) => onChange({ pack1_identity: { ...p, businessAddress: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          autoComplete="street-address"
        />
        {errors.businessAddress && <p className="mt-1 text-sm text-red-600">{errors.businessAddress}</p>}
      </div>
      <div>
        <label htmlFor="naicsCode" className="block text-sm font-medium text-neutral-700">
          What is your NAICS code?
        </label>
        <input
          id="naicsCode"
          type="text"
          value={p.naicsCode}
          onChange={(e) => onChange({ pack1_identity: { ...p, naicsCode: e.target.value } })}
          className="mt-1 block w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        {errors.naicsCode && <p className="mt-1 text-sm text-red-600">{errors.naicsCode}</p>}
      </div>
    </div>
  );
}

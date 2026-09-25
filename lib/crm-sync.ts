/**
 * Post-Creator CRM ops sync.
 *
 * Creator remains the authoritative store for all 36 answers.
 * CRM gets Contact (+ optional Account) + MWQ-linked Task with score /
 * Creator record ID / completion date in Description — never q1–q36.
 * Do not write GYBS_Business_Intakes answer fields.
 */

import { isCrmConfigured, zohoCrmJson } from './zoho-crm';
import { getDefaultMwqId } from './crm-mwq';
import { createTask, type TaskRecord } from './crm-tasks';
import { getBand } from './scoring';

export type CrmSyncInput = {
  creatorRecordId: string;
  businessId: string;
  name: string;
  email: string;
  businessName: string;
  phone?: string;
  score: number;
  /** When true, use the fixed connection-test subject on MWQ-1. */
  connectionTest?: boolean;
};

export type CrmSyncResult = {
  skipped?: boolean;
  reason?: string;
  contactId?: string;
  accountId?: string;
  task?: TaskRecord;
  duplicate?: boolean;
  relatedToLinked?: boolean;
  relatedToWarning?: string;
  error?: string;
};

function splitName(fullName: string): { first: string; last: string } {
  const trimmed = fullName.trim();
  if (!trimmed) return { first: 'Unknown', last: 'Contact' };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: parts[0] };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

async function findContactIdByEmail(email: string): Promise<string | null> {
  const { ok, status, data } = await zohoCrmJson<{
    data?: Array<{ id: string }>;
    code?: string;
    message?: string;
  }>(`/Contacts/search?email=${encodeURIComponent(email.trim())}`);

  // 204 / empty / no rows → create a new contact
  if (status === 204 || !data?.data?.length) return null;

  if (!ok) {
    // INVALID_QUERY / no records patterns — treat as miss, not hard fail
    const code = data?.code || '';
    if (code === 'INVALID_QUERY' || status === 400) return null;
    throw new Error(data?.message || `Contact search failed (HTTP ${status})`);
  }

  return data.data[0].id;
}

async function upsertContact(input: CrmSyncInput): Promise<string> {
  const existingId = await findContactIdByEmail(input.email);
  const { first, last } = splitName(input.name);

  const record: Record<string, unknown> = {
    First_Name: first,
    Last_Name: last,
    Email: input.email.trim(),
  };
  if (input.phone?.trim()) {
    record.Phone = input.phone.trim();
  }

  if (existingId) {
    await zohoCrmJson(`/Contacts/${encodeURIComponent(existingId)}`, {
      method: 'PUT',
      body: JSON.stringify({ data: [record] }),
    });
    return existingId;
  }

  const { ok, data } = await zohoCrmJson<{
    data?: Array<{ details?: { id?: string }; message?: string }>;
  }>('/Contacts', {
    method: 'POST',
    body: JSON.stringify({ data: [record] }),
  });

  const id = data?.data?.[0]?.details?.id;
  if (!ok || !id) {
    const row = data?.data?.[0] as
      | { message?: string; code?: string; details?: unknown }
      | undefined;
    throw new Error(
      row?.message
        ? `Contact create failed: ${row.message}${row.code ? ` (${row.code})` : ''}${
            row.details ? ` details=${JSON.stringify(row.details)}` : ''
          }`
        : `Failed to create CRM Contact: ${JSON.stringify(data)}`
    );
  }
  return id;
}

async function findAccountIdByName(name: string): Promise<string | null> {
  const safe = name.replace(/[()]/g, '').trim();
  if (!safe) return null;
  const criteria = `(Account_Name:equals:${safe})`;
  const { ok, status, data } = await zohoCrmJson<{
    data?: Array<{ id: string }>;
    code?: string;
    message?: string;
  }>(`/Accounts/search?criteria=${encodeURIComponent(criteria)}`);

  if (status === 204 || !data?.data?.length) return null;
  if (!ok) {
    const code = data?.code || '';
    if (code === 'INVALID_QUERY' || status === 400) return null;
    throw new Error(data?.message || `Account search failed (HTTP ${status})`);
  }
  return data.data[0].id;
}

async function upsertAccount(businessName: string): Promise<string | undefined> {
  const name = businessName.trim();
  if (!name) return undefined;

  const existing = await findAccountIdByName(name);
  if (existing) return existing;

  const { ok, data } = await zohoCrmJson<{
    data?: Array<{ details?: { id?: string } }>;
  }>('/Accounts', {
    method: 'POST',
    body: JSON.stringify({ data: [{ Account_Name: name }] }),
  });

  return data?.data?.[0]?.details?.id;
}

function buildOpsDescription(input: CrmSyncInput, bandKey: string): string {
  const completedAt = new Date().toISOString();
  return [
    'GYBS preliminary assessment (ops reference — answers live in Zoho Creator).',
    `Creator_Record_ID: ${input.creatorRecordId}`,
    `Business_ID: ${input.businessId}`,
    `Business_Name: ${input.businessName}`,
    `Email: ${input.email}`,
    `Preliminary_Score: ${input.score}`,
    `Result_Band: ${bandKey}`,
    `Completion_Status: Completed`,
    `Completion_Date: ${completedAt}`,
  ].join('\n');
}

/**
 * After a successful Creator write: upsert Contact/Account and create an
 * MWQ-linked Task. Never throws past the caller contract — returns error field.
 */
export async function syncAssessmentToCrm(input: CrmSyncInput): Promise<CrmSyncResult> {
  if (!isCrmConfigured()) {
    return { skipped: true, reason: 'Zoho CRM env not configured' };
  }

  const mwqId = getDefaultMwqId();
  if (!mwqId) {
    return { skipped: true, reason: 'ZOHO_MWQ_DEFAULT_ID not set' };
  }

  try {
    const contactId = await upsertContact(input);
    let accountId: string | undefined;
    try {
      accountId = await upsertAccount(input.businessName);
    } catch (e) {
      console.warn('[crm-sync] Account upsert skipped', e);
    }

    const band = getBand(input.score);
    const gybsKey = input.connectionTest
      ? 'connection-test-mwq-1'
      : `intake-${input.businessId}-${input.creatorRecordId}`;

    const subject = input.connectionTest
      ? 'GYBS integration connection test'
      : `GYBS assessment complete — ${input.businessName}`.slice(0, 100);

    const { task, duplicate, relatedToLinked, relatedToWarning } =
      await createTask({
        subject,
        whatId: mwqId,
        whoId: contactId,
        gybsKey,
        description: buildOpsDescription(input, band.key),
        // Connection test: Owner = Integration (null) so the task is visible under
        // MWQ-1 Open Activities / Tasks search. Real intakes use Steven / Management.
        ownerId: input.connectionTest
          ? null
          : process.env.ZOHO_DEFAULT_TASK_OWNER_ID,
        status: 'Not Started',
        priority: 'Normal',
      });

    if (relatedToWarning) {
      console.warn('[crm-sync]', relatedToWarning);
    }

    return {
      contactId,
      accountId,
      task,
      duplicate,
      relatedToLinked,
      relatedToWarning,
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'CRM sync failed';
    console.error('[crm-sync]', message);
    return { error: message };
  }
}

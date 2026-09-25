/**
 * Management Work Queue — READ ONLY.
 * Never write MWQ Status (live blueprint "Management Work Queue Control").
 */

import { zohoCrmJson } from './zoho-crm';

export function getMwqModule(): string {
  return process.env.ZOHO_MWQ_MODULE || 'Management_Work_Queue';
}

/** Zoho API name for Management Work Queue (do not use CustomModule1 for $se_module). */
export function getMwqSeModuleAliases(): string[] {
  return [getMwqModule()];
}

export function getDefaultMwqId(): string | undefined {
  return process.env.ZOHO_MWQ_DEFAULT_ID || undefined;
}

export async function listMwq(params?: { page?: number; perPage?: number }) {
  const module = getMwqModule();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 50;
  const qs = new URLSearchParams({
    page: String(page),
    per_page: String(perPage),
  });
  return zohoCrmJson(`/${module}?${qs.toString()}`);
}

export async function getMwqById(id: string) {
  const module = getMwqModule();
  return zohoCrmJson(`/${module}/${encodeURIComponent(id)}`);
}

/**
 * Ensures the CRM integration user can see the MWQ record used for What_Id.
 * Zoho returns 204 when the record is missing or hidden by sharing rules.
 */
export async function assertMwqRecordAccessible(id: string): Promise<void> {
  const { ok, status, data } = await getMwqById(id);
  const hasRow =
    data &&
    typeof data === 'object' &&
    Array.isArray((data as { data?: unknown[] }).data) &&
    ((data as { data: unknown[] }).data?.length ?? 0) > 0;

  if (ok && hasRow) return;

  throw new Error(
    `Management Work Queue record ${id} is not visible to the CRM integration user ` +
      `(HTTP ${status}). In Zoho CRM, share MWQ-1 with the Misconi USA Integration user/profile ` +
      `or open Management Work Queue permissions for that profile, then confirm ZOHO_MWQ_DEFAULT_ID ` +
      `matches the MWQ-1 record id in the browser URL.`
  );
}

/** Open Activities (tasks) related to an MWQ record. */
export async function listMwqRelatedTasks(mwqId: string) {
  const module = getMwqModule();
  return zohoCrmJson(
    `/${module}/${encodeURIComponent(mwqId)}/Tasks?fields=Subject,Status,Priority,Due_Date,Owner,Description,What_Id`
  );
}

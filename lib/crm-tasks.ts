/**
 * Zoho CRM Tasks — create / update with default (non-blueprint) status handling.
 * Draft "Task Process Management" blueprint is NOT activated — do not use transitions API.
 */

import { zohoCrmFetch, zohoCrmJson } from './zoho-crm';
import {
  assertMwqRecordAccessible,
  getMwqSeModuleAliases,
} from './crm-mwq';
import { getStoredTaskId, setStoredTaskId } from './gybs-task-keys';

/** Default Zoho Task Status picklist values (existing CRM). */
export const ALLOWED_TASK_STATUSES = [
  'Not Started',
  'Deferred',
  'In Progress',
  'Completed',
  'Waiting on someone else',
] as const;

/** Default Zoho Task Priority picklist values. */
export const ALLOWED_TASK_PRIORITIES = [
  'High',
  'Highest',
  'Low',
  'Lowest',
  'Normal',
] as const;

export type TaskStatus = (typeof ALLOWED_TASK_STATUSES)[number];
export type TaskPriority = (typeof ALLOWED_TASK_PRIORITIES)[number];

export type CreateTaskInput = {
  subject: string;
  /** MWQ (or other) record id for What_Id */
  whatId: string;
  /** Module API name for What_Id (default: Management_Work_Queue) */
  whatModule?: string;
  /** Optional Contact id for Who_Id */
  whoId?: string;
  description?: string;
  /** Stable key embedded as [gybs-key: ...] for duplicate detection */
  gybsKey: string;
  /**
   * Task owner:
   * - string → that Zoho user id
   * - undefined → ZOHO_DEFAULT_TASK_OWNER_ID (Steven / Management)
   * - null → omit Owner (Zoho assigns the authenticated Integration user)
   */
  ownerId?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
};

export type UpdateTaskInput = {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  ownerId?: string;
  description?: string;
  subject?: string;
};

export type TaskRecord = {
  id: string;
  Subject?: string;
  Status?: string;
  Priority?: string;
  Description?: string;
  Due_Date?: string;
  Owner?: { id?: string; name?: string };
  What_Id?: string | { id?: string; name?: string };
  [key: string]: unknown;
};

export type CreateTaskResult = {
  task: TaskRecord;
  duplicate: boolean;
  raw?: unknown;
  relatedToLinked: boolean;
  relatedToWarning?: string;
};

function escapeCoql(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export function formatGybsKeyMarker(gybsKey: string): string {
  return `[gybs-key: ${gybsKey}]`;
}

/** Subject prefix used for COQL duplicate checks (Description is not COQL-filterable). */
export function formatGybsSubject(subject: string, gybsKey: string): string {
  const prefix = `[gybs:${gybsKey}] `;
  const max = 100;
  const combined = `${prefix}${subject}`;
  return combined.length <= max ? combined : combined.slice(0, max);
}

export function validateTaskStatus(status: string): status is TaskStatus {
  return (ALLOWED_TASK_STATUSES as readonly string[]).includes(status);
}

export function validateTaskPriority(priority: string): priority is TaskPriority {
  return (ALLOWED_TASK_PRIORITIES as readonly string[]).includes(priority);
}

/**
 * Isolated status update path — today uses standard PUT.
 * When the Tasks blueprint is approved/activated, replace the body of this
 * function with blueprint transitions; callers stay the same.
 */
export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  if (!validateTaskStatus(status)) {
    throw new Error(`Unknown task status: ${status}`);
  }
  return zohoCrmJson(`/Tasks/${encodeURIComponent(taskId)}`, {
    method: 'PUT',
    body: JSON.stringify({
      data: [{ Status: status }],
    }),
  });
}

function escapeSearchCriteriaValue(value: string): string {
  // Zoho search criteria: escape \ ( ) then quote when brackets/spaces present
  const escaped = value
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
  if (/[\[\]:,]/.test(escaped) || /\s/.test(escaped)) {
    return `"${escaped.replace(/"/g, '\\"')}"`;
  }
  return escaped;
}

function subjectContainsGybsKey(subject: string | undefined, gybsKey: string): boolean {
  if (!subject) return false;
  return subject.includes(`[gybs:${gybsKey}]`);
}

function readWhatId(task: TaskRecord | null | undefined): string | undefined {
  const raw = task?.What_Id;
  if (typeof raw === 'string' && raw.trim()) return raw.trim();
  if (raw && typeof raw === 'object' && 'id' in raw) {
    const id = (raw as { id?: string }).id;
    return id || undefined;
  }
  return undefined;
}

function taskLinkedToWhat(task: TaskRecord | null | undefined, whatId: string): boolean {
  return readWhatId(task) === whatId;
}

function buildWhatLinkRecord(
  whatId: string,
  seModule: string
): Record<string, unknown> {
  return {
    What_Id: { id: whatId },
    $se_module: seModule,
  };
}

async function attachWhoId(taskId: string, whoId?: string): Promise<void> {
  if (!whoId) return;
  await zohoCrmJson(`/Tasks/${encodeURIComponent(taskId)}`, {
    method: 'PUT',
    body: JSON.stringify({ data: [{ Who_Id: { id: whoId } }] }),
  });
}

/**
 * Attach Task Related To (What_Id) to MWQ.
 * Who_Id is written separately — sending Contact on the same payload
 * made Zoho set $se_module=Contacts and drop What_Id.
 */
async function linkTaskToWhat(
  taskId: string,
  whatId: string,
  seModules: string[],
  whoId?: string
): Promise<{ ok: boolean; task: TaskRecord | null; error?: string }> {
  let lastError = '';

  for (const seModule of seModules) {
    const attempts: Array<{
      method: 'PUT' | 'POST';
      path: string;
      body: unknown;
      label: string;
    }> = [
      {
        method: 'PUT',
        path: `/Tasks/${encodeURIComponent(taskId)}`,
        body: { data: [buildWhatLinkRecord(whatId, seModule)] },
        label: `PUT Tasks $se_module=${seModule}`,
      },
      {
        method: 'PUT',
        path: `/${seModule}/${encodeURIComponent(whatId)}/Tasks/${encodeURIComponent(taskId)}`,
        body: { data: [{ id: taskId }] },
        label: `PUT ${seModule} related Tasks`,
      },
    ];

    for (const attempt of attempts) {
      const { ok, status, data } = await zohoCrmJson<{
        data?: Array<{ code?: string; details?: unknown; message?: string }>;
        message?: string;
      }>(attempt.path, {
        method: attempt.method,
        body: JSON.stringify(attempt.body),
      });

      const row = data?.data?.[0];
      if (ok && row?.code !== 'INVALID_DATA') {
        const task = await getTaskById(taskId);
        if (taskLinkedToWhat(task, whatId)) {
          await attachWhoId(taskId, whoId);
          return { ok: true, task: (await getTaskById(taskId)) || task };
        }
        lastError = `What_Id still empty after ${attempt.label}`;
        continue;
      }

      const details = row?.details ? ` details=${JSON.stringify(row.details)}` : '';
      lastError =
        `${row?.message || (data as { message?: string })?.message || `Task What_Id update failed (${status})`}${details} ${attempt.label}`;
    }
  }

  await attachWhoId(taskId, whoId);
  return { ok: false, task: await getTaskById(taskId), error: lastError };
}

/**
 * Find an existing GYBS task by stable key.
 * Prefer exact Subject search (COQL `like` on Subject failed in production),
 * then What_Id+Subject, then MWQ related Tasks, then COQL equals.
 */
async function findExistingByGybsKey(
  gybsKey: string,
  canonicalSubject: string,
  whatId?: string
): Promise<TaskRecord | null> {
  const safeSubject = escapeSearchCriteriaValue(canonicalSubject);

  // 1) Exact Subject match via search API
  {
    const criteria = `(Subject:equals:${safeSubject})`;
    const search = await zohoCrmJson<{ data?: TaskRecord[] }>(
      `/Tasks/search?criteria=${encodeURIComponent(criteria)}`
    );
    if (search.ok && search.data?.data?.length) {
      const hit =
        search.data.data.find((t) => subjectContainsGybsKey(t.Subject, gybsKey)) ||
        search.data.data[0];
      if (hit?.id) return hit;
    }
  }

  if (whatId) {
    // 2) Same MWQ + exact Subject (finds tasks owned by another user)
    {
      const criteria = `((What_Id:equals:${whatId})and(Subject:equals:${safeSubject}))`;
      const search = await zohoCrmJson<{ data?: TaskRecord[] }>(
        `/Tasks/search?criteria=${encodeURIComponent(criteria)}`
      );
      if (search.ok && search.data?.data?.length) {
        const hit = search.data.data[0];
        if (hit?.id) return hit;
      }
    }

    // 3) Related Tasks on the MWQ record — scan for gybs key in Subject
    {
      const module = process.env.ZOHO_MWQ_MODULE || 'Management_Work_Queue';
      const related = await zohoCrmJson<{ data?: TaskRecord[] }>(
        `/${module}/${encodeURIComponent(whatId)}/Tasks?fields=Subject,Status,Priority,Due_Date,Owner,Description,What_Id&per_page=200`
      );
      if (related.ok && related.data?.data?.length) {
        const hit = related.data.data.find((t) =>
          subjectContainsGybsKey(t.Subject, gybsKey)
        );
        if (hit?.id) return hit;
      }
    }
  }

  // 4) COQL exact Subject (LIKE with brackets was unreliable)
  const select = `select id, Subject, Status, Priority, Description, Due_Date, Owner, What_Id from Tasks where Subject = '${escapeCoql(canonicalSubject)}' limit 1`;
  const coql = await zohoCrmJson<{ data?: TaskRecord[] }>('/coql', {
    method: 'POST',
    body: JSON.stringify({ select_query: select }),
  });
  if (coql.ok && coql.data?.data?.length) {
    return coql.data.data[0];
  }

  return null;
}

async function getTaskById(id: string): Promise<TaskRecord | null> {
  const { ok, data } = await zohoCrmJson<{ data?: TaskRecord[] }>(
    `/Tasks/${encodeURIComponent(id)}?fields=Subject,Status,Priority,Due_Date,Owner,Description,What_Id,$se_module,Who_Id`
  );
  if (!ok || !data?.data?.length) return null;
  return data.data[0];
}

/**
 * Create a task linked to MWQ via What_Id.
 * Safe to call twice: returns existing task with duplicate:true when gybs-key matches.
 */
export async function createTask(
  input: CreateTaskInput
): Promise<CreateTaskResult> {
  if (input.status && !validateTaskStatus(input.status)) {
    const err = new Error(`Unknown task status: ${input.status}`) as Error & {
      statusCode: number;
    };
    err.statusCode = 422;
    throw err;
  }
  if (input.priority && !validateTaskPriority(input.priority)) {
    const err = new Error(`Unknown task priority: ${input.priority}`) as Error & {
      statusCode: number;
    };
    err.statusCode = 422;
    throw err;
  }

  const marker = formatGybsKeyMarker(input.gybsKey);
  const description = input.description
    ? `${input.description.trim()}\n\n${marker}`
    : marker;
  const subject = formatGybsSubject(input.subject, input.gybsKey);
  const seModules = input.whatModule
    ? [input.whatModule]
    : getMwqSeModuleAliases();

  const ensureLinked = async (
    task: TaskRecord,
    duplicate: boolean,
    raw?: unknown
  ): Promise<CreateTaskResult> => {
    if (taskLinkedToWhat(task, input.whatId)) {
      return { task, duplicate, raw, relatedToLinked: true };
    }

    const linked = await linkTaskToWhat(
      task.id,
      input.whatId,
      seModules,
      input.whoId
    );
    if (linked.ok && linked.task && taskLinkedToWhat(linked.task, input.whatId)) {
      return {
        task: linked.task,
        duplicate,
        raw,
        relatedToLinked: true,
      };
    }

    // Zoho often returns SUCCESS while silently clearing What_Id when the
    // Integration profile cannot write Related To for custom modules.
    return {
      task: linked.task || task,
      duplicate,
      raw,
      relatedToLinked: false,
      relatedToWarning:
        linked.error ||
        'Zoho accepted the Task but Related To (What_Id) stayed empty. ' +
          'Grant Misconi USA Integration permission to set Tasks → Related To ' +
          'for Management Work Queue (or have an admin set Related To = MWQ-1 on this task).',
    };
  };

  // Local map first — Integration often cannot re-read Tasks owned by Steven.
  const storedId = getStoredTaskId(input.gybsKey);
  if (storedId) {
    const stored = (await getTaskById(storedId)) || { id: storedId, Subject: subject };
    return ensureLinked(stored, true);
  }

  const existing = await findExistingByGybsKey(
    input.gybsKey,
    subject,
    input.whatId
  );
  if (existing?.id) {
    setStoredTaskId(input.gybsKey, existing.id);
    const full = (await getTaskById(existing.id)) || existing;
    return ensureLinked(full, true);
  }

  // Fail fast with an actionable message if MWQ-1 is hidden from the integration user.
  await assertMwqRecordAccessible(input.whatId);

  // null = leave Owner as Integration API user; undefined = env default (Steven).
  const ownerId =
    input.ownerId === null
      ? undefined
      : input.ownerId || process.env.ZOHO_DEFAULT_TASK_OWNER_ID;

  let lastError = '';
  let lastRaw: unknown;

  for (const seModule of seModules) {
    const record: Record<string, unknown> = {
      Subject: subject,
      Description: description,
      ...buildWhatLinkRecord(input.whatId, seModule),
      Status: input.status || 'Not Started',
      Priority: input.priority || 'Normal',
    };

    if (ownerId) {
      record.Owner = { id: ownerId };
    }
    if (input.dueDate) {
      record.Due_Date = input.dueDate;
    }

    const { ok, status, data } = await zohoCrmJson<{
      data?: Array<{
        code?: string;
        details?: { id?: string; api_name?: string };
        message?: string;
      }>;
      message?: string;
    }>('/Tasks', {
      method: 'POST',
      body: JSON.stringify({ data: [record] }),
    });

    const created = data?.data?.[0];
    const createdId = created?.details?.id;

    if (ok && createdId) {
      setStoredTaskId(input.gybsKey, createdId);
      const createdTask =
        (await getTaskById(createdId)) || { id: createdId, Subject: subject };
      return ensureLinked(createdTask, false, data);
    }

    // Race: another create may have won — re-check duplicate key
    const raced = await findExistingByGybsKey(
      input.gybsKey,
      subject,
      input.whatId
    );
    if (raced?.id) {
      setStoredTaskId(input.gybsKey, raced.id);
      const full = (await getTaskById(raced.id)) || raced;
      return ensureLinked(full, true, data);
    }

    const details = created?.details ? ` details=${JSON.stringify(created.details)}` : '';
    const code = created?.code ? ` (${created.code})` : '';
    lastError =
      `${created?.message || (data as { message?: string })?.message || `Zoho Tasks create failed (${status})`}${code}${details} se_module=${seModule}`;
    lastRaw = data;

    // Only retry alternate se_module when What_Id was the failing field
    if (created?.details?.api_name !== 'What_Id') {
      break;
    }
  }

  throw new Error(`${lastError} raw=${JSON.stringify(lastRaw)}`);
}

export async function updateTask(taskId: string, input: UpdateTaskInput) {
  if (input.status && !validateTaskStatus(input.status)) {
    const err = new Error(`Unknown task status: ${input.status}`) as Error & {
      statusCode: number;
    };
    err.statusCode = 422;
    throw err;
  }
  if (input.priority && !validateTaskPriority(input.priority)) {
    const err = new Error(`Unknown task priority: ${input.priority}`) as Error & {
      statusCode: number;
    };
    err.statusCode = 422;
    throw err;
  }

  // Status goes through updateTaskStatus() so blueprint migration stays isolated.
  if (
    input.status &&
    input.priority === undefined &&
    input.dueDate === undefined &&
    input.ownerId === undefined &&
    input.description === undefined &&
    input.subject === undefined
  ) {
    return updateTaskStatus(taskId, input.status);
  }

  const record: Record<string, unknown> = {};
  if (input.status) record.Status = input.status;
  if (input.priority) record.Priority = input.priority;
  if (input.dueDate) record.Due_Date = input.dueDate;
  if (input.ownerId) record.Owner = { id: input.ownerId };
  if (input.description !== undefined) record.Description = input.description;
  if (input.subject) record.Subject = input.subject;

  if (Object.keys(record).length === 0) {
    throw new Error('No task fields to update');
  }

  // Prefer isolated status helper when Status is the only write path we care about later.
  if (input.status && Object.keys(record).length === 1) {
    return updateTaskStatus(taskId, input.status);
  }

  return zohoCrmJson(`/Tasks/${encodeURIComponent(taskId)}`, {
    method: 'PUT',
    body: JSON.stringify({ data: [record] }),
  });
}

/** Low-level fetch for routes that need raw Response. */
export { zohoCrmFetch };

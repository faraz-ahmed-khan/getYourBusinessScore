import { NextResponse } from 'next/server';
import { isCrmConfigured } from '@/lib/zoho-crm';
import {
  ALLOWED_TASK_PRIORITIES,
  ALLOWED_TASK_STATUSES,
  updateTask,
  validateTaskPriority,
  validateTaskStatus,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/crm-tasks';

type Ctx = { params: Promise<{ id: string }> };

type Body = {
  status?: string;
  priority?: string;
  dueDate?: string;
  ownerId?: string;
  description?: string;
  subject?: string;
};

export async function PATCH(request: Request, context: Ctx) {
  if (!isCrmConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Zoho CRM is not configured' },
      { status: 503 }
    );
  }

  try {
    const { id } = await context.params;
    if (!id?.trim()) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const body = (await request.json()) as Body;

    if (body.status && !validateTaskStatus(body.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `status must be one of: ${ALLOWED_TASK_STATUSES.join(', ')}`,
        },
        { status: 422 }
      );
    }
    if (body.priority && !validateTaskPriority(body.priority)) {
      return NextResponse.json(
        {
          success: false,
          error: `priority must be one of: ${ALLOWED_TASK_PRIORITIES.join(', ')}`,
        },
        { status: 422 }
      );
    }

    const { ok, status, data } = await updateTask(id, {
      status: body.status as TaskStatus | undefined,
      priority: body.priority as TaskPriority | undefined,
      dueDate: body.dueDate,
      ownerId: body.ownerId,
      description: body.description,
      subject: body.subject,
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Task update failed', details: data },
        { status: status >= 400 ? status : 502 }
      );
    }

    return NextResponse.json({ success: true, ...(data as object) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Task update failed';
    const statusCode =
      e && typeof e === 'object' && 'statusCode' in e
        ? Number((e as { statusCode: number }).statusCode)
        : 500;
    return NextResponse.json(
      { success: false, error: message },
      { status: statusCode >= 400 ? statusCode : 500 }
    );
  }
}

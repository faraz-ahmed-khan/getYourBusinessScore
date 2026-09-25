import { NextResponse } from 'next/server';
import { isCrmConfigured } from '@/lib/zoho-crm';
import {
  ALLOWED_TASK_PRIORITIES,
  ALLOWED_TASK_STATUSES,
  createTask,
  validateTaskPriority,
  validateTaskStatus,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/crm-tasks';
import { getDefaultMwqId } from '@/lib/crm-mwq';

type Body = {
  subject?: string;
  whatId?: string;
  whatModule?: string;
  description?: string;
  gybsKey?: string;
  ownerId?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
};

export async function POST(request: Request) {
  if (!isCrmConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Zoho CRM is not configured' },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as Body;
    const subject = body.subject?.trim();
    const gybsKey = body.gybsKey?.trim();
    const whatId = body.whatId?.trim() || getDefaultMwqId();

    if (!subject) {
      return NextResponse.json({ success: false, error: 'subject is required' }, { status: 422 });
    }
    if (!gybsKey) {
      return NextResponse.json({ success: false, error: 'gybsKey is required' }, { status: 422 });
    }
    if (!whatId) {
      return NextResponse.json(
        { success: false, error: 'whatId is required (or set ZOHO_MWQ_DEFAULT_ID)' },
        { status: 422 }
      );
    }

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

    const result = await createTask({
      subject,
      whatId,
      whatModule: body.whatModule,
      description: body.description,
      gybsKey,
      ownerId: body.ownerId || process.env.ZOHO_DEFAULT_TASK_OWNER_ID,
      status: body.status as TaskStatus | undefined,
      priority: body.priority as TaskPriority | undefined,
      dueDate: body.dueDate,
    });

    return NextResponse.json({
      success: true,
      duplicate: result.duplicate,
      task: result.task,
      relatedToLinked: result.relatedToLinked,
      relatedToWarning: result.relatedToWarning || null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Task create failed';
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

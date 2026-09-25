import { NextResponse } from 'next/server';
import { isCrmConfigured } from '@/lib/zoho-crm';
import { syncAssessmentToCrm } from '@/lib/crm-sync';
import { clearStoredTaskId } from '@/lib/gybs-task-keys';

const CONNECTION_TEST_GYBS_KEY = 'connection-test-mwq-1';

/**
 * One controlled MWQ-1 connection test (Steven-approved).
 * Subject: "GYBS integration connection test"
 * Owner: authenticated Integration user (visible under MWQ-1 Open Activities).
 * Safe to call twice — returns duplicate:true on second call.
 *
 * Optional body `{ "reset": true }` clears the local duplicate key so a new
 * Integration-owned task is created (use once after owner/visibility fixes).
 *
 * Protect in production (env secret) once CRM credentials are live.
 */
export async function POST(request: Request) {
  if (!isCrmConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Zoho CRM is not configured' },
      { status: 503 }
    );
  }

  const expected = process.env.ZOHO_CONNECTION_TEST_SECRET;
  if (expected) {
    const header = request.headers.get('x-gybs-connection-test') || '';
    if (header !== expected) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      name?: string;
      businessName?: string;
      score?: number;
      reset?: boolean;
    };

    if (body.reset === true) {
      clearStoredTaskId(CONNECTION_TEST_GYBS_KEY);
    }

    const result = await syncAssessmentToCrm({
      creatorRecordId: 'connection-test',
      businessId: 'connection-test',
      name: body.name?.trim() || 'GYBS Connection Test',
      email: body.email?.trim() || 'gybs-connection-test@misconiusa.com',
      businessName: body.businessName?.trim() || 'GYBS Connection Test',
      score: typeof body.score === 'number' ? body.score : 0,
      connectionTest: true,
    });

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error, crm: result },
        { status: 502 }
      );
    }

    if (result.skipped) {
      return NextResponse.json(
        { success: false, error: result.reason || 'CRM sync skipped', crm: result },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      duplicate: result.duplicate === true,
      taskId: result.task?.id,
      contactId: result.contactId,
      accountId: result.accountId,
      task: result.task,
      relatedToLinked: result.relatedToLinked === true,
      relatedToWarning: result.relatedToWarning || null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Connection test failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { isCrmConfigured } from '@/lib/zoho-crm';
import { getMwqById, listMwqRelatedTasks } from '@/lib/crm-mwq';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
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

    const [record, tasks] = await Promise.all([
      getMwqById(id),
      listMwqRelatedTasks(id),
    ]);

    if (!record.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to load MWQ record', details: record.data },
        { status: record.status >= 400 ? record.status : 502 }
      );
    }

    return NextResponse.json({
      success: true,
      record: record.data,
      tasks: tasks.ok ? tasks.data : { error: tasks.data },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'MWQ fetch failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

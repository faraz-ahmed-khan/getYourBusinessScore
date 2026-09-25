import { NextResponse } from 'next/server';
import { isCrmConfigured } from '@/lib/zoho-crm';
import { listMwq } from '@/lib/crm-mwq';

export async function GET(request: Request) {
  if (!isCrmConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Zoho CRM is not configured' },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') || '1');
    const perPage = Number(searchParams.get('per_page') || '50');

    const { ok, status, data } = await listMwq({
      page: Number.isFinite(page) ? page : 1,
      perPage: Number.isFinite(perPage) ? perPage : 50,
    });

    if (!ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to list Management Work Queue', details: data },
        { status: status >= 400 ? status : 502 }
      );
    }

    return NextResponse.json({ success: true, ...((data as object) || {}) });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'MWQ list failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

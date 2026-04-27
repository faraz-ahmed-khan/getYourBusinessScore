import { NextResponse } from 'next/server';
import { zohoFetch } from '@/lib/zoho';

type RouteContext = {
  params: Promise<{
    recordId: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { recordId } = await context.params;

    const ownerName = process.env.ZOHO_OWNER_NAME!;
    const appLinkName = process.env.ZOHO_APP_LINK_NAME!;
    const reportLinkName = process.env.ZOHO_REPORT_LINK_NAME!;

    const criteria = encodeURIComponent(`ID == ${recordId}`);

    const zohoRes = await zohoFetch(
      `/creator/v2.1/data/${ownerName}/${appLinkName}/report/${reportLinkName}?criteria=${criteria}`,
      {
        method: 'GET',
      }
    );

    const zohoData = await zohoRes.json();

    if (!zohoRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Zoho get record failed',
          details: zohoData,
        },
        { status: 500 }
      );
    }

    const row = zohoData?.data?.[0];

    if (!row) {
      return NextResponse.json(
        {
          success: false,
          error: 'Record not found',
          details: zohoData,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      result: {
        businessReadinessScore: row.Final_Score,
        level: row.Readiness_Level,
        lane: row.Lane_Name,
        assignedPack: row.Assigned_Pack,
        corrections: row.Corrections,
        upgradePathway: row.Upgrade_Pathway,
      },
      raw: row,
    });
  } catch (e) {
    console.error('Result fetch error', e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : 'Failed to fetch result.',
      },
      { status: 500 }
    );
  }
}
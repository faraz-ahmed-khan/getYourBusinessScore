import { NextResponse } from 'next/server';
import { zohoFetch } from '@/lib/zoho';

type RouteContext = {
  params: Promise<{
    recordId: string;
  }>;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isNoRecordFound = (data: unknown) =>
  typeof data === 'object' &&
  data !== null &&
  'code' in data &&
  (data as { code?: number }).code === 9280;

const readFirstString = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
};

const readFirstNumber = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = row[key];
    const n = Number(value);
    if (Number.isFinite(n)) {
      return n;
    }
  }
  return 0;
};

const hasNumberField = (row: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = Number(row[key]);
    if (Number.isFinite(value)) {
      return true;
    }
  }
  return false;
};

const hasComputedResultFields = (row: Record<string, unknown>) =>
  hasNumberField(row, ['Final_Score', 'Business_Readiness_Score', 'Readiness_Score', 'Score']) ||
  readFirstString(row, ['Readiness_Level', 'Level']).length > 0;

const levelFromScore = (score: number) => {
  if (score >= 70) return 'Level 3';
  if (score >= 40) return 'Level 2';
  return 'Level 1';
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { recordId } = await context.params;
    const url = new URL(_request.url);
    const businessId = url.searchParams.get('businessId');

    const ownerName = process.env.ZOHO_OWNER_NAME!;
    const appLinkName = process.env.ZOHO_APP_LINK_NAME!;
    const reportLinkName = process.env.ZOHO_REPORT_LINK_NAME!;

    const criteriaById = `ID == ${recordId}`;
    const criteriaByBusinessId = businessId ? `businessId == "${businessId}"` : null;
    const criteriaCandidates = [criteriaById, criteriaByBusinessId].filter(Boolean) as string[];
    const maxAttempts = 5;

    let lastFailure: unknown = null;
    let row: Record<string, unknown> | undefined;
    let rowWithComputedFields: Record<string, unknown> | undefined;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      for (const rawCriteria of criteriaCandidates) {
        const criteria = encodeURIComponent(rawCriteria);
        const zohoRes = await zohoFetch(
          `/creator/v2.1/data/${ownerName}/${appLinkName}/report/${reportLinkName}?criteria=${criteria}&field_config=all`,
          {
            method: 'GET',
            headers: {
              environment: 'development',
            },
          }
        );

        const zohoData = await zohoRes.json();

        if (zohoRes.ok) {
          const currentRow = zohoData?.data?.[0];
          if (currentRow) {
            row = currentRow;
          }

          if (currentRow && hasComputedResultFields(currentRow)) {
            rowWithComputedFields = currentRow;
            break;
          }

          lastFailure = zohoData;
          continue;
        }

        lastFailure = zohoData;
      }

      if (rowWithComputedFields) {
        break;
      }

      // Keep polling while row exists but computed score fields are not ready yet.
      if (!row && !isNoRecordFound(lastFailure)) {
        break;
      }

      if (attempt < maxAttempts - 1) {
        await sleep(700);
      }
    }

    const effectiveRow = rowWithComputedFields || row;

    if (!effectiveRow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Record not found',
          details: lastFailure,
        },
        { status: 404 }
      );
    }

    const businessReadinessScore = readFirstNumber(effectiveRow, [
      'Final_Score',
      'Business_Readiness_Score',
      'Readiness_Score',
      'Score',
    ]);
    const hasZohoScore = hasNumberField(effectiveRow, [
      'Final_Score',
      'Business_Readiness_Score',
      'Readiness_Score',
      'Score',
    ]);

    if (!hasZohoScore) {
      return NextResponse.json(
        {
          success: false,
          error: 'Score not ready yet. Please retry.',
          details: effectiveRow,
        },
        { status: 503 }
      );
    }

    const finalScore = businessReadinessScore;

    const level =
      readFirstString(effectiveRow, ['Readiness_Level', 'Level']) ||
      levelFromScore(finalScore);

    const lane =
      readFirstString(effectiveRow, ['Lane_Name', 'Recommended_Lane']) ||
      'Readiness Lane';
    const assignedPack =
      readFirstString(effectiveRow, ['Assigned_Pack', 'Pack']) ||
      'Foundational Pack';
    const corrections = readFirstString(effectiveRow, ['Corrections', 'Recommended_Corrections']);
    const upgradePathway = readFirstString(effectiveRow, ['Upgrade_Pathway', 'Next_Steps']);

    return NextResponse.json({
      success: true,
      result: {
        businessReadinessScore: finalScore,
        level,
        lane,
        assignedPack,
        corrections,
        upgradePathway,
      },
      raw: effectiveRow,
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
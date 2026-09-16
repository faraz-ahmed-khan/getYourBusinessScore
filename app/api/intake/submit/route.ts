import { NextResponse } from 'next/server';
import { zohoFetch } from '@/lib/zoho';
import { TOTAL_QUESTIONS } from '@/lib/questions';

const POINT_VALUES = [0, 1, 2] as const;
type PointValue = (typeof POINT_VALUES)[number];

const QUESTION_KEYS = Array.from(
  { length: TOTAL_QUESTIONS },
  (_, i) => `q${i + 1}` as const
);

type QuestionKey = (typeof QUESTION_KEYS)[number];

type SubmitBody = {
  businessId?: string;
  intakeVersion?: string;
  score?: number;
  Name?: string;
  Email?: string;
  Business_Name?: string;
  Phone?: string;
} & Partial<Record<QuestionKey, number | string>>;

function toZohoNameParts(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { first_name: '', last_name: '' };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { first_name: parts[0], last_name: parts[0] };
  }

  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
  };
}

function parsePoint(value: unknown): PointValue | null {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n)) return null;
  if (!(POINT_VALUES as readonly number[]).includes(n)) return null;
  return n as PointValue;
}

function validateBody(body: SubmitBody): string[] {
  const errors: string[] = [];

  for (const key of QUESTION_KEYS) {
    if (parsePoint(body[key]) === null) {
      errors.push(`${key} must be one of: ${POINT_VALUES.join(', ')}`);
    }
  }

  if (typeof body.score !== 'number' || !Number.isFinite(body.score)) {
    errors.push('score must be a number');
  }

  const email = body.Email?.trim();
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be a valid email');
  }

  if (!body.Name?.trim()) {
    errors.push('Name is required');
  }
  if (!body.Business_Name?.trim()) {
    errors.push('Business_Name is required');
  }

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    const errors = validateBody(body);
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const ownerName = process.env.ZOHO_OWNER_NAME!;
    const appLinkName = process.env.ZOHO_APP_LINK_NAME!;
    const formLinkName = process.env.ZOHO_FORM_LINK_NAME!;

    const businessId =
      body.businessId ||
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `gybs-${Date.now()}`);

    const answers = Object.fromEntries(
      QUESTION_KEYS.map((key) => [key, String(parsePoint(body[key]))])
    );

    const zohoRecord: Record<string, unknown> = {
      ...answers,
      score: Number(body.score),
      Name: toZohoNameParts(body.Name || ''),
      Email: body.Email?.trim(),
      Business_Name: body.Business_Name?.trim(),
    };

    if (body.Phone?.trim()) {
      zohoRecord.Phone = body.Phone.trim();
    }

    const zohoPayload = {
      data: [zohoRecord],
    };

    console.log('[intake/submit] businessId', businessId);
    console.log('[intake/submit] zohoPayload', JSON.stringify(zohoPayload));

    const zohoRes = await zohoFetch(
      `/creator/v2.1/data/${ownerName}/${appLinkName}/form/${formLinkName}`,
      {
        method: 'POST',
        body: JSON.stringify(zohoPayload),
      }
    );

    const zohoData = await zohoRes.json();
    console.log('[intake/submit] zohoData', JSON.stringify(zohoData));

    if (!zohoRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: 'Zoho add record failed',
          details: zohoData,
        },
        { status: 500 }
      );
    }

    const created = zohoData?.result?.[0];
    const recordId = created?.data?.ID || created?.data?.id;

    if (!recordId) {
      const fieldErrors = created?.error;
      return NextResponse.json(
        {
          success: false,
          error: Array.isArray(fieldErrors)
            ? fieldErrors.join(', ')
            : 'Zoho record created but no record ID was returned',
          details: zohoData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recordId,
      businessId,
      raw: zohoData,
    });
  } catch (e) {
    console.error('Submit error', e);
    const message = e instanceof Error ? e.message : 'Submission failed.';
    const isTlsError =
      message.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE') ||
      message.includes('unable to verify the first certificate');

    return NextResponse.json(
      {
        success: false,
        error: isTlsError
          ? 'Could not connect to Zoho (TLS certificate error). Restart the dev server; local dev uses relaxed TLS by default.'
          : message,
      },
      { status: 500 }
    );
  }
}

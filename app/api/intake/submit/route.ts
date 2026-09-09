import { NextResponse } from 'next/server';
import { zohoFetch } from '@/lib/zoho';

const ANSWER_VALUES = ['A', 'B', 'C', 'D'] as const;
type AnswerValue = (typeof ANSWER_VALUES)[number];

const QUESTION_KEYS = [
  'q1',
  'q2',
  'q3',
  'q4',
  'q5',
  'q6',
  'q7',
  'q8',
  'q9',
  'q10',
] as const;

type QuestionKey = (typeof QUESTION_KEYS)[number];

type SubmitBody = {
  businessId?: string;
  intakeVersion?: string;
  score?: number;
  level?: number;
} & Partial<Record<QuestionKey, string>>;

function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === 'string' && ANSWER_VALUES.includes(value as AnswerValue);
}

function validateBody(body: SubmitBody): string[] {
  const errors: string[] = [];

  for (const key of QUESTION_KEYS) {
    const value = body[key];
    if (!isAnswerValue(value)) {
      errors.push(`${key} must be one of: ${ANSWER_VALUES.join(', ')}`);
    }
  }

  if (typeof body.score !== 'number' || !Number.isFinite(body.score)) {
    errors.push('score must be a number');
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

    const scoreValue = Number(body.score);

    // q1–q10 answers + local score stored on Zoho (field link name: score)
    const answers = Object.fromEntries(
      QUESTION_KEYS.map((key) => [key, body[key]])
    ) as Record<QuestionKey, AnswerValue>;

    const zohoRecord = {
      ...answers,
      score: scoreValue,
    };

    const zohoPayload = {
      data: [zohoRecord],
    };

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

    // Zoho sometimes returns code 3001 with field errors inside an otherwise 200-ish body.
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

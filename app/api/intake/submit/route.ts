import { NextResponse } from 'next/server';
import { zohoFetch } from '@/lib/zoho';

type SubmitBody = {
  businessId?: string;
  intakeVersion?: string;
  hasEIN?: string;
  hasBusinessBankAccount?: string;
  hasBookKeeping?: string;
  hasFinancialStatements?: string;
  hasDefinedOffers?: string;
  hasPricingDefined?: string;
  hasWrittenDescriptions?: string;
  hasCustomers?: string;
  hasRepeatCustomers?: string;
  hasPartners?: string;
};

function validateBody(body: SubmitBody): string[] {
  const errors: string[] = [];

  const mustBeOneOf = (field: keyof SubmitBody, allowed: string[]) => {
    const value = body[field];
    if (!value || !allowed.includes(value)) {
      errors.push(`${String(field)} must be one of: ${allowed.join(', ')}`);
    }
  };

  mustBeOneOf('hasEIN', ['yes', 'no']);
  mustBeOneOf('hasBusinessBankAccount', ['yes', 'no']);
  mustBeOneOf('hasBookKeeping', ['yes', 'no', 'outsourced']);
  mustBeOneOf('hasFinancialStatements', ['yes', 'no', 'partial']);
  mustBeOneOf('hasDefinedOffers', ['yes', 'no', 'in-progress']);
  mustBeOneOf('hasPricingDefined', ['yes', 'no', 'tiered']);
  mustBeOneOf('hasWrittenDescriptions', ['yes', 'no', 'partial']);
  mustBeOneOf('hasCustomers', ['yes', 'no']);
  mustBeOneOf('hasRepeatCustomers', ['yes', 'no', 'unknown']);
  mustBeOneOf('hasPartners', ['yes', 'no', 'informal']);

  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    const errors = validateBody(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 422 }
      );
    }

    const ownerName = process.env.ZOHO_OWNER_NAME!;
    const appLinkName = process.env.ZOHO_APP_LINK_NAME!;
    const formLinkName = process.env.ZOHO_FORM_LINK_NAME!;

    console.log(ownerName, appLinkName, formLinkName, "ownerName, appLinkName, formLinkName");

    const businessId =
      body.businessId ||
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `gybs-${Date.now()}`);

    const zohoPayload = {
      data: [
        {
          businessId,
          intakeVersion: body.intakeVersion || '1.0',
          hasEIN: body.hasEIN,
          hasBusinessBankAccount: body.hasBusinessBankAccount,
          hasBookKeeping: body.hasBookKeeping,
          hasFinancialStatements: body.hasFinancialStatements,
          hasDefinedOffers: body.hasDefinedOffers,
          hasPricingDefined: body.hasPricingDefined,
          hasWrittenDescriptions: body.hasWrittenDescriptions,
          hasCustomers: body.hasCustomers,
          hasRepeatCustomers: body.hasRepeatCustomers,
          hasPartners: body.hasPartners,
        },
      ],
    };

    console.log(zohoPayload, "zohoPayload");
    console.log(`/creator/v2.1/data/${ownerName}/${appLinkName}/form/${formLinkName}`);

    const zohoRes = await zohoFetch(
      `/creator/v2.1/data/${ownerName}/${appLinkName}/form/${formLinkName}`,
      {
        method: 'POST',
        body: JSON.stringify(zohoPayload),
      }
    );

    const zohoData = await zohoRes.json();

    console.log(zohoData, "zohoDataaaa");

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
      return NextResponse.json(
        {
          success: false,
          error: 'Zoho record created but no record ID was returned',
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
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : 'Submission failed.',
      },
      { status: 500 }
    );
  }
}
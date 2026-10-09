import { NextResponse } from 'next/server';
import { zohoFetch } from '@/lib/zoho';
import { isPackageTitle, PACKAGE_TIERS } from '@/lib/packages';

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  packageTitle?: string;
  packagePrice?: string;
};

function toZohoNameParts(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) return { first_name: '', last_name: '' };
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return { first_name: parts[0], last_name: parts[0] };
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(' '),
  };
}

function validateBody(body: Body): string[] {
  const errors: string[] = [];
  if (!body.name?.trim()) errors.push('Name is required');

  const email = body.email?.trim();
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be a valid email');
  }

  if (!body.phone?.trim()) errors.push('Phone is required');

  const packageTitle = body.packageTitle?.trim() || '';
  if (!packageTitle) {
    errors.push('Package is required');
  } else if (!isPackageTitle(packageTitle)) {
    errors.push('Package must be Foundation, Capability, or Optimization');
  }

  return errors;
}

/**
 * Package interest lead → Zoho Creator form.
 * Emails to Steven + applicant are handled by Creator workflows (same pattern as assessment).
 *
 * Expected Creator form fields (link name via ZOHO_PACKAGE_FORM_LINK_NAME):
 * - Name (name)
 * - Email
 * - Phone_Number
 * - Package (dropdown: Foundation | Capability | Optimization)
 * - Package_Price (optional single line)
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const errors = validateBody(body);
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 422 });
    }

    const ownerName = process.env.ZOHO_OWNER_NAME;
    const appLinkName = process.env.ZOHO_APP_LINK_NAME;
    const formLinkName =
      process.env.ZOHO_PACKAGE_FORM_LINK_NAME || 'GYBS_Package_Interest';

    if (!ownerName || !appLinkName) {
      return NextResponse.json(
        { success: false, error: 'Zoho Creator is not configured' },
        { status: 503 }
      );
    }

    const name = body.name!.trim();
    const email = body.email!.trim();
    const phone = body.phone!.trim();
    const packageTitle = body.packageTitle!.trim();

    // Prefer server-side price for the selected package (authoritative).
    const tier = PACKAGE_TIERS.find((t) => t.title === packageTitle);
    const packagePrice =
      tier?.price || body.packagePrice?.trim() || '';

    const zohoRecord: Record<string, unknown> = {
      Name: toZohoNameParts(name),
      Email: email,
      Phone_Number: phone,
      Package: packageTitle,
      Package_Price: packagePrice,
    };

    const zohoPayload = { data: [zohoRecord] };

    console.log('[packages/interest] payload', JSON.stringify(zohoPayload));

    const zohoRes = await zohoFetch(
      `/creator/v2.1/data/${ownerName}/${appLinkName}/form/${formLinkName}`,
      {
        method: 'POST',
        body: JSON.stringify(zohoPayload),
      }
    );

    const zohoData = await zohoRes.json();
    console.log('[packages/interest] zohoData', JSON.stringify(zohoData));

    if (!zohoRes.ok) {
      const zohoMessage =
        (typeof zohoData?.description === 'string' && zohoData.description) ||
        (typeof zohoData?.message === 'string' && zohoData.message) ||
        'Zoho Creator add record failed';
      const zohoCode =
        zohoData?.code != null ? ` (Creator code ${zohoData.code})` : '';
      return NextResponse.json(
        {
          success: false,
          error: `${zohoMessage}${zohoCode}`,
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
      recordId: String(recordId),
      packageTitle,
    });
  } catch (e) {
    console.error('[packages/interest]', e);
    const message = e instanceof Error ? e.message : 'Package interest submit failed';
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

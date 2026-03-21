/**
 * Intake Controller — connects to Zoho Creator.
 * Replaces dummy backend with real Zoho integration.
 */

import { NextResponse } from 'next/server';
import type { IntakePayload } from '@/lib/types';
import { validateFullIntake } from '@/lib/validation';
import { getEmptyIntakePayload } from '@/lib/mock-data';
import { getAccessToken, ZOHO_BASE } from '@/lib/zoho';

function mergePayload(body: Partial<IntakePayload>): IntakePayload {
  const empty = getEmptyIntakePayload();
  return {
    pack1_identity: { ...empty.pack1_identity, ...body.pack1_identity },
    pack2_permissions: { ...empty.pack2_permissions, ...body.pack2_permissions },
    pack3_communication: { ...empty.pack3_communication, ...body.pack3_communication },
    pack4_intent: { ...empty.pack4_intent, ...body.pack4_intent },
    pack5_readiness: { ...empty.pack5_readiness, ...body.pack5_readiness },
    pack6_opportunity: { ...empty.pack6_opportunity, ...body.pack6_opportunity },
    pack7_representation: { ...empty.pack7_representation, ...body.pack7_representation },
    pack8_documents: { ...empty.pack8_documents, ...body.pack8_documents },
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<IntakePayload>;
    const payload = mergePayload(body);

    // Validate first
    const errors = validateFullIntake(payload);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 422 }
      );
    }

    const {
      pack1_identity,
      pack2_permissions,
      pack3_communication,
      pack4_intent,
      pack5_readiness,
      pack6_opportunity,
      pack7_representation,
    } = payload;

    // Get Zoho token
    const token = await getAccessToken();

    // Forward to Zoho Creator — zero logic here
    const zohoRes = await fetch(
      `${ZOHO_BASE}/form/Master_Customer_Intake_MCI`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            // Identity Pack
            Business_Name: pack1_identity.businessName,
            Primary_Contact: pack1_identity.primaryContact,
            Email: pack1_identity.email,
            Phone: pack1_identity.phone,
            Business_Address: pack1_identity.businessAddress,
            NAICS_Code: pack1_identity.naicsCode,

            // Permissions Pack
            Permission_Communicate: pack2_permissions.permissionCommunicate,
            Permission_Documents: pack2_permissions.permissionUploadStore,
            Permission_Agent: pack2_permissions.permissionActAsAgent,
            Permission_Opportunity: pack2_permissions.permissionRepresentOpportunity,

            // Communication Pack
            Preferred_Contact_Method: pack3_communication.contactPreference,
            Communication_Frequency: pack3_communication.communicationFrequency,

            // Intent Pack
            Intent: pack4_intent.whatLookingFor,

            // Readiness Pack
            // Documents_Have: Array.isArray(pack5_readiness.documentsHave)
            //   ? pack5_readiness.documentsHave.join(',')
            //   : pack5_readiness.documentsHave,
            Documents_Needed: pack5_readiness.documentsNeed,
            Preparation_Level: pack5_readiness.howPreparedFeel,
            Readiness_Improvement: pack5_readiness.howImproveReadiness,

            // Opportunity Pack
            Opportunity_Type: pack6_opportunity.opportunityType,
            Opportunity_Timeline: pack6_opportunity.timeline,
            Opportunity_Description: pack6_opportunity.describeOpportunity,
            Attempted_Before: pack6_opportunity.attemptedBefore,
            Previous_Attempt_Details: pack6_opportunity.attemptedBeforeWhatHappened,
            Biggest_Challenge: pack6_opportunity.biggestChallenge,

            // Representation Pack
            Auth_Review_Opportunity: pack7_representation.authorizeReviewOpportunity,
            Auth_Match_Suppliers: pack7_representation.authorizeMatchSuppliersLendersPrograms,
            Auth_Communicate_Behalf: pack7_representation.authorizeCommunicateOnBehalf,
          },
        }),
      }
    );

    const zohoData = await zohoRes.json();
    console.log('Zoho Response:', JSON.stringify(zohoData, null, 2));

    if (!zohoRes.ok) {
      console.error('Zoho error:', zohoData);
      return NextResponse.json(
        { success: false, errors: [{ field: '_form', message: 'Failed to save to Zoho' }] },
        { status: 500 }
      );
    }

    // Return record_id from Zoho
    return NextResponse.json({
      success: true,
      record_id: zohoData?.result?.id ?? null,
    });

  } catch (e) {
    console.error('Submit error', e);
    return NextResponse.json(
      { success: false, error: 'Submission failed.' },
      { status: 500 }
    );
  }
}
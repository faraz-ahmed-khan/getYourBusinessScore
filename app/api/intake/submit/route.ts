/**
 * Intake Controller → Readiness Lifecycle (Level 2).
 * Dummy backend: validates full payload, enforces 4 permissions + representation,
 * generates mock UBID and Business Score. Replace with Zoho/real backend later.
 */

import { NextResponse } from 'next/server';
import type { IntakePayload, SubmitResponse } from '@/lib/types';
import { validateFullIntake } from '@/lib/validation';
import { buildSubmitResponse } from '@/lib/scoring';
import { getEmptyIntakePayload } from '@/lib/mock-data';

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

    const errors = validateFullIntake(payload);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 422 }
      );
    }

    // Dummy backend: score generation is temporary demo logic; replace with Zoho or production controller.
    const response = buildSubmitResponse(payload) as SubmitResponse;

    return NextResponse.json(response);
  } catch (e) {
    console.error('Submit error', e);
    return NextResponse.json({ success: false, error: 'Submission failed.' }, { status: 500 });
  }
}

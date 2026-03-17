/**
 * Intake Controller, Level 1 — save draft.
 * Dummy backend: accepts partial step data, returns success and normalized payload.
 * No database; no persistence across requests.
 */

import { NextResponse } from 'next/server';
import type { SaveDraftRequest, IntakePayload } from '@/lib/types';
import { getEmptyIntakePayload } from '@/lib/mock-data';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SaveDraftRequest;
    const { step, data } = body;

    const empty = getEmptyIntakePayload();
    const merged: Partial<IntakePayload> = { ...empty, ...data };

    // Normalize: ensure nested objects exist
    if (data?.pack1_identity) merged.pack1_identity = { ...empty.pack1_identity, ...data.pack1_identity };
    if (data?.pack2_permissions) merged.pack2_permissions = { ...empty.pack2_permissions, ...data.pack2_permissions };
    if (data?.pack3_communication) merged.pack3_communication = { ...empty.pack3_communication, ...data.pack3_communication };
    if (data?.pack4_intent) merged.pack4_intent = { ...empty.pack4_intent, ...data.pack4_intent };
    if (data?.pack5_readiness) merged.pack5_readiness = { ...empty.pack5_readiness, ...data.pack5_readiness };
    if (data?.pack6_opportunity) merged.pack6_opportunity = { ...empty.pack6_opportunity, ...data.pack6_opportunity };
    if (data?.pack7_representation) merged.pack7_representation = { ...empty.pack7_representation, ...data.pack7_representation };
    if (data?.pack8_documents) merged.pack8_documents = { ...empty.pack8_documents, ...data.pack8_documents };

    return NextResponse.json({
      success: true,
      payload: merged,
    });
  } catch {
    return NextResponse.json({ success: false, payload: {} }, { status: 400 });
  }
}

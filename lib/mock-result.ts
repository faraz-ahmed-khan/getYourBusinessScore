/**
 * MOCK SUBMIT RESPONSE BUILDER — replace with real backend only.
 * Single import point for POST /api/intake/submit and any future client-side preview.
 */

import type { IntakePayload, SubmitResponse } from './types';
import { buildSubmitResponse } from './scoring';

export function buildMockSubmitResponse(payload: IntakePayload): SubmitResponse {
  return buildSubmitResponse(payload);
}

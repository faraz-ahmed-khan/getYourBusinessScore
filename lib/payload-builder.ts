import type { IntakePayload } from './types';

/**
 * Frontend payload builder.
 * Keeps mapping/normalization outside UI components so backend integration
 * can replace endpoints without touching form rendering.
 */
export function buildIntakeSubmitPayload(payload: IntakePayload): IntakePayload {
  return {
    pack1_identity: {
      businessName: payload.pack1_identity.businessName.trim(),
      primaryContact: payload.pack1_identity.primaryContact.trim(),
      email: payload.pack1_identity.email.trim(),
      phone: payload.pack1_identity.phone.trim(),
      businessAddress: payload.pack1_identity.businessAddress.trim(),
      naicsCode: payload.pack1_identity.naicsCode.trim(),
    },
    pack2_permissions: { ...payload.pack2_permissions },
    pack3_communication: { ...payload.pack3_communication },
    pack4_intent: {
      whatLookingFor: payload.pack4_intent.whatLookingFor,
      whatLookingForOther: payload.pack4_intent.whatLookingForOther?.trim(),
    },
    pack5_readiness: {
      documentsHave: [...payload.pack5_readiness.documentsHave],
      documentsNeed: payload.pack5_readiness.documentsNeed.trim(),
      howPreparedFeel: payload.pack5_readiness.howPreparedFeel,
      howImproveReadiness: payload.pack5_readiness.howImproveReadiness,
    },
    pack6_opportunity: {
      opportunityType: payload.pack6_opportunity.opportunityType,
      timeline: payload.pack6_opportunity.timeline,
      describeOpportunity: payload.pack6_opportunity.describeOpportunity.trim(),
      attemptedBefore: payload.pack6_opportunity.attemptedBefore,
      attemptedBeforeWhatHappened: payload.pack6_opportunity.attemptedBeforeWhatHappened?.trim(),
      biggestChallenge: payload.pack6_opportunity.biggestChallenge.trim(),
    },
    pack7_representation: { ...payload.pack7_representation },
    pack8_documents: {
      uploadedFiles: payload.pack8_documents.uploadedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    },
  };
}


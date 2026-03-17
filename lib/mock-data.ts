/**
 * Initial / empty payload and mock data for dummy backend.
 * No database; in-memory or request-scoped only.
 */

import type { IntakePayload, DocumentOption } from './types';

export const emptyIdentity = {
  businessName: '',
  primaryContact: '',
  email: '',
  phone: '',
  businessAddress: '',
  naicsCode: '',
};

export const emptyPermissions = {
  permissionCommunicate: false,
  permissionUploadStore: false,
  permissionActAsAgent: false,
  permissionRepresentOpportunity: false,
};

export const emptyCommunication = {
  contactPreference: '' as const,
  communicationFrequency: '' as const,
};

export const emptyIntent = {
  whatLookingFor: '' as const,
  whatLookingForOther: undefined as string | undefined,
};

export const emptyReadiness = {
  documentsHave: [] as DocumentOption[],
  documentsNeed: '',
  howPreparedFeel: '' as const,
  howImproveReadiness: '' as const,
};

export const emptyOpportunity = {
  opportunityType: '' as const,
  timeline: '' as const,
  describeOpportunity: '',
  attemptedBefore: '' as 'Yes' | 'No' | '',
  attemptedBeforeWhatHappened: undefined as string | undefined,
  biggestChallenge: '',
};

export const emptyRepresentation = {
  authorizeReviewOpportunity: false,
  authorizeMatchSuppliersLendersPrograms: false,
  authorizeCommunicateOnBehalf: false,
};

export const emptyDocuments = {
  uploadedFiles: [] as { name: string; size?: number; type?: string }[],
};

export function getEmptyIntakePayload(): IntakePayload {
  return {
    pack1_identity: { ...emptyIdentity },
    pack2_permissions: { ...emptyPermissions },
    pack3_communication: { ...emptyCommunication },
    pack4_intent: { ...emptyIntent },
    pack5_readiness: { ...emptyReadiness },
    pack6_opportunity: { ...emptyOpportunity },
    pack7_representation: { ...emptyRepresentation },
    pack8_documents: { ...emptyDocuments },
  };
}

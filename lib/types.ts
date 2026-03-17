/**
 * GYBS types — aligned with MCI (Master Customer Intake) for Zoho integration.
 * All questions map to metadata columns; structure preserved for dummy backend.
 */

// PACK 1 — Identity Pack (business version only; creates UBID)
export interface IdentityPack {
  businessName: string;
  primaryContact: string;
  email: string;
  phone: string;
  businessAddress: string;
  naicsCode: string;
}

// PACK 2 — Permissions Pack (all 4 must be TRUE to complete)
export interface PermissionsPack {
  permissionCommunicate: boolean;
  permissionUploadStore: boolean;
  permissionActAsAgent: boolean;
  permissionRepresentOpportunity: boolean;
}

// PACK 3 — Communication Pack
export type ContactPreference = 'Email' | 'SMS' | 'Phone';
export type CommunicationFrequency = 'As needed' | 'Weekly' | 'Monthly';

export interface CommunicationPack {
  contactPreference: ContactPreference | '';
  communicationFrequency: CommunicationFrequency | '';
}

// PACK 4 — Intent Pack
export type IntentOption =
  | 'Marketplace products'
  | 'Distribution support'
  | 'Contracting support'
  | 'SBA support'
  | 'AI readiness'
  | 'Other';

export interface IntentPack {
  whatLookingFor: IntentOption | '';
  whatLookingForOther?: string;
}

// PACK 5 — Readiness Pack (intake-level metadata only, not readiness actions)
export type DocumentOption =
  | 'Business license'
  | 'EIN'
  | 'Bank statements'
  | 'Tax returns'
  | 'Financial statements'
  | 'Other';

export type PreparednessLevel = 'Not prepared' | 'Somewhat prepared' | 'Prepared' | 'Very prepared';
export type ImprovementPreference = 'Self-guided' | 'Assisted' | 'Subscription';

export interface ReadinessPack {
  documentsHave: DocumentOption[];
  documentsNeed: string;
  howPreparedFeel: PreparednessLevel | '';
  howImproveReadiness: ImprovementPreference | '';
}

// PACK 6 — Opportunity Pack
export type OpportunityType = 'Purchase' | 'Contract' | 'Loan' | 'Certification' | 'Program' | 'Other';
export type TimelineOption = 'Immediately' | '30 days' | '60 days' | '90+ days';

export interface OpportunityPack {
  opportunityType: OpportunityType | '';
  timeline: TimelineOption | '';
  describeOpportunity: string;
  attemptedBefore: 'Yes' | 'No' | '';
  attemptedBeforeWhatHappened?: string;
  biggestChallenge: string;
}

// PACK 7 — Representation Pack (required affirmative before completion)
export interface RepresentationPack {
  authorizeReviewOpportunity: boolean;
  authorizeMatchSuppliersLendersPrograms: boolean;
  authorizeCommunicateOnBehalf: boolean;
}

// PACK 8 — Document Upload Pack (optional; dummy: mock metadata only)
export interface DocumentUploadPack {
  uploadedFiles: { name: string; size?: number; type?: string }[];
}

export interface IntakePayload {
  pack1_identity: IdentityPack;
  pack2_permissions: PermissionsPack;
  pack3_communication: CommunicationPack;
  pack4_intent: IntentPack;
  pack5_readiness: ReadinessPack;
  pack6_opportunity: OpportunityPack;
  pack7_representation: RepresentationPack;
  pack8_documents: DocumentUploadPack;
}

export interface ReadinessCard {
  id: string;
  title: string;
  destination: string;
  description: string;
  ctaText: string;
}

export type ReadinessLevelLabel = 'Emerging' | 'Developing' | 'Ready' | 'Advanced';

export interface SubmitResponse {
  ubid: string;
  businessScore: number;
  readinessLevel: ReadinessLevelLabel;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  readinessCards: ReadinessCard[];
  metadata: {
    businessName: string;
    submittedAt: string;
  };
}

export interface SaveDraftRequest {
  step: number;
  data: Partial<IntakePayload>;
}

export interface SaveDraftResponse {
  success: boolean;
  payload: Partial<IntakePayload>;
}

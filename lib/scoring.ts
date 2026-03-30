/**
 * DUMMY BACKEND SCORING LOGIC — for demo only.
 * This should be replaced later by Zoho or production Readiness Lifecycle Controller logic.
 * Computes Business Score (0–100), Readiness Level, strengths, gaps, recommendations from intake data.
 */

import type { IntakePayload, ReadinessCard, ReadinessLevelLabel } from './types';
import { READINESS_CARDS } from './constants';

export function computeBusinessScore(payload: IntakePayload): number {
  let score = 50; // base

  // Identity completeness
  const identity = payload.pack1_identity;
  if (identity.businessName?.trim()) score += 3;
  if (identity.email?.trim()) score += 2;
  if (identity.phone?.trim()) score += 2;
  if (identity.businessAddress?.trim()) score += 3;
  if (identity.naicsCode?.trim()) score += 2;

  // Permissions all true (already enforced by validation)
  score += 5;

  // Communication preferences set
  if (payload.pack3_communication.contactPreference) score += 2;
  if (payload.pack3_communication.communicationFrequency) score += 2;

  // Intent clarity
  if (payload.pack4_intent.whatLookingFor) score += 3;

  // Readiness pack: documents and preparedness
  const docsHave = payload.pack5_readiness.documentsHave?.length ?? 0;
  score += Math.min(docsHave * 2, 10);
  const prepared = payload.pack5_readiness.howPreparedFeel;
  if (prepared === 'Very prepared') score += 5;
  else if (prepared === 'Prepared') score += 3;
  else if (prepared === 'Somewhat prepared') score += 1;

  // Opportunity detail
  const descLen = (payload.pack6_opportunity.describeOpportunity ?? '').trim().length;
  if (descLen > 100) score += 4;
  else if (descLen > 50) score += 2;
  const challengeLen = (payload.pack6_opportunity.biggestChallenge ?? '').trim().length;
  if (challengeLen > 50) score += 2;

  // Document upload (optional but shows engagement)
  const uploadCount = payload.pack8_documents?.uploadedFiles?.length ?? 0;
  score += Math.min(uploadCount * 2, 4);

  return Math.min(100, Math.max(0, Math.round(score)));
}

export function getReadinessLevel(score: number): ReadinessLevelLabel {
  if (score >= 85) return 'Advanced';
  if (score >= 70) return 'Ready';
  if (score >= 50) return 'Developing';
  return 'Emerging';
}

export function getStrengths(payload: IntakePayload, score: number): string[] {
  const strengths: string[] = [];
  if (payload.pack1_identity.naicsCode?.trim())
    strengths.push('NAICS code provided — helps us align your business with the right opportunities.');
  if ((payload.pack5_readiness.documentsHave?.length ?? 0) > 0)
    strengths.push('You already have some key documents in place.');
  const prepared = payload.pack5_readiness.howPreparedFeel;
  if (prepared === 'Prepared' || prepared === 'Very prepared')
    strengths.push('You indicated you feel prepared — a strong starting point.');
  if (payload.pack7_representation.authorizeReviewOpportunity)
    strengths.push('You have authorized opportunity review — enabling Prime Agent support.');
  if (score >= 70) strengths.push('Your overall readiness profile supports moving into pathway and opportunity steps.');
  if (strengths.length === 0) strengths.push('You have completed the intake — the first step toward readiness.');
  return strengths;
}

export function getGaps(payload: IntakePayload, score: number): string[] {
  const gaps: string[] = [];
  const docsHave = payload.pack5_readiness.documentsHave?.length ?? 0;
  if (docsHave === 0)
    gaps.push('Consider gathering core documents (e.g., business license, EIN) to strengthen your profile.');
  if (payload.pack5_readiness.howPreparedFeel === 'Not prepared' || payload.pack5_readiness.howPreparedFeel === 'Somewhat prepared')
    gaps.push('Focus on foundational readiness before pursuing larger opportunities.');
  if (payload.pack6_opportunity.attemptedBefore === 'Yes' && !(payload.pack6_opportunity.attemptedBeforeWhatHappened?.trim()))
    gaps.push('Sharing what happened in past attempts can help us tailor support.');
  if (score < 50) gaps.push('Building document readiness and clarity on your opportunity will improve your score.');
  if (gaps.length === 0) gaps.push('Continue to update your profile as your business evolves.');
  return gaps;
}

export function getRecommendations(payload: IntakePayload, readinessLevel: ReadinessLevelLabel): string[] {
  const recs: string[] = [];
  recs.push('Complete your subscription on MisconiUSA.com to unlock your readiness pathway.');
  if (readinessLevel === 'Emerging' || readinessLevel === 'Developing')
    recs.push('Consider SBAReady.org for training and foundational support before entering the operational system.');
  recs.push('Visit MisconiUSANetwork.com to learn about readiness concepts and pathway overviews.');
  if ((payload.pack8_documents?.uploadedFiles?.length ?? 0) === 0)
    recs.push('Upload key documents when ready to help us match you with the right opportunities.');
  return recs;
}

function buildResultOverview(payload: IntakePayload, readinessLevel: ReadinessLevelLabel): {
  recommendedLane: string;
  assignedPack: string;
  correctionList: string[];
  requiredDocuments: string[];
  missingInformation: string[];
  upgradePathway: string;
} {
  const docsHave = payload.pack5_readiness.documentsHave;
  /** Mock only: template list for display; replace with backend rules. */
  const requiredDocuments = ['Business license', 'EIN', 'Bank statements'];
  const missingInformation: string[] = [];
  const correctionList: string[] = [];

  if (!payload.pack5_readiness.documentsNeed.trim()) {
    missingInformation.push('Optional: add which documents you still need for clearer next steps.');
  }
  if ((payload.pack8_documents?.uploadedFiles?.length ?? 0) === 0) {
    missingInformation.push('Optional: attach sample documents in a future intake pass (upload is mocked here).');
  }

  if (docsHave.length === 0) {
    correctionList.push('Gather or upload core business documents to strengthen readiness classification.');
  }
  if (payload.pack5_readiness.howPreparedFeel === 'Not prepared' || payload.pack5_readiness.howPreparedFeel === 'Somewhat prepared') {
    correctionList.push('Prioritize foundational readiness before pursuing larger opportunities.');
  }
  if (payload.pack5_readiness.howImproveReadiness === 'Subscription') {
    correctionList.push('Align subscription onboarding with operational pathway requirements on MisconiUSA.com when ready.');
  }

  const recommendedLane =
    readinessLevel === 'Ready' || readinessLevel === 'Advanced'
      ? 'Begin Your Readiness Pathway (operational — MisconiUSA.com)'
      : readinessLevel === 'Developing'
        ? 'Learn About Readiness (education — MisconiUSANetwork.com)'
        : 'Get SBA-Aligned Training & Support (SBAReady.org)';

  const assignedPack =
    payload.pack5_readiness.howImproveReadiness === 'Subscription'
      ? 'Subscription-aligned readiness pack (mock)'
      : payload.pack5_readiness.howImproveReadiness === 'Assisted'
        ? 'Assisted readiness pack (mock)'
        : 'Self-guided readiness pack (mock)';

  const upgradePathway =
    readinessLevel === 'Advanced'
      ? 'Operational activation: complete pathway steps on MisconiUSA.com to unlock opportunity eligibility.'
      : 'Close gaps above, then re-run intake or proceed to training/education before operational subscription.';

  return {
    recommendedLane,
    assignedPack,
    correctionList,
    requiredDocuments,
    missingInformation,
    upgradePathway,
  };
}

export function buildSubmitResponse(payload: IntakePayload): {
  ubid: string;
  businessScore: number;
  readinessLevel: ReadinessLevelLabel;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  resultOverview: {
    recommendedLane: string;
    assignedPack: string;
    correctionList: string[];
    requiredDocuments: string[];
    missingInformation: string[];
    upgradePathway: string;
  };
  readinessCards: ReadinessCard[];
  metadata: { businessName: string; submittedAt: string };
} {
  const businessScore = computeBusinessScore(payload);
  const readinessLevel = getReadinessLevel(businessScore);
  const readinessCards: ReadinessCard[] = READINESS_CARDS.map((c) => ({
    id: c.id,
    title: c.title,
    destination: c.destination,
    description: c.description,
    ctaText: c.ctaText,
  }));
  return {
    ubid: `UBID-${Date.now()}-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    businessScore,
    readinessLevel,
    strengths: getStrengths(payload, businessScore),
    gaps: getGaps(payload, businessScore),
    recommendations: getRecommendations(payload, readinessLevel),
    resultOverview: buildResultOverview(payload, readinessLevel),
    readinessCards,
    metadata: {
      businessName: payload.pack1_identity.businessName?.trim() || 'Business',
      submittedAt: new Date().toISOString(),
    },
  };
}

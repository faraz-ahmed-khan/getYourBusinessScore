/**
 * Validation for Intake Controller (Level 1).
 * Enforces: all required packs, 4 permissions TRUE, representation pack complete.
 */

import type { IntakePayload, PermissionsPack, RepresentationPack } from './types';

export interface ValidationError {
  field: string;
  message: string;
}

function required(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function requiredEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateIdentityPack(p: IntakePayload['pack1_identity']): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!required(p.businessName)) errors.push({ field: 'businessName', message: 'Business name is required.' });
  if (!required(p.primaryContact)) errors.push({ field: 'primaryContact', message: 'Primary contact is required.' });
  if (!required(p.email)) errors.push({ field: 'email', message: 'Email is required.' });
  else if (!requiredEmail(p.email)) errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  if (!required(p.phone)) errors.push({ field: 'phone', message: 'Phone number is required.' });
  if (!required(p.businessAddress)) errors.push({ field: 'businessAddress', message: 'Business address is required.' });
  if (!required(p.naicsCode)) errors.push({ field: 'naicsCode', message: 'NAICS code is required.' });
  return errors;
}

/** All four permissions must be TRUE or intake cannot complete. */
export function validatePermissionsPack(p: PermissionsPack): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!p.permissionCommunicate)
    errors.push({ field: 'permissionCommunicate', message: 'You must give permission to communicate.' });
  if (!p.permissionUploadStore)
    errors.push({ field: 'permissionUploadStore', message: 'You must give permission to upload and store documents.' });
  if (!p.permissionActAsAgent)
    errors.push({ field: 'permissionActAsAgent', message: 'You must give permission for Misconi USA to act as your agent.' });
  if (!p.permissionRepresentOpportunity)
    errors.push({
      field: 'permissionRepresentOpportunity',
      message: 'You must give permission for Misconi USA to represent your opportunity.',
    });
  return errors;
}

export function validateCommunicationPack(p: IntakePayload['pack3_communication']): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!required(p.contactPreference as string))
    errors.push({ field: 'contactPreference', message: 'Please select how you prefer to be contacted.' });
  if (!required(p.communicationFrequency as string))
    errors.push({ field: 'communicationFrequency', message: 'Please select your preferred communication frequency.' });
  return errors;
}

export function validateIntentPack(p: IntakePayload['pack4_intent']): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!required(p.whatLookingFor as string))
    errors.push({ field: 'whatLookingFor', message: 'Please select what you are looking for today.' });
  if (p.whatLookingFor === 'Other' && !required(p.whatLookingForOther))
    errors.push({ field: 'whatLookingForOther', message: 'Please describe what you are looking for.' });
  return errors;
}

export function validateReadinessPack(p: IntakePayload['pack5_readiness']): ValidationError[] {
  const errors: ValidationError[] = [];
  // documentsHave can be empty array per spec; documentsNeed is free text
  if (!required(p.howPreparedFeel as string))
    errors.push({ field: 'howPreparedFeel', message: 'Please select how prepared you feel.' });
  if (!required(p.howImproveReadiness as string))
    errors.push({ field: 'howImproveReadiness', message: 'Please select how you would like to improve your readiness.' });
  return errors;
}

export function validateOpportunityPack(p: IntakePayload['pack6_opportunity']): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!required(p.opportunityType as string))
    errors.push({ field: 'opportunityType', message: 'Please select the type of opportunity you are pursuing.' });
  if (!required(p.timeline as string)) errors.push({ field: 'timeline', message: 'Please select your timeline.' });
  if (!required(p.describeOpportunity))
    errors.push({ field: 'describeOpportunity', message: 'Please describe your opportunity in your own words.' });
  if (!required(p.attemptedBefore as string))
    errors.push({ field: 'attemptedBefore', message: 'Please indicate if you have attempted this opportunity before.' });
  if (p.attemptedBefore === 'Yes' && !required(p.attemptedBeforeWhatHappened))
    errors.push({ field: 'attemptedBeforeWhatHappened', message: 'Please describe what happened.' });
  if (!required(p.biggestChallenge))
    errors.push({ field: 'biggestChallenge', message: 'Please describe the biggest challenge you are facing.' });
  return errors;
}

/** Representation pack: required affirmative controls before completion. */
export function validateRepresentationPack(p: RepresentationPack): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!p.authorizeReviewOpportunity)
    errors.push({ field: 'authorizeReviewOpportunity', message: 'You must authorize review of your opportunity.' });
  if (!p.authorizeMatchSuppliersLendersPrograms)
    errors.push({
      field: 'authorizeMatchSuppliersLendersPrograms',
      message: 'You must authorize matching with suppliers, lenders, or programs.',
    });
  if (!p.authorizeCommunicateOnBehalf)
    errors.push({
      field: 'authorizeCommunicateOnBehalf',
      message: 'You must authorize Misconi USA to communicate on your behalf when needed.',
    });
  return errors;
}

// Pack 8 (documents) is optional — no required validation.

export function validateFullIntake(payload: IntakePayload): ValidationError[] {
  const all: ValidationError[] = [];
  all.push(...validateIdentityPack(payload.pack1_identity));
  all.push(...validatePermissionsPack(payload.pack2_permissions));
  all.push(...validateCommunicationPack(payload.pack3_communication));
  all.push(...validateIntentPack(payload.pack4_intent));
  all.push(...validateReadinessPack(payload.pack5_readiness));
  all.push(...validateOpportunityPack(payload.pack6_opportunity));
  all.push(...validateRepresentationPack(payload.pack7_representation));
  return all;
}

/** Validate a single step (1–8) for client-side Next button. */
export function validateStep(payload: IntakePayload, step: number): ValidationError[] {
  switch (step) {
    case 1:
      return validateIdentityPack(payload.pack1_identity);
    case 2:
      return validatePermissionsPack(payload.pack2_permissions);
    case 3:
      return validateCommunicationPack(payload.pack3_communication);
    case 4:
      return validateIntentPack(payload.pack4_intent);
    case 5:
      return validateReadinessPack(payload.pack5_readiness);
    case 6:
      return validateOpportunityPack(payload.pack6_opportunity);
    case 7:
      return validateRepresentationPack(payload.pack7_representation);
    default:
      return [];
  }
}

/**
 * GYBS scoring engine — governed weights and normalization (spec).
 */

export type YesNo = 'yes' | 'no';

export interface IntakeAnswers {
  hasEIN: YesNo;
  hasBusinessBankAccount: YesNo;
  hasBookkeeping: 'yes' | 'outsourced' | 'no';
  hasFinancialStatements: 'yes' | 'partial' | 'no';
  hasDefinedOffers: 'yes' | 'in-progress' | 'no';
  hasPricingDefined: 'yes' | 'tiered' | 'no';
  hasWrittenDescriptions: 'yes' | 'partial' | 'no';
  hasCustomers: YesNo;
  hasRepeatCustomers: 'yes' | 'unknown' | 'no';
  hasPartners: 'yes' | 'informal' | 'no';
}

const norm = {
  hasEIN: (v: IntakeAnswers['hasEIN']) => (v === 'yes' ? 1 : 0),
  hasBusinessBankAccount: (v: IntakeAnswers['hasBusinessBankAccount']) => (v === 'yes' ? 1 : 0),
  hasBookkeeping: (v: IntakeAnswers['hasBookkeeping']) =>
    v === 'yes' ? 1 : v === 'outsourced' ? 0.75 : 0,
  hasFinancialStatements: (v: IntakeAnswers['hasFinancialStatements']) =>
    v === 'yes' ? 1 : v === 'partial' ? 0.5 : 0,
  hasDefinedOffers: (v: IntakeAnswers['hasDefinedOffers']) =>
    v === 'yes' ? 1 : v === 'in-progress' ? 0.5 : 0,
  hasPricingDefined: (v: IntakeAnswers['hasPricingDefined']) =>
    v === 'yes' ? 1 : v === 'tiered' ? 0.75 : 0,
  hasWrittenDescriptions: (v: IntakeAnswers['hasWrittenDescriptions']) =>
    v === 'yes' ? 1 : v === 'partial' ? 0.5 : 0,
  hasCustomers: (v: IntakeAnswers['hasCustomers']) => (v === 'yes' ? 1 : 0),
  hasRepeatCustomers: (v: IntakeAnswers['hasRepeatCustomers']) =>
    v === 'yes' ? 1 : v === 'unknown' ? 0.5 : 0,
  hasPartners: (v: IntakeAnswers['hasPartners']) =>
    v === 'yes' ? 1 : v === 'informal' ? 0.5 : 0,
} as const;

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export interface ScoreBreakdown {
  operationalScore: number;
  catalogScore: number;
  relationshipScore: number;
  finalScore: number;
  level: 1 | 2 | 3;
  lane: string;
  packName: string;
}

export function calculateScore(
  answers: IntakeAnswers,
  pathwayShortName: string
): ScoreBreakdown {
  const opVals = [
    norm.hasEIN(answers.hasEIN),
    norm.hasBusinessBankAccount(answers.hasBusinessBankAccount),
    norm.hasBookkeeping(answers.hasBookkeeping),
    norm.hasFinancialStatements(answers.hasFinancialStatements),
  ];
  const catVals = [
    norm.hasDefinedOffers(answers.hasDefinedOffers),
    norm.hasPricingDefined(answers.hasPricingDefined),
    norm.hasWrittenDescriptions(answers.hasWrittenDescriptions),
  ];
  const relVals = [
    norm.hasCustomers(answers.hasCustomers),
    norm.hasRepeatCustomers(answers.hasRepeatCustomers),
    norm.hasPartners(answers.hasPartners),
  ];

  const operationalScore = average(opVals) * 100;
  const catalogScore = average(catVals) * 100;
  const relationshipScore = average(relVals) * 100;

  const finalScore = Math.round(
    operationalScore * 0.5 + catalogScore * 0.3 + relationshipScore * 0.2
  );

  let level: 1 | 2 | 3;
  let lane: string;
  if (finalScore <= 33) {
    level = 1;
    lane = 'Foundational Lane';
  } else if (finalScore <= 66) {
    level = 2;
    lane = 'Guided Lane';
  } else {
    level = 3;
    lane = 'Opportunity Lane';
  }

  const packSuffix = level === 1 ? 'Starter Pack' : level === 2 ? 'Growth Pack' : 'Opportunity Pack';
  const packName = `${pathwayShortName} ${packSuffix}`;

  return {
    operationalScore,
    catalogScore,
    relationshipScore,
    finalScore,
    level,
    lane,
    packName,
  };
}

export function emptyIntakeAnswers(): IntakeAnswers {
  return {
    hasEIN: 'no',
    hasBusinessBankAccount: 'no',
    hasBookkeeping: 'no',
    hasFinancialStatements: 'no',
    hasDefinedOffers: 'no',
    hasPricingDefined: 'no',
    hasWrittenDescriptions: 'no',
    hasCustomers: 'no',
    hasRepeatCustomers: 'no',
    hasPartners: 'no',
  };
}

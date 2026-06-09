import { ASSESSMENT_QUESTIONS, type AnswerChoice } from '@/lib/assessment-questions';
import { type ReadinessLevel } from '@/lib/readiness-levels';

const CHOICE_POINTS: Record<AnswerChoice, number> = { A: 1, B: 2, C: 3, D: 4 };

export type PathwayOption = 'sba' | 'supplier' | 'subscription';

export type DoctrineScoreResult = {
  score: number;
  level: ReadinessLevel;
  availablePathways: PathwayOption[];
  answers: Record<number, AnswerChoice>;
};

export function computeDoctrineScore(answers: Record<number, AnswerChoice>): DoctrineScoreResult {
  const totalPoints = ASSESSMENT_QUESTIONS.reduce((sum, q) => {
    const choice = answers[q.id];
    return sum + (choice ? CHOICE_POINTS[choice] : 0);
  }, 0);

  const maxPoints = ASSESSMENT_QUESTIONS.length * 4;
  const score = Math.round((totalPoints / maxPoints) * 100);
  const level = levelFromScore(score);
  const availablePathways = pathwaysForLevel(level, answers);

  return { score, level, availablePathways, answers };
}

function levelFromScore(score: number): ReadinessLevel {
  if (score <= 25) return 1;
  if (score <= 50) return 2;
  if (score <= 75) return 3;
  return 4;
}

function pathwaysForLevel(level: ReadinessLevel, answers: Record<number, AnswerChoice>): PathwayOption[] {
  const pathways: PathwayOption[] = [];

  if (level <= 2) {
    pathways.push('sba');
  } else {
    pathways.push('supplier');
  }

  const strongIndicators = countStrongAnswers(answers) >= 7;
  if (level === 4 || strongIndicators) {
    pathways.push('subscription');
  }

  return pathways;
}

function countStrongAnswers(answers: Record<number, AnswerChoice>): number {
  return Object.values(answers).filter((choice) => choice === 'C' || choice === 'D').length;
}

export const PATHWAY_LABELS: Record<PathwayOption, string> = {
  sba: 'SBA Readiness Pathway',
  supplier: 'Supplier Readiness Pathway',
  subscription: 'Subscription Pathway',
};

export const PATHWAY_DESCRIPTIONS: Record<PathwayOption, string> = {
  sba: 'Foundational readiness support for businesses building documentation, operations, and financial structure.',
  supplier: 'Visibility and partner-readiness support for businesses with stable operations and documentation.',
  subscription:
    'Subscription options appear only after your Initial Business Score and support your readiness development.',
};

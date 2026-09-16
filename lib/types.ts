/** Shared GYBS types — marketing UI + assessment scoring. */

export interface ReadinessCard {
  id: string;
  title: string;
  destination: string;
  description: string;
  ctaText: string;
}

export type Lead = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
};

/** Question number → points selected (0–2). */
export type Answers = Record<number, number>;

export type QuestionOption = {
  label: string;
  pts: number;
};

export type Question = {
  num: number;
  type: 'mc' | 'yn';
  text: string;
  options: QuestionOption[];
};

export type Category = {
  name: string;
  short: string;
  desc: string;
  icon: string;
  startNum: number;
  endNum: number;
  questions: Question[];
};

export type Band = {
  key: string;
  min: number;
  max: number;
  color: string;
  headline: string;
  body: string;
  nextTier: string;
  nextHeadline: string;
  nextBody: string;
};

export type CategoryResult = {
  name: string;
  raw: number;
  max: number;
  pct: number;
  answered: number;
  total: number;
};

export type Results = {
  readinessScore: number;
  band: Band;
  answeredCount: number;
  cats: CategoryResult[];
};

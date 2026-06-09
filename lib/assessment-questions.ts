export type AnswerChoice = 'A' | 'B' | 'C' | 'D';

export type AssessmentQuestion = {
  id: number;
  question: string;
  options: { value: AnswerChoice; label: string }[];
};

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 1,
    question: 'How organized are your business documents (licenses, tax returns, financials)?',
    options: [
      { value: 'A', label: 'Not organized' },
      { value: 'B', label: 'Somewhat organized' },
      { value: 'C', label: 'Mostly organized' },
      { value: 'D', label: 'Fully organized' },
    ],
  },
  {
    id: 2,
    question: 'How consistent is your business revenue?',
    options: [
      { value: 'A', label: 'Very inconsistent' },
      { value: 'B', label: 'Somewhat inconsistent' },
      { value: 'C', label: 'Mostly consistent' },
      { value: 'D', label: 'Very consistent' },
    ],
  },
  {
    id: 3,
    question: 'Do you have a written business plan or strategy?',
    options: [
      { value: 'A', label: 'No' },
      { value: 'B', label: 'Partially' },
      { value: 'C', label: 'Yes, but outdated' },
      { value: 'D', label: 'Yes, updated and active' },
    ],
  },
  {
    id: 4,
    question: 'How strong is your cash flow?',
    options: [
      { value: 'A', label: 'Weak' },
      { value: 'B', label: 'Moderate' },
      { value: 'C', label: 'Strong' },
      { value: 'D', label: 'Very strong' },
    ],
  },
  {
    id: 5,
    question: 'How well defined is your customer base?',
    options: [
      { value: 'A', label: 'Not defined' },
      { value: 'B', label: 'Somewhat defined' },
      { value: 'C', label: 'Clearly defined' },
      { value: 'D', label: 'Fully segmented and tracked' },
    ],
  },
  {
    id: 6,
    question: 'Do you have reliable operational systems (processes, tools, workflows)?',
    options: [
      { value: 'A', label: 'No' },
      { value: 'B', label: 'Somewhat' },
      { value: 'C', label: 'Mostly' },
      { value: 'D', label: 'Fully documented and consistent' },
    ],
  },
  {
    id: 7,
    question: 'How prepared are you for lender or partner review?',
    options: [
      { value: 'A', label: 'Not prepared' },
      { value: 'B', label: 'Somewhat prepared' },
      { value: 'C', label: 'Prepared' },
      { value: 'D', label: 'Fully prepared' },
    ],
  },
  {
    id: 8,
    question: 'How stable is your business model?',
    options: [
      { value: 'A', label: 'Unstable' },
      { value: 'B', label: 'Developing' },
      { value: 'C', label: 'Stable' },
      { value: 'D', label: 'Highly stable' },
    ],
  },
  {
    id: 9,
    question: 'Do you track financial performance regularly?',
    options: [
      { value: 'A', label: 'No' },
      { value: 'B', label: 'Occasionally' },
      { value: 'C', label: 'Monthly' },
      { value: 'D', label: 'Weekly or better' },
    ],
  },
  {
    id: 10,
    question: 'How ready are you to scale or pursue new opportunities?',
    options: [
      { value: 'A', label: 'Not ready' },
      { value: 'B', label: 'Somewhat ready' },
      { value: 'C', label: 'Ready' },
      { value: 'D', label: 'Fully ready' },
    ],
  },
];

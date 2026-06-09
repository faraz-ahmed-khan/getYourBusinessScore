'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';
import { ASSESSMENT_QUESTIONS, type AnswerChoice } from '@/lib/assessment-questions';
import { computeDoctrineScore } from '@/lib/doctrine-scoring';
import { GYBS_SCORE_RESULT_KEY } from '@/lib/pathways';

function OptionButton({
  value,
  label,
  selected,
  onSelect,
}: {
  value: AnswerChoice;
  label: string;
  selected: boolean;
  onSelect: (value: AnswerChoice) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-gybs ease-in-out md:text-base ${
        selected
          ? 'border-gybs-blue bg-[#EFF6FF] text-gybs-navy'
          : 'border-gybs-border bg-white text-gybs-body hover:border-gybs-blue/40'
      }`}
    >
      <input
        type="radio"
        name="assessment-answer"
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span className="mr-3 font-bold text-gybs-navy">{value}.</span>
      {label}
    </label>
  );
}

export function AssessmentClient() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, AnswerChoice>>({});

  const question = ASSESSMENT_QUESTIONS[currentQuestion - 1];
  const selectedAnswer = answers[currentQuestion];
  const isLastQuestion = currentQuestion === ASSESSMENT_QUESTIONS.length;

  useEffect(() => {
    document.title = `Readiness Assessment — Question ${currentQuestion}`;
  }, [currentQuestion]);

  const setAnswer = useCallback((choice: AnswerChoice) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: choice }));
  }, [currentQuestion]);

  const goBack = () => {
    if (currentQuestion === 1) {
      router.push('/about');
      return;
    }
    setCurrentQuestion((q) => q - 1);
  };

  const goNext = () => {
    if (!selectedAnswer) return;

    if (isLastQuestion) {
      const result = computeDoctrineScore(answers);
      sessionStorage.setItem(GYBS_SCORE_RESULT_KEY, JSON.stringify(result));
      router.push('/results');
      return;
    }

    setCurrentQuestion((q) => q + 1);
  };

  return (
    <DoctrinePage className="!pb-24">
      <DoctrineContent narrow>
        <p className="text-sm font-semibold text-gybs-muted">Question {currentQuestion} of {ASSESSMENT_QUESTIONS.length}</p>
        <h1 className="mt-4 text-display-h1-sm text-gybs-ink md:text-display-h1">Readiness Assessment</h1>

        <div className="mt-10 rounded-xl border border-gybs-border bg-gybs-light p-6 md:p-8">
          <p className="text-lg font-semibold text-gybs-ink md:text-xl">{question.question}</p>
          <div className="mt-6 flex flex-col gap-3">
            {question.options.map((option) => (
              <OptionButton
                key={option.value}
                value={option.value}
                label={option.label}
                selected={selectedAnswer === option.value}
                onSelect={setAnswer}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={goBack} className="gybs-btn-secondary sm:min-w-[120px]">
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!selectedAnswer}
            className="gybs-btn-primary sm:min-w-[160px] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isLastQuestion ? 'View Results' : 'Next'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gybs-muted">
          <Link href="/about" className="text-gybs-blue hover:text-gybs-navy">
            About the assessment
          </Link>
        </p>
      </DoctrineContent>
    </DoctrinePage>
  );
}

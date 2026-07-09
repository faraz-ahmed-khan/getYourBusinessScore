'use client';

import Image from 'next/image';
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
    <DoctrinePage showBanner={false} className="!pt-6 !pb-16 md:!pt-8 md:!pb-20">
      <DoctrineContent>
        <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div id="assessment-questions" className="scroll-mt-24">
            <p className="text-sm font-semibold text-gybs-muted">
              Question {currentQuestion} of {ASSESSMENT_QUESTIONS.length}
            </p>
            <h1 className="mt-2 text-display-h2-sm text-gybs-ink md:text-display-h2">Readiness Assessment</h1>

            <div className="mt-6 rounded-xl border border-gybs-border bg-gybs-light p-6 md:p-8">
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

            <p className="mt-5 text-center text-sm text-gybs-muted">
              <Link href="/about" className="text-gybs-blue hover:text-gybs-navy">
                About the assessment
              </Link>
            </p>
          </div>
          <div className="flex h-full items-center overflow-hidden rounded-2xl border border-gybs-border bg-white shadow-gybs-card">
            <Image
              src="/images/assessment-section-banner.png"
              alt="Assessment readiness illustration"
              width={1024}
              height={768}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

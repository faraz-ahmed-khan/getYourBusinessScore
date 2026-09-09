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

type ZohoSubmitResponse = {
  success?: boolean;
  recordId?: string | number;
  businessId?: string;
  error?: string;
  errors?: string[];
  details?: {
    result?: Array<{ error?: string[] }>;
  };
};

function answersToZohoPayload(answers: Record<number, AnswerChoice>) {
  return {
    q1: answers[1],
    q2: answers[2],
    q3: answers[3],
    q4: answers[4],
    q5: answers[5],
    q6: answers[6],
    q7: answers[7],
    q8: answers[8],
    q9: answers[9],
    q10: answers[10],
  };
}

export function AssessmentClient() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, AnswerChoice>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const question = ASSESSMENT_QUESTIONS[currentQuestion - 1];
  const selectedAnswer = answers[currentQuestion];
  const isLastQuestion = currentQuestion === ASSESSMENT_QUESTIONS.length;

  useEffect(() => {
    document.title = `Readiness Assessment — Question ${currentQuestion}`;
  }, [currentQuestion]);

  const setAnswer = useCallback(
    (choice: AnswerChoice) => {
      setAnswers((prev) => ({ ...prev, [currentQuestion]: choice }));
      if (submitError) setSubmitError(null);
    },
    [currentQuestion, submitError]
  );

  const goBack = () => {
    if (submitting) return;
    if (currentQuestion === 1) {
      router.push('/about');
      return;
    }
    setCurrentQuestion((q) => q - 1);
  };

  const submitToZoho = async (finalAnswers: Record<number, AnswerChoice>) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = computeDoctrineScore(finalAnswers);

      const businessId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `gybs-${Date.now()}`;

      const submitRes = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          ...answersToZohoPayload(finalAnswers),
          score: result.score,
        }),
      });

      const submitData = (await submitRes.json()) as ZohoSubmitResponse;

      if (!submitRes.ok || !submitData.recordId) {
        const zohoFieldErrors = submitData.details?.result?.[0]?.error;
        const message =
          (Array.isArray(submitData.errors) && submitData.errors.join(' ')) ||
          (Array.isArray(zohoFieldErrors) && zohoFieldErrors.join(', ')) ||
          submitData.error ||
          'Failed to submit assessment to Zoho';
        throw new Error(message);
      }

      sessionStorage.setItem(GYBS_SCORE_RESULT_KEY, JSON.stringify(result));
      router.push('/results');
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong while submitting your assessment.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (!selectedAnswer || submitting) return;

    if (isLastQuestion) {
      const finalAnswers = { ...answers, [currentQuestion]: selectedAnswer };
      void submitToZoho(finalAnswers);
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

            {submitError && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {submitError}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={submitting}
                className="gybs-btn-secondary sm:min-w-[120px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!selectedAnswer || submitting}
                className="gybs-btn-primary sm:min-w-[160px] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? 'Submitting…' : isLastQuestion ? 'View Results' : 'Next'}
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

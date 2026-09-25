'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssessmentHeader } from '@/components/assessment/AssessmentHeader';
import { ProgressRail } from '@/components/assessment/ProgressRail';
import { CategoryHead } from '@/components/assessment/CategoryHead';
import { QuestionCard } from '@/components/assessment/QuestionCard';
import { BottomNav } from '@/components/assessment/BottomNav';
import { CompletionOverlay } from '@/components/assessment/CompletionOverlay';
import { CATEGORIES, TOTAL_QUESTIONS } from '@/lib/questions';
import { computeResults } from '@/lib/scoring';
import { loadAnswers, loadLead, saveAnswers } from '@/lib/storage';
import { GYBS_SCORE_RESULT_KEY } from '@/lib/pathways';
import type { Answers } from '@/lib/types';
import styles from '@/styles/assessment.module.css';

function answersToZohoPayload(answers: Answers) {
  const payload: Record<string, number> = {};
  for (let i = 1; i <= TOTAL_QUESTIONS; i++) {
    payload[`q${i}`] = answers[i];
  }
  return payload;
}

export function AssessmentClient() {
  const router = useRouter();
  const [catIndex, setCatIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [phase, setPhase] = useState<'idle' | 'leaving' | 'entering'>('entering');
  const [completing, setCompleting] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const category = CATEGORIES[catIndex];
  const isLast = catIndex === CATEGORIES.length - 1;

  useEffect(() => {
    setAnswers(loadAnswers());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAnswers(answers);
  }, [answers, hydrated]);

  useEffect(() => {
    document.title = `Readiness Assessment — ${category.name}`;
  }, [category.name]);

  const answeredTotal = useMemo(
    () => Object.keys(answers).filter((k) => answers[Number(k)] !== undefined).length,
    [answers]
  );

  const isCategoryComplete = useCallback(
    (index: number) => {
      const cat = CATEGORIES[index];
      for (let q = cat.startNum; q <= cat.endNum; q++) {
        if (answers[q] === undefined) return false;
      }
      return true;
    },
    [answers]
  );

  const onSelect = (questionNum: number, pts: number) => {
    setAnswers((prev) => ({ ...prev, [questionNum]: pts }));
    setFlagged((prev) => {
      if (!prev[questionNum]) return prev;
      const next = { ...prev };
      delete next[questionNum];
      return next;
    });
  };

  const goBack = () => {
    if (catIndex === 0) {
      router.push('/#assessment');
      return;
    }
    setPhase('leaving');
    window.setTimeout(() => {
      setCatIndex((i) => i - 1);
      setPhase('entering');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const finishAssessment = async () => {
    const lead = loadLead();
    if (!lead?.email?.trim() || !lead.firstName?.trim() || !lead.businessName?.trim()) {
      router.push('/#assessment');
      return;
    }

    setSubmitError(null);
    setCompleting(true);

    const results = computeResults(answers);
    const fullName = `${lead.firstName} ${lead.lastName ?? ''}`.trim();

    try {
      const res = await fetch('/api/intake/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answersToZohoPayload(answers),
          score: results.readinessScore,
          Name: fullName,
          Email: lead.email.trim(),
          Business_Name: lead.businessName.trim(),
          ...(lead.phone?.trim() ? { Phone: lead.phone.trim() } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const detail =
          (Array.isArray(data.errors) && data.errors.join(', ')) ||
          (typeof data.details?.description === 'string' && data.details.description) ||
          (typeof data.details?.message === 'string' && data.details.message) ||
          data.error ||
          'Could not save your assessment. Please try again.';
        throw new Error(detail);
      }

      try {
        sessionStorage.setItem(GYBS_SCORE_RESULT_KEY, JSON.stringify(results));
      } catch {
        /* ignore */
      }

      router.push('/results');
    } catch (err) {
      setCompleting(false);
      setSubmitError(err instanceof Error ? err.message : 'Submission failed.');
    }
  };

  const goNext = () => {
    const missing: number[] = [];
    for (let q = category.startNum; q <= category.endNum; q++) {
      if (answers[q] === undefined) missing.push(q);
    }

    if (missing.length > 0) {
      const nextFlags: Record<number, boolean> = {};
      missing.forEach((n) => {
        nextFlags[n] = true;
      });
      setFlagged((prev) => ({ ...prev, ...nextFlags }));
      const el = document.getElementById(`q-${missing[0]}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!isLast) {
      setPhase('leaving');
      window.setTimeout(() => {
        setCatIndex((i) => i + 1);
        setPhase('entering');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
      return;
    }

    void finishAssessment();
  };

  const lead = hydrated ? loadLead() : null;
  const wrapClass = [
    styles.qWrap,
    phase === 'leaving' ? styles.leaving : '',
    phase === 'entering' ? styles.entering : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div style={{ paddingBottom: 96, minHeight: '100vh', background: 'var(--cream)' }}>
      <AssessmentHeader lead={lead} />
      <ProgressRail
        categories={CATEGORIES}
        currentIndex={catIndex}
        isCategoryComplete={isCategoryComplete}
        answeredTotal={answeredTotal}
        totalQuestions={TOTAL_QUESTIONS}
      />
      <CategoryHead
        category={category}
        index={catIndex}
        totalCategories={CATEGORIES.length}
        totalQuestions={TOTAL_QUESTIONS}
      />

      <div className={styles.qStage}>
        <div className={`${styles.wrap} ${wrapClass}`}>
          {category.questions.map((question, i) => (
            <QuestionCard
              key={question.num}
              question={question}
              totalQuestions={TOTAL_QUESTIONS}
              selectedValue={answers[question.num]}
              flagged={Boolean(flagged[question.num])}
              delayMs={i * 45}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      {submitError && (
        <div className={styles.wrap} style={{ paddingBottom: 12 }}>
          <p
            role="alert"
            style={{
              color: 'var(--red)',
              background: 'rgba(165,28,44,.08)',
              border: '1px solid rgba(165,28,44,.25)',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: '0.9rem',
            }}
          >
            {submitError}
          </p>
        </div>
      )}

      <BottomNav
        canGoBack
        onBack={goBack}
        onNext={goNext}
        answeredTotal={answeredTotal}
        totalQuestions={TOTAL_QUESTIONS}
        nextLabel={completing ? 'Saving…' : isLast ? 'See My Score' : 'Next Section →'}
      />

      <CompletionOverlay show={completing} />
    </div>
  );
}

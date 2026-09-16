'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ResultsHeader } from '@/components/results/ResultsHeader';
import { ScoreGauge } from '@/components/results/ScoreGauge';
import { CategoryRow } from '@/components/results/CategoryRow';
import { NextStepCard } from '@/components/results/NextStepCard';
import { computeResults, getTier, TIPS } from '@/lib/scoring';
import { TOTAL_QUESTIONS } from '@/lib/questions';
import { clearAnswers, loadAnswers } from '@/lib/storage';
import { GYBS_SCORE_RESULT_KEY } from '@/lib/pathways';
import type { Results } from '@/lib/types';
import styles from '@/styles/results.module.css';

export function ResultsClient() {
  const [results, setResults] = useState<Results | null>(null);
  const [incomplete, setIncomplete] = useState(false);

  useEffect(() => {
    const answers = loadAnswers();
    const answered = Object.keys(answers).length;
    setIncomplete(answered > 0 && answered < TOTAL_QUESTIONS);

    if (answered > 0) {
      const computed = computeResults(answers);
      setResults(computed);
      try {
        sessionStorage.setItem(GYBS_SCORE_RESULT_KEY, JSON.stringify(computed));
      } catch {
        /* ignore */
      }
      return;
    }

    try {
      const raw = sessionStorage.getItem(GYBS_SCORE_RESULT_KEY);
      if (raw) {
        setResults(JSON.parse(raw) as Results);
        return;
      }
    } catch {
      /* ignore */
    }

    setResults(null);
  }, []);

  const topGaps = useMemo(() => {
    if (!results) return [];
    return [...results.cats]
      .map((cat, index) => ({ cat, index }))
      .sort((a, b) => a.cat.pct - b.cat.pct || a.index - b.index)
      .slice(0, 3);
  }, [results]);

  if (!results) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
        <ResultsHeader />
        <div className={styles.wrap} style={{ padding: '64px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-soft)' }}>
            No results found. Complete the assessment to see your readiness score.
          </p>
          <Link href="/#assessment" style={{ display: 'inline-block', marginTop: 24, color: 'var(--navy-800)' }}>
            Begin Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <ResultsHeader />

      <div className={`${styles.incompleteBar} ${incomplete ? styles.show : ''}`}>
        You answered {results.answeredCount} of {TOTAL_QUESTIONS} questions.{' '}
        <Link href="/assessment">Finish the assessment</Link> for a complete score.
      </div>

      <section className={styles.scoreHero}>
        <div className={styles.shInner}>
          <p className={styles.eyebrow}>Your Initial Readiness Score</p>
          <ScoreGauge score={results.readinessScore} color={results.band.color} />
          <div className={styles.bandPill}>
            <span className={styles.dot} style={{ background: results.band.color }} />
            {results.band.key} Stage
          </div>
          <h1 className={styles.shTitle}>
            Your Readiness Score: {results.readinessScore}. {results.band.headline}
          </h1>
          <p className={styles.shSub}>{results.band.body}</p>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Your Top Gaps</p>
            <h2>Where to focus first</h2>
            <p>Your 2–3 lowest-scoring categories — these are the gaps most likely to block an opportunity.</p>
          </div>
          <div className={styles.catList}>
            {topGaps.map(({ cat }, i) => {
              const tier = getTier(cat.pct);
              return (
                <CategoryRow
                  key={cat.name}
                  result={cat}
                  rank={i + 1}
                  tier={tier}
                  tip={TIPS[cat.name]?.[tier] ?? ''}
                  delayMs={i * 60}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${styles.block} ${styles.nextBand}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <p className={styles.eyebrow}>Recommended Next Step</p>
            <h2>Close the gaps that matter most</h2>
            <p>Based on your score band, here&apos;s the preparation pathway that fits.</p>
          </div>
          <NextStepCard band={results.band} />
          <p className={styles.callLine}>
            Want help walking through this?{' '}
            <a href="mailto:hello@misconiusa.com">Book a free readiness call</a>
          </p>
        </div>
      </section>

      <div className={styles.retakeBand}>
        <button
          type="button"
          onClick={() => {
            clearAnswers();
            try {
              sessionStorage.removeItem(GYBS_SCORE_RESULT_KEY);
            } catch {
              /* ignore */
            }
            window.location.href = '/#assessment';
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--navy-800)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.86rem',
          }}
        >
          Retake the assessment
        </button>
      </div>

      <footer className={styles.site}>
        <p>© {new Date().getFullYear()} Misconi USA · Get Your Business Score</p>
      </footer>
    </div>
  );
}

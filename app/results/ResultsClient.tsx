'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';
import {
  PATHWAY_DESCRIPTIONS,
  PATHWAY_LABELS,
  type DoctrineScoreResult,
  type PathwayOption,
} from '@/lib/doctrine-scoring';
import { getReadinessLevelInfo, READINESS_LEVELS } from '@/lib/readiness-levels';
import { GYBS_SCORE_RESULT_KEY } from '@/lib/pathways';

export function ResultsClient() {
  const [data, setData] = useState<DoctrineScoreResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const pathwaysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(GYBS_SCORE_RESULT_KEY);
    if (!raw) {
      setData(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as DoctrineScoreResult;
      setData(parsed);

      const target = Number(parsed.score || 0);
      const duration = 1500;
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayScore(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    } catch {
      setData(null);
    }
  }, []);

  const levelInfo = useMemo(() => {
    if (!data) return null;
    return getReadinessLevelInfo(data.level);
  }, [data]);

  const scrollToPathways = () => {
    pathwaysRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!data || !levelInfo) {
    return (
      <DoctrinePage>
        <DoctrineContent narrow>
          <p className="text-gybs-muted">No results found. Complete the assessment to see your readiness score.</p>
          <Link href="/assessment" className="gybs-btn-primary mt-6 inline-flex">
            Begin Assessment
          </Link>
        </DoctrineContent>
      </DoctrinePage>
    );
  }

  return (
    <DoctrinePage>
      <DoctrineContent>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">Your Readiness Score</h1>

        <div className="mt-10 rounded-xl border border-gybs-border bg-gybs-light p-8 md:p-10">
          <p className="text-[72px] font-bold leading-none text-gybs-navy md:text-[96px]">{displayScore}</p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gybs-body">
            Your score is based on your answers across documentation, operations, financials, and market readiness.
          </p>
          <p className="mt-4 inline-flex rounded-full border border-gybs-blue/30 bg-gybs-blue/10 px-4 py-2 text-sm font-semibold text-gybs-navy">
            {levelInfo.title}
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gybs-ink">Readiness Level Descriptions</h2>
          <ul className="mt-6 space-y-4">
            {READINESS_LEVELS.map((level) => (
              <li
                key={level.level}
                className={`rounded-xl border p-5 ${
                  level.level === data.level
                    ? 'border-gybs-blue bg-[#EFF6FF]'
                    : 'border-gybs-border bg-white'
                }`}
              >
                <p className="font-bold text-gybs-ink">{level.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gybs-body">{level.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section ref={pathwaysRef} className="mt-12 scroll-mt-24">
          <h2 className="text-xl font-bold text-gybs-ink">Recommended Pathway</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-gybs-body">
            Based on your readiness score, the following pathway options are available. Choose the pathway that best
            fits your business needs.
          </p>

          <ul className="mt-8 space-y-4">
            {(['sba', 'supplier', 'subscription'] as PathwayOption[]).map((pathway) => {
              const available = data.availablePathways.includes(pathway);
              return (
                <li
                  key={pathway}
                  className={`rounded-xl border p-6 ${
                    available ? 'border-gybs-border bg-white' : 'border-gybs-border/60 bg-gybs-light opacity-70'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-gybs-ink">{PATHWAY_LABELS[pathway]}</h3>
                    {!available && (
                      <span className="rounded-full bg-gybs-border px-3 py-1 text-xs font-semibold text-gybs-muted">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gybs-body">{PATHWAY_DESCRIPTIONS[pathway]}</p>
                  {pathway === 'subscription' && available && (
                    <p className="mt-3 text-xs text-gybs-muted">
                      Opportunity access remains locked until a Misconi USA representative approves activation.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link href="/subscribe" className="gybs-btn-primary text-center">
            Continue to Subscription Gateway
          </Link>
          <button type="button" onClick={scrollToPathways} className="gybs-btn-secondary">
            View Your Readiness Pathway Options
          </button>
        </div>

        <p className="mt-4 text-sm text-gybs-muted">
          Subscription is offered after your Initial Business Score.
        </p>
      </DoctrineContent>
    </DoctrinePage>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SubmitResponse } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { formatScore } from '@/lib/formatters';
import { normalizeResultResponse } from '@/lib/result-model';
import { ResultList } from '@/components/results/ResultList';

/**
 * Level 2 — Governed readiness outcome (mock data until backend replaces generator).
 */
export default function ResultsPage() {
  const [data, setData] = useState<SubmitResponse | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem('gybs_results');
    if (raw) {
      try {
        const parsed = normalizeResultResponse(JSON.parse(raw) as SubmitResponse);
        setData(parsed);
        const target = parsed.businessScore;
        const duration = 1500;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayScore(Math.round(target * eased));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      } catch {
        setData(null);
      }
    }
  }, []);

  const scoreColor = useMemo(() => {
    if (!data) return '#0f172a';
    const s = data.businessScore;
    if (s <= 39) return '#EF4444';
    if (s <= 59) return '#F59E0B';
    if (s <= 79) return '#3B82F6';
    return '#10B981';
  }, [data]);

  if (data === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-[color:var(--color-text-muted)]">
          No results found. Complete the assessment to see your Business Score.
        </p>
        <Link
          href="/assessment"
          className="mt-4 inline-block rounded-xl bg-[color:var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_30px_rgba(0,87,184,0.35)] hover:bg-[color:var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Start assessment
        </Link>
      </div>
    );
  }

  const ro = data.resultOverview;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-24">
      <header className="mb-10 border-b border-[color:var(--color-border)] pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
          Governed readiness outcome
        </p>
        <h1 className="mt-2 text-[2rem] font-extrabold tracking-[-0.04em] text-[color:var(--color-text-primary)] sm:text-[2.4rem]">
          Your Business Score
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">UBID: {data.ubid}</p>
      </header>

      {/* 1. Score Summary */}
      <section aria-labelledby="score-summary-heading" className="mb-10">
        <h2 id="score-summary-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
          Score summary
        </h2>
        <Card className="mt-4 border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                Business Score
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span
                  className="text-[4rem] font-black leading-none sm:text-[4.5rem]"
                  style={{ color: scoreColor }}
                  aria-label={`Business score ${formatScore(data.businessScore)}`}
                >
                  {formatScore(displayScore)}
                </span>
                <span className="text-sm text-[color:var(--color-text-muted)]">out of 100</span>
              </div>
            </div>
            <div className="relative mx-auto h-28 w-28 shrink-0 sm:mx-0">
              <svg viewBox="0 0 120 60" className="h-full w-full">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <path
                  d="M10 60 A50 50 0 0 1 110 60"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M10 60 A50 50 0 0 1 110 60"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * data.businessScore) / 100}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Readiness Outcome */}
      <section aria-labelledby="readiness-outcome-heading" className="mb-10">
        <h2 id="readiness-outcome-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
          Readiness outcome
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Card className="border-[color:var(--color-border)] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">Readiness level</p>
            <p className="mt-2 text-xl font-semibold text-[color:var(--color-text-primary)]">{data.readinessLevel}</p>
          </Card>
          <Card className="border-[color:var(--color-border)] bg-white p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">Recommended lane</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-[color:var(--color-text-body)]">{ro.recommendedLane}</p>
          </Card>
          <Card className="border-[color:var(--color-border)] bg-white p-5 sm:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">Assigned pack</p>
            <p className="mt-2 text-sm text-[color:var(--color-text-body)]">{ro.assignedPack}</p>
          </Card>
        </div>
      </section>

      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="strengths-heading">
          <h2 id="strengths-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
            Strengths
          </h2>
          <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
            <ResultList items={data.strengths} emptyLabel="None listed for this mock run." variant="dot" />
          </div>
        </section>
        <section aria-labelledby="gaps-heading">
          <h2 id="gaps-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
            Gaps
          </h2>
          <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
            <ResultList items={data.gaps} emptyLabel="No gaps flagged in this mock run." variant="dot" />
          </div>
        </section>
      </div>

      <section aria-labelledby="recs-heading" className="mt-10">
        <h2 id="recs-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
          Recommendations
        </h2>
        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
          <ResultList items={data.recommendations} emptyLabel="No recommendations in this mock run." />
        </div>
      </section>

      {/* What You Need to Fix */}
      <section aria-labelledby="corrections-heading" className="mt-10">
        <h2 id="corrections-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
          What you need to fix
        </h2>
        <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">Correction list (mock — replace with backend rules).</p>
        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
          <ResultList items={ro.correctionList} emptyLabel="No corrections required in this mock run." />
        </div>
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="required-docs-heading">
          <h2 id="required-docs-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
            Required documents
          </h2>
          <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">Template list for prototype display.</p>
          <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
            <ResultList items={ro.requiredDocuments} emptyLabel="None specified in this mock run." />
          </div>
        </section>
        <section aria-labelledby="missing-info-heading">
          <h2 id="missing-info-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
            Missing information
          </h2>
          <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">Optional gaps surfaced from intake (mock).</p>
          <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-4">
            <ResultList items={ro.missingInformation} emptyLabel="No optional gaps flagged in this mock run." />
          </div>
        </section>
      </div>

      {/* Upgrade Pathway */}
      <section aria-labelledby="upgrade-heading" className="mt-10">
        <h2 id="upgrade-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
          Upgrade pathway
        </h2>
        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-2)] p-5 text-sm leading-relaxed text-[color:var(--color-text-body)]">
          {ro.upgradePathway || 'Not specified in this mock run.'}
        </div>
      </section>

      {/* Next Step Destinations */}
      <section aria-labelledby="destinations-heading" className="mt-12 border-t border-[color:var(--color-border)] pt-10">
        <h2 id="destinations-heading" className="text-[1.15rem] font-semibold text-[color:var(--color-text-primary)]">
          Next step destinations
        </h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
          Exactly three governed lanes. Choose the surface that matches your next action — operational (MisconiUSA.com), education
          (MisconiUSANetwork.com), or training (SBAReady.org).
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {data.readinessCards.map((card, index) => {
            const colorBands = ['#0057B8', '#0EA5E9', '#10B981'] as const;
            const band = colorBands[index] ?? '#0057B8';
            return (
              <Card
                key={card.id}
                className="flex h-full flex-col border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-[0_18px_60px_rgba(15,23,42,0.18)]"
              >
                <div className="mb-4 h-1 w-10 rounded-full" style={{ backgroundColor: band }} aria-hidden="true" />
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{card.title}</h3>
                <p className="mt-1 text-[11px] text-[color:var(--color-primary)]">{new URL(card.destination).hostname}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{card.description}</p>
                <a
                  href={card.destination}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex w-fit items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_35px_rgba(0,87,184,0.35)] transition duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[color:var(--color-primary-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {card.ctaText}
                </a>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

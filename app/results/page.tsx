'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { SubmitResponse } from '@/lib/types';
import { Card } from '@/components/shared/Card';
import { formatScore } from '@/lib/formatters';

/**
 * Level 2 — Readiness activation after score generation.
 * Displays: Business Score, Readiness Level, Strengths, Gaps, Recommendations, exactly 3 readiness cards.
 * No "Get Your Business Score" CTA here; no fourth card; no Review Score card.
 */
export default function ResultsPage() {
  const [data, setData] = useState<SubmitResponse | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem('gybs_results');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as SubmitResponse;
        setData(parsed);
        // Score reveal: animate 0 → score over 1.5s
        const target = parsed.businessScore;
        const duration = 1500;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
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

  const readinessLabel = data.readinessLevel;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 pb-24">
      <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
            Readiness results
          </p>
          <h1 className="mt-2 text-[2rem] font-extrabold tracking-[-0.04em] text-[color:var(--color-text-primary)] sm:text-[2.4rem]">
            Your Business Score
          </h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">UBID: {data.ubid}</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* Left: score reveal + gauge */}
        <Card className="relative overflow-hidden border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                Business Score
              </p>
              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className="text-[4.5rem] font-black leading-none"
                  style={{ color: scoreColor }}
                  aria-label={`Business score ${formatScore(data.businessScore)}`}
                >
                  {formatScore(displayScore)}
                </span>
                <span className="text-sm text-[color:var(--color-text-muted)]">out of 100</span>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-surface-2)] px-3 py-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: scoreColor }}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium text-[color:var(--color-text-body)]">{readinessLabel}</span>
              </div>
            </div>
            <div className="relative h-28 w-28">
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

        {/* Right: strengths/gaps/recs summary */}
        <div className="space-y-6">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
              Score breakdown
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-[color:var(--color-text-body)]">
              {data.strengths.slice(0, 2).map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)]" />
                  <span>{s}</span>
                </li>
              ))}
              {data.gaps.slice(0, 2).map((g, i) => (
                <li key={`gap-${i}`} className="flex items-start gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[color:var(--color-warning)]" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
              Detailed recommendations
            </h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-[color:var(--color-text-body)]">
              {data.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-[1.1rem] font-semibold text-[color:var(--color-text-primary)]">Next steps</h2>
        <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
          Choose one of the following readiness lanes. These are the only three routing options after your score.
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
                <div
                  className="mb-4 h-1 w-10 rounded-full"
                  style={{ backgroundColor: band }}
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                  {card.description}
                </p>
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

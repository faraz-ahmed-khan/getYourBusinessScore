'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const raw = sessionStorage.getItem('gybs_results');
    if (raw) {
      try {
        setData(JSON.parse(raw) as SubmitResponse);
      } catch {
        setData(null);
      }
    }
  }, []);

  if (data === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-neutral-600">No results found. Complete the assessment to see your Business Score.</p>
        <Link
          href="/assessment"
          className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Start assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-20">
      <h1 className="text-2xl font-bold text-neutral-900">Your Business Score</h1>
      <p className="mt-1 text-sm text-neutral-500">UBID: {data.ubid}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-neutral-500">Business Score</p>
          <p className="mt-1 text-4xl font-bold text-primary-600">{formatScore(data.businessScore)}</p>
          <p className="mt-1 text-sm text-neutral-600">out of 100</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-neutral-500">Readiness Level</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-900">{data.readinessLevel}</p>
        </Card>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-900">Strengths</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-neutral-700">
          {data.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-neutral-900">Gaps</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-neutral-700">
          {data.gaps.map((g, i) => (
            <li key={i}>{g}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-neutral-900">Recommendations</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-neutral-700">
          {data.recommendations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">Next steps</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Choose one of the following readiness lanes. These are the only three routing options after your score.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-1">
          {data.readinessCards.map((card) => (
            <Card key={card.id} className="flex flex-col">
              <h3 className="font-semibold text-neutral-900">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm text-neutral-600">{card.description}</p>
              <a
                href={card.destination}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-fit items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {card.ctaText}
              </a>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

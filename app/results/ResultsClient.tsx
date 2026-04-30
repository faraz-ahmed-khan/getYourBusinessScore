'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Layers,
  Navigation,
  Package,
  ArrowRight,
  X,
  Check,
  Building2,
  GraduationCap,
  Award,
} from 'lucide-react';
import { GYBS_SCORE_RESULT_KEY } from '@/lib/pathways';

type StoredZohoResult = {
  score: number;
  readinessLevel?: string;
  recommendedLane?: string;
  assignedPack?: string;
  corrections?: string;
  upgradePathway?: string;
  pathway?: string;
  pathwayLabel?: string;
  pathwayTitle?: string;
};

type UpgradeStep = {
  label: string;
  done: boolean;
};

function normalizeLevel(level?: string): 1 | 2 | 3 | null {
  if (!level) return null;
  if (level.includes('1')) return 1;
  if (level.includes('2')) return 2;
  return 3;
}

function levelBadge(level: 1 | 2 | 3): { text: string; className: string } {
  if (level === 1) {
    return {
      text: 'Level 1 — Foundational Lane',
      className: 'bg-gybs-accent/15 text-gybs-ink border-gybs-accent/40',
    };
  }

  if (level === 2) {
    return {
      text: 'Level 2 — Guided Lane',
      className: 'bg-gybs-blue/10 text-gybs-navy border-gybs-blue/30',
    };
  }

  return {
    text: 'Level 3 — Opportunity Lane',
    className: 'bg-gybs-success/15 text-gybs-ink border-gybs-success/40',
  };
}

function parseCorrections(corrections?: string): string[] {
  if (!corrections || !corrections.trim()) return [];
  return corrections
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseUpgradeSteps(upgradePathway?: string): UpgradeStep[] {
  if (!upgradePathway || !upgradePathway.trim()) return [];

  return upgradePathway
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => ({
      label: line,
      done: false,
    }));
}

export function ResultsClient() {
  const [data, setData] = useState<StoredZohoResult | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const raw = sessionStorage.getItem(GYBS_SCORE_RESULT_KEY);

    if (!raw) {
      setData(null);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as StoredZohoResult;
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

  const normalizedLevel = useMemo(() => {
    if (!data) return null;
    return normalizeLevel(data.readinessLevel);
  }, [data]);

  const badge = useMemo(() => {
    if (!normalizedLevel) return null;
    return levelBadge(normalizedLevel);
  }, [normalizedLevel]);

  const correctionsList = useMemo(() => {
    if (!data) return [];
    return parseCorrections(data.corrections);
  }, [data]);

  const upgradeSteps = useMemo(() => {
    if (!data) return [];
    return parseUpgradeSteps(data.upgradePathway);
  }, [data]);

  if (!data || normalizedLevel === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-gybs-muted">
          No results found. Complete the assessment to see your Business Readiness Score.
        </p>
        <Link href="/assessment" className="gybs-btn-primary mt-6 inline-flex">
          Start assessment
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gybs-light pb-24">
      <div className="mx-auto max-w-content px-4 pt-10 md:px-6">
        <div className="mx-auto max-w-[800px] rounded-xl border border-gybs-border bg-white p-8 shadow-gybs-card md:p-12">
          <div className="flex justify-center">
            <span className="rounded-full bg-gybs-navy px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              {data.pathwayLabel || data.pathwayTitle || 'Assessment Result'}
            </span>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <p className="text-sm font-semibold text-gybs-muted">Business Readiness Score</p>
            <p className="mt-2 text-[96px] font-bold leading-none text-gybs-navy">{displayScore}</p>
            <p className="text-gybs-muted">out of 100</p>

            <div className="relative mx-auto mt-8 h-32 w-48">
              <svg viewBox="0 0 120 60" className="h-full w-full">
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
                  stroke="#1B3A6B"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="157"
                  strokeDashoffset={157 - (157 * Number(data.score)) / 100}
                  style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
                />
              </svg>
            </div>

            {badge && (
              <span className={`mt-6 rounded-full border px-4 py-2 text-sm font-semibold ${badge.className}`}>
                {badge.text}
              </span>
            )}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[800px] rounded-xl border border-gybs-border bg-white p-6 shadow-gybs-card md:p-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Layers, label: 'Readiness Level', value: data.readinessLevel || 'Not available yet' },
              { Icon: Navigation, label: 'Your Lane', value: data.recommendedLane || 'Not available yet' },
              { Icon: Package, label: 'Assigned Pack', value: data.assignedPack || 'Not available yet' },
              { Icon: ArrowRight, label: 'Next Step', value: 'Subscribe to unlock' },
            ].map((c) => (
              <div key={c.label} className="text-center lg:text-left">
                <c.Icon className="mx-auto h-8 w-8 text-gybs-blue lg:mx-0" />
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-gybs-muted">{c.label}</p>
                <p className="mt-1 text-sm font-semibold text-gybs-ink">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mx-auto mt-12 max-w-[800px]">
          <h2 className="text-xl font-bold text-gybs-ink">What to Work On</h2>

          {correctionsList.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {correctionsList.map((c) => (
                <li key={c} className="flex gap-3 rounded-xl border border-gybs-border bg-white p-4 shadow-sm">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-gybs-danger" strokeWidth={2.5} />
                  <span className="text-sm text-gybs-body">{c}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-gybs-border bg-white p-4 shadow-sm">
              <p className="text-sm text-gybs-body">No corrections listed. Your result is currently strong.</p>
            </div>
          )}
        </section>

        <section className="mx-auto mt-12 max-w-[800px]">
          <h2 className="text-xl font-bold text-gybs-ink">Your Upgrade Pathway</h2>

          {upgradeSteps.length > 0 ? (
            <ol className="mt-6 space-y-4">
              {upgradeSteps.map((s, i) => (
                <li key={`${s.label}-${i}`} className="flex gap-4 rounded-xl border border-gybs-border bg-white p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gybs-light text-sm font-bold text-gybs-navy">
                    {i + 1}
                  </span>
                  <div className="flex flex-1 items-start gap-2">
                    {s.done ? (
                      <Check className="h-5 w-5 text-gybs-success" strokeWidth={2.5} />
                    ) : (
                      <span className="w-5" />
                    )}
                    <span className={`text-sm ${s.done ? 'text-gybs-muted line-through' : 'text-gybs-body'}`}>
                      {s.label}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-4 rounded-xl border border-gybs-border bg-white p-4 shadow-sm">
              <p className="text-sm text-gybs-body">No upgrade pathway was returned.</p>
            </div>
          )}
        </section>

        <section className="mx-auto mt-16 max-w-[800px]">
          <h2 className="text-center text-2xl font-bold text-gybs-ink md:text-3xl">
            Continue Your Readiness Journey
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                Icon: Building2,
                iconClass: 'text-gybs-navy',
                title: 'Operational Readiness',
                desc: 'Subscribe, pathways, and opportunity routing after you are readiness-activated.',
                href: 'https://misconiusa.com',
                cta: 'Visit MisconiUSA.com',
              },
              {
                Icon: GraduationCap,
                iconClass: 'text-gybs-blue',
                title: 'Education & Orientation',
                desc: 'Readiness concepts and ecosystem context before or alongside your pathway.',
                href: 'https://misconiusanetwork.com',
                cta: 'Visit MisconiUSANetwork.com',
              },
              {
                Icon: Award,
                iconClass: 'text-gybs-success',
                title: 'Training & SBA Support',
                desc: 'Foundational training and SBA-supported help for earlier-stage readiness needs.',
                href: 'https://sbaready.com',
                cta: 'Visit SBAReady.com',
              },
            ].map((card) => (
              <div key={card.title} className="gybs-card flex flex-col !p-6">
                <card.Icon className={`h-10 w-10 ${card.iconClass}`} />
                <h3 className="mt-4 text-lg font-bold text-gybs-ink">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gybs-muted">{card.desc}</p>
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gybs-btn-primary mt-6 w-full text-center"
                >
                  {card.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section
          className="mx-auto mt-16 max-w-content rounded-2xl px-6 py-14 text-white md:px-10 md:py-16"
          style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2E6BE6 100%)' }}
        >
          <h2 className="text-center text-2xl font-bold md:text-3xl">Choose How You Want to Move Forward</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/85 md:text-base">
            Your score shows where you are. Your subscription determines how far you can go.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-white/20 bg-white p-6 text-gybs-ink shadow-lg">
              <span className="inline-block rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-gybs-muted">
                CURRENT
              </span>
              <h3 className="mt-4 text-lg font-bold">Free — Score Only</h3>
              <p className="mt-2 text-3xl font-bold text-gybs-navy">$0</p>
              <ul className="mt-4 space-y-2 text-sm text-gybs-body">
                <li>✓ Score, Level, Lane, Pack, Corrections</li>
              </ul>
              <button
                type="button"
                disabled
                className="mt-6 w-full rounded-lg border-2 border-gybs-border py-3 text-sm font-semibold text-gybs-muted"
              >
                You&apos;re on Free
              </button>
            </div>

            <div className="rounded-xl border border-white/20 bg-white p-6 text-gybs-ink shadow-lg">
              <span className="inline-block rounded-full bg-gybs-blue/15 px-3 py-1 text-xs font-bold text-gybs-blue">
                BASIC
              </span>
              <h3 className="mt-4 text-lg font-bold">Education & Support</h3>
              <p className="mt-2 text-3xl font-bold text-gybs-navy">$49/mo</p>
              <ul className="mt-4 space-y-2 text-sm text-gybs-body">
                <li>✓ Everything in Free</li>
                <li>✓ Education & Templates</li>
                <li>✓ Document Upload</li>
                <li>✓ Limited Team Access</li>
              </ul>
              <a
                href="https://misconiusa.com/subscribe?tier=basic"
                target="_blank"
                rel="noopener noreferrer"
                className="gybs-btn-primary mt-6 block w-full text-center"
              >
                Upgrade to Basic
              </a>
            </div>

            <div className="relative rounded-xl border-2 border-gybs-accent bg-white p-6 text-gybs-ink shadow-xl lg:-translate-y-1">
              <span className="inline-block rounded-full bg-gybs-accent/20 px-3 py-1 text-xs font-bold text-gybs-ink">
                RECOMMENDED
              </span>
              <h3 className="mt-4 text-lg font-bold">Full Readiness Infrastructure</h3>
              <p className="mt-2 text-3xl font-bold text-gybs-navy">$199/mo</p>
              <ul className="mt-4 space-y-2 text-sm text-gybs-body">
                <li>✓ Everything in Basic</li>
                <li>✓ Unlimited Team Access</li>
                <li>✓ Routing Eligibility</li>
                <li>✓ Opportunity Eligibility</li>
                <li>✓ CUBE Enterprise Suite</li>
              </ul>
              <a
                href="https://misconiusa.com/subscribe?tier=enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="gybs-btn-gold mt-6 block w-full text-center"
              >
                Upgrade to Enterprise
              </a>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-white/75">
            Your score and lane are always free. Subscriptions unlock what you do with them.
          </p>
        </section>
      </div>
    </div>
  );
}
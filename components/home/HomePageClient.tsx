'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ClipboardList,
  BarChart3,
  CreditCard,
  Compass,
  ShoppingCart,
  Truck,
  FileText,
  Award,
} from 'lucide-react';
import { KIOSK_PATHWAYS } from '@/components/home/kiosk-data';
import {
  GYBS_OPEN_KIOSK_PENDING_KEY,
  GYBS_SELECTED_PATHWAY_KEY,
  type PathwayId,
} from '@/lib/pathways';

function openKioskOnHome() {
  window.dispatchEvent(new CustomEvent('gybs-open-kiosk'));
  document.getElementById('kiosk-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function HomePageClient() {
  const [kioskVisible, setKioskVisible] = useState(false);

  useEffect(() => {
    const onOpen = () => setKioskVisible(true);
    window.addEventListener('gybs-open-kiosk', onOpen);
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(GYBS_OPEN_KIOSK_PENDING_KEY) === '1') {
      sessionStorage.removeItem(GYBS_OPEN_KIOSK_PENDING_KEY);
      setKioskVisible(true);
      requestAnimationFrame(() => {
        document.getElementById('kiosk-section')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
    return () => window.removeEventListener('gybs-open-kiosk', onOpen);
  }, []);

  const setPathway = (id: PathwayId) => {
    sessionStorage.setItem(GYBS_SELECTED_PATHWAY_KEY, id);
  };

  return (
    <div>
      {/* SECTION 1 — HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1B3A6B 0%, #2E6BE6 100%)',
        }}
      >
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-[60px] md:grid-cols-2 md:gap-16 md:px-6 md:py-[100px]">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white/95 backdrop-blur-sm">
              <span className="mr-2" aria-hidden>
                🇺🇸
              </span>
              National Business Readiness Gateway
            </div>
            <h1 className="text-display-h1-sm text-white md:text-display-h1">
              Find Out If Your Business Is Actually Ready.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 md:text-[18px] md:leading-relaxed">
              GYBS is the diagnostic entry point for the Misconi USA ecosystem. Complete a focused intake, get your
              Business Score, and see exactly how ready your business is today.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {['bg-blue-200', 'bg-amber-200', 'bg-emerald-200'].map((c) => (
                  <span
                    key={c}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/80 ${c} text-xs font-semibold text-gybs-ink`}
                  >
                    •
                  </span>
                ))}
              </div>
              <p className="text-sm text-white/90">4,200+ businesses scored across readiness.</p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" onClick={openKioskOnHome} className="gybs-btn-gold !px-7 !py-3.5">
                Get Your Business Score
              </button>
              <Link
                href="/subscribe"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-7 py-3.5 text-base font-semibold text-white transition-all duration-gybs ease-in-out hover:bg-white/10"
              >
                Subscribe
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-white/60">Takes about 5–7 minutes. Instant score when you finish.</p>
          </div>

          <div className="flex justify-center md:justify-end">
            <div
              className="hero-float w-full max-w-md rounded-xl border border-gybs-border bg-white p-6 shadow-xl md:p-8"
              style={{ transform: 'rotate(2deg)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-gybs-muted">Business Score (sample)</p>
              <p className="mt-2 text-[72px] font-bold leading-none text-gybs-navy">74</p>
              <p className="mt-1 text-sm text-gybs-muted">Intake-only snapshot</p>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'Identity readiness', pct: 82, color: 'bg-gybs-blue' },
                  { label: 'Documentation', pct: 68, color: 'bg-gybs-accent' },
                  { label: 'Opportunity readiness', pct: 90, color: 'bg-gybs-success' },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex justify-between text-xs text-gybs-body">
                      <span>{row.label}</span>
                      <span>{row.pct}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gybs-border">
                      <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between gap-4 border-t border-gybs-border pt-4 text-xs text-gybs-muted">
                <div>
                  <p className="font-semibold text-gybs-ink">Prescore status</p>
                  <p>No pathways yet</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gybs-ink">Based on intake</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — KIOSK (hidden until opened) */}
      <div id="kiosk-section" className="scroll-mt-24">
        {kioskVisible && (
          <section className="gybs-section gybs-kiosk-reveal bg-gybs-light">
            <div className="mx-auto max-w-content px-4 md:px-6">
          <h2 className="text-center text-display-h2-sm text-gybs-ink md:text-display-h2">Which route do you want to take?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gybs-muted">
            Select the readiness pathway that matches your business goal.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {KIOSK_PATHWAYS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.id} className="gybs-card flex flex-col">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gybs-light text-gybs-navy">
                    <Icon className="h-6 w-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-gybs-ink">{p.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gybs-muted">{p.description}</p>
                  <div className="my-5 h-px w-full bg-gybs-border" />
                  <div className="flex flex-col gap-3">
                    <Link
                      href={`/assessment?pathway=${p.id}`}
                      onClick={() => setPathway(p.id)}
                      className="gybs-btn-primary w-full text-center"
                    >
                      Get Your Business Score
                    </Link>
                    <Link href="/subscribe" className="gybs-btn-secondary w-full text-center">
                      Subscribe
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
          </section>
        )}
      </div>

      {/* SECTION 3 — HOW IT WORKS */}
      <section className="gybs-section bg-white">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <h2 className="text-center text-display-h2-sm text-gybs-ink md:text-display-h2">Your Route Through GYBS</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gybs-muted">
            Four simple steps to your Business Readiness Score.
          </p>
          <div className="relative mt-16">
            <div className="absolute left-0 right-0 top-8 hidden h-0 border-t-2 border-dashed border-gybs-blue/40 md:block" style={{ marginLeft: '10%', marginRight: '10%' }} />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
              {[
                { n: '01', Icon: ClipboardList, title: 'Complete the Intake', desc: 'Answer focused questions about your business operations, offers, and relationships.' },
                { n: '02', Icon: BarChart3, title: 'Get Your Score', desc: 'Receive your Business Readiness Score (0–100) instantly after submission.' },
                { n: '03', Icon: CreditCard, title: 'Subscribe to Unlock', desc: 'Subscribe to unlock readiness, education, and opportunities aligned to your score.' },
                { n: '04', Icon: Compass, title: 'Choose Your Direction', desc: 'Continue into operational readiness, education, or SBA-aligned support.' },
              ].map((s) => (
                <div key={s.n} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gybs-navy text-lg font-bold text-white">
                    {s.n}
                  </div>
                  <div className="mb-3 rounded-lg bg-gybs-light p-3 text-gybs-navy">
                    <s.Icon className="mx-auto h-6 w-6" />
                  </div>
                  <h3 className="text-display-h3-sm font-bold text-gybs-ink md:text-display-h3">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gybs-muted md:text-base">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — SCORING */}
      <section className="gybs-section bg-gybs-light">
        <div className="mx-auto grid max-w-content items-start gap-12 px-4 md:grid-cols-2 md:gap-16 md:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gybs-blue">The scoring engine</p>
            <h2 className="mt-3 text-display-h2-sm text-gybs-ink md:text-display-h2">How Your Business Score Is Calculated</h2>
            <p className="mt-6 text-base leading-relaxed text-gybs-body">
              The Business Readiness Score is generated from your intake responses. GYBS evaluates three key areas of your
              business and produces a clear readiness score that shows where you stand today.
            </p>
            <div className="mt-8 rounded-xl bg-gybs-navy p-6 text-sm leading-relaxed text-white">
              Only your final score is shown. Sub-scores are used internally for accurate calculation.
            </div>
          </div>
          <div className="gybs-card !hover:translate-y-0">
            <h3 className="text-lg font-bold text-gybs-ink">Score Composition</h3>
            <div className="mt-8 space-y-8">
              {[
                { label: 'Operational Readiness', pct: 50, bar: 'bg-gybs-blue', weight: '50% weight', desc: 'Operations, banking, bookkeeping, financials' },
                { label: 'Catalog Readiness', pct: 30, bar: 'bg-gybs-accent', weight: '30% weight', desc: 'Offers, pricing, written descriptions' },
                { label: 'Relationship Readiness', pct: 20, bar: 'bg-gybs-success', weight: '20% weight', desc: 'Customers, retention, partners' },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-semibold text-gybs-ink">{row.label}</span>
                    <span className="text-sm font-medium text-gybs-blue">{row.weight}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-gybs-border">
                    <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${row.pct}%` }} />
                  </div>
                  <p className="mt-2 text-sm text-gybs-muted">{row.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-lg bg-[#EFF6FF] p-4 font-mono text-xs text-gybs-navy">
              Final Score = (Op×50%) + (Cat×30%) + (Rel×20%)
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — READINESS DIRECTIONS */}
      <section className="gybs-section bg-white">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <h2 className="text-center text-display-h2-sm text-gybs-ink md:text-display-h2">Readiness Directions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gybs-muted">
            After your score, choose the direction that fits your business.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { Icon: ShoppingCart, color: 'text-gybs-accent', title: 'Marketplace Readiness', desc: 'Position your business for customers, visibility, and marketplace participation.' },
              { Icon: Truck, color: 'text-gybs-blue', title: 'Distribution Readiness', desc: 'Prepare your business for product movement, fulfillment, and distribution partnerships.' },
              { Icon: FileText, color: 'text-gybs-navy', title: 'Contract Readiness', desc: 'Align your business with procurement, compliance, and contract-based opportunities.' },
              { Icon: Award, color: 'text-gybs-success', title: 'SBA Readiness', desc: 'Strengthen your foundation with SBA-aligned training and early-stage readiness development.' },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-gybs-border border-l-4 border-l-gybs-blue bg-white p-7 shadow-gybs-card transition-all duration-gybs ease-in-out hover:-translate-y-0.5 hover:shadow-gybs-card-hover"
              >
                <b.Icon className={`h-8 w-8 ${b.color}`} strokeWidth={2} />
                <h3 className="mt-4 text-lg font-bold text-gybs-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gybs-muted">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <p className="text-lg font-medium text-gybs-ink">Ready to find out where your business stands?</p>
            <button type="button" onClick={openKioskOnHome} className="gybs-btn-gold">
              Get Your Business Score
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6 — STATS */}
      <section
        className="gybs-section text-white"
        style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2E6BE6 100%)' }}
      >
        <div className="mx-auto max-w-content px-4 md:px-6">
          <div className="flex flex-col divide-y divide-white/20 md:flex-row md:divide-x md:divide-y-0">
            {[
              { n: '4,200+', l: 'Businesses Scored' },
              { n: '6', l: 'Readiness Pathways' },
              { n: '3', l: 'Readiness Directions' },
            ].map((s) => (
              <div key={s.l} className="flex flex-1 flex-col items-center px-6 py-8 text-center md:py-4">
                <p className="text-4xl font-bold md:text-5xl">{s.n}</p>
                <p className="mt-2 text-sm text-white/85 md:text-base">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

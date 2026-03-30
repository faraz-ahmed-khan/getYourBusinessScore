import Link from 'next/link';
import { LEVEL_1_ROUTES } from '@/lib/constants';

/**
 * Homepage hero — business-only readiness kiosk, diagnostic entry point.
 * Prescore intake and scoring surface. No pathways, opportunities, training, or education content.
 */
export function Hero() {
  return (
    <section
    
      className="relative overflow-hidden border-b border-[color:var(--color-border)]"
      style={{
        background:
          'radial-gradient(circle at top right, rgba(0,87,184,0.05), transparent 55%), linear-gradient(to bottom, #ffffff, #f8fafc)',
      }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:py-24 lg:py-28 md:flex-row md:items-stretch md:text-left">
        <div className="md:w-1/2 md:pr-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981]" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
              Business Readiness Assessment
            </span>
          </div>

          <h1 className="mt-7 text-[2.5rem] font-extrabold leading-[1.08] tracking-[-0.05em] text-[color:var(--color-text-primary)] sm:text-[2.9rem] md:text-[3.4rem]">
            Find Out If Your Business Is Actually{' '}
            <span className="relative inline-block">
              Ready
              <span className="pointer-events-none absolute inset-x-0 bottom-[-6px] h-[10px] rounded-full bg-[rgba(0,87,184,0.15)]" />
            </span>
            .
          </h1>

          <p className="mt-6 mx-auto max-w-md text-[16px] leading-relaxed text-[color:var(--color-text-muted)] md:mx-0">
            GYBS is the diagnostic entry point for the Misconi USA ecosystem. Complete a focused intake, get your
            Business Score, and see exactly how ready your business is today.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 md:justify-start">
            <div className="flex -space-x-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#e0f2fe] to-[#bfdbfe] text-xs font-medium text-[color:var(--color-text-primary)]">
                A
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#fee2e2] to-[#fecaca] text-xs font-medium text-[color:var(--color-text-primary)]">
                B
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gradient-to-br from-[#dcfce7] to-[#bbf7d0] text-xs font-medium text-[color:var(--color-text-primary)]">
                C
              </span>
            </div>
            <p className="text-sm text-[color:var(--color-text-muted)]">4,200+ businesses scored across readiness.</p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-2 sm:items-start">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center rounded-[10px] bg-[color:var(--color-primary)] px-10 py-3.5 text-[15px] font-semibold text-white shadow-[0_16px_40px_rgba(0,87,184,0.32)] transition-transform transition-shadow duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:bg-[color:var(--color-primary-dark)] hover:shadow-[0_22px_60px_rgba(0,87,184,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Get Your Business Score
              </Link>
              <a
                href={LEVEL_1_ROUTES.subscribe}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-[10px] border border-[color:var(--color-border-active)] bg-white px-6 py-3.5 text-[15px] font-semibold text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Subscribe
              </a>
            </div>
            <p className="text-xs text-[color:var(--color-text-muted)] sm:text-left">
              Takes about 5–7 minutes. Instant score when you finish.
            </p>
          </div>
        </div>

        <div className="mt-10 flex w-full justify-center md:mt-0 md:w-1/2 md:justify-end">
          <div className="hero-float hidden w-full max-w-sm rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[0_16px_50px_rgba(15,23,42,0.14)] md:flex md:flex-col">
            {/* Header: label + score + gauge */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-text-muted)]">
                  Business Score (sample)
                </p>
                <p className="mt-1 text-4xl font-extrabold text-[color:var(--color-primary)]">74</p>
                <p className="mt-1 text-[11px] text-[color:var(--color-text-muted)]">Intake-only snapshot</p>
              </div>
              <div className="relative h-16 w-16 rounded-full bg-[color:var(--color-primary-light)]">
                <div className="absolute inset-1 rounded-full border-[3px] border-[rgba(0,87,184,0.18)]" />
                <div className="absolute inset-1 rounded-full border-[3px] border-t-[color:var(--color-primary)] border-l-[color:var(--color-primary)] border-b-transparent border-r-transparent" />
              </div>
            </div>

            {/* Bars */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[color:var(--color-text-muted)]">
                <span>Identity readiness</span>
                <span>82%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[color:var(--color-surface-3)]">
                <div className="h-1.5 w-[82%] rounded-full bg-[#3B82F6]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[color:var(--color-text-muted)]">
                <span>Documentation</span>
                <span>68%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[color:var(--color-surface-3)]">
                <div className="h-1.5 w-[68%] rounded-full bg-[#F59E0B]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[color:var(--color-text-muted)]">
                <span>Opportunity readiness</span>
                <span>90%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[color:var(--color-surface-3)]">
                <div className="h-1.5 w-[90%] rounded-full bg-[#10B981]" />
              </div>
            </div>

            {/* Compact summary row – fills lower area without adding noise */}
            <div className="mt-4 flex items-center justify-between rounded-[14px] bg-[color:var(--color-surface-2)] px-3 py-2 text-[10px] text-[color:var(--color-text-muted)]">
              <div className="space-y-0.5">
                <p className="font-semibold text-[color:var(--color-text-primary)]">Prescore status</p>
                <p>No pathways or opportunities yet.</p>
              </div>
              <div className="space-y-0.5 text-right">
                <p className="font-semibold text-[color:var(--color-text-primary)]">Based on intake</p>
                <p>Identity, documents, and opportunity intent only.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { LEVEL_1_ROUTES } from '@/lib/constants';

/**
 * Doctrine-aligned "How Readiness Works" + lightweight pathway awareness.
 */
const READINESS_DIRECTIONS = [
  {
    label: 'Operational readiness',
    host: 'MisconiUSA.com',
    href: 'https://misconiusa.com',
    body: 'Subscribe, pathways, and opportunity routing after you are readiness-activated.',
  },
  {
    label: 'Education & orientation',
    host: 'MisconiUSANetwork.com',
    href: 'https://misconiusanetwork.com',
    body: 'Readiness concepts and ecosystem context before or alongside your pathway.',
  },
  {
    label: 'Training & SBA-aligned support',
    host: 'SBAReady.org',
    href: LEVEL_1_ROUTES.training,
    body: 'Foundational training and Apex-supported help for earlier-stage readiness needs.',
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-2)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">How readiness works</h2>
        <p className="mt-2 max-w-3xl text-sm text-[color:var(--color-text-muted)]">
          GYBS is the entry gateway: intake first, then a governed result that points you to the right external surface.
          Nothing here replaces subscription, pathways, or training—those live on the three destinations below.
        </p>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--color-text-muted)]">
          Three readiness directions (post-score)
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {READINESS_DIRECTIONS.map((d) => (
            <a
              key={d.host}
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[color:var(--color-border)] bg-white p-4 text-sm transition hover:border-[color:var(--color-primary)] hover:shadow-sm"
            >
              <p className="font-semibold text-[color:var(--color-text-primary)]">{d.label}</p>
              <p className="mt-1 text-[13px] text-[color:var(--color-primary)]">{d.host}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--color-text-muted)]">{d.body}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

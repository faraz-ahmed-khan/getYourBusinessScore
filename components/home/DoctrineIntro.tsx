/**
 * Level-1 doctrine block: what happens after entry without duplicating results-page lanes.
 */

export function DoctrineIntro() {
  return (
    <section className="border-t border-[color:var(--color-border)] bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">Your route through GYBS</h2>
        <ol className="mt-6 space-y-3 text-left text-sm text-[color:var(--color-text-body)]">
          <li className="flex gap-3">
            <span className="font-semibold text-[color:var(--color-primary)]">1.</span>
            <span>Start with intake — the eight-pack business readiness assessment.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-[color:var(--color-primary)]">2.</span>
            <span>Receive your Business Score (prototype output until backend is connected).</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-[color:var(--color-primary)]">3.</span>
            <span>See your readiness level and the governed outcome: lane, pack, corrections, and next steps.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-[color:var(--color-primary)]">4.</span>
            <span>
              Continue to exactly one primary direction when ready:{' '}
              <strong className="font-medium text-[color:var(--color-text-primary)]">MisconiUSA.com</strong> (operational
              readiness), <strong className="font-medium text-[color:var(--color-text-primary)]">MisconiUSANetwork.com</strong>{' '}
              (education), or <strong className="font-medium text-[color:var(--color-text-primary)]">SBAReady.org</strong>{' '}
              (training and SBA-aligned support).
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}

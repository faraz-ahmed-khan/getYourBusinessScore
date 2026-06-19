import Image from 'next/image';

/**
 * GYBS corporate banner (Corporate Websites Sheet Layout §3).
 * Title: Get Your Business Score
 * Tagline: Readiness is the Gate to Opportunity
 * Visual: shield logo, grid background, readiness gauge
 */
export function GybsBanner() {
  return (
    <section
      className="border-b border-gybs-border bg-white"
      aria-label="Get Your Business Score — Readiness is the Gate to Opportunity"
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <Image
          src="/images/gybs-banner.png"
          alt="Get Your Business Score. Readiness is the Gate to Opportunity."
          width={1200}
          height={675}
          className="mx-auto h-auto w-full"
          priority
          sizes="(max-width: 768px) 100vw, 960px"
        />
      </div>
    </section>
  );
}

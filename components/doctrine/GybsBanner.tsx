import Link from 'next/link';

const BANNER_SRC = '/images/readiness-hero-banner.png';

export function GybsBanner() {
  return (
    <div className="border-b border-gybs-border bg-white">
      <div className="mx-auto max-w-content px-4 md:px-6">
        <div className="relative overflow-hidden">
          <img
            src={BANNER_SRC}
            alt="Business readiness dashboard with analytics and growth indicators"
            className="block h-auto w-full"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-y-0 left-0 flex w-full items-center px-6 md:w-[48%] md:px-10">
            <div className="rounded-xl bg-white/75 p-4 backdrop-blur-[1px] md:p-6">
              <h2 className="text-2xl font-bold text-gybs-ink md:text-4xl">Get Your Business Score</h2>
              <p className="mt-3 text-sm leading-relaxed text-gybs-body md:text-base">
                Begin your readiness intake to identify strengths, gaps, and next steps in the Misconi USA ecosystem.
              </p>
              <Link href="/about" className="gybs-btn-primary mt-5">
                Start Readiness Intake
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

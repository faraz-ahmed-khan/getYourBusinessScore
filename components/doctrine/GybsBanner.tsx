import Link from 'next/link';

const BANNER_SRC = '/images/readiness-hero-banner.png';

export function GybsBanner() {
  return (
    <div className="border-b border-gybs-border bg-white">
      <div className="mx-auto max-w-content px-4 py-10 md:px-6 md:py-14">
        <div className="relative md:overflow-hidden">
          <div className="mb-6 md:absolute md:inset-y-0 md:left-0 md:z-10 md:mb-0 md:flex md:w-[48%] md:items-center md:px-10">
            <div className="md:rounded-xl md:bg-white/75 md:p-6 md:backdrop-blur-[1px]">
              <h2 className="text-2xl font-bold text-gybs-ink md:text-4xl">Get Your Business Score</h2>
              <p className="mt-3 text-sm leading-relaxed text-gybs-body md:text-base">
                Begin your readiness intake to identify strengths, gaps, and next steps in the Misconi USA ecosystem.
              </p>
              <Link href="/about" className="gybs-btn-primary mt-5">
                Start Readiness Intake
              </Link>
            </div>
          </div>
          <img
            src={BANNER_SRC}
            alt="Business readiness dashboard with analytics and growth indicators"
            className="block h-auto w-full"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}

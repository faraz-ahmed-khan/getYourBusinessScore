const ASSESSMENT_BANNER_SRC = '/images/assessment-section-banner.png';

export function AssessmentBanner() {
  return (
    <div className="border-b border-gybs-border bg-white">
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:px-6 md:py-14">
        <div>
          <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">About the Readiness Assessment</h1>
          <p className="mt-6 max-w-xl text-lg text-gybs-body md:text-[18px] md:leading-relaxed">
            This assessment evaluates your business across documentation, operations, financials, and market
            readiness. Your readiness score determines which pathway options are available to support your growth and
            prepares your business for Final Submission Intake (FSI).
          </p>
          <p className="mt-4 max-w-xl text-lg text-gybs-body md:text-[18px] md:leading-relaxed">
            Client responses will be attached to your UBID and processed through your Master Business Intake (MBI) and
            metadata shell (MMI).
          </p>
          <a href="#assessment-questions" className="gybs-btn-primary mt-10 inline-flex">
            Begin Assessment
          </a>
        </div>
        <img
          src={ASSESSMENT_BANNER_SRC}
          alt="Business readiness assessment with checklist, analytics, and security indicators"
          className="block h-auto w-full rounded-2xl border border-gybs-border bg-white shadow-gybs-card"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </div>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Unlock readiness, education, and opportunities aligned to your Business Readiness Score.',
};

export default function SubscribePage() {
  return (
    <div className="min-h-[70vh] bg-gybs-light">
      <section
        className="px-4 py-[60px] text-white md:py-[100px]"
        style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #2E6BE6 100%)' }}
      >
        <div className="mx-auto max-w-content text-center md:px-6">
          <h1 className="text-display-h2-sm md:text-display-h2">Subscribe to unlock readiness</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            Membership connects you to Misconi USA operational readiness, ecosystem education, and SBA-aligned support.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://misconiusa.com/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="gybs-btn-gold"
            >
              Subscribe on MisconiUSA.com
            </a>
            <Link href="/" className="gybs-btn-secondary !border-white !text-white hover:!bg-white/10">
              Get Your Business Score
            </Link>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-content px-4 py-16 md:px-6">
        <p className="text-center text-base leading-relaxed text-gybs-body">
          Use the pathway you selected on the homepage, complete your intake, then choose a subscription tier that matches how
          far you want to take readiness activation.
        </p>
      </div>
    </div>
  );
}

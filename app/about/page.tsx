import type { Metadata } from 'next';
import Link from 'next/link';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'About the Readiness Assessment',
};

export default function AboutPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">About the Readiness Assessment</h1>
        <p className="mt-6 max-w-xl text-lg text-gybs-body md:text-[18px] md:leading-relaxed">
          This assessment evaluates your business across documentation, operations, financials, and market readiness.
          Your readiness score determines which pathway options are available to support your growth and prepares your
          business for Final Submission Intake (FSI).
        </p>
        <p className="mt-4 max-w-xl text-lg text-gybs-body md:text-[18px] md:leading-relaxed">
          Client responses will be attached to your UBID and processed through your Master Business Intake (MBI) and
          metadata shell (MMI).
        </p>
        <div className="mt-10">
          <Link href="/assessment" className="gybs-btn-primary">
            Begin Assessment
          </Link>
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

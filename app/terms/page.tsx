import type { Metadata } from 'next';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'Terms & Policies',
};

const PLACEHOLDER_SECTIONS = ['Terms & Conditions', 'Privacy Statement', 'Disclaimer'];

export default function TermsPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">Terms & Policies</h1>
        <div className="mt-10 space-y-8">
          {PLACEHOLDER_SECTIONS.map((section) => (
            <div key={section} className="rounded-xl border border-gybs-border bg-gybs-light p-6">
              <h2 className="text-xl font-bold text-gybs-ink">{section}</h2>
              <p className="mt-2 text-base text-gybs-muted">(Placeholder)</p>
            </div>
          ))}
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

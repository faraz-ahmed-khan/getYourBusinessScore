import type { Metadata } from 'next';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'Contact GetYourBusinessScore.com',
};

export default function ContactPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">Contact GetYourBusinessScore.com</h1>
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gybs-ink">Support Routing</h2>
          <p className="mt-3 text-lg text-gybs-body">
            Email:{' '}
            <a href="mailto:support@getyourbusinessscore.com" className="font-medium text-gybs-blue hover:text-gybs-navy">
              support@getyourbusinessscore.com
            </a>
          </p>
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

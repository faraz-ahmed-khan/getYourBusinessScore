import type { Metadata } from 'next';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'How the Readiness Score Works',
};

const EVALUATION_AREAS = [
  'Documentation',
  'Financial health',
  'Operational stability',
  'Market clarity',
  'Scalability',
];

export default function HowItWorksPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">How the Readiness Score Works</h1>

        <div className="mt-10 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gybs-ink">Scoring Method</h2>
            <p className="mt-3 text-lg leading-relaxed text-gybs-body">
              Weighted model evaluating documentation, operations, financials, and market position.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gybs-ink">What We Evaluate</h2>
            <ul className="mt-4 space-y-2">
              {EVALUATION_AREAS.map((area) => (
                <li key={area} className="flex items-start gap-3 text-lg text-gybs-body">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gybs-ink">Why Readiness Matters</h2>
            <p className="mt-3 text-lg leading-relaxed text-gybs-body">
              Determines ability to qualify for funding, attract partners, pursue opportunities, and scale.
            </p>
          </div>
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

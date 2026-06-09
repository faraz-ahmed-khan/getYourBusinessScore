import type { Metadata } from 'next';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';
import { READINESS_LEVELS } from '@/lib/readiness-levels';

export const metadata: Metadata = {
  title: 'Business Readiness Levels',
};

export default function ReadinessLevelsPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">Business Readiness Levels</h1>
        <ul className="mt-10 space-y-8">
          {READINESS_LEVELS.map((level) => (
            <li key={level.level} className="rounded-xl border border-gybs-border bg-gybs-light p-6">
              <h2 className="text-xl font-bold text-gybs-ink">{level.title}</h2>
              <p className="mt-2 text-base leading-relaxed text-gybs-body">{level.description}</p>
            </li>
          ))}
        </ul>
      </DoctrineContent>
    </DoctrinePage>
  );
}

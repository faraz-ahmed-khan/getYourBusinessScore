import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AssessmentClient } from './AssessmentClient';

export const metadata: Metadata = {
  title: 'Business Readiness Assessment',
};

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center" style={{ background: 'var(--cream)', color: 'var(--ink-soft)' }}>
          Loading…
        </div>
      }
    >
      <AssessmentClient />
    </Suspense>
  );
}

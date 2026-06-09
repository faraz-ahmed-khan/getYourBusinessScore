import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AssessmentClient } from './AssessmentClient';

export const metadata: Metadata = {
  title: 'Readiness Assessment — Question 1',
};

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gybs-light text-gybs-muted">Loading…</div>
      }
    >
      <AssessmentClient />
    </Suspense>
  );
}

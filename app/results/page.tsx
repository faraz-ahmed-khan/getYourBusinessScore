import type { Metadata } from 'next';
import { ResultsClient } from './ResultsClient';

export const metadata: Metadata = {
  title: 'Your Business Readiness Score',
};

export default function ResultsPage() {
  return <ResultsClient />;
}

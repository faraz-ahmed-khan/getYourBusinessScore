'use client';

import Link from 'next/link';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export function HomePageClient() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">Get Your Business Score</h1>
        <p className="mt-6 max-w-xl text-lg text-gybs-body md:text-[18px] md:leading-relaxed">
          You are about to begin the Misconi USA Readiness Intake. This process will create or retrieve your
          Universal Business ID (UBID), activate your Master Business Intake (MBI), and initialize your metadata
          shell (MMI).
        </p>
        <p className="mt-4 max-w-xl text-lg text-gybs-body md:text-[18px] md:leading-relaxed">
          Your responses will generate your readiness score and begin your readiness lifecycle. This score
          identifies your strengths, gaps, and next steps in the Misconi USA ecosystem.
        </p>
        <div className="mt-10">
          <Link href="/about" className="gybs-btn-primary">
            Start Readiness Intake
          </Link>
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

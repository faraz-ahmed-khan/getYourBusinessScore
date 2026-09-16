'use client';

import { SiteHeader } from '@/components/home/SiteHeader';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Journey } from '@/components/home/Journey';
import { AssessmentIntake } from '@/components/home/AssessmentIntake';
import { Leadership } from '@/components/home/Leadership';
import { Packages } from '@/components/home/Packages';
import { Governance } from '@/components/home/Governance';
import { FinalCta } from '@/components/home/FinalCta';
import { SiteFooter } from '@/components/home/SiteFooter';

export function HomePageClient() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Journey />
        <AssessmentIntake />
        <Leadership />
        <Packages />
        <Governance />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}

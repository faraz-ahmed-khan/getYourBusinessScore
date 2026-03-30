import { Hero } from '@/components/home/Hero';
import { DoctrineIntro } from '@/components/home/DoctrineIntro';
import { HowItWorks } from '@/components/home/HowItWorks';

/**
 * GYBS Homepage — Level 1 entry gateway + doctrine framing (no post-score lanes as interactive selectors).
 */
export default function HomePage() {
  return (
    <div>
      <Hero />
      <DoctrineIntro />
      <HowItWorks />
    </div>
  );
}

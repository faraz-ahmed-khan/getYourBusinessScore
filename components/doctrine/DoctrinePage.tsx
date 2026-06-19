import type { ReactNode } from 'react';
import { GybsBanner } from '@/components/doctrine/GybsBanner';

type DoctrinePageProps = {
  children: ReactNode;
  className?: string;
  /** Set false on pages that should not show the corporate banner */
  showBanner?: boolean;
};

export function DoctrinePage({ children, className = '', showBanner = true }: DoctrinePageProps) {
  return (
    <div>
      {showBanner ? <GybsBanner /> : <div className="banner-slot" aria-hidden="true" />}
      <section className={`gybs-section bg-white ${className}`.trim()}>{children}</section>
    </div>
  );
}

type DoctrineContentProps = {
  children: ReactNode;
  narrow?: boolean;
};

export function DoctrineContent({ children, narrow = false }: DoctrineContentProps) {
  return (
    <div className={`mx-auto max-w-content px-4 md:px-6 ${narrow ? 'max-w-3xl' : ''}`.trim()}>
      {children}
    </div>
  );
}

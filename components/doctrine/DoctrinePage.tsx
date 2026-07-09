import type { ReactNode } from 'react';
import { AssessmentBanner } from '@/components/doctrine/AssessmentBanner';
import { GybsBanner } from '@/components/doctrine/GybsBanner';

type BannerVariant = 'default' | 'assessment' | 'none';

type DoctrinePageProps = {
  children: ReactNode;
  className?: string;
  /** @deprecated Use `banner` instead */
  showBanner?: boolean;
  banner?: BannerVariant;
};

function PageBanner({ variant }: { variant: BannerVariant }) {
  if (variant === 'assessment') return <AssessmentBanner />;
  if (variant === 'default') return <GybsBanner />;
  return <div className="banner-slot" aria-hidden="true" />;
}

export function DoctrinePage({
  children,
  className = '',
  showBanner = true,
  banner,
}: DoctrinePageProps) {
  const bannerVariant: BannerVariant =
    banner ?? (showBanner ? 'default' : 'none');

  return (
    <div className="bg-white">
      <PageBanner variant={bannerVariant} />
      <section className={`gybs-page-content ${className}`.trim()}>{children}</section>
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

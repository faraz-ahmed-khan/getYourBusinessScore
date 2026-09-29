'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/home/SiteHeader';

const UI_PAGES = new Set(['/', '/assessment', '/results']);
const HOMEPAGE_HEADER_PAGES = new Set(['/terms', '/privacy']);

/**
 * Marketing home, assessment, and results ship their own header/footer.
 * Secondary doctrine pages still use the global Navbar + SiteFooter.
 */
export function Chrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = UI_PAGES.has(pathname);
  const useHomepageHeader = HOMEPAGE_HEADER_PAGES.has(pathname);

  return (
    <>
      {!hideShell && !useHomepageHeader && <Navbar />}
      {useHomepageHeader && <SiteHeader />}
      {children}
      {!hideShell && <SiteFooter />}
    </>
  );
}

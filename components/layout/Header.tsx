'use client';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sticky header. Prescore CTA only: "Get Your Business Score" must NOT appear on results page.
 */
export function Header() {
  const pathname = usePathname();
  const isResultsPage = pathname === '/results';

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <div className="relative w-[120px] h-[60px] sm:w-[140px] sm:h-[70px] md:w-[160px] md:h-[80px]">
              <Image
                src="/images/logo.png"
                alt="GYBS Logo"
                fill
                className="object-contain"
              />
           </div>
          </Link>
        {!isResultsPage && (
          <Link
            href="/assessment"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Get Your Business Score
          </Link>
        )}
      </div>
    </header>
  );
}

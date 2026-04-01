'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { GYBS_OPEN_KIOSK_PENDING_KEY } from '@/lib/pathways';

function openKioskOnHome() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('gybs-open-kiosk'));
  document.getElementById('kiosk-section')?.scrollIntoView({ behavior: 'smooth' });
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';

  return (
    <header
      className={`sticky top-0 z-50 h-[72px] border-b border-gybs-border bg-white transition-shadow duration-gybs ease-in-out ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      }`}
    >
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-[100px] sm:h-11 sm:w-[120px]">
            <Image src="/images/logo.png" alt="GYBS" fill className="object-contain object-left" priority />
          </div>
          <span className="sr-only">GYBS</span>
        </Link>

        <div className="flex items-center gap-3">
          {!isHome && (
            <Link
              href="/"
              className="text-sm font-medium text-gybs-body transition-colors duration-gybs hover:text-gybs-navy"
            >
              Home
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              if (pathname === '/') {
                openKioskOnHome();
              } else {
                sessionStorage.setItem(GYBS_OPEN_KIOSK_PENDING_KEY, '1');
                router.push('/');
              }
            }}
            className="gybs-btn-primary !py-3 !text-sm sm:!text-base"
          >
            Get Your Business Score
          </button>
        </div>
      </div>
    </header>
  );
}

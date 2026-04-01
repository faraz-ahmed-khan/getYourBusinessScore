import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-gybs-ink text-white">
      <div className="mx-auto max-w-content px-4 py-14 md:px-6">
        <div className="flex flex-col gap-10 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="flex max-w-md flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-12 w-24 shrink-0">
              <Image src="/images/logo.png" alt="GYBS" fill className="object-contain object-left" />
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              The national readiness gateway for businesses of every size.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-medium sm:items-end">
            <a href="https://misconiusa.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/90">
              MisconiUSA.com
            </a>
            <a href="https://misconiusanetwork.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/90">
              MisconiUSANetwork.com
            </a>
            <a href="https://sbaready.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/90">
              SBAReady.com
            </a>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© 2025 Misconi USA. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-200">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-200">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

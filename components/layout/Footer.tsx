import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 bg-[#0b1220] text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-20">
              <Image src="/images/logo.png" alt="GYBS Logo" fill className="object-contain object-left" />
            </div>
            <p className="text-sm text-slate-300">The national readiness gateway for businesses of every size.</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-y-2 border-t border-white/10 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-200">
              Terms of Service
            </Link>
          </div>
          <p>© 2026 Misconi USA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

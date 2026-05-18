'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClipboardList, BarChart3, CreditCard, Compass } from 'lucide-react';
import { KIOSK_PATHWAYS } from '@/components/home/kiosk-data';
import {
  GYBS_OPEN_KIOSK_PENDING_KEY,
  GYBS_SELECTED_PATHWAY_KEY,
  type PathwayId,
} from '@/lib/pathways';

const DEFAULT_PATHWAY: PathwayId = 'business';

function openKioskOnHome() {
  window.dispatchEvent(new CustomEvent('gybs-open-kiosk'));
}

export function HomePageClient() {
  const router = useRouter();
  const [kioskVisible, setKioskVisible] = useState(false);

  const startAssessment = (pathway: PathwayId = DEFAULT_PATHWAY) => {
    sessionStorage.setItem(GYBS_SELECTED_PATHWAY_KEY, pathway);
    router.push(`/assessment?pathway=${pathway}`);
  };

  useEffect(() => {
    const onOpen = () => setKioskVisible(true);
    window.addEventListener('gybs-open-kiosk', onOpen);
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(GYBS_OPEN_KIOSK_PENDING_KEY) === '1') {
      sessionStorage.removeItem(GYBS_OPEN_KIOSK_PENDING_KEY);
      setKioskVisible(true);
    }
    return () => window.removeEventListener('gybs-open-kiosk', onOpen);
  }, []);

  useEffect(() => {
    if (!kioskVisible) return;
    requestAnimationFrame(() => {
      document.getElementById('kiosk-section')?.scrollIntoView({ behavior: 'smooth' });
    });
  }, [kioskVisible]);

  const setPathway = (id: PathwayId) => {
    sessionStorage.setItem(GYBS_SELECTED_PATHWAY_KEY, id);
  };

  return (
    <div>
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1B3A6B 0%, #2E6BE6 100%)',
        }}
      >
        <div className="mx-auto grid max-w-content items-center gap-12 px-4 py-[60px] md:grid-cols-2 md:gap-16 md:px-6 md:py-[100px]">
          <div>
            <div className="mb-6 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white/95 backdrop-blur-sm">
              <span className="mr-2" aria-hidden>
                🇺🇸
              </span>
              National Business Readiness Gateway
            </div>
            <h1 className="text-display-h1-sm text-white md:text-display-h1">
              Find Out If Your Business Is Actually Ready.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 md:text-[18px] md:leading-relaxed">
              GYBS is the diagnostic entry point for the Misconi USA ecosystem. Complete a focused intake, get your
              Business Score, and see exactly how ready your business is today.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => startAssessment()} className="gybs-btn-gold !px-7 !py-3.5">
                Get Your Business Score
              </button>
              <button
                type="button"
                onClick={openKioskOnHome}
                className="inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent px-7 py-3.5 text-base font-semibold text-white transition-all duration-gybs ease-in-out hover:bg-white/10"
              >
                Choose pathway
              </button>
              <Link
                href="/subscribe"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/40 bg-transparent px-7 py-3.5 text-base font-semibold text-white/90 transition-all duration-gybs ease-in-out hover:bg-white/10"
              >
                Subscribe
              </Link>
            </div>
            <p className="mt-4 text-[13px] text-white/60">Takes about 5–7 minutes. Instant score when you finish.</p>
          </div>

          <div className="flex justify-center md:justify-end">
            <div
              className="hero-float w-full max-w-md rounded-xl border border-gybs-border bg-white p-6 shadow-xl md:p-8"
              style={{ transform: 'rotate(2deg)' }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest text-gybs-muted">Business Score (sample)</p>
              <p className="mt-2 text-[72px] font-bold leading-none text-gybs-navy">74</p>
              <p className="mt-1 text-sm text-gybs-muted">Intake-only snapshot</p>
            </div>
          </div>
        </div>
      </section>

      <div id="kiosk-section" className="scroll-mt-24">
        {kioskVisible && (
          <section className="gybs-section gybs-kiosk-reveal bg-gybs-light">
            <div className="mx-auto max-w-content px-4 md:px-6">
              <h2 className="text-center text-display-h2-sm text-gybs-ink md:text-display-h2">
                Which route do you want to take?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gybs-muted">
                Select the readiness pathway that matches your business goal.
              </p>
              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {KIOSK_PATHWAYS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.id} className="gybs-card flex flex-col">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gybs-light text-gybs-navy">
                        <Icon className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <h3 className="text-lg font-bold text-gybs-ink">{p.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-gybs-muted">{p.description}</p>
                      <div className="my-5 h-px w-full bg-gybs-border" />
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`/assessment?pathway=${p.id}`}
                          onClick={() => setPathway(p.id)}
                          className="gybs-btn-primary w-full text-center"
                        >
                          Get Your Business Score
                        </Link>
                        <Link href="/subscribe" className="gybs-btn-secondary w-full text-center">
                          Subscribe
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      <section className="gybs-section bg-white">
        <div className="mx-auto max-w-content px-4 md:px-6">
          <h2 className="text-center text-display-h2-sm text-gybs-ink md:text-display-h2">Your Route Through GYBS</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gybs-muted">
            Four steps: intake, score, subscribe, then continue on the site matched to your result.
          </p>
          <div className="relative mt-16">
            <div
              className="absolute left-0 right-0 top-8 hidden h-0 border-t-2 border-dashed border-gybs-blue/40 md:block"
              style={{ marginLeft: '10%', marginRight: '10%' }}
            />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-6">
              {[
                {
                  n: '01',
                  Icon: ClipboardList,
                  title: 'Complete the Intake',
                  desc: 'Customer details plus focused questions on operations, offers, and market.',
                },
                {
                  n: '02',
                  Icon: BarChart3,
                  title: 'Get Your Score',
                  desc: 'Receive your Business Readiness Score (0–100) after submission.',
                },
                {
                  n: '03',
                  Icon: CreditCard,
                  title: 'Subscribe to Unlock',
                  desc: 'Subscribe on MisconiUSA.com when you are ready for full readiness activation.',
                },
                {
                  n: '04',
                  Icon: Compass,
                  title: 'Continue Your Route',
                  desc: 'From your results page, follow the lane and outbound links for your next step.',
                },
              ].map((s) => (
                <div key={s.n} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gybs-navy text-lg font-bold text-white">
                    {s.n}
                  </div>
                  <div className="mb-3 rounded-lg bg-gybs-light p-3 text-gybs-navy">
                    <s.Icon className="mx-auto h-6 w-6" />
                  </div>
                  <h3 className="text-display-h3-sm font-bold text-gybs-ink md:text-display-h3">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gybs-muted md:text-base">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 flex flex-col items-center gap-6 text-center">
            <button type="button" onClick={() => startAssessment()} className="gybs-btn-gold">
              Get Your Business Score
            </button>
            <button
              type="button"
              onClick={openKioskOnHome}
              className="text-sm font-medium text-gybs-blue hover:text-gybs-navy"
            >
              Or choose a specific pathway first
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

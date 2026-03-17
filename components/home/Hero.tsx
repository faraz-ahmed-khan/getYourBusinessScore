import Link from 'next/link';

/**
 * Homepage hero — business-only readiness kiosk, diagnostic entry point.
 * Prescore intake and scoring surface. No pathways, opportunities, training, or education content.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200 bg-gradient-to-b from-white to-neutral-50">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
          Get Your Business Score
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600">
          The business-only readiness scoring kiosk for the Misconi USA ecosystem. Complete a short intake, receive your Business Score and readiness level, and get routed to the right next step.
        </p>
        <div className="mt-10">
          <Link
            href="/assessment"
            className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Get Your Business Score
          </Link>
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Get Your Business Score (GYBS), a Misconi USA readiness system, collects and uses information.',
};

const USE_ITEMS = [
  'Assess and interpret your business readiness information.',
  'Prepare for appointments, follow up on missing information, and provide reports, recommendations, preparation support, and customer service.',
  'Manage purchases, payment plans, billing events, and service access.',
  'Improve forms, communications, services, and customer experience.',
  'Protect customers, Misconi USA, GYBS, and systems from misuse or security risks.',
  'Meet applicable legal, accounting, recordkeeping, and compliance obligations.',
];

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
      <h2 className="text-xl font-bold text-gybs-ink">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-gybs-body">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">
          GYBS Privacy Policy
        </h1>
        <p className="mt-3 text-base text-gybs-muted">
          Get Your Business Score | A Misconi USA Readiness System
        </p>

        <Section title="Overview">
          <p>
            Get Your Business Score (GYBS), a readiness system owned by Misconi USA, collects and
            uses information to assess business readiness, communicate with customers, deliver
            requested services, process purchases, and improve the GYBS experience.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p>
            Depending on how you use GYBS, information may include your name, business name, email
            address, phone number, location details you provide, assessment and intake answers,
            business goals and operational information, documents you submit for review, appointment
            and support communications, and purchase records needed to provide the service. Payment
            processors may collect card or account details directly under their own terms.
          </p>
        </Section>

        <Section title="How We Use Information">
          <ul className="space-y-3">
            {USE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Marketing Choices and Sharing">
          <p>
            Submitting a GYBS assessment does not automatically subscribe you to marketing messages.
            Marketing subscriptions and consent are handled separately, and you may unsubscribe using
            the options provided in those messages. GYBS may use service providers for hosting,
            customer records, payments, scheduling, communications, and approved service functions.
            Information may also be shared when you request a referral or connection, when needed to
            provide a service you requested, or when required by law. GYBS does not sell personal
            information to advertisers.
          </p>
        </Section>

        <Section title="Protection and Your Requests">
          <p>
            GYBS uses reasonable administrative and technical safeguards appropriate to the
            information and systems used, but no online system can promise absolute security. Do not
            send highly sensitive information unless GYBS specifically requests it through an
            approved method. Contact GYBS Support to ask about your information, request a
            correction, or understand your privacy choices.
          </p>
        </Section>

        <Section title="Management Review">
          <p>
            This policy is a draft for management approval and should be checked against actual
            operating practices and applicable legal requirements before publication.
          </p>
        </Section>

        <p className="mt-10 pb-16 text-sm text-gybs-muted">
          Related:{' '}
          <Link href="/terms" className="font-medium text-gybs-blue hover:text-gybs-navy">
            Terms and Conditions
          </Link>
        </p>
      </DoctrineContent>
    </DoctrinePage>
  );
}

import type { Metadata } from 'next';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'Terms & Policies',
};

const PROHIBITED_USES = [
  'Submitting false or misleading information',
  'Attempting to alter scoring logic',
  'Circumventing intake validation',
  'Unauthorized access or data extraction',
];

const DATA_COLLECTED = [
  'Business information',
  'Supplier information',
  'Partner information',
  'Opportunity information',
  'Readiness documentation',
];

const DATA_USE_PURPOSES = [
  'Readiness scoring',
  'Intake validation',
  'Routing',
  'Stakeholder protection',
];

const INTAKE_REQUIREMENTS = [
  'Valid business identity',
  'Accurate documentation',
  'Truthful readiness responses',
];

const SCORING_PURPOSES = [
  'Protect stakeholders',
  'Protect opportunities',
  'Ensure qualified routing',
];

const SCORING_OUTCOMES = [
  'Numeric readiness score',
  'Readiness state classification',
  'Gap identification',
];

const PROTECTION_MEASURES = [
  'Intake validation',
  'Scoring governance',
  'Opportunity access control',
];

export default function TermsPage() {
  return (
    <DoctrinePage>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">Terms & Policies</h1>

        <div className="mt-10 rounded-xl border border-gybs-border bg-gybs-light p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-gybs-muted">Terms and Policies Information</p>
          <h2 className="mt-3 text-2xl font-bold text-gybs-ink">GYBS Terms & Policies</h2>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">1. Terms of Use</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            GetYourBusinessScore.com™ (GYBS) is a governed intake, scoring, and readiness classification system owned
            and operated by Misconi USA LLC. By accessing or using this platform, users agree to follow all intake
            rules, scoring disclosures, and readiness governance requirements.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">Authorized Use</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            GYBS may only be used for legitimate business intake, supplier intake, partner intake, and opportunity
            intake. Any attempt to bypass scoring, manipulate readiness states, or interfere with intake governance is
            strictly prohibited.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">Prohibited Use</h3>
          <ul className="mt-4 space-y-3">
            {PROHIBITED_USES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gybs-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">2. Privacy Policy</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            Misconi USA LLC respects and protects all data submitted through GYBS. This section outlines how intake
            data is collected, stored, and used.
          </p>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Data Collected</h4>
          <ul className="mt-3 space-y-2">
            {DATA_COLLECTED.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gybs-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">How Data Is Used</h4>
          <p className="mt-3 text-base leading-relaxed text-gybs-body">
            Data is used exclusively for {DATA_USE_PURPOSES.join(', ')}, and stakeholder protection. No data is sold
            or shared outside the governed Misconi USA ecosystem.
          </p>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Data Protection</h4>
          <p className="mt-3 text-base leading-relaxed text-gybs-body">
            All intake data is encrypted, access-controlled, and governed under Misconi USA&apos;s Readiness Doctrine.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">3. Data Intake Policy</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            GYBS is an intake engine. All submissions must be complete, accurate, and verifiable.
          </p>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Intake Requirements</h4>
          <ul className="mt-3 space-y-2">
            {INTAKE_REQUIREMENTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gybs-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Intake Verification</h4>
          <p className="mt-3 text-base leading-relaxed text-gybs-body">
            Misconi USA may request additional documentation to verify readiness claims.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">4. Readiness Scoring Disclosure</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            GYBS assigns readiness scores and readiness states based on governed criteria.
          </p>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Scoring Purpose</h4>
          <ul className="mt-3 space-y-2">
            {SCORING_PURPOSES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gybs-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                {item}
              </li>
            ))}
          </ul>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Scoring Outcomes</h4>
          <ul className="mt-3 space-y-2">
            {SCORING_OUTCOMES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gybs-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">5. Stakeholder Protection Notice</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            GYBS protects businesses, suppliers, partners, and opportunities by ensuring only qualified and validated
            entities enter the Misconi USA ecosystem.
          </p>

          <h4 className="mt-6 text-lg font-semibold text-gybs-ink">Protection Measures</h4>
          <ul className="mt-3 space-y-2">
            {PROTECTION_MEASURES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-gybs-body">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gybs-blue" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">6. Intellectual Property Notice</h3>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            GetYourBusinessScore.com™, its scoring engine, intake logic, readiness doctrine, and operational
            architecture are protected intellectual property of Misconi USA LLC.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gybs-body">
            Any attempt to alter, simplify, or replicate the governed system without authorization is strictly
            prohibited.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-gybs-border bg-white p-6 md:p-8">
          <h3 className="text-xl font-bold text-gybs-ink">7. Contact Information</h3>
          <div className="mt-4 space-y-1 text-base leading-relaxed text-gybs-body">
            <p>Misconi USA LLC</p>
            <p>Knoxville, Tennessee</p>
            <p>
              Support:{' '}
              <a href="mailto:support@misconiusa.com" className="font-medium text-gybs-blue hover:text-gybs-navy">
                support@misconiusa.com
              </a>
            </p>
          </div>
        </div>
      </DoctrineContent>
    </DoctrinePage>
  );
}

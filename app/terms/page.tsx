import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { DoctrineContent, DoctrinePage } from '@/components/doctrine/DoctrinePage';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Terms and Conditions for Get Your Business Score (GYBS), a Misconi USA readiness system.',
};

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

export default function TermsPage() {
  return (
    <DoctrinePage showBanner={false}>
      <DoctrineContent narrow>
        <h1 className="text-display-h1-sm text-gybs-ink md:text-display-h1">
          GYBS Terms and Conditions
        </h1>
        <p className="mt-3 text-base text-gybs-muted">
          Get Your Business Score | A Misconi USA Readiness System
        </p>

        <Section title="1. Agreement and Service Overview">
          <p>
            Get Your Business Score (GYBS) is a Misconi USA readiness system that helps business
            owners identify gaps, understand readiness, and prepare for opportunities they want to
            pursue. By using GYBS pages, submitting an assessment or intake, booking an appointment,
            receiving a report, or purchasing a GYBS service, you agree to these Terms and
            Conditions.
          </p>
          <p>
            GYBS may help identify business needs, provide preliminary and, when applicable,
            verified readiness information, explain areas to strengthen, and offer self guided,
            assisted, specialist, or managed preparation pathways when available. GYBS may recommend
            third party products, professionals, platforms, or services that could address an
            identified need.
          </p>
        </Section>

        <Section title="2. No Guarantee of Outside Outcomes">
          <p>
            GYBS provides readiness evaluation and preparation support. It does not guarantee
            funding, contracts, procurement awards, customers, certification, supplier acceptance,
            distribution access, approvals, or any other third party outcome. A score or readiness
            status is not an approval from a lender, government agency, buyer, customer, certifying
            body, supplier, or other outside organization. Outside organizations set their own
            requirements and make their own decisions.
          </p>
        </Section>

        <Section title="3. Customer Information and Assessment Results">
          <p>
            You agree to provide complete and accurate information to the best of your knowledge.
            Results and recommendations depend on the information and documents you provide. Missing,
            outdated, or incorrect information may affect your score, interpretation, and
            recommendations. If important information or business conditions change, your score,
            readiness status, or preparation plan may also change.
          </p>
          <p>
            An initial assessment result is based on submitted answers and may be preliminary. Some
            readiness decisions require documents, supporting information, or additional review
            before they can be confirmed. A preliminary result is not verified readiness. A verified
            readiness result is issued only after the required review and supporting evidence have
            been completed. Results should be interpreted in the context of the assessment and
            scoring version used at that time.
          </p>
        </Section>

        <Section title="4. Assessment Acknowledgement">
          <p>Before submitting an assessment, you should acknowledge:</p>
          <blockquote className="border-l-4 border-gybs-blue/40 bg-gybs-light px-4 py-3 italic text-gybs-ink">
            &ldquo;I understand that my GYBS assessment is a readiness evaluation based on the
            information I provide and that my results do not guarantee any third party approval or
            opportunity.&rdquo;
          </blockquote>
        </Section>

        <Section title="5. Recommendations and Third Party Providers">
          <p>
            GYBS recommendations are based on the information available, identified gaps, and your
            stated goal. Recommendations should address an actual need and should not duplicate work
            you have already completed and can verify. A recommendation of a third party product,
            platform, specialist, affiliate, or partner is informational and is not a guarantee of
            quality, approval, availability, pricing, performance, or outcome. You decide whether to
            use a third party provider and are responsible for reviewing that provider&apos;s terms
            and costs.
          </p>
        </Section>

        <Section title="6. Purchases, Scope, and Service Period">
          <p>
            A purchase covers the package, time period, meetings, support limits, and deliverables
            described in the offer or checkout page shown at purchase. Unless the offer clearly
            states otherwise, each purchase applies to one business. Work for another business
            requires a separate assessment, purchase, approved upgrade, or written scope.
          </p>
          <p>
            GYBS packages may use a 30, 60, or 90 day preparation window as shown in the offer.
            Unless the offer states otherwise, the service period begins when payment is confirmed
            and required onboarding information is received, with activation targeted within 2
            business days. If customer information, documents, approvals, or meetings are delayed,
            the timeline may pause or shift until the required item is received.
          </p>
          <p>
            You are responsible for providing requested information and documents on time, attending
            or rescheduling required meetings, reviewing items requiring your approval, paying
            outside costs not included in the package, and making final business decisions. You
            should verify information before using it with outside organizations.
          </p>
        </Section>

        <Section title="7. Exclusions and Additional Work">
          <p>
            Unless expressly included in the purchased scope, a package does not include unlimited
            consulting, unlimited revisions, work for multiple businesses, third party fees,
            government fees, platform subscriptions, legal representation, accounting services, loan
            approval, contract awards, certification approval, or other additional work.
          </p>
          <p>
            If new needs are identified outside the package, GYBS may recommend an upgrade or provide
            a separate quote. Additional work requires your approval. Outside products, platforms,
            filing fees, certifications, specialists, and other third party costs are separate unless
            the offer clearly states they are included.
          </p>
        </Section>

        <Section title="8. Payment Terms">
          <p>
            GYBS may offer one time payment or an approved installment plan for eligible offers. The
            checkout page should show the total price and available payment structure before payment
            is authorized. If you select installments, you authorize the payment processor to charge
            the approved payment method according to the schedule shown at checkout. An installment
            plan is not an unlimited subscription unless the offer clearly says it is recurring.
          </p>
          <p>
            If a scheduled payment fails, GYBS or the payment processor may notify you and may retry
            the payment according to checkout settings. You should correct the payment method within
            5 calendar days of the failure notice. If payment remains unpaid after that period, GYBS
            may pause work, meetings, deliverables, or access tied to the unpaid portion. A payment
            pause does not automatically extend the preparation period unless GYBS confirms a revised
            timeline. Payment processors may issue receipts, and GYBS or Misconi USA may retain
            transaction and service records for billing, accounting, refunds, support, and
            recordkeeping.
          </p>
        </Section>

        <Section title="9. Refunds, Cancellations, and Rescheduling">
          <p>
            The final refund, cancellation, and rescheduling rules must be displayed or linked before
            purchase or booking. The draft policy provides a 7 calendar day refund request window. If
            service has not started and no outside costs have been committed, an eligible purchase may
            be refunded in full. If work has started, an approved refund may be reduced by completed
            work, used meetings, delivered items, and non refundable third party costs. Requests after
            7 calendar days are generally not eligible unless required by law or approved by
            Management.
          </p>
          <p>
            A complete refund request is targeted for review within 5 business days. Approved refunds
            are normally initiated within 5 business days after approval. Card refunds may take 5 to
            10 business days to appear, depending on the processor, bank, or card issuer.
          </p>
          <p>
            Appointments should be cancelled or rescheduled at least 24 hours in advance. Late
            cancellations or changes may count as a used meeting or be subject to the applicable offer
            terms. A no show may count as a used meeting unless an exception is approved. Repeated
            rescheduling that prevents progress may require a new scheduling plan or affect the
            service timeline. Third party charges, filing fees, subscriptions, processing fees, and
            other outside costs may be non refundable once paid to the provider.
          </p>
          <p className="font-medium text-gybs-ink">
            Important: Management must approve the final refund window, cancellation deadline,
            rescheduling limit, no show treatment, and treatment of non refundable work or fees before
            this policy is published.
          </p>
        </Section>

        <Section title="10. Changes and Availability">
          <p>
            GYBS may improve assessments, reports, offers, tools, and service processes over time. The
            applicable terms, policy, assessment, or offer in effect when you use or purchase the
            service will apply, unless an updated version must apply by law or is accepted by you.
          </p>
        </Section>

        <Section title="11. Accessibility">
          <p>
            GYBS aims to make public information, assessments, forms, and customer communications
            usable by as many people as reasonably possible. It works to improve readability,
            navigation, form labels, contrast, keyboard use, and other accessibility features. If you
            encounter an access barrier, contact GYBS Support and describe the page or function and
            the barrier. GYBS aims to acknowledge accessibility requests within 2 business days and,
            when reasonably possible, provide an alternate format or practical workaround within 5
            business days. Complex fixes may take longer, with a status update when needed.
          </p>
        </Section>

        <Section title="12. Contact and Support">
          <p>
            Contact GYBS Support for assessment or score questions, information corrections,
            appointment help, package or purchase questions, payment or refund questions, privacy
            requests, accessibility issues, technical problems, or other support. Include your name,
            business name, preferred contact method, and relevant assessment, appointment, purchase,
            or report reference when available. Do not send passwords or full payment card
            information.
          </p>
          <p>
            Management must insert approved support email, form, or phone details before publication.
            GYBS aims to acknowledge support requests within 2 business days and provide a response or
            status update for routine requests within 5 business days. Requests requiring document
            review, payment research, privacy verification, or management approval may take longer.
          </p>
          <p>
            Current support contact:{' '}
            <a
              href="mailto:support@getyourbusinessscore.com"
              className="font-medium text-gybs-blue hover:text-gybs-navy"
            >
              support@getyourbusinessscore.com
            </a>
          </p>
        </Section>

        <Section title="13. Policy Links and Customer Acknowledgement">
          <p>
            Before submitting an assessment, customers should be shown the Assessment Disclaimer and{' '}
            <Link href="/privacy" className="font-medium text-gybs-blue hover:text-gybs-navy">
              Privacy Policy
            </Link>
            . Before purchasing, customers should be able to review the package scope, Conditions of
            Sale, Refund and Cancellation Policy, Payment Terms, and these Terms and Conditions.
            Suggested purchase acknowledgement:
          </p>
          <blockquote className="border-l-4 border-gybs-blue/40 bg-gybs-light px-4 py-3 italic text-gybs-ink">
            &ldquo;I have reviewed and agree to the applicable GYBS purchase terms and policies.&rdquo;
          </blockquote>
          <p>
            The customer should be informed that purchasing provides readiness preparation and the
            deliverables described in the offer, not a guaranteed outside result.
          </p>
        </Section>

        <p className="mt-10 pb-16 text-sm text-gybs-muted">
          Related:{' '}
          <Link href="/privacy" className="font-medium text-gybs-blue hover:text-gybs-navy">
            Privacy Policy
          </Link>
        </p>
      </DoctrineContent>
    </DoctrinePage>
  );
}

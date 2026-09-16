import styles from "@/styles/home.module.css";

interface Tier {
  wrapClass: string;
  level: string;
  title: string;
  price: string;
  mandate: string;
  gate: string;
  scope: string[];
  deliverables: string[];
  result: string;
  ctaLabel: string;
  boundary: string;
}

const TIERS: Tier[] = [
  {
    wrapClass: styles.pkgFoundation,
    level: "Readiness Tier 1",
    title: "Foundation",
    price: "$497",
    mandate: "Mandate: Establish the business.",
    gate: "Is the business properly established to operate and advance?",
    scope: [
      "Legal identity and formation baseline",
      "Core business records and documentation",
      "Licensing, insurance, and compliance review",
      "Operating structure and record controls",
      "Starter visibility readiness",
    ],
    deliverables: [
      "Foundation DIY Readiness Guide",
      "Foundation Readiness Baseline",
      "Critical and non-critical Gap Register",
      "30/60/90 Preparation Record",
      "Foundation Completion Report",
    ],
    result: "Documented completed actions, unresolved gaps, and an approved next-step recommendation.",
    ctaLabel: "Begin Foundation Preparation",
    boundary: "Does not verify delivery capability or qualify the business for a specific opportunity.",
  },
  {
    wrapClass: styles.pkgCapability,
    level: "Readiness Tier 2",
    title: "Capability",
    price: "$997",
    mandate: "Mandate: Demonstrate the capability.",
    gate: "Can the business consistently perform what it represents?",
    scope: [
      "Delivery model and operating-capacity review",
      "Procedures, controls, and documentation",
      "Quality, consistency, and risk management",
      "Performance claims and capability evidence",
      "Capability limitations and gap controls",
    ],
    deliverables: [
      "Capability DIY Readiness Guide",
      "Business Capability Map",
      "Capability Evidence Register",
      "Critical and non-critical Gap Record",
      "Capability Review Report",
    ],
    result:
      "Documented capability findings, verified supporting evidence, limitations, and an approved next-step recommendation.",
    ctaLabel: "Begin Capability Preparation",
    boundary:
      "Does not automatically qualify the business for funding, contracting, supplier, distribution, or visibility opportunities.",
  },
  {
    wrapClass: styles.pkgOpportunity,
    level: "Readiness Tier 3",
    title: "Opportunity Preparation",
    price: "$1,997",
    mandate: "Mandate: Prepare verified capability for a defined opportunity.",
    gate: "Does the verified business meet the requirements of this opportunity?",
    scope: [
      "Defined opportunity and source preservation",
      "Requirement-to-capability comparison",
      "Opportunity-specific gap preparation",
      "Compliance and representation controls",
      "Readiness or application-file assembly",
    ],
    deliverables: [
      "Opportunity Preparation DIY Guide",
      "Opportunity Requirement Matrix",
      "Verified Capability Comparison",
      "Opportunity Readiness File",
      "Controlled Preparation Decision",
    ],
    result: "Qualified, conditional, hold, or not-ready decision. Opportunity routing requires separate authorization.",
    ctaLabel: "Begin Opportunity Preparation",
    boundary: "Opportunity Ready is an earned, verified status. It is not automatically included with purchase.",
  },
];

export function Packages() {
  return (
    <section className={`${styles.section} ${styles.packages}`} id="packages">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>GYBS Business Readiness Preparation</p>
          <h2>Establish. Demonstrate. Prepare.</h2>
          <p>
            Three governed 90-day engagements designed to establish the business, document its capability, and
            prepare verified capability for a defined opportunity.
          </p>
        </div>

        <div className={styles.pkgGrid}>
          {TIERS.map((tier) => (
            <article className={`${styles.pkg} ${tier.wrapClass}`} key={tier.title}>
              <header className={styles.pkgTop}>
                <p className={styles.pkgLevel}>{tier.level}</p>
                <h3 className={styles.pkgTitle}>{tier.title}</h3>
                <div className={styles.pkgPriceRow}>
                  <span className={styles.pkgPrice}>{tier.price}</span>
                  <span className={styles.pkgPeriod}>90-Day Readiness Engagement</span>
                </div>
              </header>
              <div className={styles.pkgBody}>
                <p className={styles.pkgMandate}>{tier.mandate}</p>
                <p className={styles.pkgGate}>
                  <strong>Readiness gate:</strong> {tier.gate}
                </p>
                <p className={styles.pkgLabel}>Controlled scope</p>
                <ul className={styles.pkgScope}>
                  {tier.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.pkgLabel}>Controlled deliverables</p>
                <ul className={styles.pkgDeliv}>
                  {tier.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.pkgResult}>
                  <strong>Completion result:</strong> {tier.result}
                </p>
                <div className={styles.pkgAction}>
                  <a className={styles.pkgBtn} href="#assessment">
                    {tier.ctaLabel}
                  </a>
                  <p className={styles.pkgBoundary}>
                    <strong>Boundary:</strong> {tier.boundary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

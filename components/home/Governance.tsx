import styles from "@/styles/home.module.css";

export function Governance() {
  return (
    <section className={styles.governance}>
      <div className={styles.wrap}>
        <div className={styles.govBox}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p>
            <strong>GYBS governing standard.</strong> Each purchase applies to one business and the approved
            package scope, and includes the applicable tier-specific DIY Guide. Completion does not guarantee
            funding, contracts, certifications, referrals, opportunity approval, or Opportunity Ready status.
            Optional add-ons are not included in the advertised package price; they are available upon request
            and must be separately scoped, quoted, and approved. External products, providers, and services are
            recommendations unless expressly included in writing.
          </p>
        </div>
      </div>
    </section>
  );
}

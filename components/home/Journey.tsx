import styles from "@/styles/home.module.css";

export function Journey() {
  return (
    <section className={`${styles.section} ${styles.journey}`}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>How Your Readiness Journey Begins</p>
          <h2>Three steps to your first honest look</h2>
        </div>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepBadge}>1</div>
            <h4>Complete the Initial Assessment</h4>
            <p>Answer a short set of questions about your business — it takes about ten minutes.</p>
            <svg className={styles.stepArrow} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M0 10h90M80 3l10 7-10 7" />
            </svg>
          </div>
          <div className={styles.step}>
            <div className={styles.stepBadge}>2</div>
            <h4>Receive Your Preliminary Score</h4>
            <p>Get an initial readiness view based on your responses, plus your top gap areas.</p>
            <svg className={styles.stepArrow} viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M0 10h90M80 3l10 7-10 7" />
            </svg>
          </div>
          <div className={styles.step}>
            <div className={styles.stepBadge}>3</div>
            <h4>Continue to Verification</h4>
            <p>Move into GYBS verification and preparation with a pathway built for what you actually need.</p>
          </div>
        </div>
        <p className={styles.journeyFoot}>
          Initial results are based on self-reported information. A Verified Readiness Score requires GYBS review
          and supporting documentation.
        </p>
      </div>
    </section>
  );
}

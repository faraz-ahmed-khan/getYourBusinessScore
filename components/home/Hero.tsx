import { Button } from "@/components/Button";
import styles from "@/styles/home.module.css";

export function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={`${styles.wrap} ${styles.heroGrid}`}>
        <div>
          <p className={styles.eyebrow}>Your Business Readiness Assessment</p>
          <h1>See Where Your Business Stands</h1>
          <p className={styles.lede}>
            Opportunities don&apos;t wait for a business to get ready — they&apos;re won by the businesses that
            already are. Understand your readiness, identify your gaps, and get a clear next preparation pathway
            in under ten minutes.
          </p>
          <div className={styles.ctaRow}>
            <Button href="#assessment" variant="primary" size="lg">
              Start Your Business Readiness Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Button>
          </div>
          <p className={styles.microcopy}>
            <strong>About ten minutes.</strong> A clear, honest look at where your business stands today — before
            an opportunity asks the question for you.
          </p>
        </div>

        <div className={styles.scoreCard} aria-label="Sample preliminary readiness score">
          <p className={`${styles.eyebrow} ${styles.kicker}`}>Sample Preliminary Readiness Score</p>
          <h3>Preliminary Readiness Score</h3>
          <div className={styles.gaugeWrap}>
            <svg width="220" height="130" viewBox="0 0 220 130">
              <path d="M20 110 A90 90 0 0 1 74 30" fill="none" stroke="#a51c2c" strokeWidth="16" strokeLinecap="round" />
              <path d="M80 26 A90 90 0 0 1 140 26" fill="none" stroke="#c9962c" strokeWidth="16" strokeLinecap="round" />
              <path d="M146 30 A90 90 0 0 1 200 110" fill="none" stroke="#2e7b55" strokeWidth="16" strokeLinecap="round" />
            </svg>
            <div className={styles.gaugeNum}>
              78<span>/100</span>
            </div>
          </div>
          <p className={styles.foot}>
            <strong>Based on self-reported information</strong>
            Verification required for the Verified Readiness Score.
          </p>
        </div>
      </div>
    </section>
  );
}

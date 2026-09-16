import { Button } from "@/components/Button";
import styles from "@/styles/home.module.css";

export function FinalCta() {
  return (
    <section className={`${styles.section} ${styles.finalCta}`}>
      <div className={styles.wrap}>
        <p className={styles.eyebrow}>Take The Next Step</p>
        <h2>Ready to see where your business stands?</h2>
        <p>
          Gain clarity. Identify opportunities. Build a stronger tomorrow. The businesses that get chosen are the
          ones that were already ready.
        </p>
        <Button href="#assessment" variant="primary" size="lg" className={styles.finalCtaBtn}>
          Start Your Business Readiness Assessment
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Button>
      </div>
    </section>
  );
}

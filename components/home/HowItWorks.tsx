import styles from "@/styles/home.module.css";

export function HowItWorks() {
  return (
    <section className={`${styles.section} ${styles.understand}`} id="how-it-works">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>What Your Preliminary Readiness Results Help You Understand</p>
          <h2>Clarity before opportunity — not after</h2>
        </div>
        <div className={styles.uGrid}>
          <div className={styles.uItem}>
            <div className={styles.uIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#17365d" strokeWidth="2">
                <path d="M4 20V10M11 20V4M18 20v-7" />
              </svg>
            </div>
            <h4>Your Starting Point</h4>
            <p>See where your business may currently stand across the areas buyers, lenders, and partners evaluate first.</p>
          </div>
          <div className={styles.uItem}>
            <div className={styles.uIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#17365d" strokeWidth="2">
                <circle cx="10" cy="10" r="7" />
                <path d="M21 21l-6-6" />
              </svg>
            </div>
            <h4>Your Priority Gaps</h4>
            <p>See what&apos;s holding your business back and exactly where your attention will make the biggest difference.</p>
          </div>
          <div className={styles.uItem}>
            <div className={styles.uIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#17365d" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
              </svg>
            </div>
            <h4>Your Next Step</h4>
            <p>Get guidance on the right preparation pathway for your business, so effort goes where it counts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

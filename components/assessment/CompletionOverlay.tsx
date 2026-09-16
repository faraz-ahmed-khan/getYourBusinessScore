import styles from "@/styles/assessment.module.css";

export function CompletionOverlay({ show }: { show: boolean }) {
  return (
    <div className={`${styles.overlay} ${show ? styles.show : ""}`}>
      <svg className={styles.ring} viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="27" />
        <circle className={styles.arc} cx="32" cy="32" r="27" strokeDasharray="90 200" />
      </svg>
      <h3>Calculating your Business Score…</h3>
      <p>Scoring all six readiness categories.</p>
    </div>
  );
}

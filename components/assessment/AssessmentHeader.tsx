import { Logo } from "@/components/Logo";
import { Lead } from "@/lib/types";
import styles from "@/styles/assessment.module.css";

export function AssessmentHeader({ lead }: { lead: Lead | null }) {
  const name = lead?.businessName || (lead?.firstName ? `${lead.firstName} ${lead.lastName ?? ""}`.trim() : "");

  return (
    <header className={styles.site}>
      <div className={styles.siteBar}>
        <a className={styles.brand} href="/">
          <Logo width={30} height={35} />
          <span className={styles.brandCopy}>
            <span className={styles.gybs}>GYBS</span>
            <br />
            <span className={styles.tag}>Business Readiness Assessment</span>
          </span>
        </a>
        <div className={styles.headerNote}>
          {name && <strong>{name}</strong>}
          Your progress is saved automatically
        </div>
      </div>
    </header>
  );
}

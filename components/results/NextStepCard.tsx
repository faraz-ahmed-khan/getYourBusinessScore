import { Band } from "@/lib/types";
import { consultationHref } from "@/lib/site-urls";
import { Button } from "@/components/Button";
import styles from "@/styles/results.module.css";

export function NextStepCard({ band }: { band: Band }) {
  return (
    <div className={styles.nextCard}>
      <p className={styles.nextTier}>{band.nextTier}</p>
      <h3 className={styles.nextHeadline}>{band.nextHeadline}</h3>
      <p className={styles.nextBody}>{band.nextBody}</p>
      <div className={styles.nextActions}>
        <Button href={consultationHref()} variant="primary">
          Book Your Consultation
        </Button>
        <Button href="/#packages" variant="outlineLight">
          Compare All Tiers
        </Button>
      </div>
    </div>
  );
}

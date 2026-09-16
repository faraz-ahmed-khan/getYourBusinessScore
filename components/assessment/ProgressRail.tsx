import { Category } from "@/lib/types";
import styles from "@/styles/assessment.module.css";

interface Props {
  categories: Category[];
  currentIndex: number;
  isCategoryComplete: (index: number) => boolean;
  answeredTotal: number;
  totalQuestions: number;
}

export function ProgressRail({ categories, currentIndex, isCategoryComplete, answeredTotal, totalQuestions }: Props) {
  const pct = Math.round((answeredTotal / totalQuestions) * 100);

  return (
    <div className={styles.progressBand}>
      <div className={styles.progressInner}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <div className={styles.rail}>
          {categories.map((cat, i) => {
            const done = isCategoryComplete(i) && i !== currentIndex;
            const active = i === currentIndex;
            const stepClass = [styles.railStep, active ? styles.active : "", done ? styles.done : ""]
              .filter(Boolean)
              .join(" ");
            return (
              <div className={stepClass} key={cat.name}>
                <div className={styles.railDot}>{done ? "\u2713" : i + 1}</div>
                <div className={styles.railLbl}>{cat.short}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

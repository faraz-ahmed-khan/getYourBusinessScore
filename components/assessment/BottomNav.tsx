import { Button } from "@/components/Button";
import styles from "@/styles/assessment.module.css";

interface Props {
  canGoBack: boolean;
  onBack: () => void;
  onNext: () => void;
  answeredTotal: number;
  totalQuestions: number;
  nextLabel: string;
}

export function BottomNav({ canGoBack, onBack, onNext, answeredTotal, totalQuestions, nextLabel }: Props) {
  return (
    <nav className={styles.assessNav}>
      <div className={styles.assessNavInner}>
        <Button variant="outlineLight" onClick={onBack} style={{ visibility: canGoBack ? "visible" : "hidden" }}>
          ← Back
        </Button>
        <div className={styles.anProgress}>
          <strong>{answeredTotal}</strong> / {totalQuestions} answered
        </div>
        <div className={styles.anBtns}>
          <Button variant="primary" onClick={onNext}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </nav>
  );
}

import { Question } from "@/lib/types";
import styles from "@/styles/assessment.module.css";

interface Props {
  question: Question;
  totalQuestions: number;
  selectedValue: number | undefined;
  flagged: boolean;
  delayMs: number;
  onSelect: (questionNum: number, pts: number) => void;
}

export function QuestionCard({ question, totalQuestions, selectedValue, flagged, delayMs, onSelect }: Props) {
  const gridClass = question.options.length === 2 ? styles.optGrid2 : styles.optGrid3;
  const answered = selectedValue !== undefined;
  const cardClass = [styles.qCard, answered ? styles.answered : "", flagged ? styles.flagged : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} style={{ animationDelay: `${delayMs}ms` }} id={`q-${question.num}`}>
      <div className={styles.qHead}>
        <span className={styles.qNum}>
          Q{question.num}
          <span className={styles.qTotal}>/{totalQuestions}</span>
        </span>
        <p className={styles.qText}>{question.text}</p>
      </div>
      <div className={`${styles.optGrid} ${gridClass}`}>
        {question.options.map((opt) => {
          const selected = selectedValue === opt.pts;
          return (
            <button
              type="button"
              key={opt.label}
              className={`${styles.optBtn} ${selected ? styles.selected : ""}`}
              onClick={() => onSelect(question.num, opt.pts)}
            >
              <span className={styles.optLabel}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import { Category } from "@/lib/types";
import styles from "@/styles/assessment.module.css";

interface Props {
  category: Category;
  index: number;
  totalCategories: number;
  totalQuestions: number;
}

export function CategoryHead({ category, index, totalCategories, totalQuestions }: Props) {
  return (
    <section className={styles.catHead}>
      <div className={styles.wrap}>
        <div className={styles.catHeadInner}>
          <div className={styles.catIcon} dangerouslySetInnerHTML={{ __html: category.icon }} />
          <div>
            <p className={styles.catEyebrow}>
              Section {index + 1} of {totalCategories}
            </p>
            <h1 className={styles.catTitle}>{category.name}</h1>
            <p className={styles.catDesc}>{category.desc}</p>
            <p className={styles.catCount}>
              Questions {category.startNum}–{category.endNum} of {totalQuestions}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

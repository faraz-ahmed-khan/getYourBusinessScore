import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import styles from "@/styles/results.module.css";

export function ResultsHeader() {
  return (
    <header className={styles.site}>
      <div className={styles.siteBar}>
        <a className={styles.brand} href="/">
          <span className={styles.brandLogo}>
            <Logo width={160} height={46} priority />
          </span>
        </a>
        <Button href="/#packages" variant="outlineLight">
          Explore Packages
        </Button>
      </div>
    </header>
  );
}

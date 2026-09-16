import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import styles from "@/styles/results.module.css";

export function ResultsHeader() {
  return (
    <header className={styles.site}>
      <div className={styles.siteBar}>
        <a className={styles.brand} href="/">
          <Logo width={30} height={35} />
          <span className={styles.brandCopy}>
            <span className={styles.gybs}>GYBS</span>
            <br />
            <span className={styles.tag}>Your Readiness Score</span>
          </span>
        </a>
        <Button href="/#packages" variant="outlineLight">
          Explore Packages
        </Button>
      </div>
    </header>
  );
}

import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import styles from "@/styles/home.module.css";

export function SiteHeader() {
  return (
    <header className={styles.site}>
      <div className={styles.siteBar}>
        <a className={styles.brand} href="#top">
          <Logo width={38} height={44} />
          <span className={styles.brandCopy}>
            <span className={styles.gybs}>GYBS</span>
            <br />
            <span className={styles.tag}>A Misconi USA Readiness System</span>
          </span>
        </a>
        <nav className={styles.mainNav} aria-label="Primary">
          <a href="#how-it-works">How It Works</a>
          <a href="#about-ceo">About GYBS</a>
          <a href="#packages">Packages</a>
        </nav>
        <Button href="#assessment" variant="primary">
          Start Assessment
        </Button>
      </div>
    </header>
  );
}

import { Logo } from "@/components/Logo";
import styles from "@/styles/home.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.site}>
      <div className={styles.wrap}>
        <div className={styles.footRow}>
          <div className={styles.footBrand}>
            <Logo width={24} height={28} />
            <span className={styles.gybs}>GYBS</span>
          </div>
          <div className={styles.footLinks}>
            <a href="#how-it-works">How It Works</a>
            <a href="#about-ceo">About GYBS</a>
            <a href="#packages">Packages</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <p className={styles.footLegal}>
          GYBS — Get Your Business Score is a Misconi USA Readiness System. GYBS evaluates and prepares; it does
          not guarantee or approve third-party funding, contracting, or opportunity outcomes. The Initial Intent
          Score is preliminary and self-reported. A Verified Readiness Score requires GYBS review and supporting
          documentation. &copy; Misconi USA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

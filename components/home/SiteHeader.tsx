import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import styles from "@/styles/home.module.css";

export function SiteHeader({ isHomePage = false }: { isHomePage?: boolean }) {
  const sectionHref = (section: string) => `${isHomePage ? '' : '/'}#${section}`;

  return (
    <header className={styles.site}>
      <div className={styles.siteBar}>
        <a className={styles.brand} href={sectionHref('top')}>
          <span className={styles.brandLogo}>
            <Logo width={190} height={54} priority />
          </span>
        </a>
        <nav className={styles.mainNav} aria-label="Primary">
          <a href={sectionHref('how-it-works')}>How It Works</a>
          <a href={sectionHref('about-ceo')}>About GYBS</a>
          <a href={sectionHref('packages')}>Packages</a>
        </nav>
        <Button href={sectionHref('assessment')} variant="primary">
          Start Assessment
        </Button>
      </div>
    </header>
  );
}

import Image from "next/image";
import styles from "@/styles/home.module.css";

export function Leadership() {
  return (
    <section className={styles.leader} id="about-ceo">
      <div className={styles.wrap}>
        <div className={styles.leaderPhoto}>
          <div className={styles.frame}>
            <Image
              src="/images/ceo-steven-mays.jpg"
              alt="Steven B. Mays, Jr., CEO of Misconi USA"
              width={640}
              height={800}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
          <span className={styles.tagChip}>Readiness is the Gate to Growth</span>
        </div>
        <div className={styles.leaderBody}>
          <p className={styles.eyebrow}>A Message From Leadership</p>
          <h2>Steven B. Mays, Jr.</h2>
          <p className={styles.role}>Founder &amp; CEO, Misconi USA — The Readiness Company</p>

          <p className={styles.leaderQuote}>
            &ldquo;Your Business Score will let you know if your business is ready for opportunity. Readiness is
            the Gate to Growth.&rdquo;
          </p>

          <p className={styles.bio}>
            Steven B. Mays, Jr. founded Misconi USA on a simple, hard-earned belief: businesses don&apos;t lose
            opportunities because they weren&apos;t good enough — they lose them because they weren&apos;t ready
            when the opportunity arrived. GYBS, the Get Your Business Score system, was built under his direction
            to close that gap: a governed, evidence-based way for a business owner to see exactly where they
            stand, what&apos;s missing, and what to do about it, before a funder, buyer, or agency ever asks the
            question.
          </p>

          <p className={styles.bio}>
            Under his leadership, Misconi USA holds every tier of the GYBS system — from the Preliminary Readiness
            Score to full opportunity preparation — to the same standard: honest measurement, controlled scope,
            and no promises the business hasn&apos;t actually earned. That discipline is the reason a GYBS score
            means something. It is not a guarantee of funding, contracts, or approval; it is a clear, defensible
            picture of where a business truly stands, so the next step is the right one.
          </p>

          <div className={styles.leaderSignoff}>
            <span className={styles.sig}>S. B. Mays, Jr.</span>
            <span className={styles.roleLine}>Founder &amp; CEO, Misconi USA</span>
          </div>
        </div>
      </div>
    </section>
  );
}

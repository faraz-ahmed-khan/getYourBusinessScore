'use client';

import { useState } from 'react';
import { PACKAGE_TIERS, type PackageTitle } from '@/lib/packages';
import { PackageInterestModal } from '@/components/home/PackageInterestModal';
import styles from '@/styles/home.module.css';

const WRAP: Record<(typeof PACKAGE_TIERS)[number]['wrapClassKey'], string> = {
  pkgFoundation: styles.pkgFoundation,
  pkgCapability: styles.pkgCapability,
  pkgOpportunity: styles.pkgOpportunity,
};

export function Packages() {
  const [open, setOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<PackageTitle | null>(null);
  const [selectedPrice, setSelectedPrice] = useState('');

  function openModal(title: PackageTitle, price: string) {
    setSelectedTitle(title);
    setSelectedPrice(price);
    setOpen(true);
  }

  return (
    <section className={`${styles.section} ${styles.packages}`} id="packages">
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>GYBS Business Readiness Preparation</p>
          <h2>Establish. Demonstrate. Prepare.</h2>
          <p>
            Three governed 90-day engagements designed to establish the business, document its capability, and
            prepare verified capability for a defined opportunity.
          </p>
        </div>

        <div className={styles.pkgGrid}>
          {PACKAGE_TIERS.map((tier) => (
            <article className={`${styles.pkg} ${WRAP[tier.wrapClassKey]}`} key={tier.title}>
              <header className={styles.pkgTop}>
                <p className={styles.pkgLevel}>{tier.level}</p>
                <h3 className={styles.pkgTitle}>{tier.title}</h3>
                <div className={styles.pkgPriceRow}>
                  <span className={styles.pkgPrice}>{tier.price}</span>
                  <span className={styles.pkgPeriod}>90-Day Readiness Engagement</span>
                </div>
              </header>
              <div className={styles.pkgBody}>
                <p className={styles.pkgMandate}>{tier.mandate}</p>
                <p className={styles.pkgGate}>
                  <strong>Readiness gate:</strong> {tier.gate}
                </p>
                <p className={styles.pkgLabel}>Controlled scope</p>
                <ul className={styles.pkgScope}>
                  {tier.scope.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.pkgLabel}>Controlled deliverables</p>
                <ul className={styles.pkgDeliv}>
                  {tier.deliverables.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.pkgResult}>
                  <strong>Completion result:</strong> {tier.result}
                </p>
                <div className={styles.pkgAction}>
                  <button
                    type="button"
                    className={styles.pkgBtn}
                    onClick={() => openModal(tier.title, tier.price)}
                  >
                    {tier.ctaLabel}
                  </button>
                  <p className={styles.pkgBoundary}>
                    <strong>Boundary:</strong> {tier.boundary}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <PackageInterestModal
        open={open}
        packageTitle={selectedTitle}
        packagePrice={selectedPrice}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}

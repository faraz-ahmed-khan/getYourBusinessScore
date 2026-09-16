"use client";

import { useEffect, useState } from "react";
import { CategoryResult } from "@/lib/types";
import { Tier } from "@/lib/scoring";
import styles from "@/styles/results.module.css";

const TIER_CLASS: Record<Tier, string> = {
  low: styles.tierLow,
  mid: styles.tierMid,
  high: styles.tierHigh,
};

const TIER_TAG: Record<Tier, string> = {
  low: "Priority Gap",
  mid: "In Progress",
  high: "Strength",
};

interface Props {
  result: CategoryResult;
  rank: number;
  tier: Tier;
  tip: string;
  delayMs: number;
}

export function CategoryRow({ result, rank, tier, tip, delayMs }: Props) {
  // Bar starts at 0% and animates to its real value shortly after mount,
  // so the CSS width transition actually has something to animate from.
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = window.setTimeout(() => setBarWidth(result.pct), 120 + delayMs);
    return () => window.clearTimeout(t);
  }, [result.pct, delayMs]);

  return (
    <div className={`${styles.catRow} ${TIER_CLASS[tier]}`} style={{ animationDelay: `${delayMs}ms` }}>
      <div className={styles.catTop}>
        <div className={styles.catRank}>{rank}</div>
        <div className={styles.catNameRow}>
          <span className={styles.catName}>{result.name}</span>
          <span className={styles.catScore}>
            {result.raw} / {result.max} pts &middot; {result.pct}%
          </span>
        </div>
        <span className={styles.catTag}>{TIER_TAG[tier]}</span>
      </div>
      <div className={styles.catTrack}>
        <div className={styles.catFill} style={{ width: `${barWidth}%` }} />
      </div>
      <p className={styles.catTip}>{tip}</p>
    </div>
  );
}

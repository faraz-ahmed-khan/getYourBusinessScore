"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/styles/results.module.css";

interface Props {
  score: number;
  color: string;
}

const RADIUS = 92;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreGauge({ score, color }: Props) {
  const [displayScore, setDisplayScore] = useState(0);
  const [offset, setOffset] = useState(CIRCUMFERENCE);
  const frame = useRef<number>();

  useEffect(() => {
    const duration = 1100;
    let start: number | null = null;

    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.round(score * eased));
      if (p < 1) frame.current = requestAnimationFrame(step);
    }
    frame.current = requestAnimationFrame(step);

    // Kick the arc fill on the next tick so the CSS transition animates from full circumference.
    const t = window.setTimeout(() => {
      setOffset(CIRCUMFERENCE * (1 - score / 100));
    }, 30);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.clearTimeout(t);
    };
  }, [score]);

  return (
    <div className={styles.gaugeWrap}>
      <svg viewBox="0 0 216 216">
        <circle className={styles.gaugeTrack} cx="108" cy="108" r={RADIUS} />
        <circle
          className={styles.gaugeFill}
          cx="108"
          cy="108"
          r={RADIUS}
          style={{ stroke: color, strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
        />
      </svg>
      <div className={styles.gaugeCenter}>
        <div className={styles.gaugeNum}>{displayScore}</div>
        <div className={styles.gaugeLbl}>out of 100</div>
      </div>
    </div>
  );
}

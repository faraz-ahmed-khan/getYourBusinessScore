"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { clearAnswers, saveLead } from "@/lib/storage";
import { GYBS_SCORE_RESULT_KEY } from "@/lib/pathways";
import styles from "@/styles/home.module.css";

export function AssessmentIntake() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // New intake always starts a fresh assessment (don't reuse prior answers).
    clearAnswers();
    try {
      sessionStorage.removeItem(GYBS_SCORE_RESULT_KEY);
    } catch {
      /* ignore */
    }
    saveLead({
      firstName: String(data.get("first_name") ?? ""),
      lastName: String(data.get("last_name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      businessName: String(data.get("business_name") ?? ""),
    });
    setSubmitting(true);
    router.push("/assessment");
  }

  return (
    <section className={styles.assess} id="assessment">
      <div className={styles.wrap}>
        <div className={styles.assessCopy}>
          <p className={styles.eyebrow}>Take The Next Step</p>
          <h2>Ready to see where your business stands?</h2>
          <p>
            Gain clarity. Identify your gaps. Build a stronger, more prepared business — starting today. It&apos;s
            fast, and it&apos;s the first honest, complete look most businesses never take until an opportunity is
            already on the line.
          </p>
          <ul className={styles.assessList}>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Your full readiness score, across all six categories
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Your top readiness gaps, explained
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              A recommended next preparation pathway
            </li>
          </ul>
        </div>

        <form className={styles.formCard} aria-labelledby="assessment-heading" onSubmit={handleSubmit}>
          <h3 id="assessment-heading">Begin your assessment</h3>
          <p className={styles.sub}>Takes about 10 minutes. Your results are private and self-reported.</p>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="fname">First name</label>
              <input id="fname" name="first_name" type="text" autoComplete="given-name" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="lname">Last name</label>
              <input id="lname" name="last_name" type="text" autoComplete="family-name" required />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className={styles.field}>
              <label htmlFor="bizname">Business name</label>
              <input id="bizname" name="business_name" type="text" required />
            </div>
          </div>

          <label className={styles.consent}>
            <input type="checkbox" name="consent" required />I agree to receive my Initial Intent Score and related
            communications from Misconi USA. This score is preliminary and self-reported — it is separate from,
            and not a substitute for, the Verified Readiness Score.
          </label>

          <Button variant="primary" className={styles.formSubmit} type="submit" disabled={submitting}>
            {submitting ? "Starting…" : "Start My Business Readiness Assessment"}
          </Button>
          <p className={styles.formNote}>Your information is private and never sold.</p>
        </form>
      </div>
    </section>
  );
}

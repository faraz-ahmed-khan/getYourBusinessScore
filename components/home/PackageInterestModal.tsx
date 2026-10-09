'use client';

import { FormEvent, useEffect, useId, useRef, useState } from 'react';
import { Button } from '@/components/Button';
import type { PackageTitle } from '@/lib/packages';
import styles from '@/styles/home.module.css';

type PackageInterestModalProps = {
  open: boolean;
  packageTitle: PackageTitle | null;
  packagePrice: string;
  onClose: () => void;
};

export function PackageInterestModal({
  open,
  packageTitle,
  packagePrice,
  onClose,
}: PackageInterestModalProps) {
  const titleId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setSubmitting(false);
      setError(null);
      setDone(false);
      return;
    }
    const t = window.setTimeout(() => nameRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, submitting]);

  if (!open || !packageTitle) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/packages/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          phone: String(data.get('phone') ?? ''),
          packageTitle,
          packagePrice,
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
        errors?: string[];
      };
      if (!res.ok || !json.success) {
        throw new Error(
          (Array.isArray(json.errors) && json.errors.join(', ')) ||
            json.error ||
            'Could not save your details. Please try again.'
        );
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className={styles.pkgModalOverlay}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div
        className={styles.pkgModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          type="button"
          className={styles.pkgModalClose}
          onClick={onClose}
          disabled={submitting}
          aria-label="Close"
        >
          ×
        </button>

        {done ? (
          <div className={styles.pkgModalSuccess}>
            <h2 id={titleId}>{packageTitle}</h2>
            <p>
              Thank you. Your interest in the <strong>{packageTitle}</strong> package was received.
              We will follow up by email shortly.
            </p>
            <Button type="button" variant="primary" className={styles.formSubmit} onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 id={titleId}>{packageTitle}</h2>
            <p className={styles.pkgModalSub}>
              {packagePrice} · 90-Day Readiness Engagement. Share your details and we will follow up.
            </p>

            <div className={styles.field}>
              <label htmlFor="pkg-name">Name</label>
              <input
                ref={nameRef}
                id="pkg-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="pkg-email">Email</label>
              <input
                id="pkg-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={submitting}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="pkg-phone">Phone number</label>
              <input
                id="pkg-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                disabled={submitting}
              />
            </div>

            {error && <p className={styles.pkgModalError}>{error}</p>}

            <Button
              type="submit"
              variant="primary"
              className={styles.formSubmit}
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Submit interest'}
            </Button>
            <p className={styles.formNote}>Your information is private and never sold.</p>
          </form>
        )}
      </div>
    </div>
  );
}

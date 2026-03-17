/**
 * Simple formatters for display (e.g., score, dates).
 */

export function formatScore(score: number): string {
  return `${Math.round(score)}`;
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

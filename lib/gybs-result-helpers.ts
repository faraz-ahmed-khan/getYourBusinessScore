import type { ScoreBreakdown } from '@/lib/scoring-engine';

export interface StoredScoreResult extends ScoreBreakdown {
  pathwayId: string;
  pathwayBadge: string;
  corrections: string[];
  upgradeSteps: { label: string; done: boolean }[];
}

export function buildResultPayload(
  breakdown: ScoreBreakdown,
  pathwayId: string,
  pathwayBadge: string
): StoredScoreResult {
  const corrections = deriveCorrections(breakdown);
  const upgradeSteps = deriveUpgradeSteps(breakdown.level);
  return {
    ...breakdown,
    pathwayId,
    pathwayBadge,
    corrections,
    upgradeSteps,
  };
}

function deriveCorrections(b: ScoreBreakdown): string[] {
  const items: string[] = [];
  if (b.operationalScore < 50) {
    items.push('Strengthen operational foundations: EIN, dedicated business banking, bookkeeping, and financial statements.');
  }
  if (b.catalogScore < 50) {
    items.push('Clarify your offers: defined products/services, pricing, and written descriptions.');
  }
  if (b.relationshipScore < 50) {
    items.push('Grow market proof: paying customers, repeat business, and formal partner relationships.');
  }
  if (items.length === 0) {
    items.push('Maintain documentation and keep financial records current to preserve your readiness position.');
  }
  return items;
}

function deriveUpgradeSteps(level: 1 | 2 | 3): { label: string; done: boolean }[] {
  if (level === 1) {
    return [
      { label: 'Complete core operational documentation (EIN, banking, bookkeeping).', done: false },
      { label: 'Define offers with pricing and written descriptions.', done: false },
      { label: 'Document customer and partner relationships.', done: false },
      { label: 'Re-score after improvements to move to Guided Lane.', done: false },
    ];
  }
  if (level === 2) {
    return [
      { label: 'Operational baseline established.', done: true },
      { label: 'Expand catalog clarity and proof of traction.', done: false },
      { label: 'Formalize partnerships and repeat revenue signals.', done: false },
      { label: 'Target Opportunity Lane with full documentation pack.', done: false },
    ];
  }
  return [
    { label: 'Operational readiness on track.', done: true },
    { label: 'Catalog and offers documented.', done: true },
    { label: 'Market and partner relationships evidenced.', done: true },
    { label: 'Subscribe to unlock routing and opportunity eligibility.', done: false },
  ];
}

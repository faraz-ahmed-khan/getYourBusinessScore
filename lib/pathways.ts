export const GYBS_SELECTED_PATHWAY_KEY = 'gybs_selected_pathway';
export const GYBS_SCORE_RESULT_KEY = 'gybs_score_result';
/** Set before navigating home so kiosk opens after redirect from other routes */
export const GYBS_OPEN_KIOSK_PENDING_KEY = 'gybs_open_kiosk_pending';

export type PathwayId =
  | 'business'
  | 'supplier'
  | 'marketplace'
  | 'distribution'
  | 'contract'
  | 'sba';

export const PATHWAY_IDS: PathwayId[] = [
  'business',
  'supplier',
  'marketplace',
  'distribution',
  'contract',
  'sba',
];

export function isPathwayId(v: string | null | undefined): v is PathwayId {
  return !!v && PATHWAY_IDS.includes(v as PathwayId);
}

/** Display title for kiosk cards and copy */
export const PATHWAY_TITLE: Record<PathwayId, string> = {
  business: 'Business Readiness',
  supplier: 'Supplier Readiness',
  marketplace: 'Marketplace Readiness',
  distribution: 'Distribution Readiness',
  contract: 'Contract Readiness',
  sba: 'SBA Readiness',
};

/** Uppercase badge for results */
export function pathwayBadgeLabel(id: PathwayId): string {
  return PATHWAY_TITLE[id].toUpperCase();
}

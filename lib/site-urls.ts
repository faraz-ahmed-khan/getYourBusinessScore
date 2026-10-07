/**
 * External ecosystem URLs — sourced from .env (NEXT_PUBLIC_* for client + server).
 */

function trimTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

const misconiUsa = trimTrailingSlash(
  process.env.NEXT_PUBLIC_MISCONI_USA_URL ?? 'https://misconiusa.com'
);
const misconiNetwork = trimTrailingSlash(
  process.env.NEXT_PUBLIC_MISCONI_NETWORK_URL ?? 'https://misconiusanetwork.com'
);
const sbaReady = trimTrailingSlash(process.env.NEXT_PUBLIC_SBA_READY_URL ?? 'https://sbaready.com');

export const SITE_URLS = {
  gybs: trimTrailingSlash(process.env.NEXT_PUBLIC_GYBS_URL ?? 'https://getyourbusinessscore.com'),
  misconiUsa,
  misconiNetwork,
  sbaReady,
  subscribe: `${misconiUsa}/subscribe`,
  subscribeBasic: `${misconiUsa}/subscribe?tier=basic`,
  subscribeEnterprise: `${misconiUsa}/subscribe?tier=enterprise`,
} as const;

/** Public marketing / funnel links. Prefer these over hard-coded hrefs. */
export const LINKS = {
  // TODO(client): consultation booking URL
  consultation: '',
} as const;

/** Consultation CTA href — booking URL when set, otherwise the contact page. */
export function consultationHref(): string {
  return LINKS.consultation || '/contact';
}

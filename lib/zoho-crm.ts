/**
 * Zoho CRM client (Management Work Queue + Tasks).
 * Separate OAuth grant from Creator — do not reuse ZOHO_REFRESH_TOKEN.
 */

type ZohoTokenResponse = {
  access_token: string;
  expires_in: number;
  api_domain?: string;
  token_type?: string;
};

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;
let inFlightTokenRequest: Promise<string> | null = null;
let loggedInsecureTlsWarning = false;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitedTokenError = (body: string) =>
  body.includes('too many requests') || body.includes('Access Denied');

/**
 * Opt-in only: relax TLS for local Zoho calls on broken corporate chains.
 * Set ZOHO_INSECURE_TLS=true in .env. Never on by default.
 */
function configureDevTls(): void {
  if (process.env.NODE_ENV === 'production') return;
  if (process.env.ZOHO_INSECURE_TLS !== 'true') return;
  if (process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    if (!loggedInsecureTlsWarning) {
      loggedInsecureTlsWarning = true;
      console.warn(
        '[zoho-crm] TLS verification disabled (ZOHO_INSECURE_TLS=true). Use only for local development.'
      );
    }
  }
}

configureDevTls();

export function isCrmConfigured(): boolean {
  return Boolean(
    process.env.ZOHO_CRM_CLIENT_ID &&
      process.env.ZOHO_CRM_CLIENT_SECRET &&
      process.env.ZOHO_CRM_REFRESH_TOKEN &&
      process.env.ZOHO_ACCOUNT_BASE &&
      process.env.ZOHO_CRM_API_BASE
  );
}

async function requestNewCrmToken(): Promise<string> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_CRM_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CRM_CLIENT_ID!,
    client_secret: process.env.ZOHO_CRM_CLIENT_SECRET!,
    grant_type: 'refresh_token',
  });

  const retries = [0, 1200, 2500];
  let lastErrorText = '';

  for (let i = 0; i < retries.length; i += 1) {
    if (retries[i] > 0) {
      await sleep(retries[i]);
    }

    const res = await fetch(`${process.env.ZOHO_ACCOUNT_BASE}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = (await res.json()) as ZohoTokenResponse;
      const ttlMs = Math.max(30, data.expires_in - 60) * 1000;
      cachedAccessToken = data.access_token;
      cachedAccessTokenExpiresAt = Date.now() + ttlMs;
      return data.access_token;
    }

    lastErrorText = await res.text();
    if (!isRateLimitedTokenError(lastErrorText)) {
      break;
    }
  }

  throw new Error(`Zoho CRM token refresh failed: ${lastErrorText}`);
}

export async function getZohoCrmAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  if (!inFlightTokenRequest) {
    inFlightTokenRequest = requestNewCrmToken().finally(() => {
      inFlightTokenRequest = null;
    });
  }

  return inFlightTokenRequest;
}

export type CrmFetchInit = RequestInit & {
  /** When true (default), send trigger:[] on JSON write bodies so CRM workflows do not fire. */
  suppressTriggers?: boolean;
};

function withTriggerSuppressed(body: string | undefined, suppress: boolean): string | undefined {
  if (!suppress || body == null || body === '') return body;
  try {
    const parsed = JSON.parse(body) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      if (!('trigger' in parsed)) {
        parsed.trigger = [];
      }
      return JSON.stringify(parsed);
    }
  } catch {
    /* leave body as-is */
  }
  return body;
}

/**
 * CRM API fetch. Paths are relative to ZOHO_CRM_API_BASE
 * (e.g. `/Management_Work_Queue` or `/coql`).
 */
export async function zohoCrmFetch(path: string, init: CrmFetchInit = {}) {
  if (!isCrmConfigured()) {
    throw new Error('Zoho CRM is not configured (missing ZOHO_CRM_* env vars)');
  }

  const accessToken = await getZohoCrmAccessToken();
  const suppressTriggers = init.suppressTriggers !== false;
  const method = (init.method || 'GET').toUpperCase();
  const isWrite = method !== 'GET' && method !== 'HEAD';

  let body = typeof init.body === 'string' ? init.body : init.body != null ? String(init.body) : undefined;
  if (isWrite) {
    body = withTriggerSuppressed(body, suppressTriggers);
  }

  const { suppressTriggers: _omit, ...rest } = init;

  const base = process.env.ZOHO_CRM_API_BASE!.replace(/\/$/, '');
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;

  return fetch(url, {
    ...rest,
    method,
    body,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
      ...(rest.headers || {}),
    },
    cache: 'no-store',
  });
}

export async function zohoCrmJson<T = unknown>(
  path: string,
  init: CrmFetchInit = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await zohoCrmFetch(path, init);
  const text = await res.text();
  const trimmed = text.trim();

  // Zoho search often returns 204 No Content (or an empty body) when nothing matches.
  if (!trimmed) {
    return {
      ok: res.ok || res.status === 204,
      status: res.status,
      data: {} as T,
    };
  }

  try {
    return {
      ok: res.ok,
      status: res.status,
      data: JSON.parse(trimmed) as T,
    };
  } catch {
    const snippet = trimmed.slice(0, 200);
    throw new Error(
      `Zoho CRM returned non-JSON (HTTP ${res.status}) for ${path}: ${snippet}`
    );
  }
}

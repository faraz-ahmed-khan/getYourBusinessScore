// lib/zoho.ts
type ZohoTokenResponse = {
  access_token: string;
  expires_in: number;
  api_domain?: string;
  token_type?: string;
};

let cachedAccessToken: string | null = null;
let cachedAccessTokenExpiresAt = 0;
let inFlightTokenRequest: Promise<string> | null = null;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRateLimitedTokenError = (body: string) =>
  body.includes('too many requests') || body.includes('Access Denied');

async function requestNewZohoToken(): Promise<string> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
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

  throw new Error(`Zoho token refresh failed: ${lastErrorText}`);
}

export async function getZohoAccessToken(): Promise<string> {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  if (!inFlightTokenRequest) {
    inFlightTokenRequest = requestNewZohoToken().finally(() => {
      inFlightTokenRequest = null;
    });
  }

  return inFlightTokenRequest;
}

export async function zohoFetch(path: string, init: RequestInit = {}) {
  const accessToken = await getZohoAccessToken();

  const res = await fetch(`${process.env.ZOHO_CREATOR_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  return res;
}
// lib/zoho.ts
type ZohoTokenResponse = {
  access_token: string;
  expires_in: number;
  api_domain?: string;
  token_type?: string;
};

export async function getZohoAccessToken(): Promise<string> {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${process.env.ZOHO_ACCOUNT_BASE}/oauth/v2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Zoho token refresh failed: ${text}`);
  }

  const data = (await res.json()) as ZohoTokenResponse;
  return data.access_token;
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
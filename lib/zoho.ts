export async function getAccessToken(): Promise<string> {
  const res = await fetch(
    'https://accounts.zoho.com/oauth/v2/token?' +
    new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    }),
    { method: 'POST' }
  );
  const data = await res.json();
  return data.access_token;
}

export const ZOHO_BASE =
  `https://creator.zoho.com/api/v2/${process.env.ZOHO_ACCOUNT_NAME}/${process.env.ZOHO_APP_NAME}`;
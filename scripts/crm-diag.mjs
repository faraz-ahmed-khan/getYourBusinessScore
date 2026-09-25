import fs from 'fs';

const env = Object.fromEntries(
  fs
    .readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
for (const [k, v] of Object.entries(env)) {
  if (!(k in process.env)) process.env[k] = v;
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const mwqId = process.env.ZOHO_MWQ_DEFAULT_ID;

(async () => {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_CRM_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CRM_CLIENT_ID,
    client_secret: process.env.ZOHO_CRM_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });
  const tj = await (
    await fetch(`${process.env.ZOHO_ACCOUNT_BASE}/oauth/v2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
  ).json();
  const token = tj.access_token;
  const base = 'https://www.zohoapis.com/crm/v2';

  async function crm(label, path, init = {}) {
    const r = await fetch(`${base}${path}`, {
      ...init,
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    });
    const t = await r.text();
    console.log('\n===', label, r.status);
    console.log(t.slice(0, 1200));
    try {
      return JSON.parse(t || '{}');
    } catch {
      return {};
    }
  }

  // Create WITHOUT trigger suppression
  const created = await crm('CREATE no trigger suppress', '/Tasks', {
    method: 'POST',
    body: JSON.stringify({
      data: [
        {
          Subject: '[gybs:probe-no-trigger] What_Id no trigger[]',
          Status: 'Not Started',
          Priority: 'Normal',
          What_Id: { id: mwqId },
          $se_module: 'Management_Work_Queue',
        },
      ],
    }),
  });
  const id = created?.data?.[0]?.details?.id;
  if (id) {
    await crm('GET', `/Tasks/${id}?fields=Subject,What_Id,$se_module`);
  }

  // Can Integration edit What_Id on Steven's already-linked task?
  await crm('PUT working task same What_Id', `/Tasks/7145141000001791024`, {
    method: 'PUT',
    body: JSON.stringify({
      data: [
        {
          What_Id: { id: mwqId },
          $se_module: 'Management_Work_Queue',
        },
      ],
    }),
  });
  await crm(
    'GET working after PUT',
    `/Tasks/7145141000001791024?fields=Subject,What_Id,$se_module`
  );
})().catch((e) => console.error(e));

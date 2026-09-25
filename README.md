# GYBS — Get Your Business Score

Business-only readiness scoring kiosk for the Misconi USA ecosystem. GYBS is the **only** platform that performs intake, scoring, and routing. It captures customer details and assessment answers, submits to Zoho Creator (authoritative for all 36 answers), syncs an ops reference + MWQ Task to Zoho CRM, and displays the scored result with outbound routing links.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zoho Creator** — authoritative assessment record (q1–q36 + score + contact)
- **Zoho CRM** — Contact/Account ops reference, Management Work Queue (read), Tasks (create/update)

## Commands

- **Install:** `npm install`
- **Dev:** `npm run dev` — [http://localhost:3000](http://localhost:3000)
- **Build:** `npm run build`
- **Start:** `npm start` (after build)

## Environment

Copy `.env.example` to `.env` and fill in values.

**Ecosystem URLs** (footer, results routing, subscribe — change per environment without editing code):

- `NEXT_PUBLIC_GYBS_URL`
- `NEXT_PUBLIC_MISCONI_USA_URL`
- `NEXT_PUBLIC_MISCONI_NETWORK_URL`
- `NEXT_PUBLIC_SBA_READY_URL`

Subscribe tier links are derived from `NEXT_PUBLIC_MISCONI_USA_URL` in `lib/site-urls.ts`.

**Zoho Creator** (see `lib/zoho.ts`):

- `ZOHO_OWNER_NAME`, `ZOHO_APP_LINK_NAME`, `ZOHO_FORM_LINK_NAME`, `ZOHO_REPORT_LINK_NAME`
- `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`, `ZOHO_ACCOUNT_BASE`, `ZOHO_CREATOR_BASE`

**Zoho CRM** (separate grant — Misconi dedicated integration account; see `lib/zoho-crm.ts`):

- `ZOHO_CRM_CLIENT_ID`, `ZOHO_CRM_CLIENT_SECRET`, `ZOHO_CRM_REFRESH_TOKEN`, `ZOHO_CRM_API_BASE`
- `ZOHO_MWQ_MODULE` (default `Management_Work_Queue`)
- `ZOHO_MWQ_DEFAULT_ID` (MWQ-1 for connection test / default routing)
- `ZOHO_DEFAULT_TASK_OWNER_ID` (Steven / Management for MWQ-1 test)
- Optional `ZOHO_CONNECTION_TEST_SECRET` for `POST /api/zoho/connection-test`

CRM stores **ops fields only** (contact/business, Creator record ID, score/band, completion date) on the Task Description + Contact/Account. It does **not** duplicate q1–q36 into `GYBS_Business_Intakes`.

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/intake/submit` | Validates intake, creates Creator record, then CRM ops sync + MWQ Task |
| `GET /api/readiness/result/[recordId]` | Polls Zoho report for computed score, lane, pack, corrections |
| `GET /api/readiness/cards` | Returns three governed outbound routing cards |
| `GET /api/zoho/mwq` | List Management Work Queue (read only) |
| `GET /api/zoho/mwq/[id]` | One MWQ record + related Tasks |
| `POST /api/zoho/tasks` | Create Task linked to MWQ (`What_Id`); duplicate-safe via `[gybs-key]` |
| `PATCH /api/zoho/tasks/[id]` | Update Task status/owner/due/priority/description (default status process) |
| `POST /api/zoho/connection-test` | One controlled MWQ-1 test: subject `GYBS integration connection test` |

Hard CRM rules: always send `trigger: []` on writes; **never** write MWQ Status; Task create is idempotent on `gybs-key`.

## User flow

1. **Home** — Hero, pathway kiosk, short “how it works”.
2. **Assessment** (`/assessment`) — Lead details → 36 questions → submit to Creator (+ CRM/MWQ ops).
3. **Results** (`/results`) — Score, band, top gaps (or high-score fallback), package CTA.
4. **Subscribe** (`/subscribe`) — CTA to external MisconiUSA subscribe.

## Questionnaire note

Live approved set: **29 multiple-choice + 7 yes/no = 36**. Supporting PDFs that still say 27/9 should be corrected; the website questions stay unchanged.

## Scope (by design)

**In scope:** intake, local scoring, Creator write, CRM ops reference, MWQ read, Task create/update, results display.

**Out of scope this phase:** conditional questions, Systeme.io→Zoho automation, draft Tasks blueprint, scoring/questionnaire/email/workflow changes, Calendly, inventing new Zoho fields/modules.

# GYBS — Get Your Business Score

Business-only readiness scoring kiosk for the Misconi USA ecosystem. GYBS is the **only** platform that performs intake, scoring, and routing. It captures customer details and assessment answers, submits to Zoho Creator, and displays the scored result with outbound routing links.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zoho Creator** — intake storage and readiness scoring (via API routes)

## Commands

- **Install:** `npm install`
- **Dev:** `npm run dev` — [http://localhost:3000](http://localhost:3000)
- **Build:** `npm run build`
- **Start:** `npm start` (after build)

## Environment

Configure Zoho in `.env` (see existing env vars used by `lib/zoho.ts` and API routes):

- `ZOHO_OWNER_NAME`
- `ZOHO_APP_LINK_NAME`
- `ZOHO_FORM_LINK_NAME`
- `ZOHO_REPORT_LINK_NAME`
- Plus Zoho OAuth / token variables required by `zohoFetch`

## API routes

| Route | Purpose |
|-------|---------|
| `POST /api/intake/submit` | Validates intake, creates Zoho record (`Name`, `Email`, `Business_Name`, question fields) |
| `GET /api/readiness/result/[recordId]` | Polls Zoho report for computed score, lane, pack, corrections |
| `GET /api/readiness/cards` | Returns three governed outbound routing cards |

## User flow

1. **Home** — Hero, pathway kiosk, short “how it works” (intake-focused; no articles/directories/profiles).
2. **Assessment** (`/assessment`) — Customer details → 3 question steps (operations, offers, market) → submit to Zoho.
3. **Results** (`/results`) — Score, level, lane, pack, corrections, upgrade pathway, outbound links to MisconiUSA / Network / SBAReady.
4. **Subscribe** (`/subscribe`) — CTA to external MisconiUSA subscribe (no subscription logic hosted here).

## Project structure

- `app/` — Pages and API routes
- `app/assessment/AssessmentClient.tsx` — **Active** intake UI
- `components/home/` — Homepage kiosk
- `lib/intake-types.ts` — Assessment answer types
- `lib/zoho.ts` — Zoho API client
- `lib/constants.ts` — Routing card definitions

## Scope (by design)

**In scope:** intake forms, readiness scoring (Zoho), routing metadata, results display.

**Out of scope:** articles, directories, profiles, opportunity marketplace pages, hosted educational content. Education/training live on linked ecosystem sites after scoring.

## Removed in cleanup (legacy)

The following were removed as unused; restore from git history if needed:

- 8-pack MCI assessment UI (`Step1`–`Step8`, `AssessmentFlow`)
- Local mock scoring (`lib/scoring.ts`, `scoring-engine`, save-draft, upload mock)
- Unused home components (`Hero`, `HowItWorks`, `DoctrineIntro`)

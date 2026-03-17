# GYBS — Get Your Business Score

Business-only readiness scoring kiosk for the Misconi USA ecosystem. GYBS is a diagnostic entry point: it captures business identity and metadata, generates a Business Score, displays readiness level, and routes users into the correct readiness lane.

## Stack

- **Next.js** (latest stable, App Router)
- **TypeScript**
- **Tailwind CSS**
- Dummy backend using Next.js API route handlers under `/app/api` (no real database).

## Commands

- **Install:** `npm install`
- **Dev:** `npm run dev` — run the app locally at [http://localhost:3000](http://localhost:3000)
- **Build:** `npm run build`
- **Start (production):** `npm start` (after `npm run build`)

## Deploy on Vercel

1. **Option A — Vercel CLI (from this folder)**  
   - Log in: `npx vercel login`  
   - Deploy: `npx vercel` (preview) or `npx vercel --prod` (production)  
   - Follow the prompts to link or create a project.

2. **Option B — Git + Vercel Dashboard**  
   - Push this project to GitHub (or GitLab/Bitbucket).  
   - Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo.  
   - Vercel will detect Next.js; leave build settings as default and deploy.

## Dummy backend behavior

- **POST `/api/intake/save-draft`** — Accepts partial step data, returns success and a normalized payload. No persistence; no database.
- **POST `/api/intake/submit`** — Accepts full intake payload (all 8 packs), validates required fields and permissions, generates a mock UBID and Business Score (0–100), and returns readiness level, strengths, gaps, recommendations, and exactly three readiness cards.
- **POST `/api/upload/mock`** — Accepts file metadata or form data; returns mock uploaded file names. No real file storage.
- **GET `/api/readiness/cards`** — Returns the same three governed readiness cards (pathway, learn, training).

Score generation and UBID creation are temporary demo logic and should be replaced later by Zoho or a production readiness controller.

## Zoho integration

Zoho integration is **not** implemented. The intake payload and question structure are aligned with MCI (Master Customer Intake) metadata for a future Zoho integration (UBID, readiness table, readiness lifecycle, Prime Agent representation).

## Project structure

- `app/` — Pages (home, assessment, results) and API routes
- `components/` — Layout, home, assessment steps, results, shared UI
- `lib/` — Types, validation, scoring, constants, mock data, formatters

## Flow

1. **Homepage** — Hero and primary CTA “Get Your Business Score” only (no pathways, opportunities, or training/education content).
2. **Assessment** — Multi-step flow through 8 packs (Identity, Permissions, Communication, Intent, Readiness, Opportunity, Representation, Documents). Submit sends data to the dummy backend and redirects to results.
3. **Results** — Business Score, Readiness Level, Strengths, Gaps, Recommendations, and exactly three readiness cards (Begin Your Readiness Pathway → MisconiUSA.com; Learn About Readiness → MisconiUSANetwork.com; Get SBA-Aligned Training & Support → SBAReady.org).

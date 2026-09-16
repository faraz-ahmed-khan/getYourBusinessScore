import { CATEGORIES, TOTAL_POINTS, TOTAL_QUESTIONS } from "./questions";
import { Answers, Band, CategoryResult, Results } from "./types";

/** Score bands and copy, from "GYBS Results-Screen Copy". */
export const BANDS: Band[] = [
  {
    key: "Foundation",
    min: 0,
    max: 39,
    color: "#eb7626",
    headline: "You're at the Foundation stage — and that's a smart place to start.",
    body: "Right now, key pieces buyers and lenders look for aren't fully in place yet. That's not a failure — it's exactly what a readiness score is for. You now know where you stand before it costs you an opportunity. The good news: these gaps are the most fixable ones, and closing them moves you up fast.",
    nextTier: "Foundation Tier · $497",
    nextHeadline: "Start with the Foundation tier.",
    nextBody:
      "It builds the base everything else depends on — legal identity, core records, and licensing, insurance, and compliance review.",
  },
  {
    key: "Capability",
    min: 40,
    max: 69,
    color: "#c9962c",
    headline: "You're at the Capability stage — stronger than most, with clear room to grow.",
    body: "Your core is in place — you're operating and capable. What's holding you back now are the gaps in eligibility, documentation, and positioning that decide who gets picked. Close those, and you move from \u201ccapable\u201d to \u201cchosen.\u201d This is the stage where the right moves open real opportunities.",
    nextTier: "Capability Tier · $997",
    nextHeadline: "The Capability tier targets exactly these gaps.",
    nextBody:
      "It includes everything in Foundation, plus a delivery-capacity review, procedures and controls, and capability evidence you can put in front of a buyer.",
  },
  {
    key: "Protection",
    min: 70,
    max: 100,
    color: "#2e7b55",
    headline: "You're at the Protection stage — you're ready, and ahead of most businesses.",
    body: "You've done the hard work — your business is prepared to compete. At this level, the goal shifts from getting ready to staying ready and protecting the position you've built, so you can go after bigger contracts, partners, and funding with confidence. A small gap at this stage can cost a big opportunity.",
    nextTier: "Protection Tier · $1,997",
    nextHeadline: "The Protection tier helps you optimize and protect your readiness.",
    nextBody:
      "It includes everything in Foundation and Capability — so you can stay ready and compete for bigger contracts, partners, and funding with confidence.",
  },
];

export type Tier = "low" | "mid" | "high";

/** Fix-plan guidance per category, keyed by tier (low <40%, mid 40-69%, high >=70%). */
export const TIPS: Record<string, Record<Tier, string>> = {
  "Business Foundation": {
    low: "Formalize the basics: register your business with the state, get your EIN, and open a dedicated business bank account. These are the first things a lender, buyer, or agency checks — and the base everything else depends on.",
    mid: "You've got some of the foundation in place. Confirm your registration is active, consolidate your name, logo, and website, and get your paperwork organized in one place you can hand over on short notice.",
    high: "Your foundation is solid. Keep your registration, EIN, and records current so everything stays easy to produce the moment a buyer or lender asks.",
  },
  "Money & Funding Readiness": {
    low: "Start tracking income and expenses consistently, and put a simple system in place for watching monthly cash flow. Lenders and buyers want steady, documented numbers before they'll talk terms.",
    mid: "Your financial picture is taking shape. Tighten up your record-keeping so it's current at all times, and start building business credit deliberately so you're not starting from zero when funding comes up.",
    high: "Your financial readiness is strong. Keep records current and keep building business credit so you can move fast the next time funding or a large order requires it.",
  },
  "Day-to-Day Operations": {
    low: "Write down how the core work actually gets done, and put a simple system in place for taking orders, invoicing, and getting paid. Too much depends on what's in your head right now — that's a risk buyers notice.",
    mid: "Your operations work, but they're not fully repeatable yet. Document the process, add a backup for your key people or suppliers, and bring in a few tools to stay organized as volume grows.",
    high: "Your operations are dependable and documented. Focus on stress-testing capacity — could you truly scale if a big order landed tomorrow?",
  },
  "Supplier Readiness": {
    low: "Build a clear, current list of what you sell or offer, and get your packaging, labeling, and product info buyer-ready. Without this, you can't credibly answer a large buyer's first question.",
    mid: "You have pieces of a supplier profile in place. Firm up your supply chain reliability and confirm you could fulfill a larger order — that's usually the gap between a small buyer and a big one.",
    high: "You're supplier-ready. Keep your capacity, packaging, and vendor relationships current, and start pursuing formal supplier approvals with larger companies.",
  },
  "Licenses & Compliance": {
    low: "Confirm which licenses, permits, and insurance your work actually requires, and get them current. This is the fastest way to get disqualified from an opportunity — and one of the fastest to fix.",
    mid: "Most of your compliance basics are there. Close the specific gaps — insurance coverage, a missing certification, or a written policy — so your records would hold up if someone checked them today.",
    high: "Your compliance position is strong. Keep licenses, insurance, and certifications current, and review your written policies periodically so nothing quietly lapses.",
  },
  "Contract & Opportunity Readiness": {
    low: "Get oriented: understand what SAM.gov registration and set-asides mean for you, and start building a capability statement. This category is usually the last one ready — and the one that turns readiness into a won contract.",
    mid: "You've started positioning for contracts. Finish your SAM.gov registration, sharpen your capability statement, and build a clear target list of the buyers or agencies you actually want.",
    high: "You're positioned to compete. Keep your capability statement and registrations current, and keep sharpening how you stand out to the specific buyers on your target list.",
  },
};

export function getBand(score: number): Band {
  return BANDS.find((b) => score >= b.min && score <= b.max) ?? BANDS[0];
}

export function getTier(pct: number): Tier {
  if (pct < 40) return "low";
  if (pct < 70) return "mid";
  return "high";
}

export function computeResults(answers: Answers): Results {
  let raw = 0;
  let answeredCount = 0;
  for (let q = 1; q <= TOTAL_QUESTIONS; q++) {
    if (answers[q] !== undefined) {
      raw += answers[q];
      answeredCount++;
    }
  }
  const readinessScore = Math.round((raw / TOTAL_POINTS) * 100);
  const band = getBand(readinessScore);

  const cats: CategoryResult[] = CATEGORIES.map((c) => {
    let catRaw = 0;
    let catAnswered = 0;
    for (let q = c.startNum; q <= c.endNum; q++) {
      if (answers[q] !== undefined) {
        catRaw += answers[q];
        catAnswered++;
      }
    }
    const max = c.questions.length * 2;
    const pct = Math.round((catRaw / max) * 100);
    return { name: c.name, raw: catRaw, max, pct, answered: catAnswered, total: c.questions.length };
  });

  return { readinessScore, band, answeredCount, cats };
}

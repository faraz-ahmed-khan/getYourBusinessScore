import { Category } from "./types";

/**
 * Source of truth for all 36 questions, in the exact wording and scoring
 * from "GYBS Readiness Questionnaire v3 FINAL". Each question is worth
 * 0-2 points; multiple-choice questions give the gradation (2/1/0),
 * yes/no questions score 2 or 0. 36 questions x 2 pts = 72 possible,
 * scaled to a 0-100 score. Edit copy and options here — nothing in the
 * assessment UI needs to change when this data changes.
 */
const RAW_CATEGORIES: (Omit<Category, "startNum" | "endNum" | "questions"> & {
  questions: Omit<Category["questions"][number], "num">[];
})[] = [
  {
    name: "Business Foundation",
    short: "Foundation",
    desc: "The base everything else depends on — how your business is registered, structured, and identified.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/></svg>',
    questions: [
      {
        type: "mc",
        text: "Is your business officially set up (registered with your state)?",
        options: [
          { label: "Yes, and it's active", pts: 2 },
          { label: "Set up, but not active or I'm not sure", pts: 1 },
          { label: "Not yet", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Do you have a tax ID number (EIN) for the business?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How long have you been running the business?",
        options: [
          { label: "More than 3 years", pts: 2 },
          { label: "1 to 3 years", pts: 1 },
          { label: "Less than a year / just starting", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Do you have a business bank account, separate from your personal one?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Which do you already have in place?",
        options: [
          { label: "A business name, a logo, AND a website/page", pts: 2 },
          { label: "One or two of those", pts: 1 },
          { label: "None yet", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "When you need your key business paperwork, how easy is it to find?",
        options: [
          { label: "It's organized and easy to find", pts: 2 },
          { label: "I have it, but it's scattered", pts: 1 },
          { label: "I'm not sure what I have", pts: 0 },
        ],
      },
    ],
  },
  {
    name: "Money & Funding Readiness",
    short: "Money & Funding",
    desc: "How steady, tracked, and fundable your business's money really is.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.4 1.1-2.5 2.5-2.5s2.5.9 2.5 2c0 3-5 2-5 5 0 1.1 1.1 2 2.5 2s2.5-1.1 2.5-2.5"/></svg>',
    questions: [
      {
        type: "mc",
        text: "How steady is your business income?",
        options: [
          { label: "Steady and predictable", pts: 2 },
          { label: "It goes up and down", pts: 1 },
          { label: "Little or none yet", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How up to date are your financial records (income, expenses, statements)?",
        options: [
          { label: "Current and organized", pts: 2 },
          { label: "Somewhat / a bit behind", pts: 1 },
          { label: "Not really tracked", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Where are you with business credit?",
        options: [
          { label: "Established business credit", pts: 2 },
          { label: "Started, but limited", pts: 1 },
          { label: "Haven't started", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Have you ever applied for a loan, credit, or funding?",
        options: [
          { label: "Yes, and got approved", pts: 2 },
          { label: "Yes, but got turned down", pts: 1 },
          { label: "Never tried", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "If a lender asked for your financials today, could you provide them?",
        options: [
          { label: "Yes, right away", pts: 2 },
          { label: "Yes, but it'd take some time", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Do you keep an eye on your monthly cash flow (money in vs. money out)?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "No", pts: 0 },
        ],
      },
    ],
  },
  {
    name: "Day-to-Day Operations",
    short: "Operations",
    desc: "How the work actually gets done — and whether it would hold up under pressure.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    questions: [
      {
        type: "mc",
        text: "How is the main work documented?",
        options: [
          { label: "Written down and repeatable", pts: 2 },
          { label: "Mostly in my head", pts: 1 },
          { label: "No real process yet", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "If a big order came in tomorrow, could you handle it?",
        options: [
          { label: "Yes, we could scale up", pts: 2 },
          { label: "Maybe, with some strain", pts: 1 },
          { label: "No, we'd struggle", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Do you have the people or help to deliver consistently?",
        options: [
          { label: "Yes, enough help", pts: 2 },
          { label: "Limited — mostly just me", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How much do you use tools to stay organized (scheduling, customers, inventory)?",
        options: [
          { label: "In place and used daily", pts: 2 },
          { label: "A few, here and there", pts: 1 },
          { label: "Not really", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How reliable is your way of taking orders, invoicing, and getting paid?",
        options: [
          { label: "Solid and reliable", pts: 2 },
          { label: "Works, but patchy", pts: 1 },
          { label: "No real system", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "If you lost a key person or supplier tomorrow, could the business keep going?",
        options: [
          { label: "Yes, we have backups", pts: 2 },
          { label: "It'd be hard, but we'd manage", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
    ],
  },
  {
    name: "Supplier Readiness",
    short: "Supplier",
    desc: "Whether you could reliably deliver for a buyer larger than the ones you have today.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7.5" cy="18" r="1.6"/><circle cx="17.5" cy="18" r="1.6"/></svg>',
    questions: [
      {
        type: "mc",
        text: "How complete is your list of what you sell or offer?",
        options: [
          { label: "Complete and current", pts: 2 },
          { label: "Partial or out of date", pts: 1 },
          { label: "Don't have one", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Could you supply a larger buyer the amount they might need?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "Small orders only", pts: 1 },
          { label: "No / not sure", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How dependable are your own suppliers or vendors?",
        options: [
          { label: "Reliable and established", pts: 2 },
          { label: "Some, informal", pts: 1 },
          { label: "None / doesn't apply", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Do you have the packaging, labeling, or product info a buyer would expect?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "Partly", pts: 1 },
          { label: "No / not sure", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Could you handle shipping or delivery if orders grew?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "Limited", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Have you ever been approved as a supplier by a bigger company?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "Not yet", pts: 0 },
        ],
      },
    ],
  },
  {
    name: "Licenses & Compliance",
    short: "Compliance",
    desc: "The licenses, insurance, and paperwork that decide whether you're even eligible.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>',
    questions: [
      {
        type: "mc",
        text: "Do you have the licenses or permits your type of work requires?",
        options: [
          { label: "Yes, all current", pts: 2 },
          { label: "Some, or not sure", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "What's your business insurance situation (like liability)?",
        options: [
          { label: "Active coverage", pts: 2 },
          { label: "Minimal or expired", pts: 1 },
          { label: "None", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Do you hold any certifications relevant to your line of work?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How confident are you that you meet your industry's rules and standards?",
        options: [
          { label: "Fully confident", pts: 2 },
          { label: "Mostly / unsure of some", pts: 1 },
          { label: "Not confident", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "If a buyer or agency checked your records, would they hold up?",
        options: [
          { label: "Yes, we're ready for that", pts: 2 },
          { label: "Somewhat", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Do you have the written policies your work may require (safety, privacy, etc.)?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "No", pts: 0 },
        ],
      },
    ],
  },
  {
    name: "Contract & Opportunity Readiness",
    short: "Contracts",
    desc: "How ready you are to find, bid on, and win real contracts.",
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
    questions: [
      {
        type: "mc",
        text: "Are you registered in SAM.gov (with a UEI and CAGE code)?",
        options: [
          { label: "Yes, active", pts: 2 },
          { label: "Started, not finished", pts: 1 },
          { label: "No / not sure what that is", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Do you have a capability statement ready to send to buyers?",
        options: [
          { label: "Yes, current", pts: 2 },
          { label: "An old or rough one", pts: 1 },
          { label: "No", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "How clear are you on which contracts, buyers, or agencies you want to work with?",
        options: [
          { label: "A clear target list", pts: 2 },
          { label: "A general idea", pts: 1 },
          { label: "Not sure yet", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Do you know if you qualify for set-asides (small, veteran-owned, minority-owned, etc.)?",
        options: [
          { label: "Yes, and certified where I can be", pts: 2 },
          { label: "I think I qualify but haven't certified", pts: 1 },
          { label: "Don't know", pts: 0 },
        ],
      },
      {
        type: "mc",
        text: "Have you ever bid on a government or big-company contract?",
        options: [
          { label: "Yes, and won at least one", pts: 2 },
          { label: "Yes, but haven't won yet", pts: 1 },
          { label: "Never", pts: 0 },
        ],
      },
      {
        type: "yn",
        text: "Do you feel you know what buyers look for and how to stand out?",
        options: [
          { label: "Yes", pts: 2 },
          { label: "Not yet — I'd want help here", pts: 0 },
        ],
      },
    ],
  },
];

/** Assigns global question numbers 1-36 across all categories in order. */
function buildCategories(): Category[] {
  let counter = 1;
  return RAW_CATEGORIES.map((cat) => {
    const startNum = counter;
    const questions = cat.questions.map((q) => ({ ...q, num: counter++ }));
    return { ...cat, startNum, endNum: counter - 1, questions };
  });
}

export const CATEGORIES: Category[] = buildCategories();
export const TOTAL_QUESTIONS = CATEGORIES.reduce((n, c) => n + c.questions.length, 0);
export const TOTAL_POINTS = TOTAL_QUESTIONS * 2;

import { Answers, Lead } from "./types";

const ANSWERS_KEY = "gybs_answers";
const LEAD_KEY = "gybs_lead";

const isBrowser = () => typeof window !== "undefined";

export function loadAnswers(): Answers {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(ANSWERS_KEY);
    return raw ? (JSON.parse(raw) as Answers) : {};
  } catch {
    return {};
  }
}

export function saveAnswers(answers: Answers): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
  } catch {
    /* storage full or unavailable — fail silently, same as the static build */
  }
}

export function clearAnswers(): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ANSWERS_KEY);
  } catch {
    /* noop */
  }
}

export function loadLead(): Lead | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(LEAD_KEY);
    return raw ? (JSON.parse(raw) as Lead) : null;
  } catch {
    return null;
  }
}

export function saveLead(lead: Lead): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
  } catch {
    /* noop */
  }
}

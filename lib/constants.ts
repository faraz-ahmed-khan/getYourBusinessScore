/**
 * GYBS constants.
 * Cross-site purpose separation: GYBS → MisconiUSA (operational), MisconiUSANetwork (education), SBAReady (training).
 */

// Exactly 3 readiness lanes — no fourth card, no Review Score card.
// Canonical production domains (mock prototype uses same URLs).
export const READINESS_CARDS = [
  {
    id: 'pathway',
    title: 'Begin Your Readiness Pathway',
    destination: 'https://misconiusa.com',
    description:
      'Enter the official readiness system operated by the Prime Agent. Subscribe, unlock your pathway, and begin completing the requirements needed to access customer, product, and supplier opportunities.',
    ctaText: 'Go to MisconiUSA.com',
  },
  {
    id: 'learn',
    title: 'Learn About Readiness',
    destination: 'https://misconiusanetwork.com',
    description:
      'Explore readiness concepts, pathway overviews, and ecosystem education. Understand how the readiness system works before entering your pathway.',
    ctaText: 'Visit MisconiUSANetwork.com',
  },
  {
    id: 'training',
    title: 'Get SBA-Aligned Training & Support',
    destination: 'https://sbaready.org',
    description:
      'Access the Readiness Institute for training, development, and SBA-aligned support. Ideal for early-stage businesses and users who need foundational readiness help before entering the operational system.',
    ctaText: 'Go to SBAReady.org',
  },
] as const;

// Level 1 routing targets (intake only; no readiness lanes at Level 1).
export const LEVEL_1_ROUTES = {
  subscribe: 'https://misconiusa.com/subscribe',
  education: 'https://misconiusanetwork.com',
  training: 'https://sbaready.org',
} as const;

export const ASSESSMENT_STEP_COUNT = 8;

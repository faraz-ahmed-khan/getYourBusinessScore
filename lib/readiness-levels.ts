export type ReadinessLevel = 1 | 2 | 3 | 4;

export type ReadinessLevelInfo = {
  level: ReadinessLevel;
  title: string;
  description: string;
};

export const READINESS_LEVELS: ReadinessLevelInfo[] = [
  {
    level: 1,
    title: 'Level 1 — Foundational',
    description: 'Early stage readiness. Documentation incomplete. Operations minimal.',
  },
  {
    level: 2,
    title: 'Level 2 — Emerging',
    description: 'Basic structure in place. Some documentation. Partial operations.',
  },
  {
    level: 3,
    title: 'Level 3 — Prepared',
    description: 'Strong documentation. Stable operations. Ready for visibility.',
  },
  {
    level: 4,
    title: 'Level 4 — Opportunity Ready',
    description: 'Fully documented. Operationally strong. Ready for partners and growth.',
  },
];

export function getReadinessLevelInfo(level: ReadinessLevel): ReadinessLevelInfo {
  return READINESS_LEVELS[level - 1];
}

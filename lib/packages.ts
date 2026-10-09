/** GYBS readiness package tiers shown on the homepage. */

export const PACKAGE_TITLES = ['Foundation', 'Capability', 'Optimization'] as const;

export type PackageTitle = (typeof PACKAGE_TITLES)[number];

export function isPackageTitle(value: string): value is PackageTitle {
  return (PACKAGE_TITLES as readonly string[]).includes(value);
}

export type PackageTier = {
  wrapClassKey: 'pkgFoundation' | 'pkgCapability' | 'pkgOpportunity';
  level: string;
  title: PackageTitle;
  price: string;
  mandate: string;
  gate: string;
  scope: string[];
  deliverables: string[];
  result: string;
  ctaLabel: string;
  boundary: string;
};

export const PACKAGE_TIERS: PackageTier[] = [
  {
    wrapClassKey: 'pkgFoundation',
    level: 'Readiness Tier 1',
    title: 'Foundation',
    price: '$497',
    mandate: 'Mandate: Establish the business.',
    gate: 'Is the business properly established to operate and advance?',
    scope: [
      'Legal identity and formation baseline',
      'Core business records and documentation',
      'Licensing, insurance, and compliance review',
      'Operating structure and record controls',
      'Starter visibility readiness',
    ],
    deliverables: [
      'Foundation DIY Readiness Guide',
      'Foundation Readiness Baseline',
      'Critical and non-critical Gap Register',
      '30/60/90 Preparation Record',
      'Foundation Completion Report',
    ],
    result: 'Documented completed actions, unresolved gaps, and an approved next-step recommendation.',
    ctaLabel: 'Begin Foundation Preparation',
    boundary: 'Does not verify delivery capability or qualify the business for a specific opportunity.',
  },
  {
    wrapClassKey: 'pkgCapability',
    level: 'Readiness Tier 2',
    title: 'Capability',
    price: '$997',
    mandate: 'Mandate: Demonstrate the capability.',
    gate: 'Can the business consistently perform what it represents?',
    scope: [
      'Delivery model and operating-capacity review',
      'Procedures, controls, and documentation',
      'Quality, consistency, and risk management',
      'Performance claims and capability evidence',
      'Capability limitations and gap controls',
    ],
    deliverables: [
      'Capability DIY Readiness Guide',
      'Business Capability Map',
      'Capability Evidence Register',
      'Critical and non-critical Gap Record',
      'Capability Review Report',
    ],
    result:
      'Documented capability findings, verified supporting evidence, limitations, and an approved next-step recommendation.',
    ctaLabel: 'Begin Capability Preparation',
    boundary:
      'Does not automatically qualify the business for funding, contracting, supplier, distribution, or visibility opportunities.',
  },
  {
    wrapClassKey: 'pkgOpportunity',
    level: 'Readiness Tier 3',
    title: 'Optimization',
    price: '$1,997',
    mandate: 'Mandate: Prepare verified capability for a defined opportunity.',
    gate: 'Does the verified business meet the requirements of this opportunity?',
    scope: [
      'Defined opportunity and source preservation',
      'Requirement-to-capability comparison',
      'Opportunity-specific gap preparation',
      'Compliance and representation controls',
      'Readiness or application-file assembly',
    ],
    deliverables: [
      'Opportunity Preparation DIY Guide',
      'Opportunity Requirement Matrix',
      'Verified Capability Comparison',
      'Opportunity Readiness File',
      'Controlled Preparation Decision',
    ],
    result: 'Qualified, conditional, hold, or not-ready decision. Opportunity routing requires separate authorization.',
    ctaLabel: 'Begin Optimization',
    boundary: 'Opportunity Ready is an earned, verified status. It is not automatically included with purchase.',
  },
];

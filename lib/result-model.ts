import type { SubmitResponse } from './types';

const EMPTY_OVERVIEW = {
  recommendedLane: 'See readiness results after submit.',
  assignedPack: 'Not assigned.',
  correctionList: [] as string[],
  requiredDocuments: [] as string[],
  missingInformation: [] as string[],
  upgradePathway: 'Complete intake to generate a governed outcome.',
};

/**
 * Normalizes mock result for UI. Ensures `resultOverview` exists for older sessionStorage entries.
 * Empty arrays are preserved — UI shows an explicit empty state.
 */
export function normalizeResultResponse(data: SubmitResponse): SubmitResponse {
  const ro = data.resultOverview;
  if (!ro) {
    return {
      ...data,
      resultOverview: { ...EMPTY_OVERVIEW },
    };
  }
  return {
    ...data,
    resultOverview: {
      recommendedLane: ro.recommendedLane,
      assignedPack: ro.assignedPack,
      correctionList: ro.correctionList ?? [],
      requiredDocuments: ro.requiredDocuments ?? [],
      missingInformation: ro.missingInformation ?? [],
      upgradePathway: ro.upgradePathway,
    },
  };
}

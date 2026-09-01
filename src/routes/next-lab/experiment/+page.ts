import type { PageLoad } from "./$types.js";
import {
  experimentCaseIds,
  getExperimentCase,
  type ExperimentCaseId,
} from "$lib/next-experiments/cases.js";
import type { AdaptationMode } from "$lib/next-experiments/types.js";

const adaptationModes: AdaptationMode[] = ["disabled", "suggest", "apply"];

export const load: PageLoad = ({ url }) => {
  const requestedCase = url.searchParams.get("case") as ExperimentCaseId;
  const requestedMode = url.searchParams.get("mode") as AdaptationMode;
  const caseId = experimentCaseIds.includes(requestedCase)
    ? requestedCase
    : experimentCaseIds[0];
  const mode = adaptationModes.includes(requestedMode)
    ? requestedMode
    : "suggest";

  return { experiment: getExperimentCase(caseId, mode), mode };
};

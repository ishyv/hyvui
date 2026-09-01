import type { PageLoad } from "./$types.js";
import {
  baselineCaseIds,
  type BaselineCaseId,
} from "$lib/next-lab/baselineCases.js";

export const load: PageLoad = ({ url }) => {
  const requested = url.searchParams.get("case");
  const caseId = baselineCaseIds.includes(requested as BaselineCaseId)
    ? (requested as BaselineCaseId)
    : baselineCaseIds[0];

  return { caseId };
};

import type { PageLoad } from "./$types.js";
import {
  resolvePassage,
  type PassageMode,
} from "$lib/next-experiments/passageResolution.js";
import type { PassageStep } from "$lib/next-experiments/Passage.svelte";

const reason =
  "the habitat must absorb the subject across three readable steps";
const steps: PassageStep[] = [
  {
    id: "shoreline",
    label: "01 / shoreline",
    heading: "the first trace reaches the surface.",
    body: "water, fabric, and light share one edge before the subject appears.",
  },
  {
    id: "saturation",
    label: "02 / saturation",
    heading: "the outline loses contrast.",
    body: "the field grows denser. reflection and sediment replace the readable edge.",
  },
  {
    id: "absorption",
    label: "03 / absorption",
    heading: "the trace remains in the water.",
    body: "the passage ends without closure. the subject has altered the field around it.",
  },
];

export const load: PageLoad = ({ url }) => {
  const requestedMode = url.searchParams.get("mode") as PassageMode;
  const mode = requestedMode === "static" ? "static" : "scroll";
  return {
    plan: resolvePassage("ecological-elegy", { mode, reason }),
    steps,
  };
};

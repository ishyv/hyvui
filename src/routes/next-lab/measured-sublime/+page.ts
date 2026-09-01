import type { PageLoad } from "./$types.js";
import { resolveComposition } from "$lib/next-experiments/core.js";
import { resolveMeasuredSublime } from "$lib/next-experiments/measuredSublime.js";
import type {
  CompositionNodeSpec,
  CompositionRelation,
} from "$lib/next-experiments/types.js";

const premise =
  "a system can measure every relation except the moment intention becomes form";

const nodes: CompositionNodeSpec[] = [
  { id: "intention", content: "premise", role: "focal-point" },
  { id: "constraint", content: "boundary", role: "counterweight" },
  { id: "decision", content: "form", role: "interruption" },
  { id: "witness", content: "evidence", role: "foreground" },
];

const relations: CompositionRelation[] = [
  {
    id: "constraint-anchors-intention",
    kind: "anchor",
    source: "constraint",
    target: "intention",
    strength: "required",
    behavior: "hold intention against the declared boundary",
  },
  {
    id: "decision-reveals-intention",
    kind: "reveal",
    source: "decision",
    target: "intention",
    strength: "preferred",
    behavior: "expose the moment intention becomes visible form",
  },
  {
    id: "witness-follows-decision",
    kind: "connect",
    source: "witness",
    target: "decision",
    strength: "hint",
    behavior: "let readable evidence follow the decision",
  },
];

export const load: PageLoad = () => {
  const composition = resolveComposition({
    artDirection: {
      seed: "measured-sublime-01",
      adaptation: "apply",
    },
    nodes,
    relations,
  });
  const specimen = resolveMeasuredSublime({
    seed: "measured-sublime-01",
    premise,
    field: { quietRatio: 0.58, register: "austere-apparatus" },
    phenomenon: {
      id: "decision-specimen",
      source: "composition-decisions",
    },
    trajectory: "exposure",
    rupture: {
      kind: "internal-seam",
      relationId: "decision-reveals-intention",
    },
    withholding: "conceal-facets-until-inspected",
    materialEvidence: [
      "node-boundary",
      "relation-seam",
      "decision-registration",
    ],
    composition,
    relations,
  });

  return { premise, composition, specimen, relations };
};

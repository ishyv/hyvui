import type { PageLoad } from "./$types.js";
import { resolveBiomeComposition } from "$lib/next-experiments/biomeComposition.js";
import type { BiomeBrief } from "$lib/next-experiments/biomes.js";
import type {
  ArtDirection,
  CompositionNodeSpec,
  CompositionRelation,
} from "$lib/next-experiments/types.js";

const brief: BiomeBrief = {
  seed: "witness-cannot-be-calibrated-01",
  premise: "the act of looking changes the thing it claims to measure",
  hostBiome: "operational-apparatus",
  grafts: [
    {
      biome: "celestial-cartography",
      channel: "framing",
      mode: "symbiotic",
      reason: "the observation field becomes a navigable private sky",
    },
  ],
  contentOrder: ["field", "aperture", "trace", "record"],
  requiredContent: ["field", "aperture", "trace", "record"],
  withholding: "widening the view restores context while reducing certainty",
  focalPolicy: "singular",
};

const nodes: CompositionNodeSpec[] = [
  {
    id: "field",
    content: "Surface",
    role: "field",
    capabilities: ["field", "frame"],
    priority: 1,
  },
  {
    id: "aperture",
    content: "Surface",
    role: "focal-point",
    capabilities: ["focal-point", "reveal", "bounded-variation"],
    priority: 4,
  },
  {
    id: "trace",
    content: "EnergyArc",
    role: "connector",
    capabilities: ["connect", "frame"],
    priority: 2,
  },
  {
    id: "record",
    content: "Text",
    role: "counterweight",
    capabilities: ["counterweight", "reveal"],
    priority: 3,
  },
];

const relations: CompositionRelation[] = [
  {
    id: "aperture-frames-field",
    kind: "frame",
    source: "aperture",
    target: "field",
    strength: "required",
    behavior: "hold one observation inside the larger uncertain field",
    fallback: "keep the aperture and field in authored order",
  },
  {
    id: "trace-connects-aperture",
    kind: "connect",
    source: "trace",
    target: "aperture",
    strength: "preferred",
    behavior: "carry the act of looking from the aperture into its context",
    fallback: "keep the trace as a readable relation below the field",
  },
  {
    id: "record-reveals-aperture",
    kind: "reveal",
    source: "record",
    target: "aperture",
    strength: "preferred",
    behavior: "let the record become less certain as context expands",
    fallback: "keep the selected observation readable in the rail",
  },
];

const artDirection: ArtDirection = {
  seed: brief.seed,
  material: "mission-control",
  mood: "an instrument looking back",
  density: "balanced",
  contrast: "quiet",
  rhythm: "slow",
  motion: "active",
  adaptation: "disabled",
};

export const load: PageLoad = () => ({
  artDirection,
  brief,
  nodes,
  relations,
  plan: resolveBiomeComposition({
    brief,
    nodes,
    relations,
    adaptation: artDirection.adaptation,
  }),
});

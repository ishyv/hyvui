import type { PageLoad } from "./$types.js";
import { resolveBiomeComposition } from "$lib/next-experiments/biomeComposition.js";
import type { BiomeBrief } from "$lib/next-experiments/biomes.js";
import type {
  CompositionNodeSpec,
  CompositionRelation,
  ArtDirection,
} from "$lib/next-experiments/types.js";

const brief: BiomeBrief = {
  seed: "plan-01",
  premise: "the habitat remains legible only through its maintenance traces",
  hostBiome: "machine-ecology",
  focalPolicy: "polycentric",
  grafts: [
    {
      biome: "operational-apparatus",
      channel: "information",
      mode: "symbiotic",
      reason: "maintenance records make local mechanisms legible",
    },
  ],
};

const nodes: CompositionNodeSpec[] = [
  { id: "signal", content: "Text", role: "focal-point", priority: 1 },
  { id: "route", content: "ThreadLine", role: "connector", priority: 3 },
  { id: "habitat", content: "Surface", role: "field", priority: 0 },
];

const relations: CompositionRelation[] = [
  {
    id: "route-connects-signal",
    kind: "connect",
    source: "route",
    target: "signal",
    strength: "preferred",
    behavior: "carry maintenance evidence toward the signal",
    fallback: "keep the authored flow",
  },
];

const artDirection: ArtDirection = {
  seed: brief.seed,
  adaptation: "suggest",
  material: "mission-control",
  density: "balanced",
  contrast: "quiet",
  rhythm: "varied",
  motion: "still",
};

export const load: PageLoad = () => ({
  plan: resolveBiomeComposition({ brief, nodes, relations }),
  artDirection,
  nodes,
  relations,
});

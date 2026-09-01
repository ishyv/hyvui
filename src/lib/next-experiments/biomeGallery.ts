import { getBiomeDefinition, type BiomeBrief } from "./biomes.js";
import { resolveBiomeBrief } from "./biomeResolution.js";

export const biomeProofIds = [
  "ceremonial-reliquary",
  "ecological-elegy",
  "oneiric-object-poetry",
  "machine-ecology",
  "manifesto-print",
  "kinetic-rupture",
] as const;

export type BiomeProofId = (typeof biomeProofIds)[number];

export type SharedBiomeContent = {
  eyebrow: string;
  title: string;
  body: string;
  datum: string;
  status: string;
  action: string;
};

export type BiomeProof = {
  id: BiomeProofId;
  title: string;
  host: string;
  thesis: string;
  spatialLaw: string;
  density: string;
  timeModel: string;
  viewerRole: string;
  frameMode: string;
  palette: string;
  stageLabel: string;
  signal: string;
  content: SharedBiomeContent;
};

type BiomeProofScenario = Pick<
  BiomeProof,
  "id" | "title" | "thesis" | "palette" | "stageLabel" | "signal" | "content"
>;

export const sharedBiomeContent: SharedBiomeContent = {
  eyebrow: "hyvui / field note 06",
  title: "one observation. six arrangements.",
  body: "the same words sit under six different spatial rules.",
  datum: "observation / 06",
  status: "proof / six hosts",
  action: "open next frame",
};

const biomeProofScenarios: BiomeProofScenario[] = [
  {
    id: "ceremonial-reliquary",
    title: "the chamber keeps the signal",
    thesis: "ornament carries the label. approach sets the order of attention.",
    palette: "warm-metal-and-night",
    stageLabel: "reliquary / 01",
    signal: "the jewel remains lit",
    content: sharedBiomeContent,
  },
  {
    id: "ecological-elegy",
    title: "the water closes over the body",
    thesis: "the body enters the habitat and disappears by degrees.",
    palette: "water-and-ashen-green",
    stageLabel: "elegy / 02",
    signal: "the surface closes over",
    content: sharedBiomeContent,
  },
  {
    id: "oneiric-object-poetry",
    title: "one object sets the scale",
    thesis: "one impossible object sets the scale for everything around it.",
    palette: "domestic-night-and-moon",
    stageLabel: "object poem / 03",
    signal: "the weight settles",
    content: sharedBiomeContent,
  },
  {
    id: "machine-ecology",
    title: "the habitat has no center",
    thesis: "each local part can be read. the full route cannot.",
    palette: "corrosion-and-cool-metal",
    stageLabel: "habitat / 04",
    signal: "the route remains in use",
    content: sharedBiomeContent,
  },
  {
    id: "manifesto-print",
    title: "the sentence refuses the margin",
    thesis: "the sentence crosses the margin. the mark answers back.",
    palette: "paper-ink-and-signal",
    stageLabel: "manifesto / 05",
    signal: "the line interrupts",
    content: sharedBiomeContent,
  },
  {
    id: "kinetic-rupture",
    title: "the path breaks into motion",
    thesis: "the body leaves by a visible path.",
    palette: "carbon-and-hot-amber",
    stageLabel: "rupture / 06",
    signal: "the body has become a path",
    content: sharedBiomeContent,
  },
];

export const biomeProofs: BiomeProof[] = biomeProofScenarios.map((scenario) => {
  const definition = getBiomeDefinition(scenario.id);
  if (!definition) {
    throw new Error(`missing biome definition for proof: ${scenario.id}`);
  }
  return {
    ...scenario,
    host: definition.label,
    spatialLaw: definition.spatialLaw,
    density: definition.density,
    timeModel: definition.timeModel,
    viewerRole: definition.viewerRole,
    frameMode: definition.frameModes[0] ?? "still-display",
  };
});

export type BiomeHybridProof = {
  id: string;
  label: string;
  brief: BiomeBrief;
};

export const biomeHybridProofs: BiomeHybridProof[] = [
  {
    id: "elegy-archive",
    label: "ecological elegy × operational archive",
    brief: {
      seed: "hybrid-elegy-archive-01",
      premise: "the archive lists what the habitat absorbs over time",
      hostBiome: "ecological-elegy",
      grafts: [
        {
          biome: "operational-apparatus",
          channel: "information",
          mode: "tensional",
          reason: "maintenance records show what the habitat has taken",
        },
      ],
    },
  },
  {
    id: "reliquary-cosmos",
    label: "ceremonial reliquary × celestial cartography",
    brief: {
      seed: "hybrid-reliquary-cosmos-01",
      premise: "the relic receives a navigation light",
      hostBiome: "ceremonial-reliquary",
      grafts: [
        {
          biome: "celestial-cartography",
          channel: "light",
          mode: "symbiotic",
          reason: "the aureole marks the relic's orbit",
        },
      ],
    },
  },
  {
    id: "manifesto-commons",
    label: "manifesto print × noise commons",
    brief: {
      seed: "hybrid-manifesto-commons-01",
      premise: "the public sentence gathers the marks that interrupt it",
      hostBiome: "manifesto-print",
      grafts: [
        {
          biome: "noise-commons",
          channel: "material",
          mode: "symbiotic",
          reason: "the marks sit on the sentence as material interruptions",
        },
      ],
    },
  },
];

const destructiveHybridProof: BiomeHybridProof = {
  id: "object-poetry-diagnostic",
  label: "oneiric object-poetry × operational diagnostic",
  brief: {
    seed: "hybrid-object-diagnostic-01",
    premise: "the small impossible object becomes a diagnostic dashboard",
    hostBiome: "oneiric-object-poetry",
    grafts: [
      {
        biome: "operational-apparatus",
        channel: "information",
        mode: "tensional",
        reason:
          "a dashboard changes the object from poem to diagnostic surface",
      },
    ],
  },
};

const allBiomeHybridProofs = [...biomeHybridProofs, destructiveHybridProof];

export function resolveBiomeHybridProof(id: string) {
  const proof = allBiomeHybridProofs.find((candidate) => candidate.id === id);
  if (!proof) return undefined;
  return { ...proof, ...resolveBiomeBrief(proof.brief) };
}

export function getBiomeProof(
  id: string | null | undefined,
): BiomeProof | undefined {
  return biomeProofs.find((proof) => proof.id === id);
}

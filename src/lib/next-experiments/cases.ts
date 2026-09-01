import type {
  AdaptationMode,
  ArtDirection,
  CompositionNodeSpec,
  CompositionRelation,
  NodeRole,
} from "./types.js";

export const experimentCaseIds = [
  "sparse",
  "dense",
  "image-dominant",
  "type-dominant",
  "atmospheric-motion",
] as const;

export type ExperimentCaseId = (typeof experimentCaseIds)[number];

export type ExperimentCase = {
  id: ExperimentCaseId;
  title: string;
  description: string;
  artDirection: Omit<ArtDirection, "adaptation">;
  nodes: CompositionNodeSpec[];
  relations: CompositionRelation[];
};

const node = (
  id: string,
  content: string,
  role: NodeRole,
  capabilities: string[] = [],
  extra: Partial<CompositionNodeSpec> = {},
): CompositionNodeSpec => ({ id, content, role, capabilities, ...extra });

const relation = (
  id: string,
  kind: CompositionRelation["kind"],
  source: string,
  target: string,
  behavior: string,
  strength: CompositionRelation["strength"] = "preferred",
  overlapIntent?: CompositionRelation["overlap"],
): CompositionRelation => ({
  id,
  kind,
  source,
  target,
  strength,
  ...(overlapIntent ? { overlap: overlapIntent } : {}),
  behavior,
  fallback: "keep the authored flow",
});

export const experimentCases: ExperimentCase[] = [
  {
    id: "sparse",
    title: "a room held open",
    description:
      "the signal crosses the note edge. the surrounding field stays open.",
    artDirection: {
      seed: "next-sparse-01",
      mood: "quiet tension",
      material: "archive",
      density: "sparse",
      contrast: "quiet",
      rhythm: "slow",
      motion: "still",
    },
    nodes: [
      node("signal", "Text", "focal-point", [
        "bounded-variation",
        "overlap-target",
      ]),
      node("note", "Surface", "counterweight", ["bounded-variation"]),
    ],
    relations: [
      relation(
        "signal-over-note",
        "overlap",
        "signal",
        "note",
        "let the focal signal cross the note edge",
        "preferred",
        "edge",
      ),
    ],
  },
  {
    id: "dense",
    title: "the active register",
    description: "small readings form one field around the focal value.",
    artDirection: {
      seed: "next-dense-01",
      mood: "measured pressure",
      material: "mission-control",
      density: "dense",
      contrast: "balanced",
      rhythm: "tight",
      motion: "restrained",
    },
    nodes: [
      node("readings", "Grid", "field", ["bounded-variation"]),
      node("focal-readout", "Text", "focal-point", ["bounded-variation"]),
      node("trace", "ThreadLine", "connector", ["connective"]),
    ],
    relations: [
      relation(
        "trace-connects-readings",
        "connect",
        "trace",
        "readings",
        "keep the readings in one field",
      ),
      relation(
        "focal-echoes-trace",
        "echo",
        "focal-readout",
        "trace",
        "repeat the focal cadence once",
      ),
    ],
  },
  {
    id: "image-dominant",
    title: "the recovered surface",
    description: "the image leads. its caption stays attached to the edge.",
    artDirection: {
      seed: "next-image-01",
      mood: "artifact under inspection",
      material: "hextech",
      density: "balanced",
      contrast: "aggressive",
      rhythm: "varied",
      motion: "still",
    },
    nodes: [
      node("artifact", "Frame", "focal-point", [
        "bounded-variation",
        "anchor-source",
      ]),
      node("caption", "Text", "counterweight", ["anchor-target"]),
      node("edge-mark", "Glyph", "frame", ["edge-aware"]),
    ],
    relations: [
      relation(
        "caption-follows-artifact",
        "anchor",
        "caption",
        "artifact",
        "keep the caption attached to the artifact",
      ),
      relation(
        "mark-frames-artifact",
        "frame",
        "edge-mark",
        "artifact",
        "let the mark catch the image edge",
        "hint",
      ),
    ],
  },
  {
    id: "type-dominant",
    title: "the sentence sets the measure",
    description:
      "the divider approaches the sentence but leaves its authored position.",
    artDirection: {
      seed: "next-type-01",
      mood: "language under pressure",
      material: "field-notebook",
      density: "sparse",
      contrast: "aggressive",
      rhythm: "varied",
      motion: "still",
    },
    nodes: [
      node("statement", "Text", "focal-point", ["bounded-variation"], {
        constraints: { manualPlacement: true },
        placement: { x: "8%", y: "24%", scale: 1.1, rotate: "-2deg" },
      }),
      node("interruption", "Divider", "interruption", ["edge-aware"]),
      node("citation", "Label", "counterweight", ["bounded-variation"]),
    ],
    relations: [
      relation(
        "line-interrupts-statement",
        "interrupt",
        "interruption",
        "statement",
        "interrupt the reading without moving the statement",
      ),
      relation(
        "citation-echoes-statement",
        "echo",
        "citation",
        "statement",
        "repeat one fragment in the margin",
        "hint",
      ),
    ],
  },
  {
    id: "atmospheric-motion",
    title: "the reliquary in weather",
    description:
      "a raised signal sits inside moving weather. a trace points onward.",
    artDirection: {
      seed: "next-atmosphere-01",
      mood: "weather around a signal",
      material: "arcane",
      density: "balanced",
      contrast: "quiet",
      rhythm: "slow",
      motion: "active",
      authority: "strong",
      gesture: "reliquary",
      thesis: "the signal is being swallowed by weather",
      focal: "beacon",
      motif: "concentric-interruption",
      palette: "cold-to-warm-rupture",
      typography: "monumental-whisper",
      depth: "veil-beacon-field",
      interaction: "gravitational-hover",
    },
    nodes: [
      node("weather", "GridOverlay", "atmosphere", ["ambient"]),
      node("beacon", "FloatCard", "focal-point", [
        "bounded-variation",
        "depth",
      ]),
      node("trace", "EnergyArc", "connector", ["connective"]),
    ],
    relations: [
      relation(
        "weather-surrounds-beacon",
        "overlap",
        "weather",
        "beacon",
        "let the field pass behind the raised object",
        "preferred",
        "field",
      ),
      relation(
        "trace-leaves-beacon",
        "connect",
        "trace",
        "beacon",
        "carry the motion toward the next scene",
      ),
    ],
  },
];

export function getExperimentCase(
  id: ExperimentCaseId,
  adaptation: AdaptationMode,
): ExperimentCase & { artDirection: ArtDirection } {
  const selected =
    experimentCases.find((item) => item.id === id) ?? experimentCases[0];
  return {
    ...selected,
    artDirection: { ...selected.artDirection, adaptation },
  };
}

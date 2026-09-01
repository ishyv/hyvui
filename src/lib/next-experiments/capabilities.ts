import type { CompositionGesture, NodeRole, RelationKind } from "./types.js";
import {
  listBiomeCapabilities,
  type AgentBiomeCapability,
} from "./biomeManifest.js";

export type VisualCapability = {
  id: string;
  label: string;
  roles: NodeRole[];
  compatibleRelations: RelationKind[];
  canContain: boolean;
  canBeContained: boolean;
  scale: "bounded" | "fluid" | "extreme";
  notes: string;
};

export type MaterialCapability = {
  component: string;
  roles: NodeRole[];
  strengths: string[];
  compatibleRelations: RelationKind[];
  cautions: string[];
};

export type ArtGestureCapability = {
  id: CompositionGesture;
  label: string;
  principle: string;
  signatures: string[];
  cautions: string[];
};

export type AgentManifest = {
  schemaVersion: "0.1";
  defaultAdaptation: "suggest";
  identity: string[];
  compositionRules: string[];
  antiPatterns: string[];
  materials: MaterialCapability[];
  gestures: ArtGestureCapability[];
  biomes: AgentBiomeCapability[];
};

const visualCapabilities: VisualCapability[] = [
  {
    id: "anchor",
    label: "anchor",
    roles: ["connector", "frame", "counterweight"],
    compatibleRelations: ["anchor", "connect"],
    canContain: false,
    canBeContained: true,
    scale: "bounded",
    notes:
      "holds a neighboring object in place or gives a spatial reading a point of return.",
  },
  {
    id: "atmosphere",
    label: "atmosphere",
    roles: ["atmosphere", "background", "field"],
    compatibleRelations: ["overlap", "echo", "frame"],
    canContain: true,
    canBeContained: false,
    scale: "fluid",
    notes:
      "changes the temperature of a region without becoming its primary content.",
  },
  {
    id: "connect",
    label: "connect",
    roles: ["connector"],
    compatibleRelations: ["connect", "anchor", "echo"],
    canContain: false,
    canBeContained: true,
    scale: "fluid",
    notes: "carries a visual thread between two participants.",
  },
  {
    id: "counterweight",
    label: "counterweight",
    roles: ["counterweight", "frame"],
    compatibleRelations: ["overlap", "echo", "anchor"],
    canContain: true,
    canBeContained: true,
    scale: "bounded",
    notes: "balances a focal point through mass, distance, contrast, or quiet.",
  },
  {
    id: "echo",
    label: "echo",
    roles: ["interruption", "counterweight", "foreground"],
    compatibleRelations: ["echo", "reveal", "connect"],
    canContain: false,
    canBeContained: true,
    scale: "bounded",
    notes:
      "repeats a shape, line, phrase, or material cue without becoming a duplicate card.",
  },
  {
    id: "field",
    label: "field",
    roles: ["field", "background", "atmosphere"],
    compatibleRelations: ["overlap", "frame", "connect"],
    canContain: true,
    canBeContained: false,
    scale: "fluid",
    notes:
      "provides a region in which other things can gather, drift, or remain apart.",
  },
  {
    id: "focal-point",
    label: "focal point",
    roles: ["focal-point", "foreground"],
    compatibleRelations: ["overlap", "echo", "frame"],
    canContain: true,
    canBeContained: true,
    scale: "extreme",
    notes:
      "carries the primary visual idea. give it room, contrast, or a deliberate obstruction.",
  },
  {
    id: "frame",
    label: "frame",
    roles: ["frame", "background", "foreground"],
    compatibleRelations: ["frame", "overlap", "anchor"],
    canContain: true,
    canBeContained: false,
    scale: "fluid",
    notes: "defines an edge or threshold without defaulting to a rounded box.",
  },
  {
    id: "interrupt",
    label: "interrupt",
    roles: ["interruption", "foreground", "connector"],
    compatibleRelations: ["interrupt", "overlap", "echo"],
    canContain: false,
    canBeContained: true,
    scale: "bounded",
    notes:
      "breaks an expected rhythm once so the surrounding rhythm becomes visible.",
  },
  {
    id: "overlap",
    label: "overlap",
    roles: ["focal-point", "counterweight", "foreground", "frame"],
    compatibleRelations: ["overlap", "anchor", "interrupt"],
    canContain: true,
    canBeContained: true,
    scale: "bounded",
    notes:
      "lets two materials share space. use explicit z-order and a fallback for narrow viewports.",
  },
];

const materialCapabilities: MaterialCapability[] = [
  {
    component: "Text",
    roles: ["focal-point", "counterweight", "interruption", "foreground"],
    strengths: [
      "extreme scale",
      "line-break control",
      "semantic expression",
      "rhythmic repetition",
    ],
    compatibleRelations: ["echo", "overlap", "interrupt", "frame"],
    cautions: [
      "do not use every text node as a heading",
      "do not center every focal statement",
    ],
  },
  {
    component: "Surface",
    roles: ["field", "counterweight", "frame", "focal-point"],
    strengths: [
      "material continuity",
      "inset structure",
      "theme participation",
      "containment",
    ],
    compatibleRelations: ["overlap", "frame", "anchor", "echo"],
    cautions: [
      "do not turn every participant into a card",
      "preserve explicit overflow intent",
    ],
  },
  {
    component: "Frame",
    roles: ["focal-point", "frame", "field"],
    strengths: ["aspect-ratio", "image bleed", "shape preservation"],
    compatibleRelations: ["anchor", "overlap", "frame"],
    cautions: [
      "choose a ratio for the visual idea, not because 16/9 is familiar",
    ],
  },
  {
    component: "DepthStage",
    roles: ["field", "background", "focal-point", "foreground"],
    strengths: ["spatial layers", "perspective", "grounding"],
    compatibleRelations: ["overlap", "anchor", "connect"],
    cautions: [
      "use one focal depth story",
      "do not add 3D transforms as decoration alone",
    ],
  },
  {
    component: "GridOverlay",
    roles: ["atmosphere", "background", "field"],
    strengths: ["quiet texture", "orientation", "material continuity"],
    compatibleRelations: ["overlap", "frame", "echo"],
    cautions: [
      "fade or omit it in dense content",
      "keep it semantically invisible",
    ],
  },
  {
    component: "Sequence",
    roles: ["foreground", "interruption", "focal-point"],
    strengths: ["choreography", "stagger", "reveal rhythm"],
    compatibleRelations: ["reveal", "echo", "interrupt"],
    cautions: [
      "stage one focal path",
      "do not make every element enter at once",
    ],
  },
];

const gestureCapabilities: ArtGestureCapability[] = [
  {
    id: "altarpiece",
    label: "altarpiece",
    principle: "light makes a hierarchy out of witnesses",
    signatures: [
      "one elevated focal point",
      "directional light",
      "quiet witnesses",
    ],
    cautions: ["do not make every participant equally sacred"],
  },
  {
    id: "fracture",
    label: "fracture",
    principle: "a broken axis remains visible through contrast",
    signatures: [
      "misaligned type",
      "interrupted field",
      "palette discontinuity",
    ],
    cautions: ["do not confuse noise with a broken idea"],
  },
  {
    id: "procession",
    label: "procession",
    principle: "meaning arrives by passing through several scales",
    signatures: ["diagonal movement", "receding echoes", "changing scale"],
    cautions: ["give the procession a destination"],
  },
  {
    id: "reliquary",
    label: "reliquary",
    principle: "one precious object is held inside a surrounding field",
    signatures: ["raised focal object", "negative space", "protective veil"],
    cautions: ["do not turn the focal object into an ordinary card"],
  },
  {
    id: "installation",
    label: "installation",
    principle: "the empty room is part of the object",
    signatures: [
      "separated islands",
      "active negative space",
      "viewer response",
    ],
    cautions: ["do not fill every empty region"],
  },
  {
    id: "weather-system",
    label: "weather system",
    principle: "a living field changes the meaning of a still object",
    signatures: ["slow drift", "atmospheric depth", "light movement"],
    cautions: ["keep one still object for the weather to change"],
  },
];

export function listVisualCapabilities(): VisualCapability[] {
  return visualCapabilities.map((capability) => ({
    ...capability,
    roles: [...capability.roles],
    compatibleRelations: [...capability.compatibleRelations],
  }));
}

export function getVisualCapability(id: string): VisualCapability | undefined {
  return listVisualCapabilities().find((capability) => capability.id === id);
}

export function listMaterialCapabilities(): MaterialCapability[] {
  return materialCapabilities.map((material) => ({
    ...material,
    roles: [...material.roles],
    strengths: [...material.strengths],
    compatibleRelations: [...material.compatibleRelations],
    cautions: [...material.cautions],
  }));
}

export function getAgentManifest(): AgentManifest {
  return {
    schemaVersion: "0.1",
    defaultAdaptation: "suggest",
    identity: [
      "dark by default",
      "token-driven material",
      "serif body and mono metadata",
      "gold for human warmth and teal for machine signal",
      "quiet depth and intentional motion",
    ],
    compositionRules: [
      "choose a focal point before choosing a container",
      "use explicit placement when the composition depends on it",
      "prefer a meaningful relation over a new component variant",
      "let one rhythm dominate and interrupt it once",
      "keep variation bounded, seeded, and inspectable",
      "preserve normal HTML and CSS as an escape hatch",
      "choose one host biome before selecting any graft",
      "graft through one named channel and explain the bridge or conflict",
      "reject destructive combinations instead of averaging their styles",
    ],
    antiPatterns: [
      "repeat the same scene wrapper for every page",
      "turn every participant into a card",
      "add random offsets without a visual reason",
      "let adaptation silently override explicit placement",
      "invent a new accent hue to solve a composition problem",
      "use documentation examples as a canonical page template",
    ],
    materials: listMaterialCapabilities(),
    gestures: gestureCapabilities.map((gesture) => ({
      ...gesture,
      signatures: [...gesture.signatures],
      cautions: [...gesture.cautions],
    })),
    biomes: listBiomeCapabilities(),
  };
}

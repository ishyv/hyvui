import { createSeededRandom, deterministicVariation } from "./core.js";
import type {
  ArtDirection,
  ArtDirectorAuthority,
  CompositionGesture,
  CompositionNodeSpec,
  DepthBehavior,
  InteractionBehavior,
  PaletteBehavior,
  TypographyBehavior,
} from "./types.js";

export const compositionGestures: CompositionGesture[] = [
  "altarpiece",
  "fracture",
  "procession",
  "reliquary",
  "installation",
  "weather-system",
];

export type ArtLayer =
  | "background"
  | "atmosphere"
  | "midground"
  | "focal"
  | "foreground";

export type ArtPose = {
  x?: string;
  y?: string;
  scale: number;
  rotate: string;
  z: number;
};

export type ArtDirectorPlan = {
  authority: ArtDirectorAuthority;
  gesture: CompositionGesture;
  thesis: string;
  focalNodeId?: string;
  motif: string;
  palette: PaletteBehavior;
  typography: TypographyBehavior;
  depth: DepthBehavior;
  interaction: InteractionBehavior;
  semanticOrder: string[];
  nodePlanes: Record<string, ArtLayer>;
  nodePoses: Record<string, ArtPose>;
  layerOrder: ArtLayer[];
  canAddAtmosphere: boolean;
  canRemoveRequiredContent: false;
};

const gestureDefaults: Record<
  CompositionGesture,
  Omit<
    ArtDirectorPlan,
    | "authority"
    | "gesture"
    | "focalNodeId"
    | "semanticOrder"
    | "nodePlanes"
    | "nodePoses"
  >
> = {
  altarpiece: {
    thesis: "light makes a hierarchy out of witnesses",
    motif: "descending-light",
    palette: "material-contrast",
    typography: "monumental-whisper",
    depth: "stacked-planes",
    interaction: "reveal-on-proximity",
    layerOrder: [
      "background",
      "atmosphere",
      "midground",
      "focal",
      "foreground",
    ],
    canAddAtmosphere: true,
    canRemoveRequiredContent: false,
  },
  fracture: {
    thesis: "the image is still holding after the axis broke",
    motif: "broken-axis",
    palette: "cold-to-warm-rupture",
    typography: "fragmented",
    depth: "near-far",
    interaction: "field-response",
    layerOrder: [
      "background",
      "midground",
      "focal",
      "atmosphere",
      "foreground",
    ],
    canAddAtmosphere: true,
    canRemoveRequiredContent: false,
  },
  procession: {
    thesis: "meaning arrives by passing through several scales",
    motif: "receding-echo",
    palette: "ink-and-signal",
    typography: "processional",
    depth: "near-far",
    interaction: "gravitational-hover",
    layerOrder: [
      "background",
      "focal",
      "midground",
      "atmosphere",
      "foreground",
    ],
    canAddAtmosphere: true,
    canRemoveRequiredContent: false,
  },
  reliquary: {
    thesis: "the signal is being swallowed by weather",
    motif: "concentric-interruption",
    palette: "cold-to-warm-rupture",
    typography: "monumental-whisper",
    depth: "veil-beacon-field",
    interaction: "gravitational-hover",
    layerOrder: [
      "background",
      "atmosphere",
      "midground",
      "focal",
      "foreground",
    ],
    canAddAtmosphere: true,
    canRemoveRequiredContent: false,
  },
  installation: {
    thesis: "the empty room is part of the object",
    motif: "distant-islands",
    palette: "material-contrast",
    typography: "fragmented",
    depth: "stacked-planes",
    interaction: "field-response",
    layerOrder: [
      "background",
      "focal",
      "atmosphere",
      "midground",
      "foreground",
    ],
    canAddAtmosphere: true,
    canRemoveRequiredContent: false,
  },
  "weather-system": {
    thesis: "a living field changes the meaning of the still object",
    motif: "slow-orbit",
    palette: "cold-to-warm-rupture",
    typography: "monumental-whisper",
    depth: "veil-beacon-field",
    interaction: "field-response",
    layerOrder: [
      "background",
      "atmosphere",
      "focal",
      "midground",
      "foreground",
    ],
    canAddAtmosphere: true,
    canRemoveRequiredContent: false,
  },
};

function planeForNode(node: CompositionNodeSpec): ArtLayer {
  if (["background", "field"].includes(node.role)) return "background";
  if (node.role === "atmosphere") return "atmosphere";
  if (node.role === "focal-point") return "focal";
  if (["foreground", "frame"].includes(node.role)) return "foreground";
  return "midground";
}

function poseForNode(
  direction: ArtDirection,
  gesture: CompositionGesture,
  node: CompositionNodeSpec,
): ArtPose {
  const variation = deterministicVariation(direction.seed, `pose:${node.id}`);
  const scale = (value: number) =>
    Number((value + variation * 0.12).toFixed(3));

  if (gesture === "reliquary") {
    if (node.role === "focal-point") {
      return { x: "41%", y: "19%", scale: scale(1.04), rotate: "3deg", z: 5 };
    }
    if (node.role === "atmosphere") {
      return { x: "0%", y: "0%", scale: scale(1.14), rotate: "-8deg", z: 2 };
    }
    if (node.role === "connector") {
      return { x: "8%", scale: scale(1), rotate: "-13deg", z: 3 };
    }
  }

  const plane = planeForNode(node);
  return {
    scale: scale(plane === "focal" ? 1.04 : 1),
    rotate: plane === "foreground" ? "-3deg" : "0deg",
    z: {
      background: 1,
      atmosphere: 2,
      midground: 3,
      focal: 5,
      foreground: 6,
    }[plane],
  };
}

export function selectCompositionGesture(seed: string): CompositionGesture {
  const random = createSeededRandom(`gesture:${seed}`);
  return compositionGestures[Math.floor(random() * compositionGestures.length)];
}

export function resolveArtDirector(
  direction: ArtDirection,
  nodes: CompositionNodeSpec[],
): ArtDirectorPlan {
  const authority = direction.authority ?? "bounded";
  const gesture = direction.gesture ?? selectCompositionGesture(direction.seed);
  const defaults = gestureDefaults[gesture];
  const focalNodeId =
    direction.focal ?? nodes.find((node) => node.role === "focal-point")?.id;
  const canMutateVisuals =
    authority === "strong" && direction.adaptation === "apply";

  return {
    authority,
    gesture,
    thesis: direction.thesis ?? defaults.thesis,
    focalNodeId,
    motif: direction.motif ?? defaults.motif,
    palette: direction.palette ?? defaults.palette,
    typography: direction.typography ?? defaults.typography,
    depth: direction.depth ?? defaults.depth,
    interaction: direction.interaction ?? defaults.interaction,
    semanticOrder: nodes.map((node) => node.id),
    nodePlanes: Object.fromEntries(
      nodes.map((node) => [node.id, planeForNode(node)]),
    ),
    nodePoses: canMutateVisuals
      ? Object.fromEntries(
          nodes
            .filter((node) => !node.constraints?.manualPlacement)
            .map((node) => [node.id, poseForNode(direction, gesture, node)]),
        )
      : {},
    layerOrder: defaults.layerOrder,
    canAddAtmosphere: canMutateVisuals && defaults.canAddAtmosphere,
    canRemoveRequiredContent: false,
  };
}

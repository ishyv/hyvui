export const relationKinds = [
  "overlap",
  "anchor",
  "echo",
  "connect",
  "interrupt",
  "frame",
  "reveal",
] as const;

export type RelationKind = (typeof relationKinds)[number];
export type RelationStrength = "required" | "preferred" | "hint";
export type OverlapIntent = "edge" | "partial" | "deep" | "field";
export type AdaptationMode = "disabled" | "suggest" | "apply";
export type CompositionDensity = "sparse" | "balanced" | "dense";
export type Contrast = "quiet" | "balanced" | "aggressive";
export type Rhythm = "slow" | "varied" | "tight";
export type Motion = "still" | "restrained" | "active";
export type ArtDirectorAuthority = "bounded" | "strong";
export type CompositionGesture =
  | "altarpiece"
  | "fracture"
  | "procession"
  | "reliquary"
  | "installation"
  | "weather-system";
export type PaletteBehavior =
  | "steady"
  | "cold-to-warm-rupture"
  | "ink-and-signal"
  | "material-contrast";
export type TypographyBehavior =
  | "uniform"
  | "monumental-whisper"
  | "fragmented"
  | "processional";
export type DepthBehavior =
  | "flat"
  | "veil-beacon-field"
  | "stacked-planes"
  | "near-far";
export type InteractionBehavior =
  | "quiet"
  | "gravitational-hover"
  | "field-response"
  | "reveal-on-proximity";
export type NodeRole =
  | "focal-point"
  | "counterweight"
  | "field"
  | "connector"
  | "interruption"
  | "frame"
  | "atmosphere"
  | "foreground"
  | "background";

export type Placement = {
  x?: string;
  y?: string;
  scale?: number;
  rotate?: string;
  z?: number;
};

export type NodeConstraints = {
  manualPlacement?: boolean;
  [key: string]: unknown;
};

export type CompositionNodeSpec = {
  id: string;
  content: string;
  role: NodeRole;
  capabilities?: string[];
  constraints?: NodeConstraints;
  placement?: Placement;
  priority?: number;
  source?: string;
};

export type CompositionRelation = {
  id: string;
  kind: RelationKind;
  source: string;
  target: string;
  strength: RelationStrength;
  behavior: string;
  overlap?: OverlapIntent;
  range?: string;
  fallback?: string;
  sourceLocation?: string;
};

export type ArtDirection = {
  seed: string;
  mood?: string;
  material?: string;
  density?: CompositionDensity;
  contrast?: Contrast;
  rhythm?: Rhythm;
  motion?: Motion;
  adaptation: AdaptationMode;
  debug?: boolean;
  authority?: ArtDirectorAuthority;
  gesture?: CompositionGesture;
  thesis?: string;
  focal?: string;
  motif?: string;
  palette?: PaletteBehavior;
  typography?: TypographyBehavior;
  depth?: DepthBehavior;
  interaction?: InteractionBehavior;
};

export type CompositionInput = {
  artDirection: ArtDirection;
  nodes: CompositionNodeSpec[];
  relations: CompositionRelation[];
};

export type CompositionIssue = {
  path: string;
  message: string;
};

export type ValidationResult = {
  valid: boolean;
  issues: CompositionIssue[];
};

export type RelationDecision = {
  relationId: string;
  kind: RelationKind;
  status: "applied" | "suggested" | "rejected";
  reason: string;
  fallback?: string;
};

export type ResolvedNode = CompositionNodeSpec & {
  authoredPlacement?: Placement;
  relationKinds: RelationKind[];
  variation: number;
};

export type ResolvedComposition = {
  valid: boolean;
  issues: CompositionIssue[];
  seed: string;
  nodes: ResolvedNode[];
  decisions: RelationDecision[];
};

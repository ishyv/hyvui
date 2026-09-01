import { biomeIds, type BiomeId } from "./biomes.js";

export const transitionIntents = [
  "approach",
  "occlude",
  "expose",
  "transpose",
  "release",
  "inherit",
  "cut",
] as const;

export type TransitionIntent = (typeof transitionIntents)[number];
export type TransitionMode = "animate" | "state-change" | "cut";
export type TransitionPlan = {
  intent: TransitionIntent;
  mode: TransitionMode;
  durationMs: number;
  continuity: "preserve" | "none";
  fallback: string;
};

const transitionDefaults: Record<TransitionIntent, TransitionPlan> = {
  approach: {
    intent: "approach",
    mode: "animate",
    durationMs: 720,
    continuity: "preserve",
    fallback: "reveal the destination frame in document order",
  },
  occlude: {
    intent: "occlude",
    mode: "animate",
    durationMs: 840,
    continuity: "preserve",
    fallback: "replace visible atmosphere with the destination frame",
  },
  expose: {
    intent: "expose",
    mode: "animate",
    durationMs: 640,
    continuity: "preserve",
    fallback: "show the destination evidence without concealment",
  },
  transpose: {
    intent: "transpose",
    mode: "animate",
    durationMs: 560,
    continuity: "preserve",
    fallback: "preserve the content while changing its spatial reading",
  },
  release: {
    intent: "release",
    mode: "animate",
    durationMs: 680,
    continuity: "preserve",
    fallback: "show the destination after the trajectory completes",
  },
  inherit: {
    intent: "inherit",
    mode: "animate",
    durationMs: 480,
    continuity: "preserve",
    fallback: "keep the shared actor and continue in document order",
  },
  cut: {
    intent: "cut",
    mode: "cut",
    durationMs: 0,
    continuity: "none",
    fallback: "move directly to the destination frame",
  },
};

export const biomeTransitionIntents: Record<BiomeId, TransitionIntent> = {
  "operational-apparatus": "expose",
  "manifesto-print": "cut",
  "deconstructed-editorial": "transpose",
  "quiet-object-gallery": "approach",
  "ceremonial-reliquary": "approach",
  "ecological-elegy": "occlude",
  "oneiric-object-poetry": "transpose",
  "machine-ecology": "inherit",
  "celestial-cartography": "expose",
  "post-digital-morphology": "transpose",
  "kinetic-rupture": "release",
  "noise-commons": "cut",
};

export function resolveTransition(
  intent: TransitionIntent,
  reducedMotion = false,
): TransitionPlan {
  const plan = transitionDefaults[intent];
  if (!reducedMotion || plan.mode === "cut") return { ...plan };
  return {
    ...plan,
    mode: "state-change",
    durationMs: 0,
  };
}

export function resolveBiomeTransition(
  biomeId: string,
  reducedMotion = false,
): TransitionPlan {
  const intent = biomeIds.includes(biomeId as BiomeId)
    ? biomeTransitionIntents[biomeId as BiomeId]
    : "cut";
  return resolveTransition(intent, reducedMotion);
}

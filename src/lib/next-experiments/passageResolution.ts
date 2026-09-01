import { getBiomeDefinition, type BiomeId } from "./biomes.js";

export type PassageMode = "scroll" | "static";
export type PassageProgress = "intersection" | "ordinal";
export type PassageMotion = "drift" | "flow" | "scrub" | "reveal" | "none";

export type PassageOptions = {
  mode?: PassageMode;
  reason?: string;
};

export type PassagePlan = {
  valid: boolean;
  hostBiome: string;
  mode: PassageMode;
  fallbackMode: "static";
  progress: PassageProgress;
  motion: PassageMotion;
  reason: string;
};

const motionByBiome: Partial<Record<BiomeId, PassageMotion>> = {
  "ecological-elegy": "drift",
  "machine-ecology": "flow",
  "kinetic-rupture": "scrub",
  "post-digital-morphology": "reveal",
};

export function resolvePassage(
  hostId: string,
  options: PassageOptions = {},
): PassagePlan {
  const host = getBiomeDefinition(hostId);
  const reason = options.reason?.trim() ?? "";
  const mode = options.mode ?? "scroll";

  if (!host) {
    return {
      valid: false,
      hostBiome: hostId,
      mode: "static",
      fallbackMode: "static",
      progress: "ordinal",
      motion: "none",
      reason: `unknown host biome: ${hostId}`,
    };
  }

  if (!reason) {
    return {
      valid: false,
      hostBiome: host.id,
      mode: "static",
      fallbackMode: "static",
      progress: "ordinal",
      motion: "none",
      reason: "scroll passage requires a conceptual justification",
    };
  }

  if (mode === "static") {
    return {
      valid: true,
      hostBiome: host.id,
      mode: "static",
      fallbackMode: "static",
      progress: "ordinal",
      motion: "none",
      reason,
    };
  }

  return {
    valid: true,
    hostBiome: host.id,
    mode: "scroll",
    fallbackMode: "static",
    progress: "intersection",
    motion: motionByBiome[host.id] ?? "reveal",
    reason,
  };
}

import { getBiomeDefinition, type BiomeGraft, type BiomeId } from "./biomes.js";
import { resolveBiomeChannelDefinition } from "./biomeResolution.js";

export type AtmosphereIntent =
  | "localized signal"
  | "registration"
  | "studio shadow"
  | "none"
  | "aureole"
  | "absorption"
  | "interior night"
  | "flow"
  | "orbit"
  | "edge reflection"
  | "impact"
  | "accumulation";

export type BiomeAtmosphereProjection = {
  valid: boolean;
  hostBiome: string;
  intent: AtmosphereIntent;
  mode: "motion" | "static";
  durationMs: number;
  reason: string;
};

const durationByIntent: Record<AtmosphereIntent, number> = {
  "localized signal": 420,
  registration: 520,
  "studio shadow": 0,
  none: 0,
  aureole: 1800,
  absorption: 2400,
  "interior night": 900,
  flow: 1400,
  orbit: 1800,
  "edge reflection": 680,
  impact: 460,
  accumulation: 1200,
};

export function resolveBiomeAtmosphere(
  hostId: string,
  reducedMotion = false,
  grafts: readonly BiomeGraft[] = [],
): BiomeAtmosphereProjection {
  const host = getBiomeDefinition(hostId);
  if (!host) {
    return {
      valid: false,
      hostBiome: hostId,
      intent: "none",
      mode: "static",
      durationMs: 0,
      reason: `unknown host biome: ${hostId}`,
    };
  }

  const intent = {
    "operational-apparatus": "localized signal",
    "manifesto-print": "registration",
    "deconstructed-editorial": "studio shadow",
    "quiet-object-gallery": "none",
    "ceremonial-reliquary": "aureole",
    "ecological-elegy": "absorption",
    "oneiric-object-poetry": "interior night",
    "machine-ecology": "flow",
    "celestial-cartography": "orbit",
    "post-digital-morphology": "edge reflection",
    "kinetic-rupture": "impact",
    "noise-commons": "accumulation",
  } satisfies Record<BiomeId, AtmosphereIntent>;
  const atmosphere = resolveBiomeChannelDefinition(host, grafts, "motion");
  const selected = intent[atmosphere.id];
  return {
    valid: true,
    hostBiome: host.id,
    intent: selected,
    mode: reducedMotion || selected === "none" ? "static" : "motion",
    durationMs: reducedMotion ? 0 : durationByIntent[selected],
    reason: `atmosphere expresses ${atmosphere.id}'s ${atmosphere.timeModel}`,
  };
}

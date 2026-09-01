import { getBiomeDefinition, type BiomeGraft, type BiomeId } from "./biomes.js";
import { resolveBiomeChannelDefinition } from "./biomeResolution.js";

export type BiomeTypographyProjection = {
  valid: boolean;
  hostBiome: string;
  displayRole: string;
  supportRole: string;
  bodyPolicy: string;
  cautions: string[];
};

const bodyPolicyByBiome: Record<BiomeId, string> = {
  "operational-apparatus": "functional prose",
  "manifesto-print": "declaration-led",
  "deconstructed-editorial": "editorial measure",
  "quiet-object-gallery": "caption-led",
  "ceremonial-reliquary": "marginal or absent",
  "ecological-elegy": "literary margin",
  "oneiric-object-poetry": "caption-led",
  "machine-ecology": "maintenance notation",
  "celestial-cartography": "poetic notation",
  "post-digital-morphology": "specimen annotation",
  "kinetic-rupture": "residue caption",
  "noise-commons": "fragmentary voices",
};

export function resolveBiomeTypography(
  hostId: string,
  grafts: readonly BiomeGraft[] = [],
): BiomeTypographyProjection {
  const host = getBiomeDefinition(hostId);
  if (!host) {
    return {
      valid: false,
      hostBiome: hostId,
      displayRole: "",
      supportRole: "",
      bodyPolicy: "",
      cautions: [`unknown host biome: ${hostId}`],
    };
  }

  const typography = resolveBiomeChannelDefinition(host, grafts, "typography");

  return {
    valid: true,
    hostBiome: host.id,
    displayRole: typography.typography[0] ?? "",
    supportRole: typography.typography[1] ?? "",
    bodyPolicy: bodyPolicyByBiome[host.id],
    cautions: [...new Set([...host.antiPatterns, ...typography.antiPatterns])],
  };
}

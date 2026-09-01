import { getBiomeDefinition, type BiomeGraft, type BiomeId } from "./biomes.js";
import { resolveBiomeChannelDefinition } from "./biomeResolution.js";

export type BiomeMaterialProjection = {
  valid: boolean;
  hostBiome: string;
  substrate: string;
  surface: string;
  light: string;
  atmosphere: string;
  cautions: string[];
};

const surfaceByBiome: Record<BiomeId, string> = {
  "operational-apparatus": "instrument evidence",
  "manifesto-print": "ink pressure",
  "deconstructed-editorial": "sculptural shadow",
  "quiet-object-gallery": "quiet object surface",
  "ceremonial-reliquary": "weathered icon surface",
  "ecological-elegy": "submerged threshold",
  "oneiric-object-poetry": "handmade domestic matter",
  "machine-ecology": "maintenance residue",
  "celestial-cartography": "printed star field",
  "post-digital-morphology": "synthetic skin and cable",
  "kinetic-rupture": "motion residue",
  "noise-commons": "overwritten mark field",
};

const atmosphereByBiome: Record<BiomeId, string> = {
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
};

export function resolveBiomeMaterial(
  hostId: string,
  grafts: readonly BiomeGraft[] = [],
): BiomeMaterialProjection {
  const host = getBiomeDefinition(hostId);
  if (!host) {
    return {
      valid: false,
      hostBiome: hostId,
      substrate: "",
      surface: "",
      light: "",
      atmosphere: "none",
      cautions: [`unknown host biome: ${hostId}`],
    };
  }

  const material = resolveBiomeChannelDefinition(host, grafts, "material");
  const light = resolveBiomeChannelDefinition(host, grafts, "light");

  return {
    valid: true,
    hostBiome: host.id,
    substrate: material.materials[0] ?? "",
    surface: surfaceByBiome[material.id],
    light: light.light[0] ?? "",
    atmosphere: atmosphereByBiome[host.id],
    cautions: [
      ...new Set([
        ...host.antiPatterns,
        ...material.antiPatterns,
        ...light.antiPatterns,
      ]),
    ],
  };
}

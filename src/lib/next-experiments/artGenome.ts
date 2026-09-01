import {
  getBiomeDefinition,
  type BiomeDefinition,
  type BiomeGraft,
  type BiomeId,
} from "./biomes.js";
import { resolveBiomeChannelDefinition } from "./biomeResolution.js";

export type ArtGenome = {
  spatialHabitat: string;
  density: string;
  material: string;
  light: string;
  typography: string;
  information: string;
  timeModel: string;
  viewerRole: string;
  interactionVerb: string;
};

export type ArtGenomeOverride = Partial<ArtGenome>;

export type ArtGenomeIssue = {
  gene: keyof ArtGenome;
  reason: string;
};

export type ResolvedArtGenome = {
  valid: boolean;
  host?: BiomeDefinition;
  genes: ArtGenome;
  issues: ArtGenomeIssue[];
};

const emptyGenome: ArtGenome = {
  spatialHabitat: "",
  density: "",
  material: "",
  light: "",
  typography: "",
  information: "",
  timeModel: "",
  viewerRole: "",
  interactionVerb: "",
};

function defaultsFor(
  host: BiomeDefinition,
  grafts: readonly BiomeGraft[],
): ArtGenome {
  const habitat = resolveBiomeChannelDefinition(host, grafts, "framing");
  const material = resolveBiomeChannelDefinition(host, grafts, "material");
  const light = resolveBiomeChannelDefinition(host, grafts, "light");
  const typography = resolveBiomeChannelDefinition(host, grafts, "typography");
  const information = resolveBiomeChannelDefinition(
    host,
    grafts,
    "information",
  );
  const interaction = resolveBiomeChannelDefinition(
    host,
    grafts,
    "interaction",
  );

  return {
    spatialHabitat: habitat.spatialHabitat[0] ?? "",
    density: host.density,
    material: material.materials[0] ?? "",
    light: light.light[0] ?? "",
    typography: typography.typography[0] ?? "",
    information: information.information[0] ?? "",
    timeModel: host.timeModel,
    viewerRole: host.viewerRole,
    interactionVerb: interaction.interactionVerbs[0] ?? "",
  };
}

function boundsFor(
  host: BiomeDefinition,
  grafts: readonly BiomeGraft[],
): Record<keyof ArtGenome, string[]> {
  const habitat = resolveBiomeChannelDefinition(host, grafts, "framing");
  const material = resolveBiomeChannelDefinition(host, grafts, "material");
  const light = resolveBiomeChannelDefinition(host, grafts, "light");
  const typography = resolveBiomeChannelDefinition(host, grafts, "typography");
  const information = resolveBiomeChannelDefinition(
    host,
    grafts,
    "information",
  );
  const interaction = resolveBiomeChannelDefinition(
    host,
    grafts,
    "interaction",
  );

  return {
    spatialHabitat: habitat.spatialHabitat,
    density: [host.density],
    material: material.materials,
    light: light.light,
    typography: typography.typography,
    information: information.information,
    timeModel: [host.timeModel],
    viewerRole: [host.viewerRole],
    interactionVerb: interaction.interactionVerbs,
  };
}

export function resolveArtGenome(
  hostId: BiomeId | string,
  overrides: ArtGenomeOverride = {},
  grafts: readonly BiomeGraft[] = [],
): ResolvedArtGenome {
  const host = getBiomeDefinition(hostId);
  if (!host) {
    return {
      valid: false,
      genes: emptyGenome,
      issues: [
        {
          gene: "spatialHabitat",
          reason: `unknown host biome: ${hostId}`,
        },
      ],
    };
  }

  const genes = defaultsFor(host, grafts);
  const bounds = boundsFor(host, grafts);
  const issues: ArtGenomeIssue[] = [];

  for (const key of Object.keys(overrides) as Array<keyof ArtGenome>) {
    const value = overrides[key];
    if (value === undefined) continue;
    if (!bounds[key].includes(value)) {
      issues.push({
        gene: key,
        reason: `${value} is outside the ${host.id} bounds for ${key}`,
      });
      continue;
    }
    genes[key] = value;
  }

  return {
    valid: issues.length === 0,
    host,
    genes,
    issues,
  };
}

import { biomeDefinitions, type BiomeId } from "./biomes.js";

export type AgentBiomeCapability = {
  id: BiomeId;
  label: string;
  worldview: string;
  spatialLaw: string;
  attention: string;
  density: string;
  genome: {
    spatialHabitat: string[];
    materials: string[];
    light: string[];
    typography: string[];
    information: string[];
    timeModel: string;
    viewerRole: string;
    interactionVerbs: string[];
  };
  frameModes: string[];
  passageModes: string[];
  grafts: {
    channels: string[];
    symbioticWith: BiomeId[];
    tensionalWith: BiomeId[];
    destructiveWith: BiomeId[];
  };
  antiPatterns: string[];
  responsiveRule: string;
};

export function listBiomeCapabilities(): AgentBiomeCapability[] {
  return biomeDefinitions.map((biome) => ({
    id: biome.id,
    label: biome.label,
    worldview: biome.worldview,
    spatialLaw: biome.spatialLaw,
    attention: biome.attention,
    density: biome.density,
    genome: {
      spatialHabitat: [...biome.spatialHabitat],
      materials: [...biome.materials],
      light: [...biome.light],
      typography: [...biome.typography],
      information: [...biome.information],
      timeModel: biome.timeModel,
      viewerRole: biome.viewerRole,
      interactionVerbs: [...biome.interactionVerbs],
    },
    frameModes: [...biome.frameModes],
    passageModes: [...biome.passageModes],
    grafts: {
      channels: [...biome.compatibleGraftChannels],
      symbioticWith: [...biome.symbioticWith],
      tensionalWith: [...biome.tensionalWith],
      destructiveWith: [...biome.destructiveWith],
    },
    antiPatterns: [...biome.antiPatterns],
    responsiveRule: biome.responsiveRule,
  }));
}

export function getBiomeCapability(
  id: string,
): AgentBiomeCapability | undefined {
  return listBiomeCapabilities().find((biome) => biome.id === id);
}

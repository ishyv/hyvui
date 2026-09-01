import { resolveComposition } from "./core.js";
import { resolveArtGenome, type ArtGenomeOverride } from "./artGenome.js";
import {
  resolveBiomeBrief,
  resolveBiomeChannelDefinition,
  type BiomeDecision,
  type ResolvedBiomeBrief,
} from "./biomeResolution.js";
import type { BiomeBrief } from "./biomes.js";
import type {
  AdaptationMode,
  CompositionNodeSpec,
  CompositionRelation,
  RelationDecision,
} from "./types.js";

export type BiomeCompositionInput = {
  brief: BiomeBrief;
  nodes: CompositionNodeSpec[];
  relations: CompositionRelation[];
  genome?: ArtGenomeOverride;
  adaptation?: AdaptationMode;
};

export type BiomeCompositionPlan = {
  valid: boolean;
  seed: string;
  premise: string;
  hostBiome: string;
  acceptedGrafts: ResolvedBiomeBrief["acceptedGrafts"];
  genome: ReturnType<typeof resolveArtGenome>;
  focalPolicy: NonNullable<BiomeBrief["focalPolicy"]>;
  focalNodeIds: string[];
  contentOrder: string[];
  requiredContent: string[];
  withholding: string;
  semanticOrder: string[];
  visualOrder: string[];
  spatial: {
    law: string;
    attention: string;
    frameMode: string;
    passageMode: string;
  };
  material: {
    families: string[];
    light: string[];
  };
  typography: {
    roles: string[];
  };
  information: {
    modes: string[];
  };
  temporal: {
    model: string;
    frameMode: string;
    passageMode: string;
  };
  interaction: {
    viewerRole: string;
    verbs: string[];
  };
  decisions: {
    biome: BiomeDecision[];
    relations: RelationDecision[];
  };
  issues: Array<{ path: string; reason: string }>;
};

function focalNodeIds(
  nodes: CompositionNodeSpec[],
  policy: NonNullable<BiomeBrief["focalPolicy"]>,
): string[] {
  const focal = nodes.filter((node) => node.role === "focal-point");
  if (policy === "singular") {
    return [focal[0]?.id ?? nodes[0]?.id].filter((id): id is string =>
      Boolean(id),
    );
  }

  const distributed = nodes.filter((node) =>
    ["focal-point", "counterweight"].includes(node.role),
  );
  return distributed.length > 0
    ? distributed.map((node) => node.id)
    : nodes.slice(0, policy === "polycentric" ? 3 : 1).map((node) => node.id);
}

function visualOrder(nodes: CompositionNodeSpec[]): string[] {
  return nodes
    .map((node, index) => ({ node, index }))
    .sort(
      (left, right) =>
        (right.node.priority ?? 0) - (left.node.priority ?? 0) ||
        left.index - right.index,
    )
    .map(({ node }) => node.id);
}

function resolveContentConstraints(
  brief: BiomeBrief,
  nodes: CompositionNodeSpec[],
): {
  contentOrder: string[];
  requiredContent: string[];
  withholding: string;
  issues: Array<{ path: string; reason: string }>;
} {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const requestedOrder = brief.contentOrder ?? nodes.map((node) => node.id);
  const ordered = new Set<string>();
  const issues: Array<{ path: string; reason: string }> = [];

  for (const [index, nodeId] of requestedOrder.entries()) {
    if (!nodeIds.has(nodeId)) {
      issues.push({
        path: `contentOrder[${index}]`,
        reason: `content order references missing node: ${nodeId}`,
      });
      continue;
    }
    if (ordered.has(nodeId)) {
      issues.push({
        path: `contentOrder[${index}]`,
        reason: `content order repeats node: ${nodeId}`,
      });
      continue;
    }
    ordered.add(nodeId);
  }

  const contentOrder = [
    ...ordered,
    ...nodes.map((node) => node.id).filter((nodeId) => !ordered.has(nodeId)),
  ];
  const requiredContent = [...(brief.requiredContent ?? [])];

  for (const [index, nodeId] of requiredContent.entries()) {
    if (!nodeIds.has(nodeId)) {
      issues.push({
        path: `requiredContent[${index}]`,
        reason: `required content is missing from the node set: ${nodeId}`,
      });
    }
  }

  return {
    contentOrder,
    requiredContent,
    withholding: brief.withholding ?? "",
    issues,
  };
}

function mergeChannelValues(hostValues: string[], graftValues: string[]) {
  return [...new Set([...hostValues, ...graftValues])];
}

export function resolveBiomeComposition(
  input: BiomeCompositionInput,
): BiomeCompositionPlan {
  const { brief, nodes, relations } = input;
  const biome = resolveBiomeBrief(brief);
  const content = resolveContentConstraints(brief, nodes);
  const genome = resolveArtGenome(
    brief.hostBiome,
    input.genome,
    biome.acceptedGrafts,
  );
  const relationResult = resolveComposition({
    artDirection: {
      seed: brief.seed,
      adaptation: input.adaptation ?? "suggest",
    },
    nodes,
    relations,
  });
  const host = biome.host;
  const policy = brief.focalPolicy ?? "singular";
  const issues = [
    ...biome.issues,
    ...genome.issues.map((issue) => ({
      path: `genome.${issue.gene}`,
      reason: issue.reason,
    })),
    ...relationResult.issues.map((issue) => ({
      path: issue.path,
      reason: issue.message,
    })),
    ...content.issues,
  ];

  if (!host) {
    return {
      valid: false,
      seed: brief.seed,
      premise: brief.premise,
      hostBiome: brief.hostBiome,
      acceptedGrafts: [],
      genome,
      focalPolicy: policy,
      focalNodeIds: [],
      contentOrder: content.contentOrder,
      requiredContent: content.requiredContent,
      withholding: content.withholding,
      semanticOrder: content.contentOrder,
      visualOrder: visualOrder(nodes),
      spatial: { law: "", attention: "", frameMode: "", passageMode: "" },
      material: { families: [], light: [] },
      typography: { roles: [] },
      information: { modes: [] },
      temporal: { model: "", frameMode: "", passageMode: "" },
      interaction: { viewerRole: "", verbs: [] },
      decisions: {
        biome: biome.decisions,
        relations: relationResult.decisions,
      },
      issues,
    };
  }

  const acceptedGrafts = biome.acceptedGrafts;
  const material = resolveBiomeChannelDefinition(
    host,
    acceptedGrafts,
    "material",
  );
  const light = resolveBiomeChannelDefinition(host, acceptedGrafts, "light");
  const typography = resolveBiomeChannelDefinition(
    host,
    acceptedGrafts,
    "typography",
  );
  const information = resolveBiomeChannelDefinition(
    host,
    acceptedGrafts,
    "information",
  );
  const motion = resolveBiomeChannelDefinition(host, acceptedGrafts, "motion");
  const interaction = resolveBiomeChannelDefinition(
    host,
    acceptedGrafts,
    "interaction",
  );
  const framing = resolveBiomeChannelDefinition(
    host,
    acceptedGrafts,
    "framing",
  );
  const frameMode = framing.frameModes.includes(brief.framePolicy ?? "")
    ? brief.framePolicy!
    : (framing.frameModes[0] ?? "");
  const passageMode = framing.passageModes.includes(brief.passagePolicy ?? "")
    ? brief.passagePolicy!
    : (framing.passageModes[0] ?? "");

  if (brief.framePolicy && !framing.frameModes.includes(brief.framePolicy)) {
    issues.push({
      path: "framePolicy",
      reason: `${brief.framePolicy} is not declared by the selected framing biome`,
    });
  }
  if (
    brief.passagePolicy &&
    !framing.passageModes.includes(brief.passagePolicy)
  ) {
    issues.push({
      path: "passagePolicy",
      reason: `${brief.passagePolicy} is not declared by the selected framing biome`,
    });
  }

  return {
    valid:
      biome.valid &&
      genome.valid &&
      relationResult.valid &&
      issues.length === 0,
    seed: brief.seed,
    premise: brief.premise,
    hostBiome: host.id,
    acceptedGrafts,
    genome,
    focalPolicy: policy,
    focalNodeIds: focalNodeIds(nodes, policy),
    contentOrder: content.contentOrder,
    requiredContent: content.requiredContent,
    withholding: content.withholding,
    semanticOrder: content.contentOrder,
    visualOrder: visualOrder(nodes),
    spatial: {
      law: host.spatialLaw,
      attention: host.attention,
      frameMode,
      passageMode,
    },
    material: {
      families: mergeChannelValues(host.materials, material.materials),
      light: mergeChannelValues(host.light, light.light),
    },
    typography: {
      roles: mergeChannelValues(host.typography, typography.typography),
    },
    information: {
      modes: mergeChannelValues(host.information, information.information),
    },
    temporal: {
      model: motion.timeModel,
      frameMode,
      passageMode,
    },
    interaction: {
      viewerRole: host.viewerRole,
      verbs: mergeChannelValues(
        host.interactionVerbs,
        interaction.interactionVerbs,
      ),
    },
    decisions: {
      biome: biome.decisions,
      relations: relationResult.decisions,
    },
    issues,
  };
}

import {
  getBiomeDefinition,
  type BiomeBrief,
  type BiomeDefinition,
  type BiomeGraft,
  type BiomeGraftChannel,
} from "./biomes.js";

export type BiomeDecision = {
  graft: BiomeGraft;
  status: "accepted" | "rejected";
  reason: string;
  fallback: string;
};

export type BiomeResolutionIssue = {
  path: string;
  reason: string;
};

export type GraftCompatibility = {
  status: "accepted" | "rejected";
  reason: string;
  fallback: string;
};

export type ResolvedBiomeBrief = {
  valid: boolean;
  seed: string;
  premise: string;
  host?: BiomeDefinition;
  acceptedGrafts: BiomeGraft[];
  decisions: BiomeDecision[];
  issues: BiomeResolutionIssue[];
};

export function resolveBiomeChannelDefinition(
  host: BiomeDefinition,
  grafts: readonly BiomeGraft[],
  channel: BiomeGraftChannel,
): BiomeDefinition {
  const graft = [...grafts]
    .reverse()
    .find((candidate) => candidate.channel === channel);
  return graft ? (getBiomeDefinition(graft.biome) ?? host) : host;
}

const fallback = "keep the host biome and authored composition";

export function resolveGraftCompatibility(
  hostId: BiomeBrief["hostBiome"],
  graft: BiomeGraft,
): GraftCompatibility {
  const host = getBiomeDefinition(hostId);
  const graftBiome = getBiomeDefinition(graft.biome);

  if (!host) {
    return {
      status: "rejected",
      reason: `unknown host biome: ${hostId}`,
      fallback,
    };
  }

  if (!graftBiome) {
    return {
      status: "rejected",
      reason: `unknown graft biome: ${graft.biome}`,
      fallback,
    };
  }

  if (graft.mode === "tensional" && !graft.reason.trim()) {
    return {
      status: "rejected",
      reason: "tensional graft requires a bridge or conflict reason",
      fallback,
    };
  }

  if (host.destructiveWith.includes(graft.biome)) {
    return {
      status: "rejected",
      reason: `destructive graft: ${graft.biome} erases the condition that makes ${host.id} work`,
      fallback,
    };
  }

  if (!host.compatibleGraftChannels.includes(graft.channel)) {
    return {
      status: "rejected",
      reason: `${graft.channel} is not a permitted graft channel for ${host.id}`,
      fallback,
    };
  }

  if (graft.mode === "symbiotic") {
    if (host.symbioticWith.includes(graft.biome)) {
      return {
        status: "accepted",
        reason: `symbiotic bridge: ${host.id} and ${graft.biome} share a compositional law`,
        fallback,
      };
    }

    return {
      status: "rejected",
      reason: `no symbiotic bridge is declared between ${host.id} and ${graft.biome}`,
      fallback,
    };
  }

  if (host.tensionalWith.includes(graft.biome)) {
    return {
      status: "accepted",
      reason: `declared tension: ${graft.reason}`,
      fallback,
    };
  }

  return {
    status: "rejected",
    reason: `no tensional relationship is declared between ${host.id} and ${graft.biome}`,
    fallback,
  };
}

export function resolveBiomeBrief(brief: BiomeBrief): ResolvedBiomeBrief {
  const issues: BiomeResolutionIssue[] = [];
  const host = getBiomeDefinition(brief.hostBiome);

  if (!brief.seed.trim()) {
    issues.push({
      path: "seed",
      reason: "seed is required for deterministic resolution",
    });
  }

  if (!brief.premise.trim()) {
    issues.push({
      path: "premise",
      reason: "premise is required for artistic causality",
    });
  }

  if (!host) {
    issues.push({
      path: "hostBiome",
      reason: `unknown host biome: ${brief.hostBiome}`,
    });
    return {
      valid: false,
      seed: brief.seed,
      premise: brief.premise,
      acceptedGrafts: [],
      decisions: brief.grafts.map((graft) => ({
        graft,
        status: "rejected",
        reason: "host biome is unknown",
        fallback,
      })),
      issues,
    };
  }

  const decisions = brief.grafts.map((graft) => {
    const compatibility = resolveGraftCompatibility(brief.hostBiome, graft);
    return { graft, ...compatibility };
  });
  const channels = new Set<string>();
  let tensionalGrafts = 0;
  for (const [index, decision] of decisions.entries()) {
    if (index >= 2) {
      issues.push({
        path: `grafts[${index}]`,
        reason: "graft limit: a composition may use at most two grafts",
      });
      decision.status = "rejected";
      decision.reason = "graft limit exceeds the two-graft maximum";
      continue;
    }

    if (decision.status === "rejected") {
      issues.push({ path: `grafts[${index}]`, reason: decision.reason });
      continue;
    }

    if (decision.graft.mode === "tensional" && tensionalGrafts >= 1) {
      issues.push({
        path: `grafts[${index}]`,
        reason:
          "at most one tensional graft may create a high-friction contradiction",
      });
      decision.status = "rejected";
      decision.reason = "tensional graft exceeds the one-contradiction maximum";
      continue;
    }

    if (channels.has(decision.graft.channel)) {
      issues.push({
        path: `grafts[${index}]`,
        reason: `channel collision: ${decision.graft.channel} is already owned by another graft`,
      });
      decision.status = "rejected";
      decision.reason = "channel collision with an earlier accepted graft";
      continue;
    }
    channels.add(decision.graft.channel);
    if (decision.graft.mode === "tensional") tensionalGrafts += 1;
  }

  return {
    valid:
      issues.length === 0 &&
      decisions.every((decision) => decision.status === "accepted"),
    seed: brief.seed,
    premise: brief.premise,
    host,
    acceptedGrafts: decisions
      .filter((decision) => decision.status === "accepted")
      .map((decision) => decision.graft),
    decisions,
    issues,
  };
}

import {
  relationKinds,
  type CompositionInput,
  type CompositionIssue,
  type ResolvedComposition,
  type ValidationResult,
} from "./types.js";

const ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function relationNeedsPlacement(kind: (typeof relationKinds)[number]): boolean {
  return [
    "overlap",
    "anchor",
    "connect",
    "interrupt",
    "frame",
    "reveal",
  ].includes(kind);
}

export function createSeededRandom(seed: string): () => number {
  let state = hashSeed(seed) || 1;

  return () => {
    state += 0x6d2b79f5;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicVariation(
  seed: string,
  namespace: string,
): number {
  const random = createSeededRandom(`${seed}:${namespace}`);
  return Number(((random() * 2 - 1) * 0.12).toFixed(4));
}

export function validateComposition(input: CompositionInput): ValidationResult {
  const issues: CompositionIssue[] = [];
  const nodeIds = new Set<string>();
  const relationIds = new Set<string>();

  if (!input.artDirection.seed.trim()) {
    issues.push({
      path: "artDirection.seed",
      message: "seed must not be empty",
    });
  }

  for (const [index, node] of input.nodes.entries()) {
    if (!ID_PATTERN.test(node.id)) {
      issues.push({
        path: `nodes[${index}].id`,
        message: `node id must be kebab-case: ${node.id}`,
      });
    }
    if (nodeIds.has(node.id)) {
      issues.push({
        path: `nodes[${index}].id`,
        message: `duplicate node id: ${node.id}`,
      });
    }
    nodeIds.add(node.id);
  }

  for (const [index, relation] of input.relations.entries()) {
    if (!ID_PATTERN.test(relation.id)) {
      issues.push({
        path: `relations[${index}].id`,
        message: `relation id must be kebab-case: ${relation.id}`,
      });
    }
    if (!relationKinds.includes(relation.kind)) {
      issues.push({
        path: `relations[${index}].kind`,
        message: `unknown relation kind: ${relation.kind}`,
      });
    }
    if (relationIds.has(relation.id)) {
      issues.push({
        path: `relations[${index}].id`,
        message: `duplicate relation id: ${relation.id}`,
      });
    }
    relationIds.add(relation.id);

    if (!nodeIds.has(relation.source)) {
      issues.push({
        path: `relations[${index}].source`,
        message: `unknown source node: ${relation.source}`,
      });
    }
    if (!nodeIds.has(relation.target)) {
      issues.push({
        path: `relations[${index}].target`,
        message: `unknown target node: ${relation.target}`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}

export function resolveComposition(
  input: CompositionInput,
): ResolvedComposition {
  const validation = validateComposition(input);
  const relationKindsByNode = new Map<
    string,
    Set<(typeof relationKinds)[number]>
  >();

  for (const node of input.nodes) relationKindsByNode.set(node.id, new Set());
  for (const relation of input.relations) {
    relationKindsByNode.get(relation.source)?.add(relation.kind);
    relationKindsByNode.get(relation.target)?.add(relation.kind);
  }

  const nodes = input.nodes.map((node) => ({
    ...node,
    authoredPlacement: node.placement,
    relationKinds: [...(relationKindsByNode.get(node.id) ?? [])],
    variation: node.capabilities?.includes("bounded-variation")
      ? deterministicVariation(input.artDirection.seed, node.id)
      : 0,
  }));

  const nodeById = new Map(input.nodes.map((node) => [node.id, node]));
  const decisions = input.relations.map((relation) => {
    const source = nodeById.get(relation.source);
    const target = nodeById.get(relation.target);
    const manuallyPlaced =
      relationNeedsPlacement(relation.kind) &&
      Boolean(
        source?.constraints?.manualPlacement ||
        target?.constraints?.manualPlacement,
      );

    if (input.artDirection.adaptation === "disabled") {
      return {
        relationId: relation.id,
        kind: relation.kind,
        status: "rejected" as const,
        reason: "adaptation is disabled for this composition",
        fallback: relation.fallback,
      };
    }

    if (manuallyPlaced) {
      return {
        relationId: relation.id,
        kind: relation.kind,
        status: "rejected" as const,
        reason: "rejected because manual placement is explicit",
        fallback: relation.fallback,
      };
    }

    return {
      relationId: relation.id,
      kind: relation.kind,
      status:
        input.artDirection.adaptation === "suggest"
          ? ("suggested" as const)
          : ("applied" as const),
      reason: relation.behavior,
      fallback: relation.fallback,
    };
  });

  return {
    valid: validation.valid,
    issues: validation.issues,
    seed: input.artDirection.seed,
    nodes,
    decisions,
  };
}

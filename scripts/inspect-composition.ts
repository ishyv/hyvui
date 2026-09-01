import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getAgentManifest,
  type AgentManifest,
} from "../src/lib/next-experiments/capabilities.js";
import {
  resolveBiomeComposition,
  type BiomeCompositionInput,
  type BiomeCompositionPlan,
} from "../src/lib/next-experiments/biomeComposition.js";
import { resolveComposition } from "../src/lib/next-experiments/core.js";
import type {
  CompositionInput,
  ResolvedComposition,
} from "../src/lib/next-experiments/types.js";

export type CompositionInspection = {
  schemaVersion: "0.1";
  valid: boolean;
  seed: string;
  issues: ResolvedComposition["issues"];
  nodes: Array<{
    id: string;
    content: string;
    role: string;
    capabilities: string[];
    relations: string[];
    variation: number;
    authoredPlacement?: ResolvedComposition["nodes"][number]["authoredPlacement"];
  }>;
  decisions: ResolvedComposition["decisions"];
};

function assertCompositionInput(
  input: unknown,
): asserts input is CompositionInput {
  const isRecord = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === "object";

  if (
    !isRecord(input) ||
    !("artDirection" in input) ||
    !("nodes" in input) ||
    !("relations" in input) ||
    !input.artDirection ||
    !Array.isArray(input.nodes) ||
    !Array.isArray(input.relations)
  ) {
    throw new Error(
      "composition input must include artDirection, nodes, and relations",
    );
  }

  if (!isRecord(input.artDirection)) {
    throw new Error("composition input artDirection must be an object");
  }
  if (typeof input.artDirection.seed !== "string") {
    throw new Error("composition input artDirection.seed must be a string");
  }
  if (
    !["disabled", "suggest", "apply"].includes(
      input.artDirection.adaptation as string,
    )
  ) {
    throw new Error(
      "composition input artDirection.adaptation must be disabled, suggest, or apply",
    );
  }

  input.nodes.forEach((node, index) => {
    if (!isRecord(node)) {
      throw new Error(`composition input nodes[${index}] must be an object`);
    }
    for (const field of ["id", "content", "role"]) {
      if (typeof node[field] !== "string") {
        throw new Error(
          `composition input nodes[${index}].${field} must be a string`,
        );
      }
    }
  });

  input.relations.forEach((relation, index) => {
    if (!isRecord(relation)) {
      throw new Error(
        `composition input relations[${index}] must be an object`,
      );
    }
    for (const field of [
      "id",
      "kind",
      "source",
      "target",
      "strength",
      "behavior",
    ]) {
      if (typeof relation[field] !== "string") {
        throw new Error(
          `composition input relations[${index}].${field} must be a string`,
        );
      }
    }
  });
}

export function inspectComposition(
  input: CompositionInput,
): CompositionInspection {
  assertCompositionInput(input);
  const result = resolveComposition(input);

  return {
    schemaVersion: "0.1",
    valid: result.valid,
    seed: result.seed,
    issues: result.issues,
    nodes: result.nodes.map((node) => ({
      id: node.id,
      content: node.content,
      role: node.role,
      capabilities: node.capabilities ?? [],
      relations: node.relationKinds,
      variation: node.variation,
      authoredPlacement: node.authoredPlacement,
    })),
    decisions: result.decisions,
  };
}

export function inspectManifest(): AgentManifest {
  return getAgentManifest();
}

export function inspectBiomeComposition(
  input: BiomeCompositionInput,
): BiomeCompositionPlan {
  return resolveBiomeComposition(input);
}

function isBiomeCompositionInput(
  input: unknown,
): input is BiomeCompositionInput {
  return (
    Boolean(input) &&
    input !== null &&
    typeof input === "object" &&
    "brief" in input &&
    "nodes" in input &&
    "relations" in input
  );
}

function parseArguments(argv: string[]): { file?: string; manifest: boolean } {
  const options: { file?: string; manifest: boolean } = { manifest: false };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--file") options.file = argv[++index];
    if (argv[index] === "--manifest") options.manifest = true;
  }

  return options;
}

function printUsage(): never {
  process.stderr.write(
    "usage: npm run inspect:next -- --manifest | --file path/to/composition.json\n",
  );
  process.exit(1);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
) {
  const options = parseArguments(process.argv.slice(2));
  if (options.manifest) {
    process.stdout.write(`${JSON.stringify(inspectManifest(), null, 2)}\n`);
  } else if (options.file) {
    try {
      const input = JSON.parse(
        readFileSync(resolve(options.file), "utf8"),
      ) as unknown;
      const inspection = isBiomeCompositionInput(input)
        ? inspectBiomeComposition(input)
        : inspectComposition(input as CompositionInput);
      process.stdout.write(`${JSON.stringify(inspection, null, 2)}\n`);
    } catch (error) {
      process.stderr.write(
        `inspection interrupted: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      process.exitCode = 1;
    }
  } else {
    printUsage();
  }
}

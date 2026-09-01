import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

export const bakeoffConditions = [
  "control",
  "capability",
  "biome-manifest",
  "inspector",
];

/** @param {unknown} report */
export async function formatBakeoffReport(report) {
  return prettier.format(JSON.stringify(report), { parser: "json" });
}

/**
 * @typedef {Object} BakeoffAttempt
 * @property {string} condition
 * @property {string} promptId
 * @property {string|null} [hostBiome]
 * @property {number} graftCount
 * @property {number} meaningfulRelationCount
 * @property {number} semanticViolations
 * @property {boolean} genericLayout
 * @property {boolean} responsiveSurvival
 * @property {boolean} functionalIntegrity
 * @property {boolean} deterministic
 * @property {number} steeringTurns
 * @property {string} failureClass
 * @property {string} notes
 */

/** @typedef {{ id: string, title: string }} BakeoffPrompt */

const promptPath = resolve(
  fileURLToPath(new URL("../docs/research/agent-prompts.md", import.meta.url)),
);

export function readPromptCorpus(markdown = readFileSync(promptPath, "utf8")) {
  return [...markdown.matchAll(/^##\s+(\d{2})\s+\/\s+(.+)$/gm)].map(
    ([, id, title]) => ({ id, title: title.trim() }),
  );
}

function round(/** @type {number} */ value) {
  return Number(value.toFixed(2));
}

/** @param {string} condition @param {BakeoffAttempt[]} attempts */
function summarizeCondition(condition, attempts) {
  const hosts = [
    ...new Set(attempts.map((attempt) => attempt.hostBiome).filter(Boolean)),
  ];
  const totalRelations = attempts.reduce(
    (total, attempt) => total + (attempt.meaningfulRelationCount ?? 0),
    0,
  );
  const totalSteeringTurns = attempts.reduce(
    (total, attempt) => total + (attempt.steeringTurns ?? 0),
    0,
  );

  return {
    id: condition,
    attemptCount: attempts.length,
    uniqueHosts: hosts.length,
    hostBiomes: hosts,
    totalGrafts: attempts.reduce(
      (total, attempt) => total + (attempt.graftCount ?? 0),
      0,
    ),
    totalMeaningfulRelations: totalRelations,
    averageMeaningfulRelations: attempts.length
      ? round(totalRelations / attempts.length)
      : 0,
    genericLayoutCount: attempts.filter((attempt) => attempt.genericLayout)
      .length,
    responsiveFailures: attempts.filter(
      (attempt) => !attempt.responsiveSurvival,
    ).length,
    functionalFailures: attempts.filter(
      (attempt) => !attempt.functionalIntegrity,
    ).length,
    semanticViolations: attempts.reduce(
      (total, attempt) => total + (attempt.semanticViolations ?? 0),
      0,
    ),
    nondeterministicAttempts: attempts.filter(
      (attempt) => !attempt.deterministic,
    ).length,
    steeringTurns: totalSteeringTurns,
    averageSteeringTurns: attempts.length
      ? round(totalSteeringTurns / attempts.length)
      : 0,
    failureClasses: [
      ...new Set(
        attempts.map((attempt) => attempt.failureClass).filter(Boolean),
      ),
    ],
  };
}

/** @param {BakeoffAttempt[]} attempts @param {BakeoffPrompt[]} prompts */
export function summarizeBakeoff(attempts, prompts = readPromptCorpus()) {
  const validationErrors = [];
  const expectedKeys = new Set();
  const seenKeys = new Set();
  const promptIds = prompts.map((prompt) => prompt.id);

  for (const condition of bakeoffConditions) {
    for (const promptId of promptIds) {
      expectedKeys.add(`${condition}:${promptId}`);
    }
  }

  for (const attempt of attempts) {
    const key = `${attempt.condition}:${attempt.promptId}`;
    if (!expectedKeys.has(key)) {
      validationErrors.push(`unexpected ${key}`);
      continue;
    }
    if (seenKeys.has(key)) validationErrors.push(`duplicate ${key}`);
    seenKeys.add(key);
  }

  for (const key of expectedKeys) {
    if (!seenKeys.has(key)) validationErrors.push(`missing ${key}`);
  }

  const conditions = bakeoffConditions.map((condition) =>
    summarizeCondition(
      condition,
      attempts.filter((attempt) => attempt.condition === condition),
    ),
  );

  return {
    complete: validationErrors.length === 0,
    promptCount: prompts.length,
    attemptCount: attempts.length,
    conditions,
    validationErrors,
    attempts,
  };
}

/** @returns {BakeoffAttempt[]} */
function readAttempts(/** @type {string} */ path) {
  const content = readFileSync(resolve(path), "utf8").trim();
  if (!content) return [];
  if (content.startsWith("[")) return JSON.parse(content);
  return content
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function parseArguments(/** @type {string[]} */ argv) {
  const options = { input: "", output: "" };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--input") options.input = argv[++index];
    if (argv[index] === "--output") options.output = argv[++index];
  }
  return options;
}

function printUsage() {
  process.stderr.write(
    "usage: node scripts/run-biome-bakeoff.mjs --input attempts.jsonl [--output report.json]\n",
  );
  process.exitCode = 1;
}

if (process.argv[1]?.endsWith("run-biome-bakeoff.mjs")) {
  const options = parseArguments(process.argv.slice(2));
  if (!options.input) {
    printUsage();
  } else {
    try {
      const summary = summarizeBakeoff(readAttempts(options.input));
      const report = {
        generatedBy: "scripts/run-biome-bakeoff.mjs",
        evidenceMode: "proposal-inspector",
        plannedConditionCount: 4,
        ...summary,
        protocolComplete: summary.complete,
        ...(summary.complete
          ? {}
          : {
              protocolGap:
                "the captured run is missing one or more planned conditions",
            }),
      };
      const output = await formatBakeoffReport(report);
      if (options.output) writeFileSync(resolve(options.output), output);
      else process.stdout.write(output);
      if (!report.complete) process.exitCode = 2;
    } catch (error) {
      process.stderr.write(
        `bakeoff interrupted: ${error instanceof Error ? error.message : String(error)}\n`,
      );
      process.exitCode = 1;
    }
  }
}

import assert from "node:assert/strict";
import test from "node:test";
import {
  bakeoffConditions,
  formatBakeoffReport,
  readPromptCorpus,
  summarizeBakeoff,
} from "../scripts/run-biome-bakeoff.mjs";

const prompts = readPromptCorpus();

type Attempt = {
  condition: string;
  promptId: string;
  hostBiome: string | null;
  graftCount: number;
  meaningfulRelationCount: number;
  semanticViolations: number;
  genericLayout: boolean;
  responsiveSurvival: boolean;
  functionalIntegrity: boolean;
  deterministic: boolean;
  steeringTurns: number;
  failureClass: string;
  notes: string;
};

function attempt(
  condition: string,
  promptId: string,
  overrides: Partial<Attempt> = {},
): Attempt {
  return {
    condition,
    promptId,
    hostBiome:
      condition === "biome-manifest" || condition === "inspector"
        ? "manifesto-print"
        : null,
    graftCount:
      condition === "biome-manifest" || condition === "inspector" ? 1 : 0,
    meaningfulRelationCount:
      condition === "biome-manifest" || condition === "inspector" ? 2 : 0,
    semanticViolations: 0,
    genericLayout: condition === "control",
    responsiveSurvival: true,
    functionalIntegrity: true,
    deterministic: true,
    steeringTurns: condition === "control" ? 2 : 1,
    failureClass: "none",
    notes: "fixture",
    ...overrides,
  };
}

test("reads the fixed eight-prompt corpus", () => {
  assert.equal(prompts.length, 8);
  assert.deepEqual(
    prompts.map((prompt) => prompt.id),
    ["01", "02", "03", "04", "05", "06", "07", "08"],
  );
});

test("aggregates a complete paired bakeoff without hand-counting", () => {
  const attempts = bakeoffConditions.flatMap((condition) =>
    prompts.map((prompt) => attempt(condition, prompt.id)),
  );
  const report = summarizeBakeoff(attempts, prompts);

  assert.equal(report.complete, true);
  assert.equal(report.promptCount, 8);
  assert.equal(report.attemptCount, 32);
  assert.deepEqual(
    report.conditions.map((condition) => [
      condition.id,
      condition.attemptCount,
    ]),
    [
      ["control", 8],
      ["capability", 8],
      ["biome-manifest", 8],
      ["inspector", 8],
    ],
  );
  assert.equal(report.conditions[3].uniqueHosts, 1);
  assert.equal(report.conditions[3].totalGrafts, 8);
});

test("reports missing and duplicate paired attempts", () => {
  const attempts = [
    ...prompts.slice(0, 1).map((prompt) => attempt("control", prompt.id)),
    ...prompts.map((prompt) => attempt("capability", prompt.id)),
    ...prompts.map((prompt) => attempt("inspector", prompt.id)),
    attempt("inspector", "01"),
  ];
  const report = summarizeBakeoff(attempts, prompts);

  assert.equal(report.complete, false);
  assert.equal(
    report.validationErrors.some((error) => error.includes("control:02")),
    true,
  );
  assert.equal(
    report.validationErrors.some((error) =>
      error.includes("duplicate inspector:01"),
    ),
    true,
  );
});

test("formats generated reports with the repository JSON formatter", async () => {
  const output = await formatBakeoffReport({
    failureClasses: ["none"],
  });

  assert.match(output, /"failureClasses": \["none"\]/);
  assert.equal(output.endsWith("\n"), true);
});

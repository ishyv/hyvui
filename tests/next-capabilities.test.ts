import assert from "node:assert/strict";
import test from "node:test";
import {
  getAgentManifest,
  getVisualCapability,
  listVisualCapabilities,
} from "../src/lib/next-experiments/capabilities.js";

test("lists a compact stable visual vocabulary", () => {
  const capabilities = listVisualCapabilities();

  assert.deepEqual(
    capabilities.map((capability) => capability.id),
    [
      "anchor",
      "atmosphere",
      "connect",
      "counterweight",
      "echo",
      "field",
      "focal-point",
      "frame",
      "interrupt",
      "overlap",
    ],
  );
  assert.deepEqual(getVisualCapability("focal-point")?.compatibleRelations, [
    "overlap",
    "echo",
    "frame",
  ]);
});

test("returns undefined for unknown capabilities instead of guessing", () => {
  assert.equal(getVisualCapability("imaginary-role"), undefined);
});

test("exposes agent guidance without making a page template canonical", () => {
  const manifest = getAgentManifest();

  assert.equal(manifest.schemaVersion, "0.1");
  assert.equal(manifest.defaultAdaptation, "suggest");
  assert.ok(
    manifest.antiPatterns.includes(
      "repeat the same scene wrapper for every page",
    ),
  );
  assert.equal(
    manifest.materials.some((material) => material.component === "Surface"),
    true,
  );
  assert.equal(
    manifest.compositionRules.some((rule) =>
      rule.includes("explicit placement"),
    ),
    true,
  );
  assert.deepEqual(
    manifest.gestures.map((gesture) => gesture.id),
    [
      "altarpiece",
      "fracture",
      "procession",
      "reliquary",
      "installation",
      "weather-system",
    ],
  );
});

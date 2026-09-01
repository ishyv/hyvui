import assert from "node:assert/strict";
import test from "node:test";
import {
  getBiomeCapability,
  listBiomeCapabilities,
} from "../src/lib/next-experiments/biomeManifest.js";
import { getAgentManifest } from "../src/lib/next-experiments/capabilities.js";

test("lists all twelve biome capabilities with laws and cautions", () => {
  const biomes = listBiomeCapabilities();
  assert.equal(biomes.length, 12);
  assert.equal(new Set(biomes.map((biome) => biome.id)).size, 12);

  const machine = getBiomeCapability("machine-ecology");
  assert.ok(machine);
  assert.equal(machine.spatialLaw.includes("polycentric"), true);
  assert.equal(machine.genome.spatialHabitat.includes("labyrinth"), true);
  assert.equal(machine.frameModes.includes("traverse-and-trace"), true);
  assert.equal(machine.passageModes.includes("infrastructural-traverse"), true);
  assert.equal(
    machine.grafts.destructiveWith.includes("oneiric-object-poetry"),
    true,
  );
  assert.equal(machine.antiPatterns.length > 0, true);
});

test("does not guess an unknown biome capability", () => {
  assert.equal(getBiomeCapability("unknown-world"), undefined);
});

test("includes biome discovery data in the agent manifest", () => {
  const manifest = getAgentManifest();
  assert.equal(manifest.biomes.length, 12);
  assert.equal(
    manifest.biomes.some((biome) => biome.id === "ceremonial-reliquary"),
    true,
  );
  assert.equal(
    manifest.compositionRules.some((rule) => rule.includes("host biome")),
    true,
  );
});

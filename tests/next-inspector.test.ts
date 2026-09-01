import assert from "node:assert/strict";
import test from "node:test";
import {
  inspectComposition,
  inspectBiomeComposition,
  inspectManifest,
} from "../scripts/inspect-composition.js";
import type { CompositionInput } from "../src/lib/next-experiments/types.js";
import type { BiomeCompositionInput } from "../src/lib/next-experiments/biomeComposition.js";

const input: CompositionInput = {
  artDirection: { seed: "inspect-01", adaptation: "suggest" },
  nodes: [
    {
      id: "focal",
      content: "Text",
      role: "focal-point",
      capabilities: ["bounded-variation"],
    },
    { id: "field", content: "Surface", role: "field" },
  ],
  relations: [
    {
      id: "focal-over-field",
      kind: "overlap",
      source: "focal",
      target: "field",
      strength: "preferred",
      behavior: "let the focal statement cross the field edge",
      fallback: "keep normal flow",
    },
  ],
};

test("inspects a composition as compact agent-readable JSON", () => {
  const result = inspectComposition(input);

  assert.equal(result.valid, true);
  assert.equal(result.seed, "inspect-01");
  assert.deepEqual(
    result.nodes.map((node) => node.id),
    ["focal", "field"],
  );
  assert.deepEqual(result.nodes[0].relations, ["overlap"]);
  assert.equal(result.decisions[0].status, "suggested");
  assert.equal(
    result.decisions[0].reason,
    "let the focal statement cross the field edge",
  );
});

test("inspects the manifest without rendering a page", () => {
  const manifest = inspectManifest();

  assert.equal(manifest.schemaVersion, "0.1");
  assert.equal(manifest.materials.length > 0, true);
  assert.equal(manifest.antiPatterns.length > 0, true);
});

test("rejects malformed input with a useful diagnostic", () => {
  assert.throws(
    () => inspectComposition({} as CompositionInput),
    /must include artDirection, nodes, and relations/,
  );
});

test("rejects malformed field types before resolution", () => {
  assert.throws(
    () =>
      inspectComposition({
        artDirection: { seed: 42, adaptation: "suggest" },
        nodes: [],
        relations: [],
      } as unknown as CompositionInput),
    /artDirection\.seed must be a string/,
  );
});

test("inspects a biome brief with host, graft, genome, and temporal plan", () => {
  const input: BiomeCompositionInput = {
    brief: {
      seed: "inspect-biome-01",
      premise: "the relic charts a private sky",
      hostBiome: "ceremonial-reliquary",
      grafts: [
        {
          biome: "celestial-cartography",
          channel: "light",
          mode: "symbiotic",
          reason: "the aureole becomes an authored orbit",
        },
      ],
    },
    nodes: [
      { id: "relic", content: "Surface", role: "focal-point" },
      { id: "witness", content: "Text", role: "counterweight" },
    ],
    relations: [],
  };

  const result = inspectBiomeComposition(input);
  assert.equal(result.valid, true);
  assert.equal(result.hostBiome, "ceremonial-reliquary");
  assert.equal(result.acceptedGrafts[0]?.channel, "light");
  assert.equal(result.genome.genes.spatialHabitat, "shrine");
  assert.equal(result.temporal.frameMode, "approach-and-hold");
});

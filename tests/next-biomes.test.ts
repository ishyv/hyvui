import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  biomeIds,
  biomeDefinitions,
  getBiomeDefinition,
  type BiomeBrief,
} from "../src/lib/next-experiments/biomes.js";
import {
  resolveBiomeBrief,
  resolveGraftCompatibility,
} from "../src/lib/next-experiments/biomeResolution.js";
import { resolveArtGenome } from "../src/lib/next-experiments/artGenome.js";

describe("biome definitions", () => {
  it("defines twelve complete host biomes", () => {
    assert.equal(biomeIds.length, 12);
    assert.equal(biomeDefinitions.length, biomeIds.length);
    assert.equal(new Set(biomeDefinitions.map((biome) => biome.id)).size, 12);

    for (const biome of biomeDefinitions) {
      assert.ok(biome.worldview.length > 0);
      assert.ok(biome.spatialLaw.length > 0);
      assert.ok(biome.attention.length > 0);
      assert.ok(biome.materials.length > 0);
      assert.ok(biome.typography.length > 0);
      assert.ok(biome.information.length > 0);
      assert.ok(biome.timeModel.length > 0);
      assert.ok(biome.viewerRole.length > 0);
      assert.ok(biome.interactionVerbs.length > 0);
      assert.ok(biome.frameModes.length > 0);
      assert.ok(biome.passageModes.length > 0);
      assert.ok(biome.antiPatterns.length > 0);
    }
  });

  it("does not guess an unknown biome", () => {
    assert.equal(getBiomeDefinition("unknown-world"), undefined);
    const result = resolveBiomeBrief({
      seed: "unknown-01",
      premise: "a thing refuses its category",
      hostBiome: "unknown-world" as BiomeBrief["hostBiome"],
      grafts: [],
    });
    assert.equal(result.valid, false);
    assert.equal(result.host, undefined);
    assert.match(result.issues[0]?.reason ?? "", /unknown host biome/);
  });
});

describe("biome graft compatibility", () => {
  const base: BiomeBrief = {
    seed: "graft-01",
    premise: "a habitat remembers what the instrument removes",
    hostBiome: "ecological-elegy",
    grafts: [],
  };

  it("accepts a compatible symbiotic information graft", () => {
    const result = resolveBiomeBrief({
      ...base,
      grafts: [
        {
          biome: "operational-apparatus",
          channel: "information",
          mode: "tensional",
          reason: "the botanical archive records what the water absorbs",
        },
      ],
    });
    assert.equal(result.valid, true);
    assert.deepEqual(
      result.acceptedGrafts.map((graft) => graft.biome),
      ["operational-apparatus"],
    );
    assert.equal(result.decisions[0]?.status, "accepted");
  });

  it("requires a reason for a tensional graft", () => {
    const graft = {
      biome: "noise-commons" as const,
      channel: "typography" as const,
      mode: "tensional" as const,
      reason: "",
    };
    const result = resolveGraftCompatibility(base.hostBiome, graft);
    assert.equal(result.status, "rejected");
    assert.match(result.reason, /bridge or conflict reason/);
  });

  it("rejects a destructive graft instead of averaging it", () => {
    const result = resolveBiomeBrief({
      ...base,
      hostBiome: "oneiric-object-poetry",
      grafts: [
        {
          biome: "operational-apparatus",
          channel: "information",
          mode: "tensional",
          reason:
            "turn the small impossible object into a diagnostic dashboard",
        },
      ],
    });
    assert.equal(result.valid, false);
    assert.equal(result.acceptedGrafts.length, 0);
    assert.equal(result.decisions[0]?.status, "rejected");
    assert.match(result.decisions[0]?.reason ?? "", /destructive/);
  });

  it("enforces the bounded graft count", () => {
    const result = resolveBiomeBrief({
      ...base,
      hostBiome: "operational-apparatus",
      grafts: [
        {
          biome: "post-digital-morphology",
          channel: "light",
          mode: "symbiotic",
          reason: "let the instrument catch a changing body",
        },
        {
          biome: "machine-ecology",
          channel: "material",
          mode: "symbiotic",
          reason: "let the habitat show through its infrastructure",
        },
        {
          biome: "celestial-cartography",
          channel: "information",
          mode: "symbiotic",
          reason: "let the instrument map its field",
        },
      ],
    });
    assert.equal(result.valid, false);
    assert.equal(result.acceptedGrafts.length, 2);
    assert.equal(result.decisions[2]?.status, "rejected");
    assert.match(result.issues.at(-1)?.reason ?? "", /two grafts/);
  });

  it("removes a later graft that collides with an accepted channel", () => {
    const result = resolveBiomeBrief({
      seed: "collision-01",
      premise: "two skies compete for one light channel",
      hostBiome: "operational-apparatus",
      grafts: [
        {
          biome: "post-digital-morphology",
          channel: "light",
          mode: "symbiotic",
          reason: "the instrument catches a changing body",
        },
        {
          biome: "machine-ecology",
          channel: "light",
          mode: "symbiotic",
          reason: "the habitat glows through its infrastructure",
        },
      ],
    });
    assert.equal(result.valid, false);
    assert.equal(result.acceptedGrafts.length, 1);
    assert.equal(result.decisions[0]?.status, "accepted");
    assert.equal(result.decisions[1]?.status, "rejected");
    assert.match(result.issues[0]?.reason ?? "", /channel collision/);
  });

  it("limits a composition to one tensional graft", () => {
    const result = resolveBiomeBrief({
      ...base,
      grafts: [
        {
          biome: "operational-apparatus",
          channel: "material",
          mode: "tensional",
          reason: "instrument surfaces expose the habitat's maintenance cost",
        },
        {
          biome: "ceremonial-reliquary",
          channel: "light",
          mode: "tensional",
          reason: "a ritual light makes the damaged habitat visible",
        },
      ],
    });

    assert.equal(result.valid, false);
    assert.equal(result.acceptedGrafts.length, 1);
    assert.equal(result.decisions[1]?.status, "rejected");
    assert.match(result.decisions[1]?.reason ?? "", /tensional graft/);
  });
});

describe("art genome", () => {
  it("derives bounded genes from the host biome", () => {
    const result = resolveArtGenome("oneiric-object-poetry");
    assert.equal(result.valid, true);
    assert.equal(result.genes.spatialHabitat, "domestic chamber");
    assert.equal(result.genes.density, "concentrated island");
    assert.equal(
      result.genes.timeModel,
      "suspension, sway, slosh, leak, and tiny uncertain changes",
    );
    assert.equal(result.genes.viewerRole, "holder");
  });

  it("rejects a gene override outside the host bounds", () => {
    const result = resolveArtGenome("quiet-object-gallery", {
      spatialHabitat: "polycentric labyrinth",
      typography: "technical instrument",
    });
    assert.equal(result.valid, false);
    assert.equal(result.genes.spatialHabitat, "gallery void");
    assert.equal(result.genes.typography, "sparse label");
    assert.equal(result.issues.length, 2);
    assert.match(result.issues[0]?.reason ?? "", /outside/);
  });
});

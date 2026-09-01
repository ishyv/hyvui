import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { resolveBiomeAtmosphere } from "../src/lib/next-experiments/biomeAtmosphere.js";
import { resolveBiomeMaterial } from "../src/lib/next-experiments/biomeMaterials.js";
import { resolveBiomeTypography } from "../src/lib/next-experiments/biomeTypography.js";

describe("biome material projections", () => {
  it("projects a quiet object as material instead of atmosphere", () => {
    const result = resolveBiomeMaterial("quiet-object-gallery");
    assert.equal(result.valid, true);
    assert.equal(result.substrate, "ceramic");
    assert.equal(result.light, "soft studio");
    assert.equal(result.atmosphere, "none");
  });

  it("projects machine ecology through its physical substrate", () => {
    const result = resolveBiomeMaterial("machine-ecology");
    assert.equal(result.valid, true);
    assert.equal(result.substrate, "pipe");
    assert.equal(result.surface, "maintenance residue");
    assert.equal(result.atmosphere, "flow");
  });
});

describe("biome typography projections", () => {
  it("keeps operational notation distinct from display type", () => {
    const result = resolveBiomeTypography("operational-apparatus");
    assert.equal(result.valid, true);
    assert.equal(result.displayRole, "technical instrument");
    assert.equal(result.supportRole, "compact metadata");
    assert.equal(result.bodyPolicy, "functional prose");
  });

  it("allows a biome to keep typography absent", () => {
    const result = resolveBiomeTypography("quiet-object-gallery");
    assert.equal(result.valid, true);
    assert.equal(result.displayRole, "sparse label");
    assert.equal(result.bodyPolicy, "caption-led");
  });
});

describe("biome atmosphere projections", () => {
  it("turns ecological absorption into local causal motion", () => {
    const result = resolveBiomeAtmosphere("ecological-elegy");
    assert.equal(result.valid, true);
    assert.equal(result.intent, "absorption");
    assert.equal(result.mode, "motion");
  });

  it("keeps the same atmospheric meaning without motion when reduced", () => {
    const result = resolveBiomeAtmosphere("ecological-elegy", true);
    assert.equal(result.intent, "absorption");
    assert.equal(result.mode, "static");
    assert.equal(result.durationMs, 0);
  });

  it("allows an accepted typography graft to change the display role", () => {
    const result = resolveBiomeTypography("manifesto-print", [
      {
        biome: "deconstructed-editorial",
        channel: "typography",
        mode: "symbiotic",
        reason: "the editorial witness keeps the declaration spatial",
      },
    ]);
    assert.equal(result.displayRole, "architectural statement");
  });

  it("allows an accepted motion graft to change the atmosphere intent", () => {
    const result = resolveBiomeAtmosphere("machine-ecology", false, [
      {
        biome: "ecological-elegy",
        channel: "motion",
        mode: "symbiotic",
        reason: "the flow carries the habitat's absorption",
      },
    ]);
    assert.equal(result.intent, "absorption");
  });
});

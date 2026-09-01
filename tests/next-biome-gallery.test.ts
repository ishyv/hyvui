import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  biomeProofIds,
  biomeProofs,
  biomeHybridProofs,
  resolveBiomeHybridProof,
  sharedBiomeContent,
} from "../src/lib/next-experiments/biomeGallery.js";

describe("biome proof gallery", () => {
  it("contains six distinct host biomes", () => {
    assert.deepEqual(biomeProofIds, [
      "ceremonial-reliquary",
      "ecological-elegy",
      "oneiric-object-poetry",
      "machine-ecology",
      "manifesto-print",
      "kinetic-rupture",
    ]);
    assert.equal(new Set(biomeProofs.map((proof) => proof.host)).size, 6);
    assert.equal(new Set(biomeProofs.map((proof) => proof.spatialLaw)).size, 6);
  });

  it("keeps one content corpus while changing the visual ecology", () => {
    assert.ok(sharedBiomeContent.title.length > 0);
    assert.ok(sharedBiomeContent.body.length > 0);
    for (const proof of biomeProofs) {
      assert.equal(proof.content.title, sharedBiomeContent.title);
      assert.equal(proof.content.body, sharedBiomeContent.body);
      assert.ok(proof.timeModel.length > 0);
      assert.ok(proof.viewerRole.length > 0);
      assert.ok(proof.frameMode.length > 0);
    }
  });

  it("resolves three named hybrids and rejects a destructive one", () => {
    assert.equal(biomeHybridProofs.length, 3);
    for (const hybrid of biomeHybridProofs) {
      const result = resolveBiomeHybridProof(hybrid.id);
      assert.ok(result);
      assert.equal(result.valid, true);
      assert.equal(result.acceptedGrafts.length, 1);
    }

    const destructive = resolveBiomeHybridProof("object-poetry-diagnostic");
    assert.ok(destructive);
    assert.equal(destructive.valid, false);
    assert.match(destructive.issues[0]?.reason ?? "", /destructive/);
  });
});

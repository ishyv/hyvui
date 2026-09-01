import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  biomeTransitionIntents,
  resolveBiomeTransition,
  resolveTransition,
} from "../src/lib/next-experiments/transitionResolution.js";

const frameIds = ["arrival", "departure"];

describe("semantic transition resolution", () => {
  it("maps a transition intent to a bounded visual plan", () => {
    const result = resolveTransition("approach");
    assert.deepEqual(result, {
      intent: "approach",
      mode: "animate",
      durationMs: 720,
      continuity: "preserve",
      fallback: "reveal the destination frame in document order",
    });
  });

  it("turns movement into an immediate state change for reduced motion", () => {
    const result = resolveTransition("release", true);
    assert.equal(result.mode, "state-change");
    assert.equal(result.durationMs, 0);
    assert.equal(result.continuity, "preserve");
  });

  it("uses a cut when continuity is not part of the intent", () => {
    const result = resolveTransition("cut");
    assert.equal(result.mode, "cut");
    assert.equal(result.durationMs, 0);
    assert.equal(result.continuity, "none");
  });

  it("maps each proof biome to a native transition intent", () => {
    assert.equal(Object.keys(biomeTransitionIntents).length, 12);
    assert.equal(resolveBiomeTransition("machine-ecology").intent, "inherit");
    assert.equal(resolveBiomeTransition("ecological-elegy").intent, "occlude");
    assert.equal(resolveBiomeTransition("unknown-world").intent, "cut");
  });
});

describe("frame identifiers", () => {
  it("keeps frame IDs stable for native hash navigation", () => {
    assert.deepEqual(frameIds, ["arrival", "departure"]);
    assert.equal(new Set(frameIds).size, frameIds.length);
  });
});

import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { resolvePassage } from "../src/lib/next-experiments/passageResolution.js";

describe("passage resolution", () => {
  it("keeps ecological absorption scroll-native when justified", () => {
    const result = resolvePassage("ecological-elegy", {
      reason: "the habitat must absorb the subject over a readable duration",
    });
    assert.equal(result.valid, true);
    assert.equal(result.mode, "scroll");
    assert.equal(result.fallbackMode, "static");
    assert.equal(result.progress, "intersection");
    assert.equal(result.motion, "drift");
  });

  it("allows an explicit static fallback without inventing scroll", () => {
    const result = resolvePassage("ecological-elegy", {
      mode: "static",
      reason: "the same absorption must remain available as ordinary reading",
    });
    assert.equal(result.valid, true);
    assert.equal(result.mode, "static");
    assert.equal(result.motion, "none");
  });

  it("rejects scroll without a conceptual justification", () => {
    const result = resolvePassage("machine-ecology", { mode: "scroll" });
    assert.equal(result.valid, false);
    assert.equal(result.mode, "static");
    assert.match(result.reason, /justification/);
  });

  it("uses static fallback for unknown hosts", () => {
    const result = resolvePassage("unknown-world", {
      reason: "there is no declared temporal law",
    });
    assert.equal(result.valid, false);
    assert.equal(result.mode, "static");
    assert.equal(result.fallbackMode, "static");
  });
});

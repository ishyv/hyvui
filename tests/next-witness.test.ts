import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  recordWitnessAttention,
  resolveWitnessView,
  witnessObservationIds,
} from "../src/lib/next-experiments/witness.js";

describe("witness view model", () => {
  it("keeps focus intimate and context relational", () => {
    const focus = resolveWitnessView("horizon", "focus", []);
    const context = resolveWitnessView("horizon", "context", []);

    assert.equal(focus.valid, true);
    assert.equal(context.valid, true);
    assert.deepEqual(focus.visibleObservationIds, ["horizon"]);
    assert.deepEqual(context.visibleObservationIds, [...witnessObservationIds]);
    assert.notEqual(focus.primaryText, context.primaryText);
    assert.equal(focus.certainty, "partial signal");
    assert.equal(context.certainty, "three markers / lower certainty");
  });

  it("records attention without duplicating or reordering the trail", () => {
    const first = recordWitnessAttention([], "canopy");
    const second = recordWitnessAttention(first, "ground");
    const repeated = recordWitnessAttention(second, "canopy");

    assert.deepEqual(first, ["canopy"]);
    assert.deepEqual(second, ["canopy", "ground"]);
    assert.deepEqual(repeated, ["canopy", "ground"]);
  });

  it("does not guess an unknown observation", () => {
    const result = resolveWitnessView("unknown", "focus", []);

    assert.equal(result.valid, false);
    assert.equal(result.observation, undefined);
    assert.equal(result.issues[0], "observation not found: unknown");
  });

  it("preserves the selected observation while changing the mode", () => {
    const result = resolveWitnessView("canopy", "context", ["ground"]);

    assert.equal(result.observation?.id, "canopy");
    assert.deepEqual(result.attentionTrail, ["ground"]);
    assert.equal(result.mode, "context");
  });
});

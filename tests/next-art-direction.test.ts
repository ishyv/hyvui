import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveArtDirector,
  selectCompositionGesture,
} from "../src/lib/next-experiments/artDirection.js";
import type {
  ArtDirection,
  CompositionNodeSpec,
} from "../src/lib/next-experiments/types.js";

const nodes: CompositionNodeSpec[] = [
  {
    id: "beacon",
    content: "FloatCard",
    role: "focal-point",
  },
  {
    id: "trace",
    content: "EnergyArc",
    role: "connector",
  },
];

const direction: ArtDirection = {
  seed: "reliquary-01",
  adaptation: "apply",
  authority: "strong",
  gesture: "reliquary",
  thesis: "the signal is being swallowed by weather",
  focal: "beacon",
  motif: "concentric-interruption",
  palette: "cold-to-warm-rupture",
  typography: "monumental-whisper",
  depth: "veil-beacon-field",
  interaction: "gravitational-hover",
  material: "arcane",
  motion: "active",
};

test("strong art direction resolves one thesis into explicit visual layers", () => {
  const plan = resolveArtDirector(direction, nodes);

  assert.equal(plan.authority, "strong");
  assert.equal(plan.gesture, "reliquary");
  assert.equal(plan.thesis, direction.thesis);
  assert.equal(plan.focalNodeId, "beacon");
  assert.equal(plan.motif, "concentric-interruption");
  assert.equal(plan.palette, "cold-to-warm-rupture");
  assert.equal(plan.typography, "monumental-whisper");
  assert.equal(plan.depth, "veil-beacon-field");
  assert.equal(plan.interaction, "gravitational-hover");
  assert.deepEqual(plan.semanticOrder, ["beacon", "trace"]);
  assert.deepEqual(plan.nodePlanes, { beacon: "focal", trace: "midground" });
  assert.equal(plan.nodePoses.beacon.scale > 1, true);
  assert.equal(plan.nodePoses.beacon.z, 5);
  assert.equal(plan.nodePoses.trace.rotate, "-13deg");
  assert.deepEqual(plan.layerOrder, [
    "background",
    "atmosphere",
    "midground",
    "focal",
    "foreground",
  ]);
  assert.equal(plan.canAddAtmosphere, true);
  assert.equal(plan.canRemoveRequiredContent, false);
});

test("implicit gesture selection is deterministic and namespaced by seed", () => {
  assert.equal(
    selectCompositionGesture("reliquary-seed"),
    selectCompositionGesture("reliquary-seed"),
  );
  assert.notEqual(
    selectCompositionGesture("reliquary-seed"),
    selectCompositionGesture("procession-seed"),
  );
});

test("a bounded direction remains passive and preserves the old contract", () => {
  const bounded: ArtDirection = {
    seed: "bounded-01",
    adaptation: "apply",
    authority: "bounded",
  };
  const plan = resolveArtDirector(bounded, nodes);

  assert.equal(plan.authority, "bounded");
  assert.equal(plan.canAddAtmosphere, false);
  assert.deepEqual(plan.nodePoses, {});
  assert.deepEqual(plan.semanticOrder, ["beacon", "trace"]);
});

test("strong visual authority only mutates the composition in apply mode", () => {
  const suggest = resolveArtDirector(
    { ...direction, adaptation: "suggest" },
    nodes,
  );
  const disabled = resolveArtDirector(
    { ...direction, adaptation: "disabled" },
    nodes,
  );

  assert.deepEqual(suggest.nodePoses, {});
  assert.equal(suggest.canAddAtmosphere, false);
  assert.deepEqual(disabled.nodePoses, {});
  assert.equal(disabled.canAddAtmosphere, false);
});

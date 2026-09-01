import assert from "node:assert/strict";
import test from "node:test";
import {
  createSeededRandom,
  deterministicVariation,
  resolveComposition,
  validateComposition,
} from "../src/lib/next-experiments/core.js";
import type { CompositionInput } from "../src/lib/next-experiments/types.js";

const composition: CompositionInput = {
  artDirection: {
    seed: "night-room-01",
    mood: "quiet tension",
    material: "archive",
    density: "sparse",
    adaptation: "suggest",
  },
  nodes: [
    {
      id: "signal",
      content: "Text",
      role: "focal-point",
      capabilities: ["bounded-variation", "overlap-target"],
      priority: 0,
    },
    {
      id: "note",
      content: "Surface",
      role: "counterweight",
      capabilities: ["bounded-variation"],
      constraints: { manualPlacement: false },
      priority: 1,
    },
  ],
  relations: [
    {
      id: "signal-over-note",
      kind: "overlap",
      source: "signal",
      target: "note",
      strength: "preferred",
      behavior: "let the focal signal cross the note edge",
      fallback: "keep both in normal flow",
    },
  ],
};

test("validates node identity and relation endpoints", () => {
  const result = validateComposition(composition);

  assert.deepEqual(result, { valid: true, issues: [] });
});

test("reports duplicate nodes and missing relation endpoints", () => {
  const invalid: CompositionInput = {
    ...composition,
    nodes: [...composition.nodes, { ...composition.nodes[0] }],
    relations: [{ ...composition.relations[0], target: "missing-node" }],
  };

  const result = validateComposition(invalid);

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.issues.map((issue) => issue.path),
    ["nodes[2].id", "relations[0].target"],
  );
});

test("rejects malformed node and relation identifiers", () => {
  const invalid: CompositionInput = {
    ...composition,
    nodes: [{ ...composition.nodes[0], id: "Signal!" }, composition.nodes[1]],
    relations: [
      { ...composition.relations[0], id: "crosses note!", source: "Signal!" },
    ],
  };

  const result = validateComposition(invalid);

  assert.equal(result.valid, false);
  assert.deepEqual(
    result.issues.map((issue) => issue.path),
    ["nodes[0].id", "relations[0].id"],
  );
});

test("keeps seeded random decisions stable and namespaced", () => {
  const first = createSeededRandom("night-room-01");
  const second = createSeededRandom("night-room-01");
  const other = createSeededRandom("night-room-02");

  assert.deepEqual([first(), first(), first()], [second(), second(), second()]);
  assert.notEqual(other(), first());
  assert.equal(
    deterministicVariation("night-room-01", "signal"),
    deterministicVariation("night-room-01", "signal"),
  );
  assert.notEqual(
    deterministicVariation("night-room-01", "signal"),
    deterministicVariation("night-room-01", "note"),
  );
});

test("resolves relation decisions without changing authored placement", () => {
  const result = resolveComposition(composition);
  const signal = result.nodes.find((node) => node.id === "signal");
  const note = result.nodes.find((node) => node.id === "note");

  assert.equal(result.valid, true);
  assert.equal(result.decisions[0].status, "suggested");
  assert.equal(
    result.decisions[0].reason,
    "let the focal signal cross the note edge",
  );
  assert.equal(signal?.variation !== 0, true);
  assert.equal(note?.variation !== 0, true);
  assert.deepEqual(signal?.authoredPlacement, undefined);
});

test("explicit manual placement rejects an applied relation", () => {
  const input: CompositionInput = {
    ...composition,
    artDirection: { ...composition.artDirection, adaptation: "apply" },
    nodes: composition.nodes.map((node) =>
      node.id === "note"
        ? { ...node, constraints: { manualPlacement: true } }
        : node,
    ),
  };

  const result = resolveComposition(input);

  assert.equal(result.decisions[0].status, "rejected");
  assert.match(result.decisions[0].reason, /manual placement/);
});

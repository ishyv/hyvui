import assert from "node:assert/strict";
import test from "node:test";
import { summarizeCompositionSnapshot } from "./measure-compositions.mjs";

test("summarizes a rendered composition snapshot into a stable signature", () => {
  const result = summarizeCompositionSnapshot({
    caseId: "sparse",
    mode: "suggest",
    rootChildren: ["header", "div.experiment", "aside"],
    nodes: [
      {
        id: "signal",
        role: "focal-point",
        relations: ["overlap"],
        rect: { left: 10, top: 10, right: 50, bottom: 50 },
      },
      {
        id: "note",
        role: "counterweight",
        relations: ["overlap"],
        rect: { left: 40, top: 40, right: 80, bottom: 80 },
      },
    ],
    componentCounts: { Card: 0, Grid: 0, Surface: 1 },
    layoutModes: ["grid"],
    directPositioning: 2,
  });

  assert.equal(result.id, "sparse:suggest");
  assert.equal(result.nodeCount, 2);
  assert.equal(result.roleCount, 2);
  assert.equal(result.relationKinds, 1);
  assert.equal(result.overlapPairs, 1);
  assert.equal(result.maxOverlapRatio, 0.0625);
  assert.equal(result.directPositioning, 2);
  assert.equal(
    result.signature,
    "header|div.experiment|aside :: grid :: focal-point,counterweight :: overlap",
  );
});

test("does not count touching edges as overlap", () => {
  const result = summarizeCompositionSnapshot({
    caseId: "edge",
    mode: "disabled",
    rootChildren: ["div.experiment"],
    nodes: [
      {
        id: "a",
        role: "field",
        relations: [],
        rect: { left: 0, top: 0, right: 10, bottom: 10 },
      },
      {
        id: "b",
        role: "frame",
        relations: [],
        rect: { left: 10, top: 0, right: 20, bottom: 10 },
      },
    ],
    componentCounts: {},
    layoutModes: [],
    directPositioning: 0,
  });

  assert.equal(result.overlapPairs, 0);
  assert.equal(result.maxOverlapRatio, 0);
});

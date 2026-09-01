import assert from "node:assert/strict";
import test from "node:test";
import {
  getOverlapRatio,
  getRegion,
  resolveOverlapNudge,
  resolveOverflowScale,
} from "../src/lib/next-experiments/visual.js";
import type { LayoutRect } from "../src/lib/next-experiments/visual.js";

const root: LayoutRect = { x: 0, y: 0, width: 1000, height: 800 };

test("calculates overlap as the smaller participant area that is shared", () => {
  const ratio = getOverlapRatio(
    { x: 200, y: 200, width: 300, height: 300 },
    { x: 400, y: 400, width: 300, height: 300 },
  );

  assert.equal(Number(ratio.toFixed(4)), 0.1111);
});

test("nudges an edge overlap away until it fits the declared budget", () => {
  const source: LayoutRect = { x: 500, y: 300, width: 300, height: 220 };
  const target: LayoutRect = { x: 580, y: 400, width: 300, height: 140 };
  const nudge = resolveOverlapNudge(source, target, 0.26);
  const moved = { ...source, x: source.x + nudge.x, y: source.y + nudge.y };

  assert.ok(nudge.x !== 0 || nudge.y !== 0);
  assert.ok(getOverlapRatio(moved, target) <= 0.26);
});

test("reports the nearest spatial region for position-aware interaction", () => {
  assert.equal(
    getRegion({ x: 40, y: 20, width: 80, height: 80 }, root),
    "upper-left",
  );
  assert.equal(
    getRegion({ x: 850, y: 650, width: 80, height: 80 }, root),
    "lower-right",
  );
});

test("scales only when a non-manual node exceeds its field", () => {
  assert.equal(
    resolveOverflowScale({ x: 100, y: 100, width: 400, height: 300 }, root),
    1,
  );
  assert.equal(
    resolveOverflowScale({ x: 100, y: 100, width: 1200, height: 900 }, root),
    0.79,
  );
});

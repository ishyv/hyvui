import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRouteMatrix,
  reducedMotionViewports,
  viewportWidths,
} from "../scripts/measure-showcase-routes.mjs";

test("route matrix covers every manifest route and approved viewport", () => {
  assert.deepEqual(viewportWidths, [1600, 1440, 1024, 768, 480, 375, 320]);
  assert.deepEqual(reducedMotionViewports, [
    { width: 1600, height: 900 },
    { width: 375, height: 900 },
  ]);
  assert.equal(buildRouteMatrix().length, 31 * viewportWidths.length);
});

test("route matrix includes both public and research representatives", () => {
  const matrix = buildRouteMatrix();
  assert.ok(matrix.some((entry) => entry.status === "published"));
  assert.ok(matrix.some((entry) => entry.status === "utility"));
  assert.ok(matrix.some((entry) => entry.status === "experimental"));
  assert.ok(matrix.some((entry) => entry.family === "scene"));
  assert.ok(matrix.some((entry) => entry.family === "research-archive"));
});

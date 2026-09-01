import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  getAdjacentShowcaseRoutes,
  getShowcasePrimaryLinks,
  listShowcaseFamily,
} from "../src/lib/showcase/showcaseNavigation.js";

describe("showcase navigation", () => {
  it("lists only the requested family in manifest order", () => {
    assert.deepEqual(
      listShowcaseFamily("scene").map((manifest) => manifest.id),
      ["bridge", "keeper", "correspondence", "watchhouse"],
    );
    assert.deepEqual(
      listShowcaseFamily("material-study").map((manifest) => manifest.id),
      ["hextech", "arcane"],
    );
  });

  it("returns previous and next links at family boundaries", () => {
    assert.deepEqual(getAdjacentShowcaseRoutes("bridge"), {
      previous: undefined,
      next: "keeper",
    });
    assert.deepEqual(getAdjacentShowcaseRoutes("correspondence"), {
      previous: "keeper",
      next: "watchhouse",
    });
    assert.deepEqual(getAdjacentShowcaseRoutes("watchhouse"), {
      previous: "correspondence",
      next: undefined,
    });
  });

  it("does not leak public navigation into experimental routes", () => {
    assert.deepEqual(getAdjacentShowcaseRoutes("next-witness"), {
      previous: "next-baseline",
      next: undefined,
    });
    assert.deepEqual(
      getShowcasePrimaryLinks().map((manifest) => manifest.id),
      ["home", "bridge", "keeper", "correspondence", "watchhouse", "docs"],
    );
  });

  it("does not mutate the manifest while resolving navigation", () => {
    const before = listShowcaseFamily("scene").map((manifest) => manifest.id);
    getAdjacentShowcaseRoutes("keeper");
    assert.deepEqual(
      listShowcaseFamily("scene").map((manifest) => manifest.id),
      before,
    );
  });
});

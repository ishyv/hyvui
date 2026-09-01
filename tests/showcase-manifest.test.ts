import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import {
  getShowcaseManifest,
  showcaseManifests,
} from "../src/lib/showcase/showcaseManifest.js";
import { biomeIds } from "../src/lib/next-experiments/biomes.js";

const expectedIds = [
  "home",
  "bridge",
  "keeper",
  "correspondence",
  "watchhouse",
  "hextech",
  "arcane",
  "docs",
  "system",
  "drifting",
  "cooling",
  "forbidden",
  "gateway",
  "interrupted",
  "lost",
  "maintenance",
  "offline",
  "pending",
  "redirecting",
  "unauthorized",
  "system-cinematic",
  "system-ornament-patterns",
  "lab",
  "next-biomes",
  "next-biome-plan",
  "next-frames",
  "next-passage",
  "next-measured-sublime",
  "next-experiment",
  "next-baseline",
  "next-witness",
];

describe("showcase route manifest", () => {
  it("enumerates every user-facing route in anthology order", () => {
    assert.deepEqual(
      showcaseManifests.map((manifest) => manifest.id),
      expectedIds,
    );
  });

  it("keeps route IDs and hrefs unique", () => {
    assert.equal(
      new Set(showcaseManifests.map((manifest) => manifest.id)).size,
      showcaseManifests.length,
    );
    assert.equal(
      new Set(showcaseManifests.map((manifest) => manifest.href)).size,
      showcaseManifests.length,
    );
  });

  it("requires a premise, focal subject, viewer, relation, and mobile mode", () => {
    for (const manifest of showcaseManifests) {
      assert.ok(manifest.premise, `${manifest.id} premise`);
      assert.ok(manifest.focal, `${manifest.id} focal`);
      assert.ok(manifest.viewerRole, `${manifest.id} viewer role`);
      assert.ok(manifest.primaryRelation, `${manifest.id} relation`);
      assert.ok(manifest.temporalLaw, `${manifest.id} temporal law`);
      assert.ok(manifest.mobileMode, `${manifest.id} mobile mode`);
    }
  });

  it("distinguishes public, utility, and experimental route families", () => {
    assert.equal(getShowcaseManifest("home")?.status, "published");
    assert.equal(getShowcaseManifest("docs")?.status, "utility");
    assert.equal(getShowcaseManifest("lab")?.status, "utility");
    assert.equal(getShowcaseManifest("next-witness")?.status, "experimental");
    assert.equal(getShowcaseManifest("missing"), undefined);
  });

  it("uses only recognized host biomes", () => {
    for (const manifest of showcaseManifests) {
      if (manifest.hostBiome) {
        assert.ok(
          biomeIds.includes(manifest.hostBiome),
          `${manifest.id} host biome ${manifest.hostBiome}`,
        );
      }
    }
  });
});

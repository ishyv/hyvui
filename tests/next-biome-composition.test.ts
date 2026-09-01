import { strict as assert } from "node:assert";
import { describe, it } from "node:test";
import { resolveBiomeComposition } from "../src/lib/next-experiments/biomeComposition.js";
import { resolveBiomeMaterial } from "../src/lib/next-experiments/biomeMaterials.js";
import type { BiomeBrief } from "../src/lib/next-experiments/biomes.js";
import type {
  CompositionNodeSpec,
  CompositionRelation,
} from "../src/lib/next-experiments/types.js";

const brief: BiomeBrief = {
  seed: "plan-01",
  premise: "the habitat remains legible only through its maintenance traces",
  hostBiome: "machine-ecology",
  focalPolicy: "polycentric",
  grafts: [
    {
      biome: "operational-apparatus",
      channel: "information",
      mode: "symbiotic",
      reason: "maintenance records make local mechanisms legible",
    },
  ],
};

const nodes: CompositionNodeSpec[] = [
  { id: "signal", content: "Text", role: "focal-point", priority: 1 },
  { id: "route", content: "ThreadLine", role: "connector", priority: 3 },
  { id: "habitat", content: "Surface", role: "field", priority: 0 },
];

const relations: CompositionRelation[] = [
  {
    id: "route-connects-signal",
    kind: "connect",
    source: "route",
    target: "signal",
    strength: "preferred",
    behavior: "carry maintenance evidence toward the signal",
    fallback: "keep the authored flow",
  },
];

describe("biome composition plan", () => {
  it("combines host law, genome, focus policy, and relation decisions", () => {
    const result = resolveBiomeComposition({ brief, nodes, relations });

    assert.equal(result.valid, true);
    assert.equal(result.hostBiome, "machine-ecology");
    assert.equal(result.genome.genes.spatialHabitat, "labyrinth");
    assert.equal(result.spatial.frameMode, "traverse-and-trace");
    assert.equal(result.temporal.passageMode, "infrastructural-traverse");
    assert.equal(result.interaction.viewerRole, "maintainer");
    assert.deepEqual(result.semanticOrder, ["signal", "route", "habitat"]);
    assert.deepEqual(result.focalNodeIds, ["signal"]);
    assert.deepEqual(result.visualOrder, ["route", "signal", "habitat"]);
    assert.equal(result.decisions.biome[0]?.status, "accepted");
    assert.equal(
      result.decisions.relations[0]?.relationId,
      "route-connects-signal",
    );
  });

  it("keeps a singular focal policy from inventing a focal node", () => {
    const result = resolveBiomeComposition({
      brief: { ...brief, focalPolicy: "singular" },
      nodes: [
        { id: "field", content: "Surface", role: "field" },
        { id: "note", content: "Text", role: "counterweight" },
      ],
      relations: [],
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.focalNodeIds, ["field"]);
    assert.deepEqual(result.semanticOrder, ["field", "note"]);
  });

  it("preserves authored content constraints in the resolved plan", () => {
    const result = resolveBiomeComposition({
      brief: {
        ...brief,
        contentOrder: ["habitat", "signal"],
        requiredContent: ["signal", "habitat"],
        withholding: "reveal the route after the habitat is understood",
      },
      nodes,
      relations,
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.contentOrder, ["habitat", "signal", "route"]);
    assert.deepEqual(result.requiredContent, ["signal", "habitat"]);
    assert.equal(
      result.withholding,
      "reveal the route after the habitat is understood",
    );
  });

  it("reports required content that is absent from the node set", () => {
    const result = resolveBiomeComposition({
      brief: { ...brief, requiredContent: ["missing-node"] },
      nodes,
      relations,
    });

    assert.equal(result.valid, false);
    assert.match(
      result.issues.find((issue) => issue.path === "requiredContent[0]")
        ?.reason ?? "",
      /missing-node/,
    );
  });

  it("removes duplicate authored content-order entries after reporting them", () => {
    const result = resolveBiomeComposition({
      brief: { ...brief, contentOrder: ["signal", "signal", "habitat"] },
      nodes,
      relations,
    });

    assert.deepEqual(result.contentOrder, ["signal", "habitat", "route"]);
    assert.match(result.issues[0]?.reason ?? "", /repeats node/);
  });

  it("projects an accepted graft through its declared material channel", () => {
    const result = resolveBiomeComposition({
      brief: {
        ...brief,
        hostBiome: "operational-apparatus",
        grafts: [
          {
            biome: "machine-ecology",
            channel: "material",
            mode: "symbiotic",
            reason: "pipe and inspection light share a working surface",
          },
        ],
      },
      nodes,
      relations,
    });

    assert.equal(result.valid, true);
    assert.equal(result.genome.genes.material, "pipe");
    assert.ok(result.material.families.includes("pipe"));
    assert.equal(
      resolveBiomeMaterial(result.hostBiome, result.acceptedGrafts).substrate,
      "pipe",
    );
  });

  it("rejects frame and passage policies outside the host vocabulary", () => {
    const result = resolveBiomeComposition({
      brief: {
        ...brief,
        framePolicy: "invented-frame",
        passagePolicy: "invented-passage",
      },
      nodes,
      relations,
    });

    assert.equal(result.valid, false);
    assert.match(
      result.issues.find((issue) => issue.path === "framePolicy")?.reason ?? "",
      /not declared/,
    );
    assert.match(
      result.issues.find((issue) => issue.path === "passagePolicy")?.reason ??
        "",
      /not declared/,
    );
  });

  it("preserves invalid biome decisions in the inspector plan", () => {
    const result = resolveBiomeComposition({
      brief: {
        ...brief,
        hostBiome: "oneiric-object-poetry",
        grafts: [
          {
            biome: "operational-apparatus",
            channel: "information",
            mode: "tensional",
            reason: "turn the object into a dashboard",
          },
        ],
      },
      nodes,
      relations,
    });

    assert.equal(result.valid, false);
    assert.equal(result.decisions.biome[0]?.status, "rejected");
    assert.match(result.issues[0]?.reason ?? "", /destructive/);
  });
});

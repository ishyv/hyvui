import assert from "node:assert/strict";
import test from "node:test";
import { resolveComposition } from "../src/lib/next-experiments/core.js";
import { resolveMeasuredSublime } from "../src/lib/next-experiments/measuredSublime.js";
import type {
  CompositionNodeSpec,
  CompositionRelation,
} from "../src/lib/next-experiments/types.js";

const nodes: CompositionNodeSpec[] = [
  { id: "intention", content: "premise", role: "focal-point" },
  { id: "constraint", content: "boundary", role: "counterweight" },
  { id: "decision", content: "form", role: "interruption" },
  { id: "witness", content: "evidence", role: "foreground" },
];

const relations: CompositionRelation[] = [
  {
    id: "constraint-anchors-intention",
    kind: "anchor",
    source: "constraint",
    target: "intention",
    strength: "required",
    behavior: "hold intention against the declared boundary",
  },
  {
    id: "decision-reveals-intention",
    kind: "reveal",
    source: "decision",
    target: "intention",
    strength: "preferred",
    behavior: "expose the moment intention becomes visible form",
  },
  {
    id: "witness-follows-decision",
    kind: "connect",
    source: "witness",
    target: "decision",
    strength: "hint",
    behavior: "let readable evidence follow the decision",
  },
];

const composition = resolveComposition({
  artDirection: {
    seed: "measured-sublime-01",
    adaptation: "apply",
  },
  nodes,
  relations,
});

const input = {
  seed: "measured-sublime-01",
  premise:
    "a system can measure every relation except the moment intention becomes form",
  field: {
    quietRatio: 0.92,
    register: "austere-apparatus" as const,
  },
  phenomenon: {
    id: "decision-specimen",
    source: "composition-decisions" as const,
  },
  trajectory: "exposure" as const,
  rupture: {
    kind: "internal-seam" as const,
    relationId: "decision-reveals-intention",
  },
  withholding: "conceal-facets-until-inspected" as const,
  materialEvidence: [
    "node-boundary",
    "relation-seam",
    "decision-registration",
  ] as const,
  composition,
  relations,
};

test("premise-first specimen derives one deterministic phenomenon from resolver data", () => {
  const specimen = resolveMeasuredSublime(input);
  const repeated = resolveMeasuredSublime(input);

  assert.equal(specimen.valid, true);
  assert.equal(specimen.premise, input.premise);
  assert.equal(specimen.phenomenonId, "decision-specimen");
  assert.equal(specimen.quietRatio, 0.8);
  assert.deepEqual(
    specimen.facets.map((facet) => facet.nodeId),
    nodes.map((node) => node.id),
  );
  assert.deepEqual(
    specimen.trace.map((segment) => segment.relationId),
    composition.decisions.map((decision) => decision.relationId),
  );
  assert.equal(specimen.rupture?.relationId, "decision-reveals-intention");
  assert.equal(specimen.materialEvidence.length, 3);
  assert.equal("atmosphere" in specimen, false);
  assert.deepEqual(specimen, repeated);
});

test("unknown rupture relation is rejected instead of replaced with decoration", () => {
  const specimen = resolveMeasuredSublime({
    ...input,
    rupture: { ...input.rupture, relationId: "missing-relation" },
  });

  assert.equal(specimen.valid, false);
  assert.equal(specimen.rupture, null);
  assert.match(specimen.issues[0] ?? "", /unknown rupture relation/);
});

test("rupture point sits between decision and intention instead of replacing either node", () => {
  const specimen = resolveMeasuredSublime(input);
  const source = specimen.facets.find((facet) => facet.nodeId === "decision");
  const target = specimen.facets.find((facet) => facet.nodeId === "intention");
  assert.ok(source);
  assert.ok(target);
  assert.ok(specimen.rupture);

  assert.notDeepEqual(specimen.rupture.point, source.registration);
  assert.notDeepEqual(specimen.rupture.point, target.registration);
  assert.equal(
    specimen.rupture.point.x,
    Math.round(((source.registration.x + target.registration.x) / 2) * 10) / 10,
  );
  assert.equal(
    specimen.rupture.point.y,
    Math.round(((source.registration.y + target.registration.y) / 2) * 10) / 10,
  );
});

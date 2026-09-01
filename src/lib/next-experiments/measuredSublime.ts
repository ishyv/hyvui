import { createSeededRandom } from "./core.js";
import type {
  CompositionRelation,
  NodeRole,
  RelationDecision,
  ResolvedComposition,
} from "./types.js";

export type MeasuredSublimeRegister =
  | "austere-apparatus"
  | "speculative-anatomy";
export type MeasuredSublimeTrajectory = "exposure" | "assembly" | "release";
export type MaterialEvidence =
  | "node-boundary"
  | "relation-seam"
  | "decision-registration";

export type MeasuredSublimeInput = {
  seed: string;
  premise: string;
  field: {
    quietRatio: number;
    register: MeasuredSublimeRegister;
  };
  phenomenon: {
    id: string;
    source: "composition-decisions";
  };
  trajectory: MeasuredSublimeTrajectory;
  rupture: {
    kind: "internal-seam";
    relationId: string;
  };
  withholding: "conceal-facets-until-inspected";
  materialEvidence: readonly MaterialEvidence[];
  composition: ResolvedComposition;
  relations: CompositionRelation[];
};

export type SpecimenFacet = {
  nodeId: string;
  role: NodeRole;
  path: string;
  registration: { x: number; y: number };
  label: {
    x: number;
    y: number;
    anchor: "start" | "end";
  };
};

export type SpecimenTraceSegment = {
  relationId: string;
  source: string;
  target: string;
  status: RelationDecision["status"];
  reason: string;
  path: string;
};

export type SpecimenRupture = {
  relationId: string;
  path: string;
  point: { x: number; y: number };
};

export type DecisionSpecimen = {
  valid: boolean;
  issues: string[];
  premise: string;
  register: MeasuredSublimeRegister;
  quietRatio: number;
  phenomenonId: string;
  trajectory: MeasuredSublimeTrajectory;
  withholding: MeasuredSublimeInput["withholding"];
  materialEvidence: MaterialEvidence[];
  bodyPath: string;
  facets: SpecimenFacet[];
  trace: SpecimenTraceSegment[];
  rupture: SpecimenRupture | null;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const round = (value: number) => Math.round(value * 10) / 10;

function createFacet(
  seed: string,
  node: ResolvedComposition["nodes"][number],
): SpecimenFacet {
  const random = createSeededRandom(`${seed}:facet:${node.id}`);
  const roleAnchor: Record<NodeRole, { x: number; y: number }> = {
    "focal-point": { x: 650, y: 380 },
    counterweight: { x: 315, y: 345 },
    interruption: { x: 610, y: 620 },
    foreground: { x: 335, y: 640 },
    field: { x: 485, y: 250 },
    connector: { x: 500, y: 500 },
    frame: { x: 745, y: 510 },
    atmosphere: { x: 470, y: 760 },
    background: { x: 250, y: 530 },
  };
  const anchor = roleAnchor[node.role];
  const x = anchor.x + (random() - 0.5) * 28;
  const y = anchor.y + (random() - 0.5) * 28;
  const width = 125 + random() * 145;
  const height = 105 + random() * 170;
  const skew = (random() - 0.5) * 52;
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;

  return {
    nodeId: node.id,
    role: node.role,
    path: [
      `M ${round(left + skew)} ${round(top)}`,
      `L ${round(right)} ${round(top + Math.abs(skew) * 0.35)}`,
      `L ${round(right - skew * 0.45)} ${round(bottom)}`,
      `L ${round(left)} ${round(bottom - Math.abs(skew) * 0.25)}`,
      "Z",
    ].join(" "),
    registration: { x: round(x), y: round(y) },
    label: {
      x: round(x + 18),
      y: round(y + (y > 500 ? 31 : -18)),
      anchor: "start",
    },
  };
}

function createBodyPath(seed: string): string {
  const random = createSeededRandom(`${seed}:body`);
  const crownX = round(286 + random() * 42);
  const crownY = round(102 + random() * 34);
  const footY = round(874 + random() * 24);

  return [
    `M ${crownX} ${crownY}`,
    "C 498 58 744 142 808 326",
    "C 868 506 782 724 612 856",
    `C 444 ${footY} 244 842 174 638`,
    "C 112 446 166 246 286 136",
    "Z",
  ].join(" ");
}

function createTracePath(
  source: SpecimenFacet,
  target: SpecimenFacet,
  relationId: string,
  seed: string,
): string {
  const random = createSeededRandom(`${seed}:trace:${relationId}`);
  const bendX = round((source.registration.x + target.registration.x) / 2);
  const bendY = round(
    (source.registration.y + target.registration.y) / 2 +
      (random() - 0.5) * 130,
  );

  return [
    `M ${source.registration.x} ${source.registration.y}`,
    `Q ${bendX} ${bendY} ${target.registration.x} ${target.registration.y}`,
  ].join(" ");
}

export function resolveMeasuredSublime(
  input: MeasuredSublimeInput,
): DecisionSpecimen {
  const issues: string[] = input.composition.issues.map(
    (issue) => `${issue.path}: ${issue.message}`,
  );
  const facets = input.composition.nodes.map((node) =>
    createFacet(input.seed, node),
  );
  const facetById = new Map(facets.map((facet) => [facet.nodeId, facet]));
  const relationById = new Map(
    input.relations.map((relation) => [relation.id, relation]),
  );

  const trace = input.composition.decisions.flatMap((decision) => {
    const relation = relationById.get(decision.relationId);
    const source = relation ? facetById.get(relation.source) : undefined;
    const target = relation ? facetById.get(relation.target) : undefined;
    if (!relation || !source || !target) {
      issues.push(`incomplete trace evidence: ${decision.relationId}`);
      return [];
    }

    return [
      {
        relationId: decision.relationId,
        source: relation.source,
        target: relation.target,
        status: decision.status,
        reason: decision.reason,
        path: createTracePath(source, target, decision.relationId, input.seed),
      },
    ];
  });

  const ruptureSegment = trace.find(
    (segment) => segment.relationId === input.rupture.relationId,
  );
  const ruptureSource = ruptureSegment
    ? facetById.get(ruptureSegment.source)
    : undefined;
  const ruptureTarget = ruptureSegment
    ? facetById.get(ruptureSegment.target)
    : undefined;
  if (!ruptureSegment) {
    issues.push(`unknown rupture relation: ${input.rupture.relationId}`);
  }

  if (!input.premise.trim()) issues.push("premise must not be empty");
  if (!input.phenomenon.id.trim())
    issues.push("phenomenon id must not be empty");

  return {
    valid: issues.length === 0,
    issues,
    premise: input.premise,
    register: input.field.register,
    quietRatio: clamp(input.field.quietRatio, 0.5, 0.8),
    phenomenonId: input.phenomenon.id,
    trajectory: input.trajectory,
    withholding: input.withholding,
    materialEvidence: [...new Set(input.materialEvidence)],
    bodyPath: createBodyPath(input.seed),
    facets,
    trace,
    rupture: ruptureSegment
      ? {
          relationId: ruptureSegment.relationId,
          path: ruptureSegment.path,
          point: {
            x: round(
              ((ruptureSource?.registration.x ?? 500) +
                (ruptureTarget?.registration.x ?? 500)) /
                2,
            ),
            y: round(
              ((ruptureSource?.registration.y ?? 500) +
                (ruptureTarget?.registration.y ?? 500)) /
                2,
            ),
          },
        }
      : null,
  };
}

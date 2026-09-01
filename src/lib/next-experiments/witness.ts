export const witnessObservationIds = ["canopy", "horizon", "ground"] as const;

export type WitnessObservationId = (typeof witnessObservationIds)[number];
export type WitnessMode = "focus" | "context";

export type WitnessObservation = {
  id: WitnessObservationId;
  label: string;
  title: string;
  focusText: string;
  contextText: string;
  relationText: string;
  certainty: string;
  position: { x: string; y: string };
};

export const witnessObservations: readonly WitnessObservation[] = [
  {
    id: "canopy",
    label: "upper field",
    title: "pale mark at the top",
    focusText: "a pale mark holds against the upper field.",
    contextText:
      "the upper edge carries a route that is not visible from the ground.",
    relationText: "above / unresolved",
    certainty: "partial signal",
    position: { x: "62%", y: "22%" },
  },
  {
    id: "horizon",
    label: "horizon",
    title: "line between fields",
    focusText: "the signal sits at the boundary between field and ground.",
    contextText:
      "all three markers are visible. the boundary links upper field, horizon, and ground.",
    relationText: "between / unresolved",
    certainty: "partial signal",
    position: { x: "48%", y: "52%" },
  },
  {
    id: "ground",
    label: "ground trace",
    title: "dark trace below",
    focusText: "the dark mark continues beneath the frame. a trace crosses it.",
    contextText: "the ground retains a trace, but its direction is unknown.",
    relationText: "below / unresolved",
    certainty: "weak trace",
    position: { x: "34%", y: "78%" },
  },
];

export type WitnessView = {
  valid: boolean;
  mode: WitnessMode;
  observation?: WitnessObservation;
  visibleObservationIds: WitnessObservationId[];
  primaryText: string;
  certainty: string;
  attentionTrail: WitnessObservationId[];
  issues: string[];
};

function isObservationId(value: string): value is WitnessObservationId {
  return witnessObservationIds.includes(value as WitnessObservationId);
}

export function getWitnessObservation(
  id: string,
): WitnessObservation | undefined {
  return witnessObservations.find((observation) => observation.id === id);
}

export function recordWitnessAttention(
  history: readonly WitnessObservationId[],
  target: string,
): WitnessObservationId[] {
  if (!isObservationId(target) || history.includes(target)) return [...history];
  return [...history, target];
}

export function resolveWitnessView(
  target: string,
  mode: WitnessMode,
  attentionTrail: readonly WitnessObservationId[],
): WitnessView {
  const observation = getWitnessObservation(target);
  if (!observation) {
    return {
      valid: false,
      mode,
      visibleObservationIds: [],
      primaryText: "",
      certainty: "unknown observation",
      attentionTrail: [...attentionTrail],
      issues: [`observation not found: ${target}`],
    };
  }

  return {
    valid: true,
    mode,
    observation,
    visibleObservationIds:
      mode === "focus" ? [observation.id] : [...witnessObservationIds],
    primaryText:
      mode === "focus" ? observation.focusText : observation.contextText,
    certainty:
      mode === "focus"
        ? observation.certainty
        : "three markers / lower certainty",
    attentionTrail: [...attentionTrail],
    issues: [],
  };
}

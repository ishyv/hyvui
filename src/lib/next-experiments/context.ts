import { getContext, setContext } from "svelte";
import type {
  RelationDecision,
  ResolvedComposition,
  ResolvedNode,
} from "./types.js";
import type { ArtDirectorPlan } from "./artDirection.js";
import type { BiomeCompositionPlan } from "./biomeComposition.js";

export const COMPOSITION_CONTEXT = Symbol("hyvui.next.composition");

export type CompositionContext = {
  getNode: (id: string) => ResolvedNode | undefined;
  getNodeDecision: (id: string) => RelationDecision | undefined;
  getInspection: () => ResolvedComposition;
  getArtDirector?: () => ArtDirectorPlan;
  getBiomePlan?: () => BiomeCompositionPlan | undefined;
};

export function provideCompositionContext(context: CompositionContext): void {
  setContext(COMPOSITION_CONTEXT, context);
}

export function useCompositionContext(): CompositionContext | undefined {
  return getContext<CompositionContext | undefined>(COMPOSITION_CONTEXT);
}

import type { HTMLAttributes } from "svelte/elements";

/**
 * Attributes safe for layout and material roots. Component-owned class and
 * children props stay out of the rest bag so library structure remains stable.
 */
export type LayoutAttributes = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "class"
>;

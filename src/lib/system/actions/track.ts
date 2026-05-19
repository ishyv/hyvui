import type { ActionReturn } from "svelte/action";
import { scroll, animate } from "motion";

interface TrackOptions {
  /** Axis the parallax effect runs on. */
  axis?: "y" | "x";
  /** Multiplier on scroll offset (0 = none, 1 = match, negative = inverse). */
  strength?: number;
}

/**
 * Scroll-driven parallax. Translates the element along an axis as the page
 * scrolls. Activates the depth system's perspective for the first time —
 * components that sit on a DepthLayer can now move relative to the viewport.
 * Respects prefers-reduced-motion (becomes a no-op).
 *
 * @example
 * <DepthLayer depth="foreground" use:track={{ strength: 0.3 }}>
 *   <FloatCard>...</FloatCard>
 * </DepthLayer>
 */
export function track(
  node: HTMLElement,
  options: TrackOptions = {},
): ActionReturn<TrackOptions> {
  if (typeof window === "undefined") return {};
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReduced) return {};

  const { axis = "y", strength = 0.2 } = options;
  const cleanup = scroll(
    animate(
      node,
      axis === "y"
        ? { y: [-40 * strength, 40 * strength] }
        : { x: [-40 * strength, 40 * strength] },
    ),
  );

  return {
    destroy() {
      cleanup();
    },
  };
}

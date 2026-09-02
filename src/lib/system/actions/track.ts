import type { ActionReturn } from "svelte/action";
import { scroll, animate } from "motion";
import {
  onDocumentVisibilityChange,
  onIntersectionChange,
  onReducedMotionChange,
  type Cleanup,
} from "../runtime.js";

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
  const { axis = "y", strength = 0.2 } = options;
  let reduced = false;
  let documentVisible = true;
  let viewportVisible = true;
  let cleanupScroll: (() => void) | undefined;

  function stop() {
    cleanupScroll?.();
    cleanupScroll = undefined;
  }

  function start() {
    stop();
    if (reduced || !documentVisible || !viewportVisible) return;
    cleanupScroll = scroll(
      animate(
        node,
        axis === "y"
          ? { y: [-40 * strength, 40 * strength] }
          : { x: [-40 * strength, 40 * strength] },
      ),
    );
  }

  const cleanups: Cleanup[] = [
    onReducedMotionChange((value) => {
      reduced = value;
      if (value) stop();
      else start();
    }),
    onDocumentVisibilityChange((value) => {
      documentVisible = value;
      if (value) start();
      else stop();
    }),
    onIntersectionChange(
      node,
      (value) => {
        viewportVisible = value;
        if (value) start();
        else stop();
      },
      { threshold: 0 },
    ),
  ];

  return {
    destroy() {
      stop();
      for (const cleanup of cleanups) cleanup();
    },
  };
}

import type { ActionReturn } from "svelte/action";
import { animateIntent } from "../motion/animateIntent.js";

interface SurfaceOptions {
  /** Delay in ms before the entrance animation starts. */
  delay?: number;
}

/**
 * Plays the register-aware entrance preset (motion/dom + presets[register].enter).
 * field-notebook springs in, mission-control snaps, archive cascades. Respects
 * prefers-reduced-motion (collapses to opacity snap).
 *
 * @example
 * <div use:surface={{ delay: 200 }}>content</div>
 */
export function surface(
  node: HTMLElement,
  options: SurfaceOptions = {},
): ActionReturn<SurfaceOptions> {
  const { delay = 0 } = options;
  if (typeof window === "undefined") return {};
  animateIntent(node, "enter", { delay: delay / 1000 });
  return {};
}

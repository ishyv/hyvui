/**
 * Plays a register-aware motion preset on an element.
 *
 * Reads the active register from <body data-register> via registerObserver,
 * looks up the matching preset, and calls Motion's animate(). Respects
 * prefers-reduced-motion automatically — under reduce, all motion collapses
 * to either an instant snap (opacity 1) or no-op.
 *
 * @example
 * import { animateIntent } from '$lib/system/motion/animateIntent';
 *
 * function surface(node) {
 *   animateIntent(node, 'enter');
 *   return {};
 * }
 */

import { animate } from "motion";
import { currentRegister } from "./registerObserver.js";
import { presets, type Intent } from "./presets.js";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function animateIntent(
  node: HTMLElement,
  intent: Intent,
  overrides?: { duration?: number; delay?: number },
) {
  if (typeof window === "undefined") return;
  const { register } = currentRegister();
  const preset = presets[register]?.[intent] ?? presets.default[intent];

  if (reducedMotion) {
    // Snap to the final keyframe value without animating
    for (const [key, val] of Object.entries(preset.keyframes)) {
      const final = Array.isArray(val) ? val[val.length - 1] : val;
      // Best-effort: set common props inline; opacity is the universal safe one
      if (key === "opacity") node.style.opacity = String(final);
    }
    return;
  }

  const opts = { ...preset.options, ...overrides };
  return animate(node, preset.keyframes as never, opts as never);
}

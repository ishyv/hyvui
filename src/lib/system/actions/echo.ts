import type { ActionReturn } from "svelte/action";
import { animate } from "motion";
import { currentRegister } from "../motion/registerObserver.js";
import { onReducedMotionChange } from "../runtime.js";
import {
  presets,
  themeAccent,
  themePressMultiplier,
} from "../motion/presets.js";

/**
 * Click pulse — radial ripple from the click point. Color picks up the active
 * theme (hextech cyan, arcane magenta, default gold). Timing matches the
 * register's press personality.
 *
 * @example
 * <button use:echo>confirm</button>
 */
export function echo(node: HTMLElement): ActionReturn {
  if (typeof window === "undefined") return {};
  let prefersReduced = false;
  let destroyed = false;
  const animations = new Set<ReturnType<typeof animate>>();
  const overlays = new Set<HTMLElement>();
  const originalPosition = node.style.position;
  const originalOverflow = node.style.overflow;
  const unsubscribeReduced = onReducedMotionChange((value) => {
    prefersReduced = value;
  });

  function handleClick(e: MouseEvent) {
    if (prefersReduced) return;

    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const { register, theme } = currentRegister(node);
    const accent = themeAccent[theme] ?? themeAccent.default;
    const mult = themePressMultiplier[theme] ?? 1;
    const baseDuration = (presets[register]?.press.options.duration ??
      0.3) as number;

    const overlay = document.createElement("span");
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      background: radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, ${accent} 26%, transparent), transparent 70%);
      opacity: 0;
    `;

    const position = getComputedStyle(node).position;
    if (position === "static") node.style.position = "relative";
    node.style.overflow = "hidden";
    node.appendChild(overlay);
    overlays.add(overlay);

    const animation = animate(overlay, { opacity: [0, 1, 0] }, {
      duration: baseDuration * mult * 2,
    } as never);
    animations.add(animation);
    void animation.finished
      .then(() => {
        if (!destroyed) overlay.remove();
      })
      .catch(() => undefined)
      .finally(() => {
        animations.delete(animation);
        overlays.delete(overlay);
      });
  }

  node.addEventListener("click", handleClick);
  return {
    destroy() {
      destroyed = true;
      node.removeEventListener("click", handleClick);
      unsubscribeReduced();
      for (const animation of animations) animation.stop();
      for (const overlay of overlays) overlay.remove();
      if (node.style.position === "relative" && originalPosition === "")
        node.style.position = "";
      else node.style.position = originalPosition;
      node.style.overflow = originalOverflow;
    },
  };
}

import type { ActionReturn } from "svelte/action";
import { animate } from "motion";
import { currentRegister } from "../motion/registerObserver.js";
import { presets } from "../motion/presets.js";
import { onReducedMotionChange } from "../runtime.js";

interface RevealOptions {
  /** CSS selector for the child element to reveal on hover. */
  target: string;
}

/**
 * Reveals a child element when the node is hovered or focused. The timing
 * matches the active register's hover personality. Respects reduced motion.
 *
 * @example
 * <div use:reveal={{ target: '.meta' }}>
 *   <span>main</span>
 *   <span class="meta">revealed</span>
 * </div>
 */
export function reveal(
  node: HTMLElement,
  options: RevealOptions,
): ActionReturn<RevealOptions> {
  if (typeof window === "undefined") return {};
  let prefersReduced = false;
  let animation: ReturnType<typeof animate> | undefined;
  const unsubscribeReduced = onReducedMotionChange((value) => {
    prefersReduced = value;
    if (value) {
      stopAnimation();
      const target = getTarget();
      if (target) {
        target.style.opacity = "1";
        target.style.transform = "";
      }
    }
  });

  function getTarget(): HTMLElement | null {
    return node.querySelector(options.target);
  }

  function init() {
    const t = getTarget();
    if (!t) return;
    t.style.opacity = "0";
    if (!prefersReduced) t.style.transform = "translateY(4px)";
  }

  function stopAnimation() {
    animation?.stop();
    animation = undefined;
  }

  function show() {
    const t = getTarget();
    if (!t) return;
    stopAnimation();
    if (prefersReduced) {
      t.style.opacity = "1";
      return;
    }
    const { register } = currentRegister(node);
    const preset = presets[register]?.hover ?? presets.default.hover;
    animation = animate(
      t,
      { opacity: [0, 1], y: [4, 0] },
      preset.options as never,
    );
  }

  function hide() {
    const t = getTarget();
    if (!t) return;
    stopAnimation();
    if (prefersReduced) {
      t.style.opacity = "0";
      return;
    }
    animation = animate(t, { opacity: [1, 0], y: [0, 4] }, {
      duration: 0.18,
    } as never);
  }

  init();
  node.addEventListener("mouseenter", show);
  node.addEventListener("mouseleave", hide);
  node.addEventListener("focusin", show);
  node.addEventListener("focusout", hide);

  return {
    destroy() {
      node.removeEventListener("mouseenter", show);
      node.removeEventListener("mouseleave", hide);
      node.removeEventListener("focusin", show);
      node.removeEventListener("focusout", hide);
      stopAnimation();
      unsubscribeReduced();
    },
  };
}

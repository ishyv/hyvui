import type { ActionReturn } from "svelte/action";
import { animate } from "motion";
import { currentRegister } from "../motion/registerObserver.js";
import { presets } from "../motion/presets.js";
import { onReducedMotionChange } from "../runtime.js";

export type ResolveStatus = "ok" | "warn" | "fail" | "pend";

const statusColors: Record<ResolveStatus, string> = {
  ok: "var(--status-ok)",
  warn: "var(--status-warn)",
  fail: "var(--status-fail)",
  pend: "var(--status-pend)",
};

export interface ResolveAction {
  trigger: (status: ResolveStatus) => void;
}

/**
 * Animates a status change. Overlay flash in the status color, fade-out
 * timing inherits the register's flash personality.
 * Dispatches `resolve:start` and `resolve:end` DOM events.
 *
 * @example
 * <form use:resolve={a => resolveAction = a}>...</form>
 */
export function resolve(
  node: HTMLElement,
  register: (action: ResolveAction) => void,
): ActionReturn {
  if (typeof window === "undefined") return {};
  let prefersReduced = false;
  let destroyed = false;
  const animations = new Set<ReturnType<typeof animate>>();
  const overlays = new Set<HTMLElement>();
  const unsubscribeReduced = onReducedMotionChange((value) => {
    prefersReduced = value;
  });

  const position = getComputedStyle(node).position;
  if (position === "static") node.style.position = "relative";

  function trigger(status: ResolveStatus) {
    if (destroyed) return;
    node.dispatchEvent(new CustomEvent("resolve:start", { detail: status }));

    if (prefersReduced) {
      node.dispatchEvent(new CustomEvent("resolve:end", { detail: status }));
      return;
    }

    const overlay = document.createElement("span");
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: ${statusColors[status]};
      opacity: 0;
      border-radius: inherit;
    `;
    node.appendChild(overlay);
    overlays.add(overlay);

    const { register: reg } = currentRegister(node);
    const preset = presets[reg]?.flash ?? presets.default.flash;

    const animation = animate(
      overlay,
      preset.keyframes as never,
      preset.options as never,
    );
    animations.add(animation);
    void animation.finished
      .then(() => {
        if (destroyed) return;
        overlay.remove();
        node.dispatchEvent(new CustomEvent("resolve:end", { detail: status }));
      })
      .catch(() => undefined)
      .finally(() => {
        animations.delete(animation);
        overlays.delete(overlay);
      });
  }

  register({ trigger });

  return {
    destroy() {
      destroyed = true;
      unsubscribeReduced();
      for (const animation of animations) animation.stop();
      for (const overlay of overlays) overlay.remove();
      if (position === "static") node.style.position = "";
    },
  };
}

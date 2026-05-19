import type { ActionReturn } from "svelte/action";
import { animate } from "motion";
import { currentRegister } from "../motion/registerObserver.js";
import { presets } from "../motion/presets.js";

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
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const position = getComputedStyle(node).position;
  if (position === "static") node.style.position = "relative";

  function trigger(status: ResolveStatus) {
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

    const { register: reg } = currentRegister();
    const preset = presets[reg]?.flash ?? presets.default.flash;

    animate(overlay, preset.keyframes as never, preset.options as never).finished.then(
      () => {
        overlay.remove();
        node.dispatchEvent(new CustomEvent("resolve:end", { detail: status }));
      },
    );
  }

  register({ trigger });

  return {
    destroy() {
      if (position === "static") node.style.position = "";
    },
  };
}

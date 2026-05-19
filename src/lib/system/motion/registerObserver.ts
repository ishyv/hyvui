/**
 * Lazy read + subscribe to the active register/theme from `<body>` data attrs.
 * One MutationObserver per document; consumers share it. SSR-safe.
 */

import type { Register, Theme } from "../variants/index.js";

type Snapshot = { register: Register | "default"; theme: Theme };
type Listener = (s: Snapshot) => void;

let cached: Snapshot | null = null;
const listeners = new Set<Listener>();
let observer: MutationObserver | null = null;

function readBody(): Snapshot {
  if (typeof document === "undefined") {
    return { register: "default", theme: "default" };
  }
  /* The existing codebase uses data-weight for register (applyWeight). */
  const r = document.body.dataset.weight as Register | undefined;
  const t = document.body.dataset.theme as Theme | undefined;
  return { register: r ?? "default", theme: t ?? "default" };
}

function ensureObserver() {
  if (observer || typeof document === "undefined") return;
  observer = new MutationObserver(() => {
    const next = readBody();
    if (
      !cached ||
      cached.register !== next.register ||
      cached.theme !== next.theme
    ) {
      cached = next;
      for (const fn of listeners) fn(next);
    }
  });
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-weight", "data-theme"],
  });
}

/** Current snapshot, cached. SSR-safe (returns default/default). */
export function currentRegister(): Snapshot {
  if (cached) return cached;
  cached = readBody();
  return cached;
}

/** Subscribe; returns unsubscribe. Fires immediately with current snapshot. */
export function onRegisterChange(fn: Listener): () => void {
  ensureObserver();
  listeners.add(fn);
  fn(currentRegister());
  return () => {
    listeners.delete(fn);
  };
}

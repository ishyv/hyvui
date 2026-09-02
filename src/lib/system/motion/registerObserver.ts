/**
 * Nearest-context appearance reads for the motion layer.
 *
 * This module keeps the historic `currentRegister()` shape for internal
 * callers, while the actual source of truth is the scoped appearance
 * resolver. Components may pass their rendered root so nested contexts work.
 */

import {
  onAppearanceChange,
  readAppearanceContext,
  type AppearanceContext,
} from "../context.js";

export type RegisterSnapshot = {
  register: AppearanceContext["weight"];
  theme: AppearanceContext["theme"];
  grade: AppearanceContext["grade"];
};

export type RegisterListener = (snapshot: RegisterSnapshot) => void;

function snapshotFor(node?: Element | null): RegisterSnapshot {
  const context = readAppearanceContext(node);
  return {
    register: context.weight,
    theme: context.theme,
    grade: context.grade,
  };
}

/** Current nearest-context snapshot. SSR-safe. */
export function currentRegister(node?: Element | null): RegisterSnapshot {
  return snapshotFor(node);
}

/** Subscribe to the nearest context affecting `node`; fires immediately. */
export function onRegisterChange(
  listener: RegisterListener,
  node?: Element | null,
): () => void {
  if (typeof document === "undefined") {
    listener(snapshotFor(node));
    return () => undefined;
  }

  const target = node ?? document.body;
  if (!target) {
    listener(snapshotFor(node));
    return () => undefined;
  }

  return onAppearanceChange(target, (context) => {
    listener({
      register: context.weight,
      theme: context.theme,
      grade: context.grade,
    });
  });
}

/**
 * Per-register motion preset registry.
 *
 * Each preset is a recipe: keyframes + Motion options. Same intent (enter,
 * press, hover, etc.) reads differently per register, which is the whole
 * point — that is the register's *motion personality*.
 *
 * field-notebook → organic springs, slight overshoot, warm timing
 * mission-control → snap easing, no spring, parallel timing, fastest
 * archive         → delayed gentle fades, museum-pacing
 * default         → middle ground (used when no register is set)
 *
 * Themes (hextech/arcane) overlay color + glow on top of the register's
 * motion personality. They are *not* motion personalities in themselves.
 */

import type { Register } from "../variants/index.js";

export type Intent = "enter" | "exit" | "hover" | "press" | "flash" | "cascade";

/**
 * Per-register stagger durations (seconds) for the `cascade` intent.
 * Sequence and KineticText read this to space their child reveals.
 */
export const cascadeStagger: Record<RegisterKey, number> = {
  "field-notebook": 0.08,
  "mission-control": 0.02,
  archive: 0.12,
  default: 0.06,
};
export type RegisterKey = Register | "default";

export interface Preset {
  /** Keyframes for the `animate()` first argument. */
  keyframes: Record<string, number | string | (number | string)[]>;
  /** Options for the `animate()` third argument. */
  options: {
    type?: "spring" | "tween" | "inertia";
    duration?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    ease?: string | number[];
    delay?: number;
  };
}

/**
 * Spring/easing curves anchored to each register's character.
 * Reused across intents so a register feels consistent.
 */
const curves = {
  "field-notebook": {
    /** organic, slight overshoot — handwritten */
    spring: { type: "spring", stiffness: 180, damping: 22, mass: 1 } as const,
    /** soft warmth, no bounce */
    ease: [0.22, 1, 0.36, 1] as number[],
  },
  "mission-control": {
    /** snap — no overshoot */
    spring: { type: "spring", stiffness: 600, damping: 38, mass: 0.6 } as const,
    /** sharp precision */
    ease: [0.4, 0, 0.2, 1] as number[],
  },
  archive: {
    /** slow settle, museum pacing */
    spring: { type: "spring", stiffness: 110, damping: 26, mass: 1.2 } as const,
    /** gentle exhale */
    ease: [0.4, 0, 0.6, 1] as number[],
  },
  default: {
    spring: { type: "spring", stiffness: 220, damping: 26, mass: 1 } as const,
    ease: [0.22, 1, 0.36, 1] as number[],
  },
} as const;

export const presets: Record<RegisterKey, Record<Intent, Preset>> = {
  "field-notebook": {
    enter: {
      keyframes: { opacity: [0, 1], y: [10, 0] },
      options: curves["field-notebook"].spring,
    },
    exit: {
      keyframes: { opacity: [1, 0], y: [0, -4] },
      options: { duration: 0.28, ease: curves["field-notebook"].ease },
    },
    hover: {
      keyframes: { y: [0, -2] },
      options: { duration: 0.24, ease: curves["field-notebook"].ease },
    },
    press: {
      keyframes: { scale: [1, 0.97, 1] },
      options: { duration: 0.32, ease: curves["field-notebook"].ease },
    },
    flash: {
      keyframes: { opacity: [0, 0.16, 0] },
      options: { duration: 0.7, ease: curves["field-notebook"].ease },
    },
    cascade: {
      keyframes: { opacity: [0, 1], y: [12, 0] },
      options: curves["field-notebook"].spring,
    },
  },
  "mission-control": {
    enter: {
      keyframes: { opacity: [0, 1] },
      options: { duration: 0.14, ease: curves["mission-control"].ease },
    },
    exit: {
      keyframes: { opacity: [1, 0] },
      options: { duration: 0.1, ease: curves["mission-control"].ease },
    },
    hover: {
      keyframes: { y: [0, -1] },
      options: { duration: 0.1, ease: curves["mission-control"].ease },
    },
    press: {
      keyframes: { scale: [1, 0.98, 1] },
      options: { duration: 0.16, ease: curves["mission-control"].ease },
    },
    flash: {
      keyframes: { opacity: [0, 0.22, 0] },
      options: { duration: 0.32, ease: curves["mission-control"].ease },
    },
    cascade: {
      keyframes: { opacity: [0, 1] },
      options: { duration: 0.18, ease: curves["mission-control"].ease },
    },
  },
  archive: {
    enter: {
      keyframes: { opacity: [0, 1], y: [6, 0] },
      options: { duration: 0.55, ease: curves.archive.ease, delay: 0.04 },
    },
    exit: {
      keyframes: { opacity: [1, 0] },
      options: { duration: 0.5, ease: curves.archive.ease },
    },
    hover: {
      keyframes: { opacity: [1, 0.92, 1] },
      options: { duration: 0.6, ease: curves.archive.ease },
    },
    press: {
      keyframes: { opacity: [1, 0.7, 1] },
      options: { duration: 0.6, ease: curves.archive.ease },
    },
    flash: {
      keyframes: { opacity: [0, 0.1, 0] },
      options: { duration: 1.2, ease: curves.archive.ease },
    },
    cascade: {
      keyframes: { opacity: [0, 1], y: [8, 0] },
      options: { duration: 0.65, ease: curves.archive.ease },
    },
  },
  default: {
    enter: {
      keyframes: { opacity: [0, 1], y: [6, 0] },
      options: { duration: 0.38, ease: curves.default.ease },
    },
    exit: {
      keyframes: { opacity: [1, 0] },
      options: { duration: 0.2, ease: curves.default.ease },
    },
    hover: {
      keyframes: { y: [0, -2] },
      options: { duration: 0.22, ease: curves.default.ease },
    },
    press: {
      keyframes: { scale: [1, 0.97, 1] },
      options: { duration: 0.26, ease: curves.default.ease },
    },
    flash: {
      keyframes: { opacity: [0, 0.14, 0] },
      options: { duration: 0.65, ease: curves.default.ease },
    },
    cascade: {
      keyframes: { opacity: [0, 1], y: [8, 0] },
      options: { duration: 0.4, ease: curves.default.ease },
    },
  },
};

/**
 * Theme-tinted accent color for ripples/glows. Drives the echo action's
 * radial-gradient color among other things.
 */
export const themeAccent = {
  default: "var(--accent)",
  hextech: "var(--htx-cyan-glow, var(--signal))",
  arcane: "var(--arc-magenta, var(--accent))",
} as const;

/** Theme-specific press duration multiplier (arcane lingers, hextech snaps). */
export const themePressMultiplier = {
  default: 1,
  hextech: 0.85,
  arcane: 1.25,
} as const;

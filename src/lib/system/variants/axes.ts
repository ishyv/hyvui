/**
 * Shared variant axes — types every register- or theme-aware component should
 * reuse. Centralizing these means a new register or tone propagates to all
 * components by editing one file.
 *
 * Components don't need to expose every axis — pick the ones that mean
 * something for that component. e.g. Divider exposes `tone` but not `size`.
 */

export const REGISTERS = [
  "field-notebook",
  "mission-control",
  "archive",
] as const;
export type Register = (typeof REGISTERS)[number];

export const THEMES = ["default", "hextech", "arcane"] as const;
export type Theme = (typeof THEMES)[number];

export const TONES = [
  "neutral",
  "accent",
  "signal",
  "warn",
  "fail",
  "ok",
  "pend",
] as const;
export type Tone = (typeof TONES)[number];

export const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;
export type Size = (typeof SIZES)[number];

export const DENSITY = ["comfortable", "compact"] as const;
export type Density = (typeof DENSITY)[number];

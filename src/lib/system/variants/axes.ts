/**
 * Shared variant axes — types every register- or theme-aware component should
 * reuse. The generated appearance unions come from the canonical token source.
 */

import {
  gradeRegisters,
  themeRegisters,
  weightRegisters,
  type GradeRegister,
  type ThemeRegister,
  type WeightRegister,
} from "../../tokens/registers.generated.js";

export const REGISTERS = weightRegisters;
export type Register = WeightRegister;

export const THEMES = ["default", ...themeRegisters] as const;
export type Theme = "default" | ThemeRegister;

export const GRADES = ["default", ...gradeRegisters] as const;
export type Grade = "default" | GradeRegister;

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

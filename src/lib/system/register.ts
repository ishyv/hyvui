import {
  gradeRegisters,
  themeRegisters,
  weightRegisters,
  type GradeRegister,
  type ThemeRegister,
  type WeightRegister,
} from "../tokens/registers.generated.js";

export type { GradeRegister, ThemeRegister, WeightRegister };

/**
 * Applies a weight register to an element by setting data-weight.
 * Call with a DOM element reference or 'body' to set globally.
 */
export function applyWeight(
  weight: WeightRegister,
  target: HTMLElement | "body" = "body",
) {
  if (typeof document === "undefined") return;
  const el = target === "body" ? document.body : target;
  el.dataset.weight = weight;
}

/**
 * Removes the weight register from an element, restoring default weight behavior.
 */
export function clearWeight(target: HTMLElement | "body" = "body") {
  if (typeof document === "undefined") return;
  const el = target === "body" ? document.body : target;
  delete el.dataset.weight;
}

/**
 * Applies a color/motif theme to an element by setting data-theme.
 */
export function applyTheme(
  theme: ThemeRegister,
  target: HTMLElement | "body" = "body",
) {
  if (typeof document === "undefined") return;
  const el = target === "body" ? document.body : target;
  el.dataset.theme = theme;
}

/**
 * Removes the theme from an element, restoring default theme behavior.
 */
export function clearTheme(target: HTMLElement | "body" = "body") {
  if (typeof document === "undefined") return;
  const el = target === "body" ? document.body : target;
  delete el.dataset.theme;
}

/**
 * Applies a color grade to an element. The grade remaps semantic color and
 * material variables without filtering descendant text or bitmap content.
 */
export function applyGrade(
  grade: GradeRegister,
  target: HTMLElement | "body" = "body",
) {
  if (typeof document === "undefined") return;
  const el = target === "body" ? document.body : target;
  el.dataset.grade = grade;
}

/**
 * Removes the grade from an element, restoring the un-graded look.
 */
export function clearGrade(target: HTMLElement | "body" = "body") {
  if (typeof document === "undefined") return;
  const el = target === "body" ? document.body : target;
  delete el.dataset.grade;
}

export { gradeRegisters, themeRegisters, weightRegisters };

export type WeightRegister = "field-notebook" | "mission-control" | "archive";
export type ThemeRegister = "hextech" | "arcane";

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

export const weightRegisters: WeightRegister[] = [
  "field-notebook",
  "mission-control",
  "archive",
];
export const themeRegisters: ThemeRegister[] = ["hextech", "arcane"];

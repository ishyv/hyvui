export type WeightRegister = "field-notebook" | "mission-control" | "archive";
export type ThemeRegister = "hextech" | "arcane";
export type GradeRegister =
  | "cold-archive"
  | "interrogation"
  | "twilight"
  | "dailies";

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
 * Applies a color grade — film-look filter on <body>. Cinematic mood layer
 * above theme; composes orthogonally with register and theme.
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

export const weightRegisters: WeightRegister[] = [
  "field-notebook",
  "mission-control",
  "archive",
];
export const themeRegisters: ThemeRegister[] = ["hextech", "arcane"];
export const gradeRegisters: GradeRegister[] = [
  "cold-archive",
  "interrogation",
  "twilight",
  "dailies",
];

import {
  applyTheme,
  applyWeight,
  applyGrade,
  clearTheme,
  clearWeight,
  clearGrade,
} from "../system/register.js";
import type {
  ThemeRegister,
  WeightRegister,
  GradeRegister,
} from "../system/register.js";

/**
 * Mounts the full appearance stack for a scene: weight + theme + grade.
 * Returns a teardown function suitable for $effect cleanup.
 */
export function mountSceneAppearance(
  weight: WeightRegister,
  theme: ThemeRegister | null = null,
  grade: GradeRegister | null = null,
) {
  applyWeight(weight);
  if (theme) applyTheme(theme);
  else clearTheme();
  if (grade) applyGrade(grade);
  else clearGrade();

  return () => {
    clearWeight();
    clearTheme();
    clearGrade();
  };
}

import {
  applyTheme,
  applyWeight,
  clearTheme,
  clearWeight,
} from "../system/register.js";
import type { ThemeRegister, WeightRegister } from "../system/register.js";

export function mountSceneAppearance(
  weight: WeightRegister,
  theme: ThemeRegister | null = null,
) {
  applyWeight(weight);
  if (theme) {
    applyTheme(theme);
  } else {
    clearTheme();
  }

  return () => {
    clearWeight();
    clearTheme();
  };
}

export {
  presets,
  themeAccent,
  themePressMultiplier,
  cascadeStagger,
} from "./presets.js";
export type { Intent, RegisterKey, Preset } from "./presets.js";
export { currentRegister, onRegisterChange } from "./registerObserver.js";
export type { RegisterSnapshot, RegisterListener } from "./registerObserver.js";
export { animateIntent } from "./animateIntent.js";
export { stagger } from "motion";

/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */
export const weightRegisters = [
  "field-notebook",
  "mission-control",
  "archive",
] as const;
export type WeightRegister = (typeof weightRegisters)[number];

export const themeRegisters = ["hextech", "arcane"] as const;
export type ThemeRegister = (typeof themeRegisters)[number];

export const gradeRegisters = [
  "cold-archive",
  "interrogation",
  "twilight",
  "dailies",
] as const;
export type GradeRegister = (typeof gradeRegisters)[number];

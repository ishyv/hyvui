import type {
  ThemeRegister,
  WeightRegister,
  GradeRegister,
} from "../system/register.js";

export type SceneSlug = "bridge" | "keeper" | "correspondence" | "watchhouse";

export type ShowcaseScene = {
  slug: SceneSlug;
  title: string;
  kicker: string;
  weight: WeightRegister;
  theme: ThemeRegister | null;
  grade: GradeRegister | null;
  description: string;
  registerNote: string;
};

export const showcaseScenes: ShowcaseScene[] = [
  {
    slug: "bridge",
    title: "the carrier's bridge",
    kicker: "night watch",
    weight: "mission-control",
    theme: "hextech",
    grade: "interrogation",
    description:
      "single operator on a quiet airship bridge. contact holding bearing 240 for six hours.",
    registerNote: "mission-control · hextech · interrogation grade",
  },
  {
    slug: "keeper",
    title: "the keeper's index",
    kicker: "private collection",
    weight: "archive",
    theme: null,
    grade: "cold-archive",
    description:
      "an archivist's terminal. provenance, conservation status, today's pulls. quiet work.",
    registerNote: "archive · default · cold-archive grade",
  },
  {
    slug: "correspondence",
    title: "field correspondence",
    kicker: "open letter",
    weight: "field-notebook",
    theme: null,
    grade: "twilight",
    description:
      "a writer composing a letter at dusk. drafts in the margin. the recipient's last reply at the top.",
    registerNote: "field-notebook · default · twilight grade",
  },
  {
    slug: "watchhouse",
    title: "the watchhouse",
    kicker: "anomaly logbook",
    weight: "field-notebook",
    theme: "arcane",
    grade: "twilight",
    description:
      "anomaly watcher's logbook. recent sightings, classification grid, the entry from last tuesday.",
    registerNote: "field-notebook · arcane · twilight grade",
  },
];

export function getScene(slug: SceneSlug) {
  return showcaseScenes.find((scene) => scene.slug === slug);
}

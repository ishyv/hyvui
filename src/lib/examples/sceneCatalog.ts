import type { ThemeRegister, WeightRegister } from "../system/register.js";

export type SceneSlug =
  | "studio-console"
  | "field-report"
  | "archive-gallery"
  | "signal-lost"
  | "hextech-forge"
  | "arcane-shard";

export type ShowcaseScene = {
  slug: SceneSlug;
  title: string;
  kicker: string;
  weight: WeightRegister;
  theme: ThemeRegister | null;
  description: string;
  registerNote: string;
  components: string[];
};

export const showcaseScenes: ShowcaseScene[] = [
  {
    slug: "studio-console",
    title: "studio console",
    kicker: "production desk",
    weight: "mission-control",
    theme: null,
    description:
      "a dense creative operations surface for shoots, revisions, releases, and asset movement.",
    registerNote: "mission-control weight. base theme.",
    components: [
      "Topbar",
      "SidebarNav",
      "MetricCard",
      "Table",
      "StatusDot",
      "DataStream",
    ],
  },
  {
    slug: "field-report",
    title: "field report",
    kicker: "editorial case study",
    weight: "field-notebook",
    theme: null,
    description:
      "a cinematic editorial page for narrative work, credits, pull quotes, and project evidence.",
    registerNote: "field-notebook weight. base theme.",
    components: [
      "NarrativeScene",
      "PullQuote",
      "MetricCard",
      "CodeBlock",
      "Badge",
    ],
  },
  {
    slug: "archive-gallery",
    title: "archive gallery",
    kicker: "artifact index",
    weight: "archive",
    theme: null,
    description:
      "a restrained catalog for collections, references, visual artifacts, and quiet browsing.",
    registerNote: "archive weight. base theme.",
    components: [
      "ArchiveScene",
      "Surface",
      "Badge",
      "SearchBar",
      "CornerBrackets",
    ],
  },
  {
    slug: "signal-lost",
    title: "signal lost",
    kicker: "failure state",
    weight: "field-notebook",
    theme: null,
    description:
      "a full-screen system state that turns a missing route into a composed visual moment.",
    registerNote: "field-notebook weight. base theme.",
    components: [
      "TerminalBoot",
      "SignalRing",
      "HorizonGrid",
      "FloatCard",
      "Button",
    ],
  },
  {
    slug: "hextech-forge",
    title: "hextech forge",
    kicker: "themed production floor",
    weight: "field-notebook",
    theme: "hextech",
    description:
      "a remade brass-and-crystal scene proving themes can sit on top of weight registers.",
    registerNote: "field-notebook weight. hextech theme.",
    components: [
      "HexGrid",
      "BrassFiligree",
      "EnergyArc",
      "ArcaneVein",
      "MetricCard",
    ],
  },
  {
    slug: "arcane-shard",
    title: "arcane shard",
    kicker: "unstable study room",
    weight: "archive",
    theme: "arcane",
    description:
      "a remade shimmer study with controlled instability, artifact staging, and corrupted logs.",
    registerNote: "archive weight. arcane theme.",
    components: [
      "CrystalShard",
      "ShimmerCloud",
      "SignalRing",
      "StatusLine",
      "Surface",
    ],
  },
];

export function getScene(slug: SceneSlug) {
  return showcaseScenes.find((scene) => scene.slug === slug);
}

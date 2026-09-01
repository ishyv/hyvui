import { getShowcaseManifest, showcaseManifests } from "./showcaseManifest.js";
import type { ShowcaseFamily, ShowcaseManifest } from "./showcaseManifest.js";

export function listShowcaseFamily(family: ShowcaseFamily): ShowcaseManifest[] {
  return showcaseManifests.filter((manifest) => manifest.family === family);
}

export function getAdjacentShowcaseRoutes(id: string): {
  previous?: string;
  next?: string;
} {
  const current = getShowcaseManifest(id);
  if (!current) return {};

  const family = listShowcaseFamily(current.family);
  const index = family.findIndex((manifest) => manifest.id === id);

  if (index < 0) return {};

  return {
    previous: family[index - 1]?.id,
    next: family[index + 1]?.id,
  };
}

export function getShowcasePrimaryLinks(): ShowcaseManifest[] {
  const primaryIds = new Set([
    "home",
    "bridge",
    "keeper",
    "correspondence",
    "watchhouse",
    "docs",
  ]);

  return showcaseManifests.filter((manifest) => primaryIds.has(manifest.id));
}

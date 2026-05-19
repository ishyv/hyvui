import type { Glyph, GlyphLibrary, GlyphName } from "./types.js";
import { defaultGlyphs } from "./default.js";
import { fieldNotebookGlyphs } from "./field-notebook.js";
import { missionControlGlyphs } from "./mission-control.js";
import { archiveGlyphs } from "./archive.js";
import { hextechGlyphs } from "./hextech.js";
import { arcaneGlyphs } from "./arcane.js";

export type { Glyph, GlyphLibrary, GlyphName } from "./types.js";

const libraries = {
  default: defaultGlyphs,
  "field-notebook": fieldNotebookGlyphs,
  "mission-control": missionControlGlyphs,
  archive: archiveGlyphs,
  hextech: hextechGlyphs,
  arcane: arcaneGlyphs,
} satisfies Record<string, GlyphLibrary>;

export type GlyphSource = keyof typeof libraries;

/**
 * Resolve a glyph by name from the requested library, falling back to default
 * if the library does not implement that name. Themes (hextech, arcane) and
 * registers (field-notebook, etc.) are both valid sources — themes override
 * register glyphs because theme is the more specific identity.
 */
export function resolveGlyph(
  name: GlyphName,
  primary: GlyphSource = "default",
  fallback: GlyphSource = "default",
): Glyph {
  const fromPrimary = libraries[primary]?.[name];
  if (fromPrimary) return fromPrimary;
  const fromFallback = libraries[fallback]?.[name];
  if (fromFallback) return fromFallback;
  return (
    libraries.default[name] ??
    libraries.default.dot ?? {
      viewBox: "0 0 24 24",
      content: `<circle cx="12" cy="12" r="2" fill="currentColor" />`,
    }
  );
}

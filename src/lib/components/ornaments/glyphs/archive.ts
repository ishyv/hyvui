import type { GlyphLibrary } from "./types.js";

/**
 * archive glyphs — index marks. §, ¶, †, ‡, file separators, catalog ticks.
 * Stroke-based, weathered feel. Use sparingly — these are for ordering, not loud accents.
 */

export const archiveGlyphs: GlyphLibrary = {
  section: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M16 6c-1-2-3-2-4-2s-4 0-4 3 4 3 4 3 4 0 4 3-3 4-4 4-3 0-4-2" stroke-linecap="round" fill="none" />
    `,
  },
  "double-dagger": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3v18M8 6h8M8 14h8" stroke-linecap="round" />
    `,
  },
  catalog: {
    viewBox: "0 0 24 24",
    content: `
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" fill="none" />
      <path d="M4 9h16M9 4v16" stroke="currentColor" />
    `,
  },
  // override dagger as the index dagger (single)
  dagger: {
    viewBox: "0 0 24 24",
    content: `<path d="M12 3v14M9 6h6M11 17l1 4 1-4" stroke-linecap="round" />`,
  },
  // override pilcrow as the formal paragraph mark
  pilcrow: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M14 4v16M18 4v16M14 4h-3a3.5 3.5 0 0 0 0 7h3" stroke-linecap="round" />
    `,
  },
};

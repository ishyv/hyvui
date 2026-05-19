import type { GlyphLibrary } from "./types.js";

/**
 * hextech glyphs — precision hex-runic shapes. Brass/cyan precision, geometric.
 * Theme overlay (--htx-cyan-glow stroke) is applied by Glyph CSS, not here.
 */

export const hextechGlyphs: GlyphLibrary = {
  "hex-rune-a": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 2l9 5.5v9L12 22l-9-5.5v-9L12 2z" stroke-linejoin="miter" />
      <path d="M12 7v10M7.5 9.5l9 5M7.5 14.5l9-5" />
    `,
  },
  "hex-rune-b": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 2l9 5.5v9L12 22l-9-5.5v-9L12 2z" stroke-linejoin="miter" />
      <circle cx="12" cy="12" r="3" />
    `,
  },
  "compass-rose": {
    viewBox: "0 0 24 24",
    content: `
      <circle cx="12" cy="12" r="9" fill="none" />
      <path d="M12 2l1.5 9L12 12l-1.5-1L12 2zM12 22l-1.5-9L12 12l1.5 1L12 22zM2 12l9 1.5L12 12l-1-1.5L2 12zM22 12l-9-1.5L12 12l1 1.5L22 12z"
        fill="currentColor" stroke="none" />
    `,
    filled: true,
  },
  "gem-cut": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3l6 5-2 11H8L6 8l6-5z" stroke-linejoin="miter" />
      <path d="M8 8l4 11 4-11M6 8h12" />
    `,
  },
  // override star with hex-cut version
  star: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3l3 6 6 1-4.5 4.2 1 6.3L12 17.6l-5.5 2.9 1-6.3L3 10l6-1z" stroke-linejoin="miter" />
    `,
  },
};

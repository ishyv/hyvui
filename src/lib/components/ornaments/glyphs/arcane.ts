import type { GlyphLibrary } from "./types.js";

/**
 * arcane glyphs — chaotic runic shapes. Magenta/violet, jagged, irregular.
 * Theme overlay (magenta glow filter) is applied by Glyph CSS, not here.
 */

export const arcaneGlyphs: GlyphLibrary = {
  "void-sigil": {
    viewBox: "0 0 24 24",
    content: `
      <circle cx="12" cy="12" r="8" fill="none" />
      <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    `,
  },
  crackle: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M4 12l3-4 2 2 3-5 2 4 3-3 2 3 3-2" stroke-linecap="round" stroke-linejoin="miter" />
    `,
  },
  "shimmer-rune": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 2l4 8 8 2-8 2-4 8-4-8-8-2 8-2 4-8z" fill="currentColor" fill-opacity="0.8" />
    `,
    filled: true,
  },
  zigzag: {
    viewBox: "0 0 24 24",
    content: `<path d="M3 12l4-6 4 6 4-6 4 6 2-3" stroke-linecap="round" stroke-linejoin="miter" />`,
  },
  // override dagger with a crackle-edged version
  dagger: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3.5l-1 2 1 1-1 2 1 1v8.5M8 7h8M10.5 18l1.5 3.5 1.5-3.5" stroke-linecap="round" stroke-linejoin="miter" />
    `,
  },
  // override asterisk as a 6-point burst
  asterisk: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3v18M4.5 7l15 10M4.5 17l15-10" stroke-linecap="round" />
    `,
  },
};

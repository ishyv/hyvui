import type { GlyphLibrary } from "./types.js";

/**
 * Default glyph set — neutral marks used when no register overrides them.
 * All viewBox 24×24 for predictable composition with size props.
 */

export const defaultGlyphs: GlyphLibrary = {
  asterisk: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 4v16M5.5 8l13 8M5.5 16l13-8" />
    `,
  },
  star: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3l2.7 5.7 6.3.7-4.8 4.2 1.4 6.1L12 16.7l-5.6 3 1.4-6.1L3 9.4l6.3-.7L12 3z" />
    `,
  },
  plus: {
    viewBox: "0 0 24 24",
    content: `<path d="M12 5v14M5 12h14" />`,
  },
  dot: {
    viewBox: "0 0 24 24",
    content: `<circle cx="12" cy="12" r="3" fill="currentColor" />`,
  },
  dash: {
    viewBox: "0 0 24 24",
    content: `<path d="M5 12h14" />`,
  },
  "double-dash": {
    viewBox: "0 0 24 24",
    content: `<path d="M5 10h14M5 14h14" />`,
  },
  bullet: {
    viewBox: "0 0 24 24",
    content: `<circle cx="12" cy="12" r="2" fill="currentColor" />`,
  },
  arrow: {
    viewBox: "0 0 24 24",
    content: `<path d="M5 12h14M14 6l6 6-6 6" />`,
  },
  chevron: {
    viewBox: "0 0 24 24",
    content: `<path d="M9 6l6 6-6 6" />`,
  },
  slash: {
    viewBox: "0 0 24 24",
    content: `<path d="M18 5L6 19" />`,
  },
  dagger: {
    viewBox: "0 0 24 24",
    content: `<path d="M12 3v15M8 7h8M11 18l1 3 1-3" />`,
  },
  pilcrow: {
    viewBox: "0 0 24 24",
    content: `<path d="M14 4v16M18 4v16M14 4h-4a3 3 0 0 0 0 6h4" />`,
  },
};

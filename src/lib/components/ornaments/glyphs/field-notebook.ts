import type { GlyphLibrary } from "./types.js";

/**
 * field-notebook glyphs — warm, slightly-imperfect, hand-pressed marks.
 * Override generic glyphs with sketched variants; add notebook-specific ones.
 */

export const fieldNotebookGlyphs: GlyphLibrary = {
  // hand-scribed asterisk — uneven legs
  asterisk: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 4.2v15.6M5.7 8.4l12.6 7.2M5.6 16l12.8-7.6" stroke-linecap="round" />
    `,
  },
  // ink-blotted star — filled to feel pressed
  star: {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 3.3l2.8 5.5 6.1.8-4.6 4.4 1.3 6.1L12 17.1l-5.6 3 1.4-6.1L3.3 9.6l6.1-.8L12 3.3z"
        fill="currentColor" fill-opacity="0.85" />
    `,
    filled: true,
  },
  "ink-star": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M12 4l1.4 4.6 4.6 1.4-4.6 1.4L12 16l-1.4-4.6L6 10l4.6-1.4L12 4z"
        fill="currentColor" />
    `,
    filled: true,
  },
  // tick used in margins
  "scribed-tick": {
    viewBox: "0 0 24 24",
    content: `<path d="M4 13l5 5 11-12" stroke-linecap="round" stroke-linejoin="round" />`,
  },
  "margin-mark": {
    viewBox: "0 0 24 24",
    content: `
      <path d="M5 4v16M5 12h6M8 8v8" stroke-linecap="round" />
    `,
  },
  dagger: {
    viewBox: "0 0 24 24",
    content: `<path d="M12 3.4v14.8M8.2 7.2h7.6M11 18.3l1 3 1-3" stroke-linecap="round" />`,
  },
};

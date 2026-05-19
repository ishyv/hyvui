import type { GlyphLibrary } from "./types.js";

/**
 * mission-control glyphs — precise technical symbols. Cardinals, signal bars,
 * ack/nak. Filled shapes preferred for legibility at small sizes.
 */

export const missionControlGlyphs: GlyphLibrary = {
  "cardinal-up": {
    viewBox: "0 0 24 24",
    content: `<path d="M12 4l8 14H4z" fill="currentColor" />`,
    filled: true,
  },
  "cardinal-down": {
    viewBox: "0 0 24 24",
    content: `<path d="M12 20L4 6h16z" fill="currentColor" />`,
    filled: true,
  },
  "signal-bars": {
    viewBox: "0 0 24 24",
    content: `
      <rect x="3"  y="15" width="3" height="5" fill="currentColor" />
      <rect x="9"  y="11" width="3" height="9" fill="currentColor" />
      <rect x="15" y="7"  width="3" height="13" fill="currentColor" />
      <rect x="21" y="3"  width="3" height="17" fill="currentColor" />
    `,
    filled: true,
  },
  ack: {
    viewBox: "0 0 24 24",
    content: `
      <rect x="3" y="6" width="18" height="12" stroke="currentColor" fill="none" />
      <path d="M7 12l3 3 7-7" stroke="currentColor" stroke-linecap="round" />
    `,
  },
  nak: {
    viewBox: "0 0 24 24",
    content: `
      <rect x="3" y="6" width="18" height="12" stroke="currentColor" fill="none" />
      <path d="M8 9l8 6M16 9l-8 6" stroke="currentColor" stroke-linecap="round" />
    `,
  },
  reticle: {
    viewBox: "0 0 24 24",
    content: `
      <circle cx="12" cy="12" r="7" fill="none" />
      <path d="M12 2v6M12 16v6M2 12h6M16 12h6" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    `,
  },
  // override dot with a precise small square (rader pip)
  dot: {
    viewBox: "0 0 24 24",
    content: `<rect x="10" y="10" width="4" height="4" fill="currentColor" />`,
    filled: true,
  },
};

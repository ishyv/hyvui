/**
 * Glyph types — shared across the per-register glyph libraries.
 *
 * Each register may implement its own subset of these names. Names a register
 * does not implement fall through to `default.ts`. This lets, e.g., archive
 * provide a stylized `dagger` while still inheriting `dot` from default.
 */

export type GlyphName =
  // generic — all libraries provide these
  | "asterisk"
  | "star"
  | "plus"
  | "dot"
  | "dash"
  | "double-dash"
  | "bullet"
  | "arrow"
  | "chevron"
  | "slash"
  | "dagger"
  | "pilcrow"
  // index marks — primarily archive
  | "section"
  | "double-dagger"
  | "catalog"
  // technical — primarily mission-control
  | "cardinal-up"
  | "cardinal-down"
  | "signal-bars"
  | "ack"
  | "nak"
  | "reticle"
  // notebook — primarily field-notebook
  | "ink-star"
  | "scribed-tick"
  | "margin-mark"
  // hextech runes
  | "hex-rune-a"
  | "hex-rune-b"
  | "compass-rose"
  | "gem-cut"
  // arcane runes
  | "void-sigil"
  | "crackle"
  | "shimmer-rune"
  | "zigzag";

export interface Glyph {
  /** SVG viewBox, e.g. "0 0 24 24". */
  viewBox: string;
  /** Inner SVG markup. Uses `currentColor` for theme-overlay tinting. */
  content: string;
  /** Optional stroke-width override (defaults to 1.5). */
  strokeWidth?: number;
  /** Renders as filled path (default false — stroked). */
  filled?: boolean;
}

export type GlyphLibrary = Partial<Record<GlyphName, Glyph>>;

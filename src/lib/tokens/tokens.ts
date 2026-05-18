export const tokens = {
  color: {
    bg: "#08090b",
    bgElev: "#12151a",
    text: "#f0e8da",
    textSoft: "#d8cdb9",
    muted: "#a79d8b",
    mutedStrong: "#7e7568",
    accent: "#c79c57",
    accentStrong: "#e2ba74",
    signal: "#79a6a3",
    statusOk: "#79a6a3",
    statusPend: "#8b8476",
    statusWarn: "#c79c57",
    statusFail: "#b66a48",
  },
  font: {
    body: "'ET Book', 'Iowan Old Style', 'Palatino Linotype', serif",
    mono: "'IBM Plex Mono', 'Menlo', 'Consolas', monospace",
  },
  type: {
    "2xs": "0.694rem",
    xs: "0.833rem",
    sm: "1rem",
    md: "1.2rem",
    lg: "1.44rem",
    xl: "1.728rem",
    "2xl": "2.074rem",
    "3xl": "clamp(2.074rem, 4vw, 3.25rem)",
    display: "clamp(3.4rem, 10vw, 8rem)",
  },
  space: {
    "3xs": "0.125rem",
    "2xs": "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  transition: {
    smooth: "0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    fast: "0.16s cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

/**
 * Typed Tailwind class names for all hyvui token colors.
 * Use these instead of writing class strings by hand to get full IDE autocomplete.
 *
 * @example
 * import { themeClasses } from '@hyvnt/hyvui';
 * // themeClasses.text.accent  → 'text-accent'
 * // themeClasses.bg.elevated  → 'bg-bg-elev'
 */
export const themeClasses = {
  bg: {
    base: "bg-bg",
    elevated: "bg-bg-elev",
  },
  text: {
    primary: "text-text",
    soft: "text-text-soft",
    muted: "text-muted",
    mutedStrong: "text-muted-strong",
    accent: "text-accent",
    accentStrong: "text-accent-strong",
    signal: "text-signal",
  },
  border: {
    default: "border-line",
    strong: "border-line-strong",
  },
  font: {
    body: "font-body",
    mono: "font-mono",
  },
  shadow: {
    veil: "shadow-veil",
  },
  status: {
    ok: "text-status-ok",
    pend: "text-status-pend",
    warn: "text-status-warn",
    fail: "text-status-fail",
  },
} as const;

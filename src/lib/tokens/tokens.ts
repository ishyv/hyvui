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
  // Fluid type — clamp(min, base + slope*vw, max) across 360→1440px viewport.
  // Small steps use 1.2 ratio at both ends (dense metadata); large steps use 1.2→1.333.
  type: {
    "2xs": "clamp(0.694rem, 0.665rem + 0.129vw, 0.781rem)",
    xs: "clamp(0.833rem, 0.798rem + 0.156vw, 0.938rem)",
    sm: "clamp(1rem, 0.958rem + 0.185vw, 1.125rem)",
    md: "clamp(1.2rem, 1.100rem + 0.443vw, 1.499rem)",
    lg: "clamp(1.44rem, 1.254rem + 0.827vw, 1.998rem)",
    xl: "clamp(1.728rem, 1.416rem + 1.387vw, 2.664rem)",
    "2xl": "clamp(2.074rem, 1.582rem + 2.188vw, 3.551rem)",
    "3xl": "clamp(2.488rem, 1.740rem + 3.326vw, 4.733rem)",
    display: "clamp(3.583rem, 1.974rem + 7.151vw, 8.41rem)",
  },
  leading: {
    tight: "1.15",
    snug: "1.3",
    body: "1.55",
    loose: "1.75",
  },
  tracking: {
    tight: "-0.02em",
    normal: "0",
    wide: "0.04em",
    meta: "0.12em",
  },
  // Fluid spacing — uniform 1.25× at max viewport, rhythm preserved.
  space: {
    "3xs": "clamp(0.125rem, 0.115rem + 0.046vw, 0.156rem)",
    "2xs": "clamp(0.25rem, 0.229rem + 0.093vw, 0.313rem)",
    xs: "clamp(0.5rem, 0.458rem + 0.185vw, 0.625rem)",
    sm: "clamp(0.75rem, 0.688rem + 0.278vw, 0.938rem)",
    md: "clamp(1rem, 0.917rem + 0.370vw, 1.25rem)",
    lg: "clamp(1.5rem, 1.375rem + 0.556vw, 1.875rem)",
    xl: "clamp(2rem, 1.833rem + 0.741vw, 2.5rem)",
    "2xl": "clamp(3rem, 2.75rem + 1.111vw, 3.75rem)",
    "3xl": "clamp(4rem, 3.667rem + 1.481vw, 5rem)",
  },
  shell: {
    max: "clamp(64rem, 92vw, 88rem)",
    pad: "clamp(1.1rem, 0.476rem + 2.778vw, 3rem)",
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

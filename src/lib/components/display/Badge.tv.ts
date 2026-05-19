import { tv, type VariantProps } from "../../system/variants/index.js";

/**
 * Badge variant matrix.
 *
 * Color and background are applied via inline style: directives in Badge.svelte
 * (the values are computed from CSS variables that respond to themes). tv() here
 * holds the base class and any future tone-specific compound variants.
 */
export const badge = tv({
  base: "hyvui-badge",
  variants: {
    variant: {
      default: "hyvui-badge-default",
      accent: "hyvui-badge-accent",
      signal: "hyvui-badge-signal",
      ok: "hyvui-badge-ok",
      warn: "hyvui-badge-warn",
      fail: "hyvui-badge-fail",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeVariants = VariantProps<typeof badge>;

import { tv, type VariantProps } from "../../system/variants/index.js";

/**
 * Button variant matrix.
 *
 * Today this composes existing .hyvui-btn-* classes — the CSS in Button.svelte
 * is the source of truth for the look. The benefit of routing through tv():
 *   - Typed ButtonVariants from one source
 *   - Compound variants for future register × variant combinations
 *   - defaultVariants makes the optional-prop story unambiguous
 *
 * To add register-aware behavior later, append a compoundVariants entry like
 *   { register: 'archive', variant: 'ghost', class: 'hyvui-btn-archive-ghost' }
 * and define the corresponding CSS rule in Button.svelte's <style> block.
 */
export const button = tv({
  base: "hyvui-btn",
  variants: {
    variant: {
      primary: "hyvui-btn-primary",
      secondary: "hyvui-btn-secondary",
      ghost: "hyvui-btn-ghost",
      destructive: "hyvui-btn-destructive",
    },
    size: {
      sm: "hyvui-btn-sm",
      md: "hyvui-btn-md",
    },
    loading: {
      true: "hyvui-btn-loading",
    },
    disabled: {
      true: "hyvui-btn-disabled",
    },
  },
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});

export type ButtonVariants = VariantProps<typeof button>;

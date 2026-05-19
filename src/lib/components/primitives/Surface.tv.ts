import { tv, type VariantProps } from "../../system/variants/index.js";

export const surface = tv({
  base: "hyvui-surface",
  variants: {
    variant: {
      base: "hyvui-surface-base",
      card: "hyvui-surface-card",
      panel: "hyvui-surface-panel",
    },
    withInset: {
      true: "hyvui-surface-inset",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

export type SurfaceVariants = VariantProps<typeof surface>;

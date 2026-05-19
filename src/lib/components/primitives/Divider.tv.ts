import { tv, type VariantProps } from "../../system/variants/index.js";

export const divider = tv({
  base: "hyvui-divider",
  variants: {
    strength: {
      default: "hyvui-divider-default",
      strong: "hyvui-divider-strong",
    },
    pattern: {
      solid: "hyvui-divider-solid",
      dashed: "hyvui-divider-dashed",
      dotted: "hyvui-divider-dotted",
      chevron: "hyvui-divider-chevron",
      scribed: "hyvui-divider-scribed",
      stepped: "hyvui-divider-stepped",
      double: "hyvui-divider-double",
    },
    orientation: {
      h: "hyvui-divider-h",
      v: "hyvui-divider-v",
    },
  },
  defaultVariants: {
    strength: "default",
    pattern: "solid",
    orientation: "h",
  },
});

export type DividerVariants = VariantProps<typeof divider>;

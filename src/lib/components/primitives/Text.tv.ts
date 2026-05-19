import { tv, type VariantProps } from "../../system/variants/index.js";

export const text = tv({
  base: "hyvui-text",
  variants: {
    variant: {
      heading: "hyvui-text-heading",
      body: "hyvui-text-body",
      caption: "hyvui-text-caption",
      italic: "hyvui-text-italic",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export type TextVariants = VariantProps<typeof text>;

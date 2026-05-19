import { tv, type VariantProps } from "../../system/variants/index.js";

export const statusDot = tv({
  base: "hyvui-status-dot",
  variants: {
    status: {
      ok: "hyvui-status-dot-ok",
      pend: "hyvui-status-dot-pend",
      warn: "hyvui-status-dot-warn",
      fail: "hyvui-status-dot-fail",
    },
    pulse: {
      true: "hyvui-status-dot-pulse",
    },
  },
  defaultVariants: {
    status: "ok",
    pulse: true,
  },
});

export type StatusDotVariants = VariantProps<typeof statusDot>;

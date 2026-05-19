/**
 * hyvui variant wrapper around tailwind-variants.
 *
 * Why this thin re-export instead of importing tv() directly?
 *  - One place to extend tv with twMerge config or hyvui-specific defaults
 *  - Components import from a stable internal path; library upgrade only touches this file
 *  - Lets us re-export VariantProps in our own type namespace for cleaner JSDoc
 *
 * @example
 * import { tv, type VariantProps } from '$lib/system/variants/tv';
 *
 * const button = tv({
 *   base: 'hyvui-btn',
 *   variants: {
 *     variant: { primary: 'hyvui-btn-primary', ghost: 'hyvui-btn-ghost' },
 *     size: { sm: 'hyvui-btn-sm', md: 'hyvui-btn-md' }
 *   },
 *   defaultVariants: { variant: 'secondary', size: 'md' }
 * });
 *
 * type ButtonVariants = VariantProps<typeof button>;
 */
export { tv, type VariantProps } from "tailwind-variants";

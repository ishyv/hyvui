<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Icon size in pixels. */
    size?: number;
    /** CSS color value for the icon. */
    color?: string;
    /** Additional CSS classes. */
    class?: string;
    /** SVG content to render inside the icon wrapper. */
    children?: Snippet;
  }

  let {
    size = 16,
    color = 'currentColor',
    class: className = '',
    children,
  }: Props = $props();
</script>

<span
  class={cn('hyvui-icon', className)}
  style:width="{size}px"
  style:height="{size}px"
  style:color={color}
  aria-hidden="true"
>
  {#if children}{@render children()}{/if}
</span>

<style>
  .hyvui-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 0;
  }

  .hyvui-icon :global(svg) {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
  }
</style>

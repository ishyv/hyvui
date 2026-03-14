<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Number of columns or a CSS grid-template-columns value. */
    cols?: number | string;
    /** Gap between grid items. */
    gap?: string;
    /** HTML tag to render. */
    as?: string;
    /** Additional CSS classes. */
    class?: string;
    /** Grid children. */
    children?: Snippet;
  }

  let {
    cols = 1,
    gap = 'var(--space-md)',
    as = 'div',
    class: className = '',
    children,
  }: Props = $props();

  const gridCols = $derived(typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols);
</script>

<svelte:element
  this={as}
  class={cn('hyvui-grid', className)}
  style:grid-template-columns={gridCols}
  style:gap={gap}
>
  {#if children}{@render children()}{/if}
</svelte:element>

<style>
  .hyvui-grid {
    display: grid;
    min-width: 0;
  }
</style>

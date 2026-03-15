<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Number of columns or a CSS grid-template-columns value. */
    cols?: number | string;
    /** Gap between grid items. */
    gap?: string;
    /** If true, collapses to a single column on mobile viewports (≤768px). Default true. */
    responsive?: boolean;
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
    responsive = true,
    as = 'div',
    class: className = '',
    children,
  }: Props = $props();

  const gridCols = $derived(typeof cols === 'number' ? `repeat(${cols}, 1fr)` : cols);
</script>

<svelte:element
  this={as}
  class={cn('hyvui-grid', responsive && 'hyvui-grid-responsive', className)}
  style:--hyv-grid-cols={gridCols}
  style:gap={gap}
>
  {#if children}{@render children()}{/if}
</svelte:element>

<style>
  .hyvui-grid {
    display: grid;
    min-width: 0;
    grid-template-columns: var(--hyv-grid-cols);
  }

  @media (max-width: 768px) {
    .hyvui-grid-responsive {
      grid-template-columns: 1fr !important;
    }
  }
</style>

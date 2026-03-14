<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Optional scene title. */
    title?: string;
    /** Number of grid columns. */
    cols?: number;
    /** Additional CSS classes. */
    class?: string;
    /** Filter controls area above the grid. */
    filter?: Snippet;
    /** Grid items (Cards, images, etc.). */
    children?: Snippet;
  }

  let {
    title = '',
    cols = 3,
    class: className = '',
    filter,
    children,
  }: Props = $props();
</script>

<section class={cn('hyvui-archive', className)}>
  <div class="hyvui-archive-inner">
    {#if title || filter}
      <div class="hyvui-archive-top">
        {#if title}
          <h2 class="hyvui-archive-title">{title}</h2>
        {/if}
        {#if filter}
          <div class="hyvui-archive-filter">
            {@render filter()}
          </div>
        {/if}
      </div>
    {/if}
    <div
      class="hyvui-archive-grid"
      style:grid-template-columns="repeat({cols}, 1fr)"
    >
      {#if children}{@render children()}{/if}
    </div>
  </div>
</section>

<style>
  .hyvui-archive {
    position: relative;
    min-height: 100dvh;
    padding: var(--space-scene);
  }

  .hyvui-archive-inner {
    display: flex;
    flex-direction: column;
    gap: calc(1.5rem * var(--reg-spacing-scale));
  }

  .hyvui-archive-top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1rem;
  }

  .hyvui-archive-title {
    font-family: var(--font-body);
    font-size: 1.4rem;
    font-weight: 400;
    line-height: var(--reg-heading-lh);
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
    margin: 0;
  }

  .hyvui-archive-filter {
    flex-shrink: 0;
  }

  .hyvui-archive-grid {
    display: grid;
    gap: var(--space-inline);
    /* no stagger offsets. uniformity is the aesthetic intent. */
  }

  @media (max-width: 768px) {
    .hyvui-archive-grid {
      grid-template-columns: 1fr !important;
    }
  }
</style>

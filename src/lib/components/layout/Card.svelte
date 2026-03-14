<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import Surface from '../primitives/Surface.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    /** TranslateY offset for staggered card grids. */
    staggerOffset?: string;
    /** Additional CSS classes. */
    class?: string;
    /** Card header slot. */
    header?: Snippet;
    /** Card body content. */
    children?: Snippet;
    /** Card footer slot. */
    footer?: Snippet;
  }

  let {
    staggerOffset = '',
    class: className = '',
    header,
    children,
    footer,
  }: Props = $props();

  const style = $derived(staggerOffset ? `transform: translateY(${staggerOffset})` : '');
</script>

<div class={cn('hyvui-card-wrap', className)} {style}>
  <Surface variant="card" class="hyvui-card-inner">
    {#if header}
      <div class="hyvui-card-header">
        {@render header()}
      </div>
    {/if}
    {#if children}
      <div class="hyvui-card-body">
        {@render children()}
      </div>
    {/if}
    {#if footer}
      <div class="hyvui-card-footer">
        {@render footer()}
      </div>
    {/if}
  </Surface>
</div>

<style>
  .hyvui-card-wrap {
    display: block;
  }

  :global(.hyvui-card-inner) {
    padding: var(--space-card);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .hyvui-card-header {
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
  }

  .hyvui-card-body {
    flex: 1;
    min-width: 0;
  }

  .hyvui-card-footer {
    padding-top: var(--space-sm);
    border-top: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
  }
</style>

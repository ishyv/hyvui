<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Surface visual style. */
    variant?: 'base' | 'card' | 'panel';
    /** HTML tag to render. */
    as?: string;
    /** Adds a pseudoelement teal inset border on panel variant. */
    withInset?: boolean;
    /** Additional CSS classes. */
    class?: string;
    /** Surface content. */
    children?: Snippet;
  }

  let {
    variant = 'base',
    as = 'div',
    withInset = false,
    class: className = '',
    children,
  }: Props = $props();
</script>

<svelte:element
  this={as}
  class={cn(
    'hyvui-surface',
    variant === 'card' && 'hyvui-surface-card',
    variant === 'panel' && 'hyvui-surface-panel',
    variant === 'base' && 'hyvui-surface-base',
    withInset && 'hyvui-surface-inset',
    className
  )}
>
  {#if children}{@render children()}{/if}
</svelte:element>

<style>
  .hyvui-surface {
    position: relative;
    overflow: clip;
    border-radius: var(--radius-md);
    isolation: isolate;
  }

  .hyvui-surface::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(240, 232, 218, 0.04), transparent 20%),
      linear-gradient(90deg, rgba(121, 166, 163, 0.03), transparent 30%);
    opacity: 0.8;
  }

  .hyvui-surface-base {
    background: var(--surface-soft);
    border: 1px solid var(--line);
    box-shadow: var(--surface-stroke);
  }

  .hyvui-surface-card {
    background: var(--surface-card);
    border: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: var(--surface-stroke), var(--shadow-card);
    backdrop-filter: blur(8px);
  }

  .hyvui-surface-panel {
    background: var(--surface-panel);
    border: 1px solid var(--line);
    box-shadow: var(--surface-stroke), var(--shadow-veil);
    backdrop-filter: blur(10px);
  }

  .hyvui-surface-inset::after {
    content: '';
    position: absolute;
    inset: 0.9rem;
    border: 1px solid rgba(121, 166, 163, 0.14);
    pointer-events: none;
  }
</style>

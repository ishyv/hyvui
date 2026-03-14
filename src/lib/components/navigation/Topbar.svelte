<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Additional CSS classes. */
    class?: string;
    /** Left slot content. */
    left?: Snippet;
    /** Center slot content. */
    center?: Snippet;
    /** Right slot content. */
    right?: Snippet;
  }

  let {
    class: className = '',
    left,
    center,
    right,
  }: Props = $props();
</script>

<header class={cn('hyvui-topbar', className)}>
  <div class="hyvui-topbar-left">
    {#if left}{@render left()}{/if}
  </div>
  <div class="hyvui-topbar-center">
    {#if center}{@render center()}{/if}
  </div>
  <div class="hyvui-topbar-right">
    {#if right}{@render right()}{/if}
  </div>
</header>

<style>
  .hyvui-topbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    gap: var(--space-md);
    min-height: 4.5rem;
    padding: var(--space-sm) var(--shell-pad);
    background:
      linear-gradient(180deg, rgba(121, 166, 163, 0.06), transparent 68%),
      rgba(8, 9, 11, 0.86);
    border-bottom: 1px solid var(--line);
    backdrop-filter: blur(10px);
  }

  .hyvui-topbar-left {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .hyvui-topbar-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .hyvui-topbar-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--space-sm);
    min-width: 0;
  }

  @media (max-width: 720px) {
    .hyvui-topbar {
      grid-template-columns: 1fr;
      justify-items: stretch;
    }

    .hyvui-topbar-center,
    .hyvui-topbar-right {
      justify-content: flex-start;
    }
  }
</style>

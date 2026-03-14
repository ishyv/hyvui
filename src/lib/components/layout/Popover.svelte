<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import Surface from '../primitives/Surface.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Controls popover visibility. */
    open?: boolean;
    /** Placement relative to anchor. */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Additional CSS classes. */
    class?: string;
    /** Popover content. */
    children?: Snippet;
  }

  let {
    open = false,
    placement = 'bottom',
    class: className = '',
    children,
  }: Props = $props();

  const placementStyles: Record<string, string> = {
    top: 'bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 0.5rem;',
    bottom: 'top: 100%; left: 50%; transform: translateX(-50%); margin-top: 0.5rem;',
    left: 'right: 100%; top: 50%; transform: translateY(-50%); margin-right: 0.5rem;',
    right: 'left: 100%; top: 50%; transform: translateY(-50%); margin-left: 0.5rem;',
  };
</script>

{#if open}
  <div class={cn('hyvui-popover', className)} style={placementStyles[placement]}>
    <Surface variant="card" class="hyvui-popover-surface">
      {#if children}{@render children()}{/if}
    </Surface>
  </div>
{/if}

<style>
  .hyvui-popover {
    position: absolute;
    z-index: var(--z-overlay);
    animation: popover-in 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  }

  :global(.hyvui-popover-surface) {
    padding: 0.5rem 0.75rem;
  }

  @keyframes popover-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-popover {
      animation: none;
    }
  }
</style>

<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import Surface from '../primitives/Surface.svelte';

  interface MenuItem {
    label: string;
    value: string;
    disabled?: boolean;
    destructive?: boolean;
  }

  interface Props {
    /** Controls menu visibility. */
    open?: boolean;
    /** Menu items. */
    items?: MenuItem[];
    /** Additional CSS classes. */
    class?: string;
    /** Fires when an item is selected with its value. */
    onselect?: (value: string) => void;
  }

  let {
    open = false,
    items = [],
    class: className = '',
    onselect,
  }: Props = $props();
</script>

{#if open}
  <div class={cn('hyvui-dropdown', className)}>
    <Surface variant="card" class="hyvui-dropdown-surface">
      {#each items as item}
        <button
          type="button"
          class={cn(
            'hyvui-dropdown-item',
            item.disabled && 'hyvui-dropdown-item-disabled',
            item.destructive && 'hyvui-dropdown-item-destructive'
          )}
          disabled={item.disabled}
          onclick={() => onselect?.(item.value)}
        >
          {item.label}
        </button>
      {/each}
    </Surface>
  </div>
{/if}

<style>
  .hyvui-dropdown {
    position: absolute;
    z-index: var(--z-overlay);
    min-width: 13rem;
    animation: dropdown-in 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  }

  :global(.hyvui-dropdown-surface) {
    padding: var(--space-xs);
  }

  .hyvui-dropdown-item {
    display: block;
    width: 100%;
    text-align: left;
    font-family: var(--font-mono);
    font-size: 0.74rem;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--text-soft);
    background: none;
    border: none;
    border-radius: var(--radius-sm);
    padding: 0.75rem 0.85rem;
    cursor: pointer;
    transition:
      transform var(--transition-fast),
      color var(--transition-fast),
      background var(--transition-fast);
  }

  .hyvui-dropdown-item:hover:not(:disabled) {
    transform: translateX(4px);
    background: linear-gradient(90deg, rgba(199, 156, 87, 0.12), transparent 72%);
    color: var(--text);
  }

  .hyvui-dropdown-item-disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .hyvui-dropdown-item-destructive {
    color: var(--status-fail);
  }

  @keyframes dropdown-in {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-dropdown {
      animation: none;
    }

    .hyvui-dropdown-item {
      transition: none;
    }

    .hyvui-dropdown-item:hover:not(:disabled) {
      transform: none;
    }
  }
</style>

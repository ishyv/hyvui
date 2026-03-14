<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface TabItem {
    id: string;
    label: string;
  }

  interface Props {
    /** Available tabs. */
    tabs?: TabItem[];
    /** Currently active tab id. */
    active?: string;
    /** Additional CSS classes. */
    class?: string;
    /** Fires when a tab is selected with the new tab id. */
    onchange?: (id: string) => void;
  }

  let {
    tabs = [],
    active = '',
    class: className = '',
    onchange,
  }: Props = $props();
</script>

<div class={cn('hyvui-tabs', className)} role="tablist">
  {#each tabs as tab}
    <button
      type="button"
      role="tab"
      aria-selected={tab.id === active}
      class={cn('hyvui-tab', tab.id === active && 'hyvui-tab-active')}
      onclick={() => onchange?.(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .hyvui-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    border-bottom: 1px solid var(--line);
    padding-bottom: var(--space-xs);
  }

  .hyvui-tab {
    position: relative;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    padding: 0.65rem 0.85rem;
    cursor: pointer;
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast),
      background var(--transition-fast);
  }

  .hyvui-tab:hover {
    color: var(--text-soft);
    background: linear-gradient(180deg, rgba(199, 156, 87, 0.08), transparent 76%);
  }

  .hyvui-tab-active {
    color: var(--accent);
    border-color: color-mix(in srgb, var(--accent) 34%, transparent);
    background: linear-gradient(180deg, rgba(199, 156, 87, 0.12), transparent 76%);
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-tab {
      transition: none;
    }
  }
</style>

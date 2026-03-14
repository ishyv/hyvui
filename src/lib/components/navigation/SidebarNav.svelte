<script lang="ts">
  import { cn } from '../../utils/cn.js';

  interface NavItem {
    label: string;
    href: string;
    active?: boolean;
  }

  interface Props {
    /** Navigation items. */
    items?: NavItem[];
    /** Additional CSS classes. */
    class?: string;
    /** Fires when a nav item is clicked. */
    onnavigate?: (item: NavItem) => void;
  }

  let {
    items = [],
    class: className = '',
    onnavigate,
  }: Props = $props();
</script>

<nav class={cn('hyvui-sidebar-nav', className)}>
  {#each items as item}
    <a
      href={item.href}
      class={cn('hyvui-sidebar-link', item.active && 'hyvui-sidebar-link-active')}
      onclick={(e) => {
        if (onnavigate) {
          e.preventDefault();
          onnavigate(item);
        }
      }}
    >
      {item.label}
    </a>
  {/each}
</nav>

<style>
  .hyvui-sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-2xs);
  }

  .hyvui-sidebar-link {
    position: relative;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    text-decoration: none;
    padding: 0.55rem 0.9rem;
    border-left: 1px solid transparent;
    min-width: 0;
    transition:
      color var(--transition-fast),
      transform var(--transition-fast),
      background var(--transition-fast),
      border-color var(--transition-fast);
  }

  .hyvui-sidebar-link:hover {
    color: var(--text-soft);
    background: linear-gradient(90deg, rgba(199, 156, 87, 0.08), transparent 76%);
  }

  .hyvui-sidebar-link-active {
    color: var(--accent);
    border-left-color: var(--line-strong);
    background: linear-gradient(90deg, rgba(199, 156, 87, 0.14), transparent 72%);
    transform: translateX(4px);
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-sidebar-link {
      transition: none;
    }

    .hyvui-sidebar-link-active {
      transform: none;
    }
  }
</style>

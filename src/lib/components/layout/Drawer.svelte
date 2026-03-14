<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import Surface from '../primitives/Surface.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Controls drawer visibility. */
    open?: boolean;
    /** Side the drawer slides in from. */
    side?: 'left' | 'right';
    /** Drawer width. */
    width?: string;
    /** Additional CSS classes. */
    class?: string;
    /** Drawer content. */
    children?: Snippet;
    /** Fires when the drawer is dismissed. */
    onclose?: () => void;
  }

  let {
    open = false,
    side = 'right',
    width = '320px',
    class: className = '',
    children,
    onclose,
  }: Props = $props();

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onclose?.();
    }
  }

  function handleBackdropClick() {
    onclose?.();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="hyvui-drawer-backdrop" onclick={handleBackdropClick} onkeydown={handleKeydown}>
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class={cn(
        'hyvui-drawer',
        side === 'left' ? 'hyvui-drawer-left' : 'hyvui-drawer-right',
        className
      )}
      style:width={width}
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <Surface variant="panel" class="hyvui-drawer-surface">
        {#if children}{@render children()}{/if}
      </Surface>
    </div>
  </div>
{/if}

<style>
  .hyvui-drawer-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--z-modal);
    background: rgba(0, 0, 0, 0.72);
  }

  .hyvui-drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: var(--z-modal);
  }

  .hyvui-drawer-left {
    left: 0;
    animation: drawer-left-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .hyvui-drawer-right {
    right: 0;
    animation: drawer-right-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  :global(.hyvui-drawer-surface) {
    height: 100%;
    padding: var(--space-card);
    overflow-y: auto;
  }

  @keyframes drawer-left-in {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  @keyframes drawer-right-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-drawer-left,
    .hyvui-drawer-right {
      animation: none;
    }
  }
</style>

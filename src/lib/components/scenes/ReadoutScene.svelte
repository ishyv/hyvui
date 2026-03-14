<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import ScanBand from '../ambient/ScanBand.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Optional title rendered as a readout expression label. */
    title?: string;
    /** Additional CSS classes. */
    class?: string;
    /** Top bar area for labels and status indicators. */
    header?: Snippet;
    /** Main content area. */
    children?: Snippet;
    /** Optional right sidebar (fixed width ~260px). */
    sidebar?: Snippet;
  }

  let {
    title = '',
    class: className = '',
    header,
    children,
    sidebar,
  }: Props = $props();
</script>

<section class={cn('hyvui-readout', className)}>
  <div class="hyvui-readout-scan" aria-hidden="true" style:opacity="calc(0.4 * var(--reg-ornament-opacity))">
    <ScanBand />
  </div>
  <div class="hyvui-readout-inner">
    {#if header || title}
      <div class="hyvui-readout-header">
        {#if title}
          <span class="expr-readout">{title}</span>
        {/if}
        {#if header}
          {@render header()}
        {/if}
      </div>
    {/if}
    <div class={cn('hyvui-readout-body', sidebar && 'hyvui-readout-body-sidebar')}>
      <div class="hyvui-readout-main">
        {#if children}{@render children()}{/if}
      </div>
      {#if sidebar}
        <aside class="hyvui-readout-sidebar">
          {@render sidebar()}
        </aside>
      {/if}
    </div>
  </div>
</section>

<style>
  .hyvui-readout {
    position: relative;
    min-height: 100dvh;
    padding: var(--space-scene);
    background-color: var(--bg);
  }

  .hyvui-readout-scan {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hyvui-readout-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: calc(1.5rem * var(--reg-spacing-scale));
    width: 100%;
  }

  .hyvui-readout-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .hyvui-readout-body {
    width: 100%;
  }

  .hyvui-readout-body-sidebar {
    display: grid;
    grid-template-columns: 1fr 260px;
    gap: calc(1.5rem * var(--reg-spacing-scale));
  }

  .hyvui-readout-main {
    min-width: 0;
  }

  .hyvui-readout-sidebar {
    min-width: 0;
  }

  @media (max-width: 768px) {
    .hyvui-readout-body-sidebar {
      grid-template-columns: 1fr;
    }
  }
</style>

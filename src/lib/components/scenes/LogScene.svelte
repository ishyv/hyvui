<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import ScanBand from '../ambient/ScanBand.svelte';
  import GridOverlay from '../ambient/GridOverlay.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Additional CSS classes. */
    class?: string;
    /** Above the log area (system name, StatusDot row). */
    header?: Snippet;
    /** Log content area (TerminalBoot, StatusLine, CodeBlock). */
    children?: Snippet;
    /** Below the log area (status summary, CTA). */
    footer?: Snippet;
  }

  let {
    class: className = '',
    header,
    children,
    footer,
  }: Props = $props();
</script>

<section class={cn('hyvui-log', className)}>
  <div class="hyvui-log-ambient" aria-hidden="true">
    <div style:opacity="0.06">
      <GridOverlay />
    </div>
    <ScanBand />
  </div>
  <div class="hyvui-log-inner">
    {#if header}
      <div class="hyvui-log-header">
        {@render header()}
      </div>
    {/if}
    <div class="hyvui-log-content">
      {#if children}{@render children()}{/if}
    </div>
    {#if footer}
      <div class="hyvui-log-footer">
        {@render footer()}
      </div>
    {/if}
  </div>
</section>

<style>
  .hyvui-log {
    position: relative;
    min-height: 100dvh;
    padding: var(--space-scene);
    background-color: var(--bg);
  }

  .hyvui-log-ambient {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .hyvui-log-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: calc(1.5rem * var(--reg-spacing-scale));
    width: 100%;
  }

  .hyvui-log-content {
    font-family: var(--font-mono);
    border-left: 2px solid rgba(121, 166, 163, 0.18);
    padding-left: 1.5rem;
  }
</style>

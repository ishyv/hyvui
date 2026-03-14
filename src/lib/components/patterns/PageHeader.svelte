<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Page title. */
    title?: string;
    /** Page subtitle. */
    subtitle?: string;
    /** Additional CSS classes. */
    class?: string;
    /** Breadcrumb slot. */
    breadcrumb?: Snippet;
    /** Actions slot (right-aligned). */
    actions?: Snippet;
  }

  let {
    title = '',
    subtitle = '',
    class: className = '',
    breadcrumb,
    actions,
  }: Props = $props();
</script>

<div class={cn('hyvui-page-header', className)}>
  {#if breadcrumb}
    <div class="hyvui-page-header-breadcrumb">
      {@render breadcrumb()}
    </div>
  {/if}
  <div class="hyvui-page-header-row">
    <div class="hyvui-page-header-text">
      <h1 class="hyvui-page-header-title">{title}</h1>
      {#if subtitle}
        <p class="hyvui-page-header-subtitle">{subtitle}</p>
      {/if}
    </div>
    {#if actions}
      <div class="hyvui-page-header-actions">
        {@render actions()}
      </div>
    {/if}
  </div>
</div>

<style>
  .hyvui-page-header {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--line);
  }

  .hyvui-page-header-breadcrumb {
    min-width: 0;
  }

  .hyvui-page-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-xl);
  }

  .hyvui-page-header-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    min-width: 0;
  }

  .hyvui-page-header-title {
    font-family: var(--font-body);
    font-size: clamp(2rem, 4vw, 3.25rem);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -0.05em;
    color: var(--text);
    margin: 0;
    text-wrap: balance;
  }

  .hyvui-page-header-subtitle {
    font-family: var(--font-body);
    font-size: 1.04rem;
    color: var(--muted);
    line-height: 1.62;
    margin: 0;
    max-width: 32rem;
    text-wrap: pretty;
  }

  .hyvui-page-header-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--space-sm);
    flex-shrink: 0;
  }

  @media (max-width: 720px) {
    .hyvui-page-header-row {
      flex-direction: column;
    }

    .hyvui-page-header-actions {
      justify-content: flex-start;
    }
  }
</style>

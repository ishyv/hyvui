<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';
  import { echo as echoAction } from '../../system/actions/echo.js';

  interface Props {
    /** Button visual style. */
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    /** Button size. */
    size?: 'sm' | 'md';
    /** Disables the button. */
    disabled?: boolean;
    /** Shows a pending status indicator instead of the label. */
    loading?: boolean;
    /** Enables the click echo ripple. */
    echo?: boolean;
    /** Additional CSS classes. */
    class?: string;
    /** Button type attribute. */
    type?: 'button' | 'submit' | 'reset';
    /** Optional href to render an anchor instead of a button. */
    href?: string;
    /** Anchor target. */
    target?: string;
    /** Anchor rel. */
    rel?: string;
    /** Click handler. */
    onclick?: (e: MouseEvent) => void;
    /** Button label content. */
    children?: Snippet;
  }

  let {
    variant = 'secondary',
    size = 'md',
    disabled = false,
    loading = false,
    echo = false,
    class: className = '',
    type = 'button',
    href,
    target,
    rel,
    onclick,
    children,
  }: Props = $props();

  function activeEcho(node: HTMLElement) {
    if (!echo) return {};
    return echoAction(node);
  }

  function handleAnchorClick(e: MouseEvent) {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }

    onclick?.(e);
  }
</script>

{#if href}
  <a
    {href}
    {target}
    {rel}
    use:activeEcho
    class={cn(
      'hyvui-btn',
      `hyvui-btn-${variant}`,
      `hyvui-btn-${size}`,
      loading && 'hyvui-btn-loading',
      disabled && 'hyvui-btn-disabled',
      className
    )}
    aria-disabled={disabled || loading}
    tabindex={disabled || loading ? -1 : undefined}
    onclick={handleAnchorClick}
  >
    {#if loading}
      <span class="hyvui-btn-dot" aria-label="loading"></span>
    {:else if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button
    {type}
    use:activeEcho
    class={cn(
      'hyvui-btn',
      `hyvui-btn-${variant}`,
      `hyvui-btn-${size}`,
      loading && 'hyvui-btn-loading',
      className
    )}
    disabled={disabled || loading}
    {onclick}
  >
    {#if loading}
      <span class="hyvui-btn-dot" aria-label="loading"></span>
    {:else if children}
      {@render children()}
    {/if}
  </button>
{/if}

<style>
  .hyvui-btn {
    position: relative;
    overflow: clip;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    border: 1px solid var(--line);
    border-radius: var(--radius-md);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--control-gap);
    transition:
      color var(--transition-smooth),
      border-color var(--transition-smooth),
      background var(--transition-smooth),
      transform var(--transition-smooth),
      box-shadow var(--transition-smooth);
    white-space: nowrap;
    text-decoration: none;
    line-height: 1;
    max-width: 100%;
    box-shadow: var(--surface-stroke);
  }

  .hyvui-btn:disabled,
  .hyvui-btn-disabled {
    opacity: 0.46;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none;
  }

  .hyvui-btn-md {
    min-height: var(--control-height-md);
    padding: 0.75rem 1.15rem;
  }

  .hyvui-btn-sm {
    min-height: var(--control-height-sm);
    padding: 0.5rem 0.8rem;
    font-size: 0.68rem;
  }

  /* primary */
  .hyvui-btn-primary {
    background:
      linear-gradient(180deg, color-mix(in srgb, var(--accent-strong) 22%, transparent), transparent 70%),
      linear-gradient(135deg, var(--accent), var(--accent-strong));
    color: var(--bg);
    border-color: color-mix(in srgb, var(--accent-strong) 45%, var(--accent));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      0 14px 26px rgba(199, 156, 87, 0.16);
  }

  .hyvui-btn-primary:hover:not(:disabled):not(.hyvui-btn-disabled) {
    transform: translateY(-2px);
    filter: brightness(1.03);
  }

  /* secondary */
  .hyvui-btn-secondary {
    background:
      linear-gradient(180deg, rgba(121, 166, 163, 0.06), transparent 62%),
      rgba(10, 12, 14, 0.74);
    color: var(--text-soft);
    border-color: var(--line-strong);
  }

  .hyvui-btn-secondary:hover:not(:disabled):not(.hyvui-btn-disabled) {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--accent) 46%, var(--line-strong));
    color: var(--text);
  }

  /* ghost */
  .hyvui-btn-ghost {
    background: transparent;
    color: var(--muted);
    border-color: transparent;
    box-shadow: none;
  }

  .hyvui-btn-ghost:hover:not(:disabled):not(.hyvui-btn-disabled) {
    background: linear-gradient(90deg, rgba(199, 156, 87, 0.12), transparent 78%);
    color: var(--text);
    transform: translateX(2px);
  }

  /* destructive */
  .hyvui-btn-destructive {
    background: rgba(10, 12, 14, 0.74);
    color: var(--text-soft);
    border-color: rgba(182, 106, 72, 0.34);
  }

  .hyvui-btn-destructive:hover:not(:disabled):not(.hyvui-btn-disabled) {
    background-color: rgba(182, 106, 72, 0.1);
    transform: translateY(-2px);
  }

  /* loading dot */
  .hyvui-btn-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--status-pend);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-btn {
      transition: none;
    }

    .hyvui-btn:hover:not(:disabled):not(.hyvui-btn-disabled) {
      transform: none;
    }

    .hyvui-btn-dot {
      animation: none;
    }
  }
</style>

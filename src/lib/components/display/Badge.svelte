<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';

  interface Props {
    /** Badge color variant. */
    variant?: 'default' | 'accent' | 'signal' | 'ok' | 'warn' | 'fail';
    /** Additional CSS classes. */
    class?: string;
    /** Badge text. */
    children?: Snippet;
  }

  let {
    variant = 'default',
    class: className = '',
    children,
  }: Props = $props();

  const colorMap: Record<string, string> = {
    default: 'var(--muted)',
    accent: 'var(--accent)',
    signal: 'var(--signal)',
    ok: 'var(--status-ok)',
    warn: 'var(--status-warn)',
    fail: 'var(--status-fail)',
  };

  const bgMap: Record<string, string> = {
    default: 'rgba(167, 157, 139, 0.08)',
    accent: 'rgba(199, 156, 87, 0.08)',
    signal: 'rgba(121, 166, 163, 0.08)',
    ok: 'rgba(121, 166, 163, 0.08)',
    warn: 'rgba(199, 156, 87, 0.08)',
    fail: 'rgba(182, 106, 72, 0.08)',
  };
</script>

<span
  class={cn('hyvui-badge', className)}
  style:color={colorMap[variant]}
  style:background-color={bgMap[variant]}
  style:border-color={colorMap[variant]}
>
  {#if children}{@render children()}{/if}
</span>

<style>
  .hyvui-badge {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    line-height: 1;
    padding: 0.25rem 0.5rem;
    border: 1px solid;
    border-color: currentColor;
    opacity: 0.8;
  }
</style>

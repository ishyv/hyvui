<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import type { Snippet } from 'svelte';
  import type { Expression } from './text.js';

  interface Props {
    /** HTML tag to render. */
    as?: string;
    /** Typographic style variant. */
    variant?: 'heading' | 'body' | 'caption' | 'italic';
    /** Text color token. */
    color?: 'primary' | 'soft' | 'muted' | 'muted-strong' | 'accent' | 'signal';
    /** Compositional intent expression. Applied alongside the variant. */
    expression?: Expression;
    /** Additional CSS classes. */
    class?: string;
    /** Text content. */
    children?: Snippet;
  }

  let {
    as = 'p',
    variant = 'body',
    color = variant === 'heading' ? 'primary' : 'soft',
    expression,
    class: className = '',
    children,
  }: Props = $props();

  const colorMap: Record<string, string> = {
    primary: 'var(--text)',
    soft: 'var(--text-soft)',
    muted: 'var(--muted)',
    'muted-strong': 'var(--muted-strong)',
    accent: 'var(--accent)',
    signal: 'var(--signal)',
  };

  const variantClass = $derived(
    cn(
      variant === 'heading' && 'hyvui-text-heading',
      variant === 'body' && 'hyvui-text-body',
      variant === 'caption' && 'hyvui-text-caption',
      variant === 'italic' && 'hyvui-text-italic',
      expression && `expr-${expression}`,
      className
    )
  );
</script>

<svelte:element this={as} class={variantClass} style:color={colorMap[color]}>
  {#if children}{@render children()}{/if}
</svelte:element>

<style>
  .hyvui-text-heading,
  .hyvui-text-body,
  .hyvui-text-caption,
  .hyvui-text-italic {
    margin: 0;
  }

  .hyvui-text-heading {
    font-family: var(--font-body);
    font-size: clamp(1.75rem, 4vw, 3.25rem);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -0.045em;
    text-wrap: balance;
  }

  .hyvui-text-body {
    font-family: var(--font-body);
    font-size: 1.03rem;
    font-weight: 400;
    line-height: 1.62;
    max-width: 32rem;
    text-wrap: pretty;
  }

  .hyvui-text-caption {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    line-height: 1.2;
  }

  .hyvui-text-italic {
    font-family: var(--font-body);
    font-size: 1.02rem;
    font-style: italic;
    font-weight: 400;
    line-height: 1.64;
    text-wrap: pretty;
  }
</style>

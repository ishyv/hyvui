<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import type { Expression } from './text.js';

	/**
	 * @example
	 * <Text variant="heading" as="h1">signal acquired</Text>
	 * <Text variant="body" color="muted">supporting prose here.</Text>
	 * <Text expression="title-card" as="h1">deep signal</Text>
	 * <Text expression="readout">sys.uptime: 99.9%</Text>
	 */
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
		children
	}: Props = $props();

	const colorMap: Record<string, string> = {
		primary: 'var(--text)',
		soft: 'var(--text-soft)',
		muted: 'var(--muted)',
		'muted-strong': 'var(--muted-strong)',
		accent: 'var(--accent)',
		signal: 'var(--signal)'
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
		font-size: var(--text-3xl);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: -0.045em;
		text-wrap: balance;
	}

	.hyvui-text-body {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 400;
		line-height: 1.62;
		max-width: 32rem;
		text-wrap: pretty;
	}

	.hyvui-text-caption {
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1.2;
	}

	.hyvui-text-italic {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-style: italic;
		font-weight: 400;
		line-height: 1.64;
		text-wrap: pretty;
	}

	/* ── hextech: `command` expression gets cyan underline glow ───────── */
	:global([data-theme='hextech']) .expr-command {
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--htx-cyan-glow) 45%, transparent);
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
	}

	/* ── arcane: `command` expression gets violet text-shadow shimmer ─── */
	:global([data-theme='arcane']) .expr-command {
		text-shadow: 0 0 12px color-mix(in srgb, var(--arc-magenta) 55%, transparent);
		animation: text-shimmer 3s var(--orn-pulse-rhythm, ease-in-out) infinite;
	}

	@keyframes text-shimmer {
		0%, 100% { text-shadow: 0 0 12px color-mix(in srgb, var(--arc-magenta) 55%, transparent); }
		50%       { text-shadow: 0 0 20px color-mix(in srgb, var(--arc-shimmer) 70%, transparent), 0 0 8px color-mix(in srgb, var(--arc-magenta) 35%, transparent); }
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='arcane']) .expr-command {
			animation: none;
		}
	}
</style>


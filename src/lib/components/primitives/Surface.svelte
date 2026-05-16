<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * @see surface — add `use:surface` for an entrance animation on mount.
	 * @example
	 * <Surface variant="card">card content</Surface>
	 * <Surface variant="panel" withInset>panel with teal inset border</Surface>
	 * <Surface variant="base" as="section">base container</Surface>
	 */
	interface Props {
		/** Surface visual style. */
		variant?: 'base' | 'card' | 'panel';
		/** HTML tag to render. */
		as?: string;
		/** Adds a pseudoelement teal inset border on panel variant. */
		withInset?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Surface content. */
		children?: Snippet;
	}

	let {
		variant = 'base',
		as = 'div',
		withInset = false,
		class: className = '',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class={cn(
		'hyvui-surface',
		variant === 'card' && 'hyvui-surface-card',
		variant === 'panel' && 'hyvui-surface-panel',
		variant === 'base' && 'hyvui-surface-base',
		withInset && 'hyvui-surface-inset',
		className
	)}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-surface {
		position: relative;
		overflow: clip;
		border-radius: var(--radius-md);
		isolation: isolate;
		max-inline-size: 100%;
		min-width: 0;
	}

	.hyvui-surface::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.04), transparent 20%),
			linear-gradient(90deg, rgba(121, 166, 163, 0.03), transparent 30%);
		opacity: 0.8;
	}

	.hyvui-surface-base {
		background: var(--surface-soft);
		border: 1px solid var(--line);
		box-shadow: var(--surface-stroke);
	}

	.hyvui-surface-card {
		background: var(--surface-card);
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: var(--surface-stroke), var(--shadow-card);
	}

	.hyvui-surface-panel {
		background: var(--surface-panel);
		border: 1px solid var(--line);
		box-shadow: var(--surface-stroke), var(--shadow-veil);
	}

	.hyvui-surface-inset::after {
		content: '';
		position: absolute;
		inset: 0.9rem;
		border: 1px solid rgba(121, 166, 163, 0.14);
		pointer-events: none;
	}

	/* ── hextech ornament ─────────────────────────────────────────────── */
	:global([data-register='hextech']) .hyvui-surface {
		border-radius: var(--radius-sm);
	}

	:global([data-register='hextech']) .hyvui-surface-card {
		border-color: rgba(184, 115, 51, 0.2);
		box-shadow:
			var(--surface-stroke),
			var(--shadow-card),
			inset 0 0 0 1px rgba(93, 217, 240, 0.04);
	}

	:global([data-register='hextech']) .hyvui-surface-panel {
		border-color: rgba(93, 217, 240, 0.18);
	}

	/* ── arcane ornament ──────────────────────────────────────────────── */
	:global([data-register='arcane']) .hyvui-surface-card {
		border-color: rgba(184, 69, 201, 0.18);
	}

	/* violet radial leak at top-left corner — nth-child rotates it per card */
	:global([data-register='arcane']) .hyvui-surface-card::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 0% 0%,
			rgba(184, 69, 201, 0.14) 0%,
			transparent 50%
		);
		pointer-events: none;
	}

	/* rotate leak position per nth-child so cards in a grid each look unique */
	:global([data-register='arcane']) .hyvui-surface-card:nth-child(2n)::after {
		background: radial-gradient(
			circle at 100% 0%,
			rgba(233, 76, 188, 0.12) 0%,
			transparent 50%
		);
	}

	:global([data-register='arcane']) .hyvui-surface-card:nth-child(3n)::after {
		background: radial-gradient(
			circle at 100% 100%,
			rgba(184, 69, 201, 0.1) 0%,
			transparent 50%
		);
	}

	:global([data-register='arcane']) .hyvui-surface-panel {
		border-color: rgba(184, 69, 201, 0.22);
		box-shadow:
			var(--surface-stroke),
			var(--shadow-veil),
			0 0 40px rgba(184, 69, 201, 0.06);
	}
</style>

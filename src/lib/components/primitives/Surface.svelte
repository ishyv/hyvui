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
			linear-gradient(180deg, color-mix(in srgb, var(--text) 4%, transparent), transparent 20%),
			linear-gradient(90deg, color-mix(in srgb, var(--signal) 3%, transparent), transparent 30%);
		opacity: 0.8;
	}

	.hyvui-surface-base {
		background: var(--surface-soft);
		border: 1px solid var(--line);
		box-shadow: var(--surface-stroke);
	}

	.hyvui-surface-card {
		background: var(--surface-card);
		border: 1px solid color-mix(in srgb, var(--text) 5%, transparent);
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
		inset: var(--control-pad-x);
		border: 1px solid color-mix(in srgb, var(--signal) 14%, transparent);
		pointer-events: none;
	}

	/* ── hextech ornament ─────────────────────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-surface-card {
		border-color: color-mix(in srgb, var(--htx-brass) 20%, transparent);
		box-shadow:
			var(--surface-stroke),
			var(--shadow-card),
			inset 0 0 0 1px color-mix(in srgb, var(--htx-cyan-glow) 4%, transparent);
	}

	:global([data-theme='hextech']) .hyvui-surface-panel {
		border-color: color-mix(in srgb, var(--htx-cyan-glow) 18%, transparent);
	}

	/* ── arcane ornament ──────────────────────────────────────────────── */
	:global([data-theme='arcane']) .hyvui-surface-card {
		border-color: color-mix(in srgb, var(--arc-magenta) 18%, transparent);
	}

	/* violet radial leak at top-left corner — nth-child rotates it per card */
	:global([data-theme='arcane']) .hyvui-surface-card::after {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(
			circle at 0% 0%,
			color-mix(in srgb, var(--arc-magenta) 14%, transparent) 0%,
			transparent 50%
		);
		pointer-events: none;
	}

	/* rotate leak position per nth-child so cards in a grid each look unique */
	:global([data-theme='arcane']) .hyvui-surface-card:nth-child(2n)::after {
		background: radial-gradient(
			circle at 100% 0%,
			color-mix(in srgb, var(--arc-shimmer) 12%, transparent) 0%,
			transparent 50%
		);
	}

	:global([data-theme='arcane']) .hyvui-surface-card:nth-child(3n)::after {
		background: radial-gradient(
			circle at 100% 100%,
			color-mix(in srgb, var(--arc-magenta) 10%, transparent) 0%,
			transparent 50%
		);
	}

	:global([data-theme='arcane']) .hyvui-surface-panel {
		border-color: color-mix(in srgb, var(--arc-magenta) 22%, transparent);
		box-shadow:
			var(--surface-stroke),
			var(--shadow-veil),
			0 0 40px color-mix(in srgb, var(--arc-magenta) 6%, transparent);
	}
</style>


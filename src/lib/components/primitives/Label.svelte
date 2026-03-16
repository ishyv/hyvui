<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * @example
	 * <Label>version 2.0</Label>
	 * <Label color="accent">active</Label>
	 * <Label color="signal" as="div">system ready</Label>
	 */
	interface Props {
		/** HTML tag to render. */
		as?: string;
		/** Label color token. */
		color?: 'muted' | 'accent' | 'signal';
		/** Additional CSS classes. */
		class?: string;
		/** Label text content. */
		children?: Snippet;
	}

	let { as = 'span', color = 'muted', class: className = '', children }: Props = $props();

	const colorMap: Record<string, string> = {
		muted: 'var(--muted-strong)',
		accent: 'var(--accent)',
		signal: 'var(--signal)'
	};
</script>

<svelte:element this={as} class={cn('hyvui-label', className)} style:color={colorMap[color]}>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		line-height: 1.2;
		white-space: nowrap;
	}
</style>

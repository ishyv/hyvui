<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * @example
	 * <Blockquote>the signal arrives before the message.</Blockquote>
	 */
	interface Props {
		/** Additional CSS classes. */
		class?: string;
		/** Quote content. */
		children?: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<blockquote class={cn('hyvui-blockquote', className)}>
	{#if children}{@render children()}{/if}
</blockquote>

<style>
	.hyvui-blockquote {
		font-family: var(--font-body);
		font-style: italic;
		font-weight: 400;
		color: var(--text-soft);
		line-height: 1.6;
		margin: 0;
		padding: var(--space-md) var(--space-lg);
		border-left: 2px solid var(--line-strong);
		background: linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent 60%);
	}
</style>

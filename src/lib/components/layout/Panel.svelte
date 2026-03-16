<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Adds a pseudoelement teal inset border. */
		withInset?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Panel header slot. */
		header?: Snippet;
		/** Panel body content. */
		children?: Snippet;
	}

	let { withInset = false, class: className = '', header, children }: Props = $props();
</script>

<Surface variant="panel" {withInset} class={cn('hyvui-panel', className)}>
	{#if header}
		<div class="hyvui-panel-header">
			{@render header()}
		</div>
	{/if}
	{#if children}
		<div class="hyvui-panel-body">
			{@render children()}
		</div>
	{/if}
</Surface>

<style>
	:global(.hyvui-panel) {
		padding: var(--space-card);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.hyvui-panel-header {
		padding-bottom: var(--space-md);
		border-bottom: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
	}

	.hyvui-panel-body {
		min-width: 0;
	}
</style>

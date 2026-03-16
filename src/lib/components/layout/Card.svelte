<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';

	/**
	 * @see surface — add `use:surface` on Card for an entrance animation on mount.
	 * @see reveal — add `use:reveal={{ target: '.meta' }}` on the Card for hover-reveal of child elements.
	 * @example
	 * <Card>
	 *   {#snippet header()}<Label>project alpha</Label>{/snippet}
	 *   <Text>card body content here.</Text>
	 *   {#snippet footer()}<Button variant="ghost" size="sm">view details</Button>{/snippet}
	 * </Card>
	 * <Card staggerOffset="1.2rem">offset card in a grid</Card>
	 */
	interface Props {
		/** TranslateY offset for staggered card grids. */
		staggerOffset?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Card header slot. */
		header?: Snippet;
		/** Card body content. */
		children?: Snippet;
		/** Card footer slot. */
		footer?: Snippet;
	}

	let { staggerOffset = '', class: className = '', header, children, footer }: Props = $props();

	const style = $derived(staggerOffset ? `transform: translateY(${staggerOffset})` : '');
</script>

<div class={cn('hyvui-card-wrap', className)} {style}>
	<Surface variant="card" class="hyvui-card-inner">
		{#if header}
			<div class="hyvui-card-header">
				{@render header()}
			</div>
		{/if}
		{#if children}
			<div class="hyvui-card-body">
				{@render children()}
			</div>
		{/if}
		{#if footer}
			<div class="hyvui-card-footer">
				{@render footer()}
			</div>
		{/if}
	</Surface>
</div>

<style>
	.hyvui-card-wrap {
		display: block;
	}

	:global(.hyvui-card-inner) {
		padding: var(--space-card);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.hyvui-card-header {
		padding-bottom: var(--space-sm);
		border-bottom: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
	}

	.hyvui-card-body {
		flex: 1;
		min-width: 0;
	}

	.hyvui-card-footer {
		padding-top: var(--space-sm);
		border-top: 1px solid color-mix(in srgb, var(--line) 92%, transparent);
	}
</style>

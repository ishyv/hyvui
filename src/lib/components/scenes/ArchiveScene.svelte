<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Grid from '../layout/Grid.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Optional scene title. */
		title?: string;
		/** Minimum card width used for responsive auto layout. */
		minCardWidth?: string;
		/** Maximum number of columns (auto layout). */
		maxCols?: number;
		/** Gap between items. */
		gap?: string;
		/** Deprecated alias for maxCols. */
		cols?: number;
		/** Additional CSS classes. */
		class?: string;
		/** Filter controls area above the grid. */
		filter?: Snippet;
		/** Grid items (Cards, images, etc.). */
		children?: Snippet;
	}

	let {
		title = '',
		minCardWidth = '18rem',
		maxCols,
		gap = 'var(--space-inline)',
		cols,
		class: className = '',
		filter,
		children
	}: Props = $props();

	const effectiveMaxCols = $derived(maxCols ?? cols ?? 3);
</script>

<section class={cn('hyvui-archive', className)}>
	<div class="hyvui-archive-inner">
		{#if title || filter}
			<div class="hyvui-archive-top">
				{#if title}
					<h2 class="hyvui-archive-title">{title}</h2>
				{/if}
				{#if filter}
					<div class="hyvui-archive-filter">
						{@render filter()}
					</div>
				{/if}
			</div>
		{/if}
		<Grid maxCols={effectiveMaxCols} minColWidth={minCardWidth} {gap} class="hyvui-archive-grid">
			{#if children}{@render children()}{/if}
		</Grid>
	</div>
</section>

<style>
	.hyvui-archive {
		position: relative;
		min-height: 100dvh;
		padding: var(--space-scene);
	}

	.hyvui-archive-inner {
		display: flex;
		flex-direction: column;
		gap: calc(1.5rem * var(--reg-spacing-scale));
	}

	.hyvui-archive-top {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
	}

	.hyvui-archive-title {
		font-family: var(--font-body);
		font-size: 1.4rem;
		font-weight: 400;
		line-height: var(--reg-heading-lh);
		letter-spacing: var(--reg-heading-tracking);
		color: var(--text);
		margin: 0;
	}

	.hyvui-archive-filter {
		flex-shrink: 0;
	}
</style>

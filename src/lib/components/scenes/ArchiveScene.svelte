<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Grid from '../layout/Grid.svelte';
	import type { Snippet } from 'svelte';

	/**
	 * @remarks Use for galleries, catalogs, index pages. Responsive card grid with optional filter controls.
	 * @example
	 * <ArchiveScene title="all projects" minCardWidth="22rem">
	 *   {#snippet filter()}<SearchBar bind:value={query} />{/snippet}
	 *   {#each filtered as item}
	 *     <Card><Text variant="heading">{item.name}</Text></Card>
	 *   {/each}
	 * </ArchiveScene>
	 */
	interface Props {
		/** Optional scene title. */
		title?: string;
		/** Minimum card width used for responsive auto layout. */
		minCardWidth?: string;
		/** Gap between items. */
		gap?: string;
		/** Optional explicit grid template for authored asymmetry or caps. */
		template?: string;
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
		gap = 'var(--space-inline)',
		template,
		class: className = '',
		filter,
		children
	}: Props = $props();

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
		<Grid
			mode={template ? 'template' : 'auto'}
			cols={template ?? 1}
			minColWidth={minCardWidth}
			{gap}
			class="hyvui-archive-grid"
		>
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
		gap: var(--space-md);
	}

	.hyvui-archive-title {
		font-family: var(--reg-font-primary);
		font-size: var(--text-lg);
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

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import type { LayoutAttributes } from '../../system/dom.js';

	/**
	 * @example
	 * <Grid minColWidth="18rem">
	 *   {#each items as item}<Card>{item.name}</Card>{/each}
	 * </Grid>
	 * <Grid mode="template" cols="1fr 2fr">
	 *   <aside>sidebar</aside>
	 *   <main>content</main>
	 * </Grid>
	 */
	interface Props extends LayoutAttributes {
		/** Grid mode. `auto` computes columns from container width. */
		mode?: 'auto' | 'template';
		/** CSS grid-template-columns value (used when mode = 'template'). */
		cols?: string | number;
		/** Minimum column width (used when mode = 'auto'). */
		minColWidth?: string;
		/** Gap between grid items. */
		gap?: string;
		/** HTML tag to render. */
		as?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Grid children. */
		children?: Snippet;
	}

	let {
		mode = 'auto',
		cols = 1,
		minColWidth = '16rem',
		gap = 'var(--space-md)',
		as = 'div',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	let gridTemplate = $derived(
		mode === 'template'
			? typeof cols === 'string'
				? cols
				: `repeat(${Math.max(1, cols)}, minmax(0, 1fr))`
			: undefined
	);
</script>

<svelte:element
	this={as}
	{...rest}
	class={cn('hyvui-grid', className)}
	style:--hyv-grid-min-col={mode === 'auto' ? minColWidth : undefined}
	style:--hyv-grid-template={gridTemplate}
	style:gap
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-grid {
		display: grid;
		min-width: 0;
		grid-template-columns: var(
			--hyv-grid-template,
			repeat(auto-fit, minmax(min(var(--hyv-grid-min-col, 16rem), 100%), 1fr))
		);
	}
</style>

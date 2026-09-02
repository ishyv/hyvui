<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import type { LayoutAttributes } from '../../system/dom.js';

	/**
	 * Horizontal flex container that wraps when out of space. Use for chip rows,
	 * tag lists, inline action groups, breadcrumb-style nav. Gap defaults to
	 * --space-sm; items keep their intrinsic size and wrap onto new lines.
	 *
	 * @example
	 * <Cluster gap="var(--space-xs)">
	 *   <Badge>signal</Badge>
	 *   <Badge>archive</Badge>
	 *   <Badge>hextech</Badge>
	 * </Cluster>
	 */
	interface Props extends LayoutAttributes {
		gap?: string;
		align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
		justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
		as?: string;
		class?: string;
		children?: Snippet;
	}

	const alignMap = {
		start: 'flex-start',
		center: 'center',
		end: 'flex-end',
		baseline: 'baseline',
		stretch: 'stretch'
	};
	const justifyMap = {
		start: 'flex-start',
		center: 'center',
		end: 'flex-end',
		between: 'space-between',
		around: 'space-around',
		evenly: 'space-evenly'
	};

	let {
		gap = 'var(--space-sm)',
		align = 'center',
		justify = 'start',
		as = 'div',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={cn('hyvui-cluster', className)}
	style:gap
	style:align-items={alignMap[align]}
	style:justify-content={justifyMap[justify]}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-cluster {
		display: flex;
		flex-wrap: wrap;
		min-width: 0;
	}
</style>

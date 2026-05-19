<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Intrinsic switcher: lays children in a row when the container is wider than
	 * `threshold`, stacks them into a column when narrower. Switches without
	 * media queries — works inside any container of any width. The calc trick
	 * (Every Layout) makes flex-basis cross from negative-huge to positive-huge
	 * exactly at the threshold, so flex-grow takes over above and full-width
	 * basis below.
	 *
	 * @example
	 * <Switcher threshold="36rem" gap="var(--space-md)">
	 *   <Card>left</Card>
	 *   <Card>right</Card>
	 * </Switcher>
	 */
	interface Props {
		/** Container width at which children flip from row to stacked column. */
		threshold?: string;
		gap?: string;
		as?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		threshold = '40rem',
		gap = 'var(--space-md)',
		as = 'div',
		class: className = '',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class={cn('hyvui-switcher', className)}
	style:gap
	style:--switcher-threshold={threshold}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-switcher {
		display: flex;
		flex-wrap: wrap;
		min-width: 0;
	}
	/* the intrinsic switch — flex-basis flips sign at the threshold */
	.hyvui-switcher > :global(*) {
		flex-grow: 1;
		flex-basis: calc((var(--switcher-threshold) - 100%) * 999);
	}
</style>

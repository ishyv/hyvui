<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import type { LayoutAttributes } from '../../system/dom.js';

	/**
	 * Centers content horizontally within a max width. Unlike Shell, Center has
	 * no implicit padding — use it inside scenes or sections where the page
	 * shell already pads. Defaults to a measure-friendly reading width.
	 *
	 * @example
	 * <Center max="38rem">
	 *   <p>long-form prose stays at a comfortable reading measure</p>
	 * </Center>
	 */
	interface Props extends LayoutAttributes {
		/** Max content width. Defaults to a 38rem reading measure. */
		max?: string;
		/** Also center text content. */
		andText?: boolean;
		as?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		max = '38rem',
		andText = false,
		as = 'div',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={cn('hyvui-center', andText && 'hyvui-center--text', className)}
	style:max-width={max}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-center {
		box-sizing: content-box;
		margin-inline: auto;
	}
	.hyvui-center--text {
		text-align: center;
	}
</style>

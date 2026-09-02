<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import type { LayoutAttributes } from '../../system/dom.js';

	/**
	 * Aspect-ratio container with object-fit children. Use for images, video, or
	 * any media that must hold a shape regardless of intrinsic size. Children
	 * fill the frame and crop to cover unless `fit="contain"` is passed.
	 *
	 * @example
	 * <Frame ratio="16/9">
	 *   <img src="..." alt="" />
	 * </Frame>
	 *
	 * <Frame ratio="1/1" fit="contain">
	 *   <svg viewBox="0 0 100 100">...</svg>
	 * </Frame>
	 */
	interface Props extends LayoutAttributes {
		/** CSS aspect-ratio. E.g. "16/9", "1/1", "3/2". */
		ratio?: string;
		fit?: 'cover' | 'contain';
		as?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		ratio = '16/9',
		fit = 'cover',
		as = 'div',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={as}
	{...rest}
	class={cn('hyvui-frame', className)}
	style:aspect-ratio={ratio}
	style:--frame-fit={fit}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-frame {
		display: block;
		overflow: hidden;
		position: relative;
	}
	.hyvui-frame > :global(*) {
		width: 100%;
		height: 100%;
		object-fit: var(--frame-fit, cover);
	}
	.hyvui-frame > :global(img),
	.hyvui-frame > :global(video) {
		display: block;
	}
</style>

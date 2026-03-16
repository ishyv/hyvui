<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { PerspectivePreset } from '../../system/depth/depth.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Perspective distance preset. */
		perspective?: PerspectivePreset;
		/** CSS percentage for horizontal perspective origin. */
		originX?: string;
		/** CSS percentage for vertical perspective origin. */
		originY?: string;
		/** HTML tag to render. */
		as?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Stage content. */
		children?: Snippet;
	}

	let {
		perspective = 'mid',
		originX = '50%',
		originY = '40%',
		as = 'div',
		class: className = '',
		children
	}: Props = $props();

	const perspectiveMap: Record<PerspectivePreset, string> = {
		near: 'var(--perspective-near)',
		mid: 'var(--perspective-mid)',
		far: 'var(--perspective-far)'
	};
</script>

<svelte:element
	this={as}
	class={cn('hyvui-depth-stage', className)}
	style:perspective={perspectiveMap[perspective]}
	style:perspective-origin="{originX}
	{originY}"
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-depth-stage {
		transform-style: preserve-3d;
		position: relative;
	}

	.hyvui-depth-stage > :global(*) {
		transform-style: preserve-3d;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-depth-stage {
			perspective: none !important;
			transform-style: flat;
		}
	}
</style>

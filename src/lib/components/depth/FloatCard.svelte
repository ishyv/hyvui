<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { tiltTransform } from '../../system/depth/depth.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';

	interface Props {
		/** Maximum tilt angle in degrees. */
		tiltMax?: number;
		/** Z-elevation on hover. */
		elevation?: 'raised' | 'foreground';
		/** Additional CSS classes. */
		class?: string;
		/** Card content. */
		children?: Snippet;
	}

	let { tiltMax = 8, elevation = 'raised', class: className = '', children }: Props = $props();

	let innerEl: HTMLDivElement | undefined = $state();
	let tiltEnabled = $state(false);
	let frame = 0;
	let lastX = 0;
	let lastY = 0;

	const elevationMap: Record<string, string> = {
		raised: 'var(--depth-raised)',
		foreground: 'var(--depth-foreground)'
	};

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
		tiltEnabled = !reduced && finePointer;
	});

	function handlePointerMove(e: PointerEvent) {
		if (!tiltEnabled || !innerEl) return;
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		lastX = (e.clientX - rect.left) / rect.width;
		lastY = (e.clientY - rect.top) / rect.height;

		innerEl.classList.remove('hyvui-float-card-leaving');
		if (frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (!innerEl) return;
			const tilt = tiltTransform(lastX, lastY, tiltMax);
			innerEl.style.transform = `${tilt} translateZ(${elevationMap[elevation]})`;
		});
	}

	function handlePointerLeave() {
		if (!innerEl) return;
		if (frame) cancelAnimationFrame(frame);
		frame = 0;
		innerEl.classList.add('hyvui-float-card-leaving');
		innerEl.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
	}
</script>

<div
	class={cn('hyvui-float-card', className)}
	role="presentation"
	onpointermove={handlePointerMove}
	onpointerleave={handlePointerLeave}
>
	<div
		class="hyvui-float-card-inner hyvui-float-card-leaving"
		bind:this={innerEl}
		style:transform="rotateX(0deg) rotateY(0deg) translateZ(0px)"
	>
		<Surface variant="card" class="hyvui-float-card-surface">
			{#if children}{@render children()}{/if}
		</Surface>
	</div>
</div>

<style>
	.hyvui-float-card {
		perspective: var(--perspective-mid);
		perspective-origin: 50% 50%;
	}

	.hyvui-float-card-inner {
		transform-style: preserve-3d;
		will-change: transform;
	}

	.hyvui-float-card-leaving {
		transition: transform var(--depth-transition);
	}

	:global(.hyvui-float-card-surface) {
		padding: var(--space-card);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-float-card {
			perspective: none;
		}

		.hyvui-float-card-inner {
			transform: none !important;
			transform-style: flat;
		}

		.hyvui-float-card-leaving {
			transition: none;
		}
	}
</style>

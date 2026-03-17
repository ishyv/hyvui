<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import CornerBrackets from '../ambient/CornerBrackets.svelte';
	import DepthStage from '../depth/DepthStage.svelte';
	import DepthLayer from '../depth/DepthLayer.svelte';
	import HorizonGrid from '../depth/HorizonGrid.svelte';
	import type { PerspectivePreset } from '../../system/depth/depth.js';
	import type { Snippet } from 'svelte';

	/**
	 * @remarks Composed spatial stage: HorizonGrid backdrop + DepthStage + CornerBrackets in one component.
	 * The missing entry point into the depth system for showcasing content.
	 * @example
	 * <ShowcaseFrame perspective="mid" animated>
	 *   {#snippet label()}<span>artifact / 001</span>{/snippet}
	 *   <FloatCard>your content</FloatCard>
	 * </ShowcaseFrame>
	 */
	interface Props {
		/** Perspective distance preset. */
		perspective?: PerspectivePreset;
		/** Animate the HorizonGrid lines. */
		animated?: boolean;
		/** Label rendered in readout style at the bottom-left. */
		label?: Snippet;
		/** Minimum height of the frame. */
		minHeight?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Content rendered at raised depth level. */
		children?: Snippet;
	}

	let {
		perspective = 'mid',
		animated = false,
		label,
		minHeight = '28rem',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class={cn('hyvui-showcase-frame', className)} style:min-height={minHeight}>
	<HorizonGrid class="hyvui-showcase-frame-grid" {animated} vanishY={0.36} rows={14} cols={10} />

	<div class="hyvui-showcase-frame-brackets" aria-hidden="true" style:opacity="var(--reg-ornament-opacity)">
		<CornerBrackets size={18} />
	</div>

	<DepthStage {perspective} class="hyvui-showcase-frame-stage">
		<DepthLayer level="raised" class="hyvui-showcase-frame-layer">
			{#if children}{@render children()}{/if}
		</DepthLayer>
	</DepthStage>

	{#if label}
		<div class="hyvui-showcase-frame-label" aria-hidden="true">
			{@render label()}
		</div>
	{/if}
</div>

<style>
	.hyvui-showcase-frame {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--line);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.hyvui-showcase-frame-grid) {
		position: absolute;
		inset: 0;
	}

	.hyvui-showcase-frame-brackets {
		position: absolute;
		inset: 1rem;
		pointer-events: none;
	}

	:global(.hyvui-showcase-frame-stage) {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.hyvui-showcase-frame-layer) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hyvui-showcase-frame-label {
		position: absolute;
		bottom: calc(0.75rem * var(--reg-spacing-scale, 1));
		left: calc(0.9rem * var(--reg-spacing-scale, 1));
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--muted);
		line-height: 1.6;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.hyvui-showcase-frame-grid canvas) {
			display: none;
		}
	}
</style>

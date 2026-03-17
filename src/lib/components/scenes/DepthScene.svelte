<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import DepthStage from '../depth/DepthStage.svelte';
	import DepthLayer from '../depth/DepthLayer.svelte';
	import type { PerspectivePreset } from '../../system/depth/depth.js';
	import type { Snippet } from 'svelte';

	/**
	 * @remarks Full-page scene where depth is the primary design language.
	 * Unlike StageScene (flat, centered), DepthScene is spatial from edge to edge.
	 * @example
	 * <DepthScene perspective="far">
	 *   {#snippet ambient()}<GridOverlay /><Vignette />{/snippet}
	 *   {#snippet ground()}<HorizonGrid animated rows={20} />{/snippet}
	 *   {#snippet stage()}
	 *     <FloatCard tiltMax={5}>
	 *       <Text expression="title-card" as="h1">deep signal</Text>
	 *     </FloatCard>
	 *   {/snippet}
	 *   {#snippet foreground()}
	 *     <Label color="muted">system / v4</Label>
	 *   {/snippet}
	 * </DepthScene>
	 */
	interface Props {
		/** Perspective depth preset. */
		perspective?: PerspectivePreset;
		/** Background decorations: GridOverlay, ScanBand, Vignette. */
		ambient?: Snippet;
		/** Ground plane — HorizonGrid belongs here. */
		ground?: Snippet;
		/** Main content at mid-depth. */
		stage?: Snippet;
		/** Foreground labels and overlays closest to viewer. Pointer-events none. */
		foreground?: Snippet;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		perspective = 'far',
		ambient,
		ground,
		stage,
		foreground,
		class: className = ''
	}: Props = $props();
</script>

<section class={cn('hyvui-depth-scene', className)}>
	<DepthStage {perspective} as="div" class="hyvui-depth-scene-stage">
		{#if ambient}
			<div class="hyvui-depth-scene-ambient" aria-hidden="true">
				{@render ambient()}
			</div>
		{/if}

		{#if ground}
			<DepthLayer level="ground" class="hyvui-depth-scene-ground">
				<div aria-hidden="true" style="display:contents">
					{@render ground()}
				</div>
			</DepthLayer>
		{/if}

		{#if stage}
			<DepthLayer level="raised" class="hyvui-depth-scene-content">
				{@render stage()}
			</DepthLayer>
		{/if}

		{#if foreground}
			<DepthLayer level="foreground" class="hyvui-depth-scene-foreground">
				{@render foreground()}
			</DepthLayer>
		{/if}
	</DepthStage>
</section>

<style>
	.hyvui-depth-scene {
		position: relative;
		min-height: 100dvh;
		overflow: hidden;
	}

	:global(.hyvui-depth-scene-stage) {
		position: relative;
		width: 100%;
		min-height: 100dvh;
	}

	.hyvui-depth-scene-ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	:global(.hyvui-depth-scene-ground) {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	:global(.hyvui-depth-scene-content) {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100dvh;
		padding: var(--space-scene);
	}

	:global(.hyvui-depth-scene-foreground) {
		position: absolute;
		inset: var(--space-lg, 1.5rem);
		pointer-events: none;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-depth-scene {
			overflow: visible;
		}
	}
</style>

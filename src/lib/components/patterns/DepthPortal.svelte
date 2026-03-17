<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import CornerBrackets from '../ambient/CornerBrackets.svelte';
	import ScanBand from '../ambient/ScanBand.svelte';
	import DepthStage from '../depth/DepthStage.svelte';
	import DepthLayer from '../depth/DepthLayer.svelte';
	import HorizonGrid from '../depth/HorizonGrid.svelte';
	import type { Snippet } from 'svelte';

	/**
	 * @remarks A framed spatial window — a card alternative where content lives in depth, not on a surface.
	 * Use in place of Card when you want content to feel embedded in space.
	 * @example
	 * <DepthPortal label="sensor array / 004" active={scanning}>
	 *   <Text variant="heading">deep signal</Text>
	 * </DepthPortal>
	 */
	interface Props {
		/** Readout label at bottom-left. */
		label?: string;
		/** When true, a ScanBand sweeps through to signal activity. */
		active?: boolean;
		/** CSS aspect-ratio value. */
		aspect?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Content rendered at foreground depth level. */
		children?: Snippet;
	}

	let {
		label,
		active = false,
		aspect = '4/3',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class={cn('hyvui-depth-portal', className)} style:aspect-ratio={aspect}>
	<HorizonGrid class="hyvui-depth-portal-grid" animated={false} vanishY={0.42} rows={10} cols={8} />

	<div class="hyvui-depth-portal-brackets" aria-hidden="true" style:opacity="var(--reg-ornament-opacity)">
		<CornerBrackets size={14} />
	</div>

	<div class="hyvui-depth-portal-scan" aria-hidden="true" class:hyvui-depth-portal-scan--active={active}>
		<ScanBand axis="y" size="12%" duration="2.8s" />
	</div>

	<DepthStage perspective="near" class="hyvui-depth-portal-stage">
		<DepthLayer level="foreground" class="hyvui-depth-portal-layer">
			{#if children}{@render children()}{/if}
		</DepthLayer>
	</DepthStage>

	{#if label}
		<div class="hyvui-depth-portal-label" aria-hidden="true">{label}</div>
	{/if}
</div>

<style>
	.hyvui-depth-portal {
		position: relative;
		overflow: hidden;
		border: 1px solid var(--line);
	}

	:global(.hyvui-depth-portal-grid) {
		position: absolute;
		inset: 0;
	}

	.hyvui-depth-portal-brackets {
		position: absolute;
		inset: 0.75rem;
		pointer-events: none;
	}

	.hyvui-depth-portal-scan {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s var(--ease-fast);
	}

	.hyvui-depth-portal-scan--active {
		opacity: 1;
	}

	:global(.hyvui-depth-portal-stage) {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.hyvui-depth-portal-layer) {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hyvui-depth-portal-label {
		position: absolute;
		bottom: 0.65rem;
		left: 0.8rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--muted);
		line-height: 1.6;
		pointer-events: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-depth-portal-scan {
			display: none;
		}
	}
</style>

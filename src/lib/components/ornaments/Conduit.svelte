<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import TravelingParticle from '../../system/motion/TravelingParticle.svelte';

	/**
	 * Multi-point connector path. Pass either an SVG `path` d-string or a list
	 * of `points` (auto-converted to a polyline). Optional traveling particles
	 * flow along the path. Theme overlays tint and texture the line.
	 *
	 * @example
	 * <Conduit points={[{x:10,y:10},{x:50,y:30},{x:90,y:10}]} flow="forward" />
	 * <Conduit path="M 10 10 Q 50 80, 90 10" particles={false} />
	 */
	interface Props {
		path?: string;
		points?: { x: number; y: number }[];
		viewBox?: string;
		flow?: 'forward' | 'back' | 'both' | 'none';
		particles?: boolean;
		speed?: number;
		class?: string;
	}

	let {
		path,
		points,
		viewBox = '0 0 100 100',
		flow = 'forward',
		particles = true,
		speed = 3.5,
		class: className = ''
	}: Props = $props();

	const d = $derived(
		path ??
			(points && points.length > 0
				? `M ${points[0].x} ${points[0].y} ` +
					points
						.slice(1)
						.map((p) => `L ${p.x} ${p.y}`)
						.join(' ')
				: 'M 0 0 L 100 100')
	);
</script>

<svg class={cn('hyvui-conduit', className)} {viewBox} aria-hidden="true">
	<path class="hyvui-conduit-line" {d} fill="none" stroke="currentColor" stroke-width="1" />
	{#if particles && flow !== 'none'}
		<g class="hyvui-conduit-flow">
			{#if flow === 'forward' || flow === 'both'}
				<TravelingParticle path={d} {speed} />
			{/if}
			{#if flow === 'back' || flow === 'both'}
				<TravelingParticle path={d} {speed} reverse />
			{/if}
		</g>
	{/if}
</svg>

<style>
	.hyvui-conduit {
		display: block;
		width: 100%;
		height: 100%;
		pointer-events: none;
		color: var(--accent);
		overflow: visible;
	}
	.hyvui-conduit-line {
		opacity: 0.5;
	}
	.hyvui-conduit-flow {
		fill: currentColor;
	}

	:global([data-theme='hextech']) .hyvui-conduit {
		color: var(--htx-cyan-glow, var(--signal));
	}
	:global([data-theme='hextech']) .hyvui-conduit-line {
		stroke-dasharray: 4 2;
		opacity: 0.7;
	}

	:global([data-theme='arcane']) .hyvui-conduit {
		color: var(--arc-magenta, var(--accent));
	}
	:global([data-theme='arcane']) .hyvui-conduit-line {
		stroke-width: 1.4;
		filter: drop-shadow(0 0 3px color-mix(in srgb, var(--arc-magenta, var(--accent)) 50%, transparent));
	}
</style>

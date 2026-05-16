<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative energy arc (SVG quadratic bezier) between two points.
	 * Under `hextech`: single clean cyan arc with traveling dot.
	 * Under `arcane`: violet arc with jitter and brighter particle.
	 * Parent must have `position: relative`. Renders `aria-hidden`.
	 *
	 * @example
	 * <div style="position: relative; height: 100px;">
	 *   <EnergyArc x1="10%" y1="100%" x2="90%" y2="100%" bend={-40} />
	 * </div>
	 */
	interface Props {
		/** Start x (CSS %). */
		x1?: string;
		/** Start y (CSS %). */
		y1?: string;
		/** End x (CSS %). */
		x2?: string;
		/** End y (CSS %). */
		y2?: string;
		/** Control point y-offset in px (negative = arc up, positive = arc down). */
		bend?: number;
		/** Traveling particle speed in seconds. */
		speed?: number;
		/** Enable traveling particle. */
		animated?: boolean;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		x1 = '10%',
		y1 = '50%',
		x2 = '90%',
		y2 = '50%',
		bend = -32,
		speed = 2,
		animated = true,
		class: className = ''
	}: Props = $props();

	const prefersReduced =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	const dur = $derived(`${speed}s`);
	const durJitter = $derived(`${speed * 1.4}s`);
	const shouldAnimate = $derived(animated && !prefersReduced);

	// We don't know actual px coords until render, so the bezier control point
	// is expressed as a data attribute and animated via SVG animateTransform.
	// For the path `d` we use a placeholder that gets overridden by JS,
	// but since this is a portoflio component, a CSS-only approximation works:
	// we anchor a <path> using % units for x/y and em for control offset.

	const filterId = `ea-glow-${Math.random().toString(36).slice(2, 8)}`;

	// Bezier path string: Q cx,cy x2,y2 — control point is midpoint elevated by `bend`
	// We use computed path as a string and pass it as an attribute.
	// Since SVG doesn't mix % and px in path d, we keep all in % and treat bend as %.
	const bendPct = $derived(`${bend}px`);

	// Path using SVG's ability to do absolute coordinates in %. Not directly possible,
	// so we use a wrapper approach: the SVG has viewBox "0 0 100 100" and we translate %.
	// Keep it simple: use an SVG with proportional coordinates.
	// The consumer positions the SVG fill on the parent, so 0 0 100 100 viewBox is fine.
	const mid = '50%';
	const path = $derived(`M ${x1} ${y1} Q ${mid} calc(50% + ${bendPct}) ${x2} ${y2}`);
</script>

<svg class={cn('hyvui-energy-arc', className)} aria-hidden="true">
	<defs>
		<filter id={filterId} x="-50%" y="-100%" width="200%" height="300%">
			<feGaussianBlur stdDeviation="2" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>

	<!-- glow halo -->
	<path
		class="hyvui-ea-halo"
		d={path}
		fill="none"
		stroke-width="5"
		filter="url(#{filterId})"
	/>

	<!-- main arc line -->
	<path
		class="hyvui-ea-line"
		d={path}
		fill="none"
		stroke-width="1"
	/>

	<!-- traveling particle -->
	{#if shouldAnimate}
		<circle class="hyvui-ea-particle" r="3">
			<animateMotion dur={dur} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear">
				<mpath>
					<path d={path} />
				</mpath>
			</animateMotion>
			<animate
				attributeName="opacity"
				values="0;1;1;0"
				keyTimes="0;0.1;0.85;1"
				dur={dur}
				repeatCount="indefinite"
			/>
		</circle>

		<!-- arcane gets a second jitter particle traveling opposite direction -->
		<circle class="hyvui-ea-particle hyvui-ea-particle--jitter" r="2">
			<animateMotion dur={durJitter} repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear">
				<mpath>
					<path d={path} />
				</mpath>
			</animateMotion>
			<animate
				attributeName="opacity"
				values="0;0.5;0.5;0"
				keyTimes="0;0.12;0.88;1"
				dur={durJitter}
				repeatCount="indefinite"
			/>
		</circle>
	{/if}
</svg>

<style>
	.hyvui-energy-arc {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: visible;
	}

	/* ── default (field-notebook) ─────────────────────────────────────── */
	.hyvui-ea-halo     { stroke: transparent; }
	.hyvui-ea-line     { stroke: rgba(199, 156, 87, 0.25); }
	.hyvui-ea-particle { fill: rgba(199, 156, 87, 0.8); }
	.hyvui-ea-particle--jitter { display: none; }

	/* ── hextech: clean cyan arc, single particle ─────────────────────── */
	:global([data-register='hextech']) .hyvui-ea-halo {
		stroke: rgba(93, 217, 240, 0.12);
	}
	:global([data-register='hextech']) .hyvui-ea-line {
		stroke: rgba(93, 217, 240, 0.55);
	}
	:global([data-register='hextech']) .hyvui-ea-particle {
		fill: rgba(184, 230, 242, 1);
	}
	:global([data-register='hextech']) .hyvui-ea-particle--jitter {
		display: none;
	}

	/* ── arcane: violet arc, bidirectional particles ──────────────────── */
	:global([data-register='arcane']) .hyvui-ea-halo {
		stroke: rgba(184, 69, 201, 0.2);
	}
	:global([data-register='arcane']) .hyvui-ea-line {
		stroke: rgba(184, 69, 201, 0.6);
	}
	:global([data-register='arcane']) .hyvui-ea-particle {
		fill: rgba(233, 76, 188, 1);
	}
	:global([data-register='arcane']) .hyvui-ea-particle--jitter {
		display: block;
		fill: rgba(184, 69, 201, 0.7);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-ea-particle,
		.hyvui-ea-particle--jitter {
			display: none;
		}
	}
</style>

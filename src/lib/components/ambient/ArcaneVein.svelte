<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative glowing crack / energy conduit rendered as SVG.
	 * Parent must have `position: relative`. Renders `aria-hidden`.
	 *
	 * Under `hextech`: precise etched control line, traveling cyan dot.
	 * Under `arcane`: pulsing violet crack, traveling particle + glow.
	 *
	 * @example
	 * <div style="position: relative; height: 200px;">
	 *   <ArcaneVein x1="10%" y1="0%" x2="90%" y2="100%" />
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
		/** Duration of traveling particle. */
		speed?: number;
		/** Enable traveling particle animation. */
		animated?: boolean;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		x1 = '0%',
		y1 = '0%',
		x2 = '100%',
		y2 = '100%',
		speed = 3,
		animated = true,
		class: className = ''
	}: Props = $props();

	const prefersReduced =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	const dur = $derived(`${speed}s`);
	const shouldAnimate = $derived(animated && !prefersReduced);

	// Unique filter ID to avoid SVG filter collision when multiple veins are on a page.
	const filterId = `av-glow-${Math.random().toString(36).slice(2, 8)}`;
</script>

<svg class={cn('hyvui-arcane-vein', className)} aria-hidden="true">
	<defs>
		<filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
			<feGaussianBlur stdDeviation="2.5" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>

	<!-- glow halo (arcane only, separate pass) -->
	<line
		class="hyvui-av-halo"
		{x1} {y1} {x2} {y2}
		stroke-width="4"
		filter="url(#{filterId})"
	/>

	<!-- main vein line -->
	<line
		class="hyvui-av-line"
		{x1} {y1} {x2} {y2}
		stroke-width="1"
	/>

	<!-- traveling particle -->
	{#if shouldAnimate}
		<circle class="hyvui-av-particle" r="2.5">
			<animateMotion
				dur={dur}
				repeatCount="indefinite"
				keyPoints="0;1"
				keyTimes="0;1"
				calcMode="linear"
			>
				<mpath>
					<line {x1} {y1} {x2} {y2} />
				</mpath>
			</animateMotion>
			<animate
				attributeName="opacity"
				values="0;0.9;0.9;0"
				keyTimes="0;0.08;0.88;1"
				dur={dur}
				repeatCount="indefinite"
			/>
		</circle>
	{/if}
</svg>

<style>
	.hyvui-arcane-vein {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: visible;
	}

	/* ── default (field-notebook) ─────────────────────────────────────── */
	.hyvui-av-halo   { stroke: transparent; }
	.hyvui-av-line   { stroke: rgba(199, 156, 87, 0.22); }
	.hyvui-av-particle { fill: rgba(199, 156, 87, 0.7); }

	/* ── hextech: etched control line, cyan particle ──────────────────── */
	:global([data-register='hextech']) .hyvui-av-halo {
		stroke: rgba(93, 217, 240, 0.08);
	}
	:global([data-register='hextech']) .hyvui-av-line {
		stroke: rgba(93, 217, 240, 0.4);
		stroke-dasharray: 6 3;
	}
	:global([data-register='hextech']) .hyvui-av-particle {
		fill: rgba(184, 230, 242, 0.95);
	}

	/* ── arcane: glowing crack, violet bleed particle ─────────────────── */
	:global([data-register='arcane']) .hyvui-av-halo {
		stroke: rgba(184, 69, 201, 0.28);
	}
	:global([data-register='arcane']) .hyvui-av-line {
		stroke: rgba(184, 69, 201, 0.7);
		stroke-dasharray: none;
	}
	:global([data-register='arcane']) .hyvui-av-particle {
		fill: rgba(233, 76, 188, 1);
		r: 3.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-av-particle {
			display: none;
		}
	}
</style>

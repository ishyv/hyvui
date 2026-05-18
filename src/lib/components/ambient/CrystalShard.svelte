<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative faceted crystal accent. Adapts per register:
	 * hextech → flat cyan prism; arcane → jagged violet shard with glow.
	 * Renders `aria-hidden`.
	 * @example
	 * <CrystalShard size={48} />
	 * <CrystalShard size={32} animated={false} />
	 */
	interface Props {
		/** Bounding size in pixels (width = size, height ~= size * 1.4). */
		size?: number;
		/** Enable breathing pulse. */
		animated?: boolean;
		/** Additional CSS classes. */
		class?: string;
	}

	let { size = 48, animated = true, class: className = '' }: Props = $props();

	const prefersReduced =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	const shouldAnimate = $derived(animated && !prefersReduced);

	// Pointy-top crystal: two overlapping polygons for faceted look.
	// Outer shard — tall diamond with offset peak
	// Inner face — smaller highlight face giving depth
	const w = $derived(size);
	const h = $derived(Math.round(size * 1.4));
	const cx = $derived(Math.round(w / 2));

	// Outer polygon: asymmetric diamond (peak offset left for natural shard look)
	const outerPoints = $derived(
		`${Math.round(cx * 0.7)},2 ${w - 4},${Math.round(h * 0.32)} ${w - 8},${h - 4} ${Math.round(cx * 0.4)},${h - 2} 4,${Math.round(h * 0.72)}`
	);

	// Inner face: smaller, offset for "facet" depth
	const innerPoints = $derived(
		`${Math.round(cx * 0.7)},2 ${w - 4},${Math.round(h * 0.32)} ${Math.round(w * 0.6)},${Math.round(h * 0.55)}`
	);
</script>

<svg
	class={cn(
		'hyvui-crystal-shard',
		shouldAnimate && 'hyvui-crystal-shard--animated',
		className
	)}
	width={w}
	height={h}
	viewBox="0 0 {w} {h}"
	fill="none"
	aria-hidden="true"
>
	<defs>
		<filter id="cs-glow" x="-40%" y="-40%" width="180%" height="180%">
			<feGaussianBlur stdDeviation="3" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>

	<!-- outer shard body -->
	<polygon class="hyvui-cs-body" points={outerPoints} />
	<!-- inner facet face -->
	<polygon class="hyvui-cs-face" points={innerPoints} />
	<!-- edge highlight line -->
	<polyline
		class="hyvui-cs-edge"
		points="{Math.round(cx * 0.7)},2 {w - 4},{Math.round(h * 0.32)}"
	/>
</svg>

<style>
	.hyvui-crystal-shard {
		display: block;
		pointer-events: none;
		overflow: visible;
	}

	/* ── default (field-notebook) ─────────────────────────────────────── */
	.hyvui-cs-body {
		fill: color-mix(in srgb, var(--accent) 6%, transparent);
		stroke: color-mix(in srgb, var(--accent) 30%, transparent);
		stroke-width: 1;
	}
	.hyvui-cs-face {
		fill: color-mix(in srgb, var(--accent) 12%, transparent);
		stroke: none;
	}
	.hyvui-cs-edge {
		stroke: color-mix(in srgb, var(--accent) 50%, transparent);
		stroke-width: 0.75;
	}

	/* ── hextech: flat cyan prism, clean geometry ─────────────────────── */
	:global([data-theme='hextech']) .hyvui-cs-body {
		fill: color-mix(in srgb, var(--htx-cyan-glow) 8%, transparent);
		stroke: color-mix(in srgb, var(--htx-cyan-glow) 55%, transparent);
		stroke-width: 1;
	}
	:global([data-theme='hextech']) .hyvui-cs-face {
		fill: color-mix(in srgb, var(--htx-cyan-glow) 18%, transparent);
	}
	:global([data-theme='hextech']) .hyvui-cs-edge {
		stroke: color-mix(in srgb, var(--htx-cyan-soft) 80%, transparent);
		stroke-width: 1;
	}

	/* ── arcane: violet shard with glow filter ────────────────────────── */
	:global([data-theme='arcane']) .hyvui-cs-body {
		fill: color-mix(in srgb, var(--arc-magenta) 12%, transparent);
		stroke: color-mix(in srgb, var(--arc-magenta) 65%, transparent);
		stroke-width: 1;
		filter: url(#cs-glow);
	}
	:global([data-theme='arcane']) .hyvui-cs-face {
		fill: color-mix(in srgb, var(--arc-shimmer) 22%, transparent);
	}
	:global([data-theme='arcane']) .hyvui-cs-edge {
		stroke: color-mix(in srgb, var(--arc-shimmer) 90%, transparent);
		stroke-width: 1.2;
	}

	/* ── pulse animation ─────────────────────────────────────────────── */
	.hyvui-crystal-shard--animated .hyvui-cs-body {
		animation: cs-breathe var(--orn-shimmer-rate, 4s) var(--orn-pulse-rhythm, ease-in-out) infinite;
	}

	:global([data-theme='arcane']) .hyvui-crystal-shard--animated .hyvui-cs-body {
		animation: cs-breathe var(--orn-shimmer-rate, 2.4s) var(--orn-pulse-rhythm, ease-in-out) infinite;
	}

	@keyframes cs-breathe {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0.55; }
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-crystal-shard--animated .hyvui-cs-body {
			animation: none;
		}
	}
</style>


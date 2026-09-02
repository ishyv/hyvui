<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import TravelingParticle from '../../system/motion/TravelingParticle.svelte';

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
		x1?: string;
		y1?: string;
		x2?: string;
		y2?: string;
		speed?: number;
		animated?: boolean;
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

</script>

<svg class={cn('hyvui-arcane-vein', className)} aria-hidden="true">
	<line class="hyvui-av-halo" {x1} {y1} {x2} {y2} stroke-width="4" />
	<line class="hyvui-av-line" {x1} {y1} {x2} {y2} stroke-width="1" />

	{#if animated}
		<g class="hyvui-av-particle">
			<TravelingParticle {x1} {y1} {x2} {y2} {speed} />
		</g>
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
	.hyvui-av-line   { stroke: color-mix(in srgb, var(--accent) 22%, transparent); }
	.hyvui-av-particle { fill: color-mix(in srgb, var(--accent) 70%, transparent); }

	/* ── hextech: etched control line, cyan particle ──────────────────── */
	:global([data-theme='hextech']) .hyvui-av-halo {
		stroke: color-mix(in srgb, var(--htx-cyan-glow) 8%, transparent);
	}
	:global([data-theme='hextech']) .hyvui-av-line {
		stroke: color-mix(in srgb, var(--htx-cyan-glow) 40%, transparent);
		stroke-dasharray: 6 3;
	}
	:global([data-theme='hextech']) .hyvui-av-particle {
		fill: color-mix(in srgb, var(--htx-cyan-soft) 95%, transparent);
	}

	/* ── arcane: glowing crack, violet bleed particle ─────────────────── */
	:global([data-theme='arcane']) .hyvui-av-halo {
		stroke: color-mix(in srgb, var(--arc-magenta) 28%, transparent);
		filter: drop-shadow(0 0 3px color-mix(in srgb, var(--arc-magenta) 42%, transparent));
	}
	:global([data-theme='arcane']) .hyvui-av-line {
		stroke: color-mix(in srgb, var(--arc-magenta) 70%, transparent);
		stroke-dasharray: none;
	}
	:global([data-theme='arcane']) .hyvui-av-particle {
		fill: color-mix(in srgb, var(--arc-shimmer) 100%, transparent);
		r: 3.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-av-particle {
			display: none;
		}
	}
</style>


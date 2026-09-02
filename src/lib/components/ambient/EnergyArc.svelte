<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { onMount } from 'svelte';
	import {
		onDocumentVisibilityChange,
		onIntersectionChange,
		onReducedMotionChange,
		scheduleGeometry,
		type Cleanup
	} from '../../system/runtime.js';

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

	const dur = $derived(`${speed}s`);
	const durJitter = $derived(`${speed * 1.4}s`);
	let reduced = $state(false);
	let documentVisible = $state(true);
	let viewportVisible = $state(true);
	const shouldAnimate = $derived(animated && !reduced && documentVisible && viewportVisible);
	let svgEl: SVGSVGElement | undefined = $state();
	let svgHeight = $state(100);

	function percentValue(value: string, fallback: number): number {
		const parsed = Number.parseFloat(value);
		return Number.isFinite(parsed) ? parsed : fallback;
	}

	onMount(() => {
		if (!svgEl) return;
		let cancelResize: Cleanup | undefined;
		const cleanups: Cleanup[] = [
			onReducedMotionChange((value) => (reduced = value)),
			onDocumentVisibilityChange((value) => (documentVisible = value)),
			onIntersectionChange(svgEl, (value) => (viewportVisible = value), { threshold: 0 })
		];
		const resizeObserver =
			typeof ResizeObserver === 'undefined'
				? undefined
				: new ResizeObserver(([entry]) => {
						if (!entry) return;
						const height = entry.contentRect.height;
						if (height <= 0) return;
						cancelResize?.();
						cancelResize = scheduleGeometry(() => {
							svgHeight = height;
							cancelResize = undefined;
						});
					});
		resizeObserver?.observe(svgEl);

		return () => {
			cancelResize?.();
			resizeObserver?.disconnect();
			for (const cleanup of cleanups) cleanup();
		};
	});

	// SVG path data only accepts numeric coordinates. Keep the public endpoints
	// as percentages, then normalize them into a proportional viewBox and scale
	// the pixel bend against the measured host height.
	function buildPath(
		startX: string,
		startY: string,
		endX: string,
		endY: string,
		bendPx: number,
		hostHeight: number,
	): string {
		const xStart = percentValue(startX, 10);
		const yStart = percentValue(startY, 50);
		const xEnd = percentValue(endX, 90);
		const yEnd = percentValue(endY, 50);
		const controlX = (xStart + xEnd) / 2;
		const controlY = (yStart + yEnd) / 2 + (bendPx / hostHeight) * 100;
		return `M ${xStart} ${yStart} Q ${controlX} ${controlY} ${xEnd} ${yEnd}`;
	}

	const path = $derived(buildPath(x1, y1, x2, y2, bend, svgHeight));
</script>

<svg
	bind:this={svgEl}
	class={cn('hyvui-energy-arc', className)}
	viewBox="0 0 100 100"
	preserveAspectRatio="none"
	aria-hidden="true"
>
	<!-- glow halo -->
	<path
		class="hyvui-ea-halo"
		d={path}
		fill="none"
		stroke-width="5"
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
	.hyvui-ea-line     { stroke: color-mix(in srgb, var(--accent) 25%, transparent); }
	.hyvui-ea-particle { fill: color-mix(in srgb, var(--accent) 80%, transparent); }
	.hyvui-ea-particle--jitter { display: none; }

	/* ── hextech: clean cyan arc, single particle ─────────────────────── */
	:global([data-theme='hextech']) .hyvui-ea-halo {
		stroke: color-mix(in srgb, var(--htx-cyan-glow) 12%, transparent);
		filter: drop-shadow(0 0 3px color-mix(in srgb, var(--htx-cyan-glow) 30%, transparent));
	}
	:global([data-theme='hextech']) .hyvui-ea-line {
		stroke: color-mix(in srgb, var(--htx-cyan-glow) 55%, transparent);
	}
	:global([data-theme='hextech']) .hyvui-ea-particle {
		fill: color-mix(in srgb, var(--htx-cyan-soft) 100%, transparent);
	}
	:global([data-theme='hextech']) .hyvui-ea-particle--jitter {
		display: none;
	}

	/* ── arcane: violet arc, bidirectional particles ──────────────────── */
	:global([data-theme='arcane']) .hyvui-ea-halo {
		stroke: color-mix(in srgb, var(--arc-magenta) 20%, transparent);
		filter: drop-shadow(0 0 4px color-mix(in srgb, var(--arc-magenta) 42%, transparent));
	}
	:global([data-theme='arcane']) .hyvui-ea-line {
		stroke: color-mix(in srgb, var(--arc-magenta) 60%, transparent);
	}
	:global([data-theme='arcane']) .hyvui-ea-particle {
		fill: color-mix(in srgb, var(--arc-shimmer) 100%, transparent);
	}
	:global([data-theme='arcane']) .hyvui-ea-particle--jitter {
		display: block;
		fill: color-mix(in srgb, var(--arc-magenta) 70%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-ea-particle,
		.hyvui-ea-particle--jitter {
			display: none;
		}
	}
</style>


<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { onAppearanceChange, readAppearanceContext } from '../../system/context.js';
	import {
		createFrameLoop,
		readSemanticColor,
		resizeCanvasBackingStore,
		scheduleGeometry,
		type Cleanup,
		type FrameLoop
	} from '../../system/runtime.js';
	import { tokens } from '../../tokens/tokens.js';

	/**
	 * Particle-smoke ambient effect using a DPR-capped canvas. Theme colors come
	 * from the nearest appearance context. Parent must have `position: relative`.
	 * Renders `aria-hidden`.
	 *
	 * @example
	 * <div style="position: relative;">
	 *   <ShimmerCloud />
	 *   content
	 * </div>
	 */
	interface Props {
		/** Particle count. */
		count?: number;
		/** Additional CSS classes. */
		class?: string;
	}

	let { count = 28, class: className = '' }: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let context: CanvasRenderingContext2D | null = null;
	let logicalW = 0;
	let logicalH = 0;
	let colorA: string = tokens.color.accent;
	let colorB: string = tokens.color.accent;
	let particles: Particle[] = [];
	let loop: FrameLoop | undefined;
	let cancelPendingResize: Cleanup | undefined;
	let lastT = 0;

	type Particle = {
		x: number;
		y: number;
		r: number;
		vx: number;
		vy: number;
		alpha: number;
		alphaDir: number;
		alphaSpeed: number;
	};

	function refreshColors() {
		if (!canvas) return;
		colorA = readSemanticColor(canvas, '--signal', tokens.color.signal);
		colorB = readSemanticColor(canvas, '--accent', tokens.color.accent);
	}

	function isArcane() {
		return canvas ? readAppearanceContext(canvas).theme === 'arcane' : false;
	}

	function spawn(): Particle {
		const fast = isArcane();
		return {
			x: Math.random() * Math.max(logicalW, 400),
			y: Math.random() * Math.max(logicalH, 300),
			r: 1 + Math.random() * (fast ? 3 : 2),
			vx: (Math.random() - 0.5) * (fast ? 0.45 : 0.2),
			vy: -(Math.random() * (fast ? 0.5 : 0.3) + 0.05),
			alpha: Math.random() * 0.3,
			alphaDir: 1,
			alphaSpeed: 0.003 + Math.random() * (fast ? 0.008 : 0.004)
		};
	}

	function resize(width: number, height: number) {
		if (!canvas || !context) return;
		const resolution = resizeCanvasBackingStore(canvas, context, width, height);
		logicalW = resolution.cssWidth;
		logicalH = resolution.cssHeight;
		if (particles.length === 0) particles = Array.from({ length: Math.max(0, count) }, spawn);
	}

	function draw(delta: number) {
		if (!context || !canvas || !logicalW || !logicalH) return;
		const fast = isArcane();
		context.clearRect(0, 0, logicalW, logicalH);

		for (const [index, particle] of particles.entries()) {
			particle.alpha += particle.alphaDir * particle.alphaSpeed * (delta / 16.667);
			if (particle.alpha >= (fast ? 0.38 : 0.22)) particle.alphaDir = -1;
			if (particle.alpha <= 0.02) particle.alphaDir = 1;

			particle.x += particle.vx * (delta / 16.667);
			particle.y += particle.vy * (delta / 16.667);
			if (particle.y < -10) particle.y = logicalH + 10;
			if (particle.x < -10) particle.x = logicalW + 10;
			if (particle.x > logicalW + 10) particle.x = -10;

			context.beginPath();
			context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
			context.fillStyle = index % 2 === 0 ? colorA : colorB;
			context.globalAlpha = particle.alpha;
			context.fill();
		}

		context.globalAlpha = 1;
	}

	onMount(() => {
		if (!canvas) return;
		context = canvas.getContext('2d');
		if (!context) return;

		const canvasRoot = canvas;
		const resizeTarget = canvas.parentElement;
		const resizeObserver = typeof ResizeObserver === 'undefined' || !resizeTarget
			? undefined
			: new ResizeObserver(([entry]) => {
				if (!entry) return;
				cancelPendingResize?.();
				cancelPendingResize = scheduleGeometry(() => resize(entry.contentRect.width, entry.contentRect.height));
			});
		if (resizeObserver && resizeTarget) resizeObserver.observe(resizeTarget);

		refreshColors();
		const unsubscribeAppearance = onAppearanceChange(canvasRoot, () => refreshColors());
		loop = createFrameLoop(canvasRoot, (time) => {
			const delta = lastT ? Math.min(100, time - lastT) : 16.667;
			lastT = time;
			draw(delta);
		}, { enabled: true });

		return () => {
			cancelPendingResize?.();
			resizeObserver?.disconnect();
			unsubscribeAppearance();
			loop?.destroy();
			loop = undefined;
			context = null;
			particles = [];
		};
	});
</script>

<canvas bind:this={canvas} class={cn('hyvui-shimmer-cloud', className)} aria-hidden="true"></canvas>

<style>
	.hyvui-shimmer-cloud {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		opacity: 0.7;
	}

	:global([data-theme='hextech']) .hyvui-shimmer-cloud {
		opacity: 0.55;
	}

	:global([data-theme='arcane']) .hyvui-shimmer-cloud {
		opacity: 0.85;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-shimmer-cloud {
			display: none;
		}
	}
</style>

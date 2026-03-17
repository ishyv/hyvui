<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { onMount } from 'svelte';

	/**
	 * Canvas-drawn perspective grid with gold-to-teal gradient. Typically placed at ground level in a DepthStage.
	 * @example
	 * <DepthStage>
	 *   <DepthLayer level="ground">
	 *     <HorizonGrid rows={16} cols={10} vanishY={0.4} animated />
	 *   </DepthLayer>
	 * </DepthStage>
	 */
	interface Props {
		/** Number of horizontal lines receding toward the vanishing point. */
		rows?: number;
		/** Number of vertical convergence lines. */
		cols?: number;
		/** Normalized Y position of vanishing point (0-1). */
		vanishY?: number;
		/** If true, lines slowly drift toward the viewer. */
		animated?: boolean;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		rows = 16,
		cols = 12,
		vanishY = 0.38,
		animated = false,
		class: className = ''
	}: Props = $props();

	let rootEl: HTMLDivElement | undefined = $state();
	let canvasEl: HTMLCanvasElement | undefined = $state();
	let animFrame = 0;
	let isVisible = $state(true);

	let ctx: CanvasRenderingContext2D | null = null;
	let logicalW = 0;
	let logicalH = 0;
	let offset = 0;
	let lastT = 0;

	const prefersReduced =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	function draw(t: number) {
		if (!ctx) return;
		if (!logicalW || !logicalH) return;

		const w = logicalW;
		const h = logicalH;
		const vpX = w / 2;
		const vpY = h * vanishY;

		ctx.clearRect(0, 0, w, h);

		// horizontal lines receding toward vanishing point
		for (let i = 0; i < rows; i++) {
			const progress = (i + t) / rows;
			if (progress > 1) continue;
			const y = vpY + (h - vpY) * Math.pow(progress, 1.6);
			const nearness = Math.pow(progress, 0.8);

			// color: gold near, teal far
			const r = Math.round(199 * (1 - nearness) + 121 * nearness);
			const g = Math.round(156 * (1 - nearness) + 166 * nearness);
			const b = Math.round(87 * (1 - nearness) + 163 * nearness);
			const alpha = 0.18 * (1 - nearness) + 0.06 * nearness;

			// fade at vanishing point
			const fadeNear = Math.min(1, progress * 4);
			const finalAlpha = alpha * fadeNear;

			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
			ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${finalAlpha})`;
			ctx.lineWidth = 1;
			ctx.stroke();
		}

		// vertical convergence lines
		for (let i = 0; i < cols; i++) {
			const xBottom = (i / (cols - 1)) * w;
			const progress = Math.abs(i / (cols - 1) - 0.5) * 2; // 0 at center, 1 at edges

			// fade at edges
			const edgeFade = 1 - Math.pow(progress, 2) * 0.7;
			const alpha = 0.1 * edgeFade;

			ctx.beginPath();
			ctx.moveTo(vpX, vpY);
			ctx.lineTo(xBottom, h);
			ctx.strokeStyle = `rgba(199, 156, 87, ${alpha})`;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
	}

	function stop() {
		if (animFrame) cancelAnimationFrame(animFrame);
		animFrame = 0;
	}

	function tick(t: number) {
		if (!animated || prefersReduced || document.hidden || !isVisible) {
			stop();
			return;
		}

		const dt = lastT ? t - lastT : 16;
		if (lastT && dt < 32) {
			animFrame = requestAnimationFrame(tick);
			return;
		}
		lastT = t;

		// Drift speed tuned to roughly match the previous "0.003 per frame" feel.
		offset = (offset + dt * 0.00018) % 1;
		draw(offset);
		animFrame = requestAnimationFrame(tick);
	}

	function start() {
		if (animFrame) return;
		lastT = 0;
		animFrame = requestAnimationFrame(tick);
	}

	function syncCanvasSize(width: number, height: number) {
		if (!canvasEl) return;
		if (!ctx) ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		logicalW = width;
		logicalH = height;

		canvasEl.width = Math.max(1, Math.floor(width * dpr));
		canvasEl.height = Math.max(1, Math.floor(height * dpr));
		canvasEl.style.width = `${width}px`;
		canvasEl.style.height = `${height}px`;

		// Reset transform before applying DPR scaling (avoids cumulative scaling).
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		draw(offset);
	}

	onMount(() => {
		if (!rootEl || !canvasEl) return;

		ctx = canvasEl.getContext('2d');

		const ro = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const { width, height } = entry.contentRect;
			syncCanvasSize(width, height);
		});

		ro.observe(rootEl);

		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				isVisible = entry.isIntersecting;
			},
			{ root: null, threshold: 0 }
		);

		io.observe(rootEl);

		function onVisibility() {
			if (document.hidden) stop();
			else if (animated && !prefersReduced && isVisible) start();
		}

		let scrollTimer = 0;
		function onScroll() {
			stop();
			clearTimeout(scrollTimer);
			scrollTimer = window.setTimeout(() => {
				if (animated && !prefersReduced && isVisible && !document.hidden) start();
			}, 150);
		}

		document.addEventListener('visibilitychange', onVisibility);
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('scroll', onScroll);
			clearTimeout(scrollTimer);
			io.disconnect();
			ro.disconnect();
			stop();
		};
	});

	$effect(() => {
		if (!canvasEl) return;
		draw(offset);

		if (
			animated &&
			!prefersReduced &&
			isVisible &&
			typeof document !== 'undefined' &&
			!document.hidden
		) {
			start();
		} else {
			stop();
		}
	});
</script>

<div bind:this={rootEl} class={cn('hyvui-horizon-grid', className)} aria-hidden="true">
	<canvas bind:this={canvasEl}></canvas>
</div>

<style>
	.hyvui-horizon-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.hyvui-horizon-grid canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>

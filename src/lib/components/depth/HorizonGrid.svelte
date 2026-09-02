<script lang="ts">
	import { onMount } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import { onAppearanceChange } from '../../system/context.js';
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
	 * Canvas-drawn perspective grid with semantic accent/signal colors. Typically
	 * placed at ground level in a DepthStage.
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
	let context: CanvasRenderingContext2D | null = null;
	let logicalW = 0;
	let logicalH = 0;
	let offset = 0;
	let lastT = 0;
	let accent: string = tokens.color.accent;
	let signal: string = tokens.color.signal;
	let loop: FrameLoop | undefined;
	let cancelPendingResize: Cleanup | undefined;

	function refreshColors() {
		if (!rootEl) return;
		accent = readSemanticColor(rootEl, '--accent', tokens.color.accent);
		signal = readSemanticColor(rootEl, '--signal', tokens.color.signal);
	}

	function draw(progressOffset: number) {
		if (!context || !logicalW || !logicalH) return;

		const w = logicalW;
		const h = logicalH;
		const vpX = w / 2;
		const vpY = h * Math.min(1, Math.max(0, vanishY));
		const horizontalCount = Math.max(1, rows);
		const verticalCount = Math.max(2, cols);

		context.clearRect(0, 0, w, h);

		for (let i = 0; i < horizontalCount; i += 1) {
			const progress = (i + progressOffset) / horizontalCount;
			if (progress > 1) continue;
			const y = vpY + (h - vpY) * Math.pow(progress, 1.6);
			const nearness = Math.pow(progress, 0.8);
			const alpha = (0.18 * (1 - nearness) + 0.06 * nearness) * Math.min(1, progress * 4);

			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(w, y);
			context.strokeStyle = nearness > 0.55 ? signal : accent;
			context.globalAlpha = alpha;
			context.lineWidth = 1;
			context.stroke();
		}

		for (let i = 0; i < verticalCount; i += 1) {
			const xBottom = (i / (verticalCount - 1)) * w;
			const distanceFromCenter = Math.abs(i / (verticalCount - 1) - 0.5) * 2;
			const alpha = 0.1 * (1 - Math.pow(distanceFromCenter, 2) * 0.7);

			context.beginPath();
			context.moveTo(vpX, vpY);
			context.lineTo(xBottom, h);
			context.strokeStyle = accent;
			context.globalAlpha = alpha;
			context.lineWidth = 1;
			context.stroke();
		}

		context.globalAlpha = 1;
	}

	function resize(width: number, height: number) {
		if (!canvasEl || !context) return;
		const resolution = resizeCanvasBackingStore(
			canvasEl,
			context,
			width,
			height
		);
		logicalW = resolution.cssWidth;
		logicalH = resolution.cssHeight;
		draw(offset);
	}

	onMount(() => {
		if (!rootEl || !canvasEl) return;
		context = canvasEl.getContext('2d');
		if (!context) return;

		refreshColors();
		const root = rootEl;
		const canvas = canvasEl;
		const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(([entry]) => {
			if (!entry) return;
			cancelPendingResize?.();
			cancelPendingResize = scheduleGeometry(() => resize(entry.contentRect.width, entry.contentRect.height));
		});
		resizeObserver?.observe(root);

		const unsubscribeAppearance = onAppearanceChange(root, () => {
			refreshColors();
			draw(offset);
		});

		loop = createFrameLoop(root, (time) => {
			const delta = lastT ? time - lastT : 16;
			lastT = time;
			offset = (offset + delta * 0.00018) % 1;
			draw(offset);
		}, { enabled: animated });

		return () => {
			cancelPendingResize?.();
			resizeObserver?.disconnect();
			unsubscribeAppearance();
			loop?.destroy();
			loop = undefined;
			context = null;
		};
	});

	$effect(() => {
		loop?.setEnabled(animated);
		draw(offset);
	});

	$effect(() => {
		rows;
		cols;
		vanishY;
		draw(offset);
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

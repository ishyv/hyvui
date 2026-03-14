<script lang="ts">
  import { cn } from '../../utils/cn.js';
  import { onMount } from 'svelte';

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
    class: className = '',
  }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let animFrame = 0;
  let offset = $state(0);

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  function draw(canvas: HTMLCanvasElement, t: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
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

  function animate() {
    if (!canvasEl) return;
    if (animated && !prefersReduced) {
      offset = (offset + 0.003) % 1;
    }
    draw(canvasEl, offset);
    if (animated && !prefersReduced) {
      animFrame = requestAnimationFrame(animate);
    }
  }

  onMount(() => {
    if (!canvasEl) return;

    const container = canvasEl.parentElement;
    if (!container) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        canvasEl!.width = width * dpr;
        canvasEl!.height = height * dpr;
        canvasEl!.style.width = `${width}px`;
        canvasEl!.style.height = `${height}px`;
        const ctx = canvasEl!.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        // set logical dimensions for draw
        canvasEl!.dataset.logicalW = String(width);
        canvasEl!.dataset.logicalH = String(height);
        draw(canvasEl!, offset);
      }
    });

    ro.observe(container);

    if (animated && !prefersReduced) {
      animFrame = requestAnimationFrame(animate);
    }

    return () => {
      ro.disconnect();
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  });

  // redraw on offset changes when animated
  $effect(() => {
    if (canvasEl && animated && !prefersReduced) {
      draw(canvasEl, offset);
    }
  });
</script>

<div class={cn('hyvui-horizon-grid', className)} aria-hidden="true">
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

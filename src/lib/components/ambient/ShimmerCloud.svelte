<script lang="ts">
  import { cn } from "../../utils/cn.js";
  import { onMount } from "svelte";

  /**
   * Particle-smoke ambient effect using canvas.
   * Under `data-theme="hextech"`: slow blue-mist dots, precise motion.
   * Under `data-theme="arcane"`: pink/violet shimmer drift, chaotic.
   * Parent must have `position: relative`. Renders `aria-hidden`.
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

  let { count = 28, class: className = "" }: Props = $props();

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  let canvas: HTMLCanvasElement | undefined = $state();
  let rafId: number | undefined;

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

  function getTheme(): string {
    if (typeof document === "undefined") return "";
    return document.body.dataset.theme ?? "";
  }

  function getParticleColor(theme: string): string {
    if (theme === "hextech") return "93, 217, 240";
    if (theme === "arcane") return "184, 69, 201";
    return "199, 156, 87";
  }

  function getParticleColorB(theme: string): string {
    // Second color for arcane (two-color particles add richness)
    if (theme === "arcane") return "233, 76, 188";
    return getParticleColor(theme);
  }

  onMount(() => {
    if (prefersReduced || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      const { width, height } = canvas.parentElement.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    }

    function spawn(): Particle {
      const w = canvas?.width ?? 400;
      const h = canvas?.height ?? 300;
      const theme = getTheme();
      const fast = theme === "arcane";
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 1 + Math.random() * (fast ? 3 : 2),
        vx: (Math.random() - 0.5) * (fast ? 0.45 : 0.2),
        vy: -(Math.random() * (fast ? 0.5 : 0.3) + 0.05),
        alpha: Math.random() * 0.3,
        alphaDir: 1,
        alphaSpeed: 0.003 + Math.random() * (fast ? 0.008 : 0.004),
      };
    }

    resize();
    particles = Array.from({ length: count }, spawn);

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let io_visible = true;
    const io = new IntersectionObserver((entries) => {
      io_visible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(canvas);

    function draw() {
      if (!ctx || !canvas) return;
      const activeCanvas = canvas;
      const theme = getTheme();
      const colorA = getParticleColor(theme);
      const colorB = getParticleColorB(theme);

      ctx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

      if (io_visible) {
        particles.forEach((p, i) => {
          // breathing alpha
          p.alpha += p.alphaDir * p.alphaSpeed;
          if (p.alpha >= (theme === "arcane" ? 0.38 : 0.22)) p.alphaDir = -1;
          if (p.alpha <= 0.02) p.alphaDir = 1;

          // drift
          p.x += p.vx;
          p.y += p.vy;

          // wrap
          if (p.y < -10) p.y = activeCanvas.height + 10;
          if (p.x < -10) p.x = activeCanvas.width + 10;
          if (p.x > activeCanvas.width + 10) p.x = -10;

          const color = i % 2 === 0 ? colorA : colorB;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${p.alpha})`;
          ctx.fill();
        });
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  });
</script>

<canvas
  bind:this={canvas}
  class={cn("hyvui-shimmer-cloud", className)}
  aria-hidden="true"
></canvas>

<style>
  .hyvui-shimmer-cloud {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.7;
  }

  :global([data-theme="hextech"]) .hyvui-shimmer-cloud {
    opacity: 0.55;
  }

  :global([data-theme="arcane"]) .hyvui-shimmer-cloud {
    opacity: 0.85;
  }

  @media (prefers-reduced-motion: reduce) {
    .hyvui-shimmer-cloud {
      display: none;
    }
  }
</style>

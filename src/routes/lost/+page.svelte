<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import {
    GridOverlay,
    Vignette,
    CornerBrackets,
    TerminalBoot,
    StatusDot,
    Label,
    Button,
    tokens,
  } from '$lib/index.js';

  const REVEAL_DELAY = 600;
  const REVEAL_STEP = 700;
  const CONTENT_DELAY = 400;
  const CTA_DELAY = 800;

  interface BootLine {
    status: 'ok' | 'pend' | 'warn' | 'fail';
    message: string;
  }

  interface TrailPoint {
    x: number;
    y: number;
    alpha: number;
  }

  const statusLines: BootLine[] = [
    { status: 'pend', message: 'initializing coordinate lookup' },
    { status: 'ok', message: 'local index verified' },
    { status: 'ok', message: 'route table intact' },
    { status: 'fail', message: 'nothing at that address' },
    { status: 'pend', message: 'logging the coordinates' },
  ];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame = 0;
  let showContent = $state(false);
  let showCta = $state(false);
  let prefersReducedMotion = $state(false);
  let time = $state(0);
  let trail = $state<TrailPoint[]>([]);

  const timers: number[] = [];

  function rgba(hex: string, alpha: number) {
    const value = Number.parseInt(hex.slice(1), 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }

  function handleResize() {
    if (!canvas || !browser) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getCrosshairPosition(width: number, height: number) {
    const cycle = (time % 840) / 840;
    const pauseStart = 0.78;

    if (cycle < pauseStart) {
      const progress = cycle / pauseStart;
      return {
        x: width * (0.12 + progress * 0.76),
        y: height * (0.24 + Math.sin(progress * Math.PI * 1.8) * 0.14),
      };
    }

    const settle = (cycle - pauseStart) / (1 - pauseStart);
    return {
      x: width * (0.88 - settle * 0.38),
      y: height * (0.24 + (0.5 - 0.24) * settle),
    };
  }

  function drawFrame(singleFrame = false) {
    if (!ctx || !canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const position = getCrosshairPosition(width, height);

    time += 1;
    trail = [{ x: position.x, y: position.y, alpha: 0.22 }, ...trail.slice(0, 10)].map((point, index) => ({
      ...point,
      alpha: Math.max(0, 0.22 - index * 0.018),
    }));

    ctx.clearRect(0, 0, width, height);

    const glow = ctx.createRadialGradient(position.x, position.y, 0, position.x, position.y, 90);
    glow.addColorStop(0, rgba(tokens.color.accent, 0.16));
    glow.addColorStop(1, rgba(tokens.color.accent, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    for (const point of trail) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 24, 0, Math.PI * 2);
      ctx.strokeStyle = rgba(tokens.color.accent, point.alpha);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.strokeStyle = rgba(tokens.color.accent, 0.16);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(position.x - 42, position.y);
    ctx.lineTo(position.x + 42, position.y);
    ctx.moveTo(position.x, position.y - 42);
    ctx.lineTo(position.x, position.y + 42);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(position.x, position.y, 18, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(tokens.color.accent, 0.24);
    ctx.stroke();

    const flash = (time % 110) / 110;
    const readoutAlpha = flash < 0.28 ? flash / 0.28 : flash < 0.58 ? 1 - (flash - 0.28) / 0.3 : 0;
    if (readoutAlpha > 0) {
      ctx.font = `11px ${tokens.font.mono}`;
      ctx.fillStyle = rgba(tokens.color.textSoft, readoutAlpha * 0.75);
      ctx.fillText(
        `${Math.round(position.x).toString().padStart(4, '0')}, ${Math.round(position.y).toString().padStart(4, '0')}`,
        position.x + 16,
        position.y - 18
      );
    }

    if (!singleFrame) {
      animationFrame = requestAnimationFrame(() => drawFrame());
    }
  }

  function handleBootComplete() {
    if (prefersReducedMotion) {
      showContent = true;
      showCta = true;
      return;
    }

    timers.push(window.setTimeout(() => { showContent = true; }, CONTENT_DELAY));
    timers.push(window.setTimeout(() => { showCta = true; }, CONTENT_DELAY + CTA_DELAY));
  }

  onMount(() => {
    if (!browser || !canvas) return;

    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctx = canvas.getContext('2d');
    handleResize();
    window.addEventListener('resize', handleResize);

    if (prefersReducedMotion) {
      drawFrame(true);
      handleBootComplete();
      return;
    }

    animationFrame = requestAnimationFrame(() => drawFrame());
  });

  onDestroy(() => {
    if (!browser) return;
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', handleResize);
    for (const timer of timers) window.clearTimeout(timer);
  });
</script>

<svelte:head>
  <title>nothing here · hyvui</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
  <canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
  <GridOverlay />
  <Vignette class="warm-vignette" />

  <div class="content-shell">
    <CornerBrackets color="color-mix(in srgb, var(--accent) 24%, transparent)" />

    <div class="terminal-block">
      <TerminalBoot
        lines={statusLines}
        delay={REVEAL_DELAY}
        interval={REVEAL_STEP}
        instant={prefersReducedMotion}
        showCursor
        class="boot-shell"
        oncomplete={handleBootComplete}
      />
    </div>

    <div class="main-message" class:visible={showContent}>
      <Label class="eyebrow" color="accent">01 / lost</Label>
      <h1 class="heading">nothing here</h1>
      <p class="body-text">something was expected. it is not here.</p>
      <p class="body-text quiet">it may have moved. it may have never been.</p>
    </div>

    <div class="cta-block" class:visible={showCta}>
      <Button variant="ghost" href="/" class="cta-link">[ return to known space ]</Button>
      <div class="status-footer">
        <StatusDot status="fail" size={6} />
        <Label>coordinates archived</Label>
      </div>
    </div>
  </div>
</div>

<style>
  .system-page {
    position: relative;
    min-height: 100dvh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background:
      radial-gradient(circle at top, color-mix(in srgb, var(--accent) 8%, transparent), transparent 26%),
      radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--signal) 6%, transparent), transparent 24%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%, var(--bg) 35%, color-mix(in srgb, var(--bg) 82%, black) 100%);
  }

  .bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  :global(.warm-vignette) {
    background:
      radial-gradient(ellipse at 50% 0%, transparent 58%, color-mix(in srgb, black 42%, transparent)),
      radial-gradient(ellipse at 50% 100%, transparent 56%, color-mix(in srgb, black 58%, transparent));
  }

  .content-shell {
    position: relative;
    z-index: 3;
    max-width: 540px;
    width: 100%;
    padding: clamp(2rem, 5vw, 4rem);
    margin: 0 auto;
  }

  .terminal-block {
    margin-bottom: 2.5rem;
  }

  :global(.boot-shell .hyvui-status-line) {
    font-size: 0.76rem;
    line-height: 1.85;
  }

  .main-message {
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .main-message.visible {
    opacity: 1;
    transform: translateY(0);
  }

  :global(.eyebrow) {
    display: block;
    margin-bottom: 1.15rem;
  }

  .heading {
    margin: 0 0 1.35rem;
    max-width: 11ch;
    font-family: var(--font-body);
    font-size: clamp(2.35rem, 5vw, 3.8rem);
    font-weight: 400;
    line-height: 0.94;
    letter-spacing: -0.05em;
    color: var(--text);
  }

  .body-text {
    margin: 0 0 0.7rem;
    max-width: 30rem;
    font-size: 1.04rem;
    line-height: 1.62;
    color: var(--text-soft);
  }

  .body-text.quiet {
    color: var(--muted);
    font-style: italic;
  }

  .cta-block {
    margin-top: 2.8rem;
    opacity: 0;
    transform: translateY(8px);
    transition:
      opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s,
      transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.15s;
  }

  .cta-block.visible {
    opacity: 1;
    transform: translateY(0);
  }

  :global(.cta-link) {
    padding-inline: 0;
    color: var(--accent);
  }

  .status-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1.35rem;
  }

  @media (prefers-reduced-motion: reduce) {
    .main-message,
    .cta-block {
      transition: none !important;
      transform: none !important;
      opacity: 1 !important;
    }
  }

  @media (max-width: 600px) {
    .content-shell {
      padding: 2rem 1.5rem;
    }

    .heading {
      font-size: clamp(1.9rem, 8vw, 2.9rem);
    }
  }
</style>

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

  interface Ring {
    radius: number;
    span: number;
    speed: number;
    direction: 1 | -1;
    opacity: number;
  }

  const statusLines: BootLine[] = [
    { status: 'pend', message: 'checking your access' },
    { status: 'ok', message: 'network path confirmed' },
    { status: 'ok', message: 'endpoint available' },
    { status: 'warn', message: 'access level too low' },
    { status: 'fail', message: 'this one is restricted' },
  ];

  const rings: Ring[] = [
    { radius: 0.15, span: Math.PI * 1.12, speed: 0.005, direction: 1, opacity: 0.16 },
    { radius: 0.22, span: Math.PI * 1.06, speed: 0.0034, direction: -1, opacity: 0.1 },
    { radius: 0.31, span: Math.PI * 1.18, speed: 0.0026, direction: 1, opacity: 0.07 },
  ];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame = 0;
  let time = $state(0);
  let showContent = $state(false);
  let showCta = $state(false);
  let prefersReducedMotion = $state(false);

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

  function drawFrame(singleFrame = false) {
    if (!ctx || !canvas) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const centerX = width * 0.5;
    const centerY = height * 0.42;

    time += 1;
    ctx.clearRect(0, 0, width, height);

    for (let index = 0; index < rings.length; index += 1) {
      const ring = rings[index];
      const pulse = Math.sin(time * 0.018 + index * 2.1) > 0.97 ? 0.12 : 0;
      const radius = Math.min(width, height) * ring.radius;
      const rotation = time * ring.speed * ring.direction;
      const start = rotation;
      const end = rotation + ring.span;

      ctx.beginPath();
      ctx.lineWidth = index === 0 ? 1.4 : 1;
      ctx.strokeStyle = index === 0
        ? rgba(tokens.color.signal, ring.opacity + pulse)
        : rgba(tokens.color.accent, ring.opacity + pulse * 0.5);
      ctx.arc(centerX, centerY, radius, start, end);
      ctx.stroke();
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
  <title>beyond the perimeter · hyvui</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
  <canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
  <GridOverlay class="teal-grid" />
  <Vignette />

  <div class="content-shell">
    <CornerBrackets color="color-mix(in srgb, var(--signal) 22%, transparent)" />

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
      <Label class="eyebrow" color="signal">02 / forbidden</Label>
      <h1 class="heading">beyond the perimeter</h1>
      <p class="body-text">this space exists. you are not cleared for it.</p>
      <p class="body-text quiet">clearance cannot be granted from here.</p>
    </div>

    <div class="cta-block" class:visible={showCta}>
      <Button variant="ghost" href="/" class="cta-link">[ return to permitted space ]</Button>
      <div class="status-footer">
        <StatusDot status="warn" size={6} />
        <Label>perimeter active</Label>
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
      radial-gradient(circle at top, color-mix(in srgb, var(--signal) 8%, transparent), transparent 24%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%, var(--bg) 36%, color-mix(in srgb, var(--bg) 82%, black) 100%);
  }

  .bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  :global(.teal-grid) {
    background-image:
      linear-gradient(to right, color-mix(in srgb, var(--signal) 12%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in srgb, var(--accent) 8%, transparent) 1px, transparent 1px);
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

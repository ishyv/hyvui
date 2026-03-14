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

  interface Props {
    authHref?: string;
  }

  interface BootLine {
    status: 'ok' | 'pend' | 'warn' | 'fail';
    message: string;
  }

  const { authHref = '/login' }: Props = $props();

  const statusLines: BootLine[] = [
    { status: 'pend', message: 'checking session' },
    { status: 'ok', message: 'endpoint available' },
    { status: 'pend', message: 'no session found' },
    { status: 'warn', message: 'authentication required' },
    { status: 'pend', message: 'waiting for you to sign in' },
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
    const centerY = height * 0.47;
    const cycle = (time % 360) / 360;
    const descend = cycle < 0.5 ? cycle / 0.5 : 1 - (cycle - 0.5) / 0.5;
    const offset = (1 - descend) * height * 0.22;

    time += 1;
    ctx.clearRect(0, 0, width, height);

    const leftX = centerX - 36;
    const rightX = centerX + 36;

    ctx.strokeStyle = rgba(tokens.color.accent, 0.18);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftX, 0 + offset);
    ctx.lineTo(leftX, centerY);
    ctx.moveTo(rightX, 0 + offset * 0.7);
    ctx.lineTo(rightX, centerY);
    ctx.stroke();

    const barOpacity = descend > 0.84 ? (descend - 0.84) / 0.16 : 0;
    if (barOpacity > 0) {
      ctx.beginPath();
      ctx.moveTo(leftX, centerY);
      ctx.lineTo(rightX, centerY);
      ctx.strokeStyle = rgba(tokens.color.accent, 0.22 * barOpacity);
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
  <title>introduce yourself · hyvui</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
  <canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
  <GridOverlay />
  <Vignette />

  <div class="content-shell">
    <CornerBrackets color="color-mix(in srgb, var(--accent) 20%, transparent)" />

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
      <Label class="eyebrow" color="accent">07 / unauthorized</Label>
      <h1 class="heading">introduce yourself</h1>
      <p class="body-text">this space is available. access requires identification.</p>
    </div>

    <div class="cta-block" class:visible={showCta}>
      <div class="cta-row">
        <Button variant="primary" href={authHref}>[ sign in ]</Button>
        <Button variant="ghost" href="/" class="cta-link">[ continue without access ]</Button>
      </div>
      <div class="status-footer">
        <StatusDot status="warn" size={6} />
        <Label>session pending</Label>
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
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%, var(--bg) 35%, color-mix(in srgb, var(--bg) 82%, black) 100%);
  }

  .bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
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
    max-width: 10ch;
    font-family: var(--font-body);
    font-size: clamp(2.35rem, 5vw, 3.8rem);
    font-weight: 400;
    line-height: 0.94;
    letter-spacing: -0.05em;
    color: var(--text);
  }

  .body-text {
    margin: 0;
    max-width: 30rem;
    font-size: 1.04rem;
    line-height: 1.62;
    color: var(--text-soft);
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

  .cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
    align-items: center;
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

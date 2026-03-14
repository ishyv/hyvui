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
    href?: string;
  }

  interface BootLine {
    status: 'ok' | 'pend' | 'warn' | 'fail';
    message: string;
  }

  const { href = '/' }: Props = $props();

  const statusLines: BootLine[] = [
    { status: 'ok', message: 'destination verified' },
    { status: 'ok', message: 'path available' },
    { status: 'pend', message: 'preparing transfer' },
    { status: 'pend', message: 'departing in -' },
  ];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame = 0;
  let time = $state(0);
  let showContent = $state(false);
  let showCta = $state(false);
  let prefersReducedMotion = $state(false);
  let countdown = $state(3);
  let held = $state(false);
  let targetHref = $state('/');

  const timers: number[] = [];
  let countdownTimer = 0;

  $effect(() => {
    targetHref = href;
  });

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

  function getArcPoint(width: number, height: number, progress: number) {
    const start = { x: width * 0.18, y: height * 0.7 };
    const control = { x: width * 0.5, y: height * 0.22 };
    const end = { x: width * 0.82, y: height * 0.42 };
    const inverse = 1 - progress;
    return {
      x: inverse * inverse * start.x + 2 * inverse * progress * control.x + progress * progress * end.x,
      y: inverse * inverse * start.y + 2 * inverse * progress * control.y + progress * progress * end.y,
    };
  }

  function drawFrame(singleFrame = false) {
    if (!ctx || !canvas) return;
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    time += 1;
    ctx.clearRect(0, 0, width, height);

    const cycle = (time % 240) / 240;
    const drawProgress = Math.min(1, cycle / 0.68);
    const fade = cycle > 0.68 ? 1 - (cycle - 0.68) / 0.32 : 1;

    ctx.beginPath();
    for (let step = 0; step <= 42; step += 1) {
      const progress = (step / 42) * drawProgress;
      const point = getArcPoint(width, height, progress);
      if (step === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = rgba(tokens.color.accent, 0.22 * fade);
    ctx.lineWidth = 1.3;
    ctx.stroke();

    const traveler = getArcPoint(width, height, drawProgress);
    const glow = ctx.createRadialGradient(traveler.x, traveler.y, 0, traveler.x, traveler.y, 18);
    glow.addColorStop(0, rgba(tokens.color.accentStrong, 0.36 * fade));
    glow.addColorStop(1, rgba(tokens.color.accentStrong, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(traveler.x - 18, traveler.y - 18, 36, 36);

    ctx.beginPath();
    ctx.arc(traveler.x, traveler.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = rgba(tokens.color.accentStrong, 0.88 * fade);
    ctx.fill();

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

  function startCountdown() {
    countdownTimer = window.setInterval(() => {
      if (held) return;
      if (countdown <= 1) {
        countdown = 0;
        window.clearInterval(countdownTimer);
        window.location.assign(targetHref);
        return;
      }
      countdown -= 1;
    }, 1000);
  }

  function holdRedirect() {
    held = true;
    window.clearInterval(countdownTimer);
  }

  onMount(() => {
    if (!browser || !canvas) return;

    const requested = new URL(window.location.href).searchParams.get('to');
    if (requested) targetHref = requested;

    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctx = canvas.getContext('2d');
    handleResize();
    window.addEventListener('resize', handleResize);

    if (prefersReducedMotion) {
      drawFrame(true);
      handleBootComplete();
    } else {
      animationFrame = requestAnimationFrame(() => drawFrame());
    }

    startCountdown();
  });

  onDestroy(() => {
    if (!browser) return;
    cancelAnimationFrame(animationFrame);
    window.clearInterval(countdownTimer);
    window.removeEventListener('resize', handleResize);
    for (const timer of timers) window.clearTimeout(timer);
  });
</script>

<svelte:head>
  <title>transferring · hyvui</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
  <canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
  <GridOverlay class="faint-grid" />
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
      <Label class="eyebrow" color="accent">04 / redirecting</Label>
      <h1 class="heading">transferring</h1>
      <div class="countdown">{countdown}</div>
      <p class="body-text">the course is set. departure is automatic.</p>
    </div>

    <div class="cta-block" class:visible={showCta}>
      {#if !held && countdown > 0}
        <Button variant="ghost" class="cta-link" onclick={holdRedirect}>[ hold. stay here ]</Button>
      {:else}
        <Button variant="ghost" href={targetHref} class="cta-link">[ now redirecting manually ]</Button>
      {/if}

      <div class="status-footer">
        <StatusDot status="pend" size={6} />
        <Label>{held ? 'departure held' : `departure in ${countdown}s`}</Label>
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
      radial-gradient(circle at top, color-mix(in srgb, var(--accent) 7%, transparent), transparent 24%),
      linear-gradient(180deg, color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%, var(--bg) 36%, color-mix(in srgb, var(--bg) 82%, black) 100%);
  }

  .bg-canvas {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  :global(.faint-grid) {
    opacity: 0.35;
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
    margin: 0;
    font-family: var(--font-body);
    font-size: clamp(2.35rem, 5vw, 3.8rem);
    font-weight: 400;
    line-height: 0.94;
    letter-spacing: -0.05em;
    color: var(--text);
  }

  .countdown {
    margin: 0.8rem 0 1rem;
    font-family: var(--font-mono);
    font-size: clamp(2rem, 10vw, 4.8rem);
    color: var(--muted-strong);
    letter-spacing: -0.08em;
    line-height: 1;
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

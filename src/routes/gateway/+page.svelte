<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import {
    ScanBand,
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

  interface Pulse {
    orbit: number;
    progress: number;
    speed: number;
  }

  const statusLines: BootLine[] = [
    { status: 'ok', message: 'local systems nominal' },
    { status: 'ok', message: 'outbound channel open' },
    { status: 'pend', message: 'contacting upstream relay' },
    { status: 'pend', message: 'relay not responding' },
    { status: 'fail', message: 'upstream unreachable' },
  ];

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null = null;
  let animationFrame = 0;
  let time = $state(0);
  let showContent = $state(false);
  let showCta = $state(false);
  let prefersReducedMotion = $state(false);
  let pulses = $state<Pulse[]>([
    { orbit: 0, progress: 0.14, speed: 0.0019 },
    { orbit: 1, progress: 0.52, speed: 0.0015 },
    { orbit: 2, progress: 0.82, speed: 0.0012 },
  ]);

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
    const centerY = height * 0.48;

    time += 1;
    ctx.clearRect(0, 0, width, height);

    const orbits = [
      { radiusX: width * 0.12, radiusY: height * 0.07, rotation: time * 0.0028, color: rgba(tokens.color.text, 0.08) },
      { radiusX: width * 0.2, radiusY: height * 0.1, rotation: -time * 0.002, color: rgba(tokens.color.accent, 0.14) },
      { radiusX: width * 0.28, radiusY: height * 0.13, rotation: time * 0.0014, color: rgba(tokens.color.signal, 0.14) },
    ];

    for (const orbit of orbits) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(orbit.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit.radiusX, orbit.radiusY, Math.PI * 0.18, 0, Math.PI * 2);
      ctx.strokeStyle = orbit.color;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    }

    const context = ctx;

    pulses = pulses.map((pulse, index) => {
      const updated = { ...pulse, progress: (pulse.progress + pulse.speed) % 1 };
      const orbit = orbits[pulse.orbit];
      const angle = updated.progress * Math.PI * 2;
      const x = centerX + Math.cos(angle) * orbit.radiusX;
      const y = centerY + Math.sin(angle) * orbit.radiusY;

      context.beginPath();
      context.arc(x, y, 2, 0, Math.PI * 2);
      context.fillStyle = rgba(tokens.color.accent, Math.max(0, 0.28 - index * 0.06));
      context.fill();

      return updated;
    });

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
  <title>the relay is silent · hyvui</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
  <canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
  <ScanBand />
  <GridOverlay />
  <Vignette />

  <div class="content-shell">
    <CornerBrackets color="color-mix(in srgb, var(--accent) 22%, transparent)" />

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
      <Label class="eyebrow" color="accent">10 / gateway</Label>
      <h1 class="heading">the relay is silent</h1>
      <p class="body-text">the request left here. it did not reach its destination.</p>
      <p class="body-text quiet">the upstream has not answered. it may be momentary.</p>
    </div>

    <div class="cta-block" class:visible={showCta}>
      <div class="cta-row">
        <Button variant="secondary" onclick={() => window.location.reload()}>[ try the relay again ]</Button>
        <Button variant="ghost" href="/" class="cta-link">[ return to base ]</Button>
      </div>
      <div class="status-footer">
        <StatusDot status="fail" size={6} />
        <Label>upstream silent</Label>
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

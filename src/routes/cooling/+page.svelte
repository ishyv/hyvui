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
		tokens
	} from '$lib/index.js';

	const REVEAL_DELAY = 600;
	const REVEAL_STEP = 700;
	const CONTENT_DELAY = 400;
	const CTA_DELAY = 800;

	interface Props {
		retryAfter?: number;
	}

	interface BootLine {
		status: 'ok' | 'pend' | 'warn' | 'fail';
		message: string;
	}

	const { retryAfter = 60 }: Props = $props();

	const statusLines: BootLine[] = [
		{ status: 'ok', message: 'request received' },
		{ status: 'ok', message: 'processing initiated' },
		{ status: 'warn', message: 'rate threshold reached' },
		{ status: 'fail', message: 'request suspended' },
		{ status: 'pend', message: 'cooling down' }
	];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame = 0;
	let time = $state(0);
	let showContent = $state(false);
	let showCta = $state(false);
	let prefersReducedMotion = $state(false);
	let remaining = $state(0);

	const timers: number[] = [];
	let cooldownTimer = 0;

	$effect(() => {
		remaining = retryAfter;
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

	function drawFrame(singleFrame = false) {
		if (!ctx || !canvas) return;
		const width = canvas.width / (window.devicePixelRatio || 1);
		const height = canvas.height / (window.devicePixelRatio || 1);
		const centerX = width * 0.5;
		const centerY = height * 0.5;
		const radius = Math.min(width, height) * 0.2;

		time += 1;
		ctx.clearRect(0, 0, width, height);

		const cycle = (time % 660) / 660;
		const fill = cycle < 0.28 ? cycle / 0.28 : cycle < 0.64 ? 1 : 1 - (cycle - 0.64) / 0.36;
		const endAngle = Math.PI * 0.88 + fill * Math.PI * 1.5;

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, Math.PI * 0.88, Math.PI * 2.38);
		ctx.strokeStyle = rgba(tokens.color.textSoft, 0.08);
		ctx.lineWidth = 7;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, Math.PI * 0.88, endAngle);
		ctx.lineWidth = 7;
		ctx.strokeStyle =
			fill > 0.9 ? rgba(tokens.color.signal, 0.42) : rgba(tokens.color.accent, 0.36);
		ctx.stroke();

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
		timers.push(
			window.setTimeout(() => {
				showContent = true;
			}, CONTENT_DELAY)
		);
		timers.push(
			window.setTimeout(() => {
				showCta = true;
			}, CONTENT_DELAY + CTA_DELAY)
		);
	}

	function startCooldown() {
		cooldownTimer = window.setInterval(() => {
			if (remaining <= 1) {
				remaining = 0;
				window.clearInterval(cooldownTimer);
				return;
			}
			remaining -= 1;
		}, 1000);
	}

	onMount(() => {
		if (!browser || !canvas) return;
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		ctx = canvas.getContext('2d');
		handleResize();
		window.addEventListener('resize', handleResize);
		startCooldown();

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
		window.clearInterval(cooldownTimer);
		window.removeEventListener('resize', handleResize);
		for (const timer of timers) window.clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>too much at once · hyvui</title>
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
			<Label class="eyebrow" color="accent">08 / cooling</Label>
			<h1 class="heading">too much at once</h1>
			<p class="body-text">
				the channel needs a moment. the request was received but not processed.
			</p>
			<p class="body-text quiet">wait a little. it will accept again.</p>
		</div>

		<div class="cta-block" class:visible={showCta}>
			<Button
				variant="secondary"
				echo={remaining === 0}
				disabled={remaining > 0}
				onclick={() => remaining === 0 && window.location.reload()}
			>
				[ retry ]
			</Button>
			<div class="status-footer">
				<StatusDot status={remaining > 0 ? 'warn' : 'ok'} size={6} />
				<Label>{remaining > 0 ? `cooling down. ${remaining}s remaining` : 'ready to retry'}</Label>
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
			radial-gradient(
				circle at top,
				color-mix(in srgb, var(--accent) 8%, transparent),
				transparent 26%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%,
				var(--bg) 35%,
				color-mix(in srgb, var(--bg) 82%, black) 100%
			);
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

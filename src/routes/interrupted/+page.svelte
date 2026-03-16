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

	interface BootLine {
		status: 'ok' | 'pend' | 'warn' | 'fail';
		message: string;
	}

	const statusLines: BootLine[] = [
		{ status: 'pend', message: 'receiving upstream response' },
		{ status: 'ok', message: 'headers acknowledged' },
		{ status: 'ok', message: 'connection established' },
		{ status: 'fail', message: 'transmission interrupted at source' },
		{ status: 'pend', message: 'holding for retransmission' }
	];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame = 0;
	let time = $state(0);
	let showContent = $state(false);
	let showCta = $state(false);
	let prefersReducedMotion = $state(false);
	let noiseUntil = $state(0);

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
		const midY = height * 0.5;

		time += 1;

		if (time > noiseUntil && Math.sin(time * 0.07) > 0.984) {
			noiseUntil = time + 18 + Math.random() * 10;
		}

		ctx.clearRect(0, 0, width, height);
		ctx.strokeStyle = rgba(tokens.color.accent, 0.08);
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(0, midY);
		ctx.lineTo(width, midY);
		ctx.stroke();

		ctx.beginPath();
		for (let x = 0; x <= width; x += 4) {
			const wave = Math.sin(x * 0.013 + time * 0.028) * 16;
			const noisy =
				time < noiseUntil ? (Math.random() - 0.5) * 54 * Math.sin(x * 0.19 + time * 0.22) : 0;
			const y = midY + wave + noisy;
			if (x === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		}
		ctx.strokeStyle = rgba(tokens.color.accent, time < noiseUntil ? 0.28 : 0.2);
		ctx.lineWidth = 1.4;
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
	<title>signal cut · hyvui</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
	<canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
	<ScanBand />
	<GridOverlay />
	<Vignette class="fail-vignette" />

	<div class="content-shell">
		<CornerBrackets color="color-mix(in srgb, var(--status-fail) 28%, transparent)" />

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
			<Label class="eyebrow" color="accent">03 / interrupted</Label>
			<h1 class="heading">signal cut</h1>
			<p class="body-text">the channel opened. what followed did not arrive.</p>
			<p class="body-text quiet">the source will try again. or it won't.</p>
		</div>

		<div class="cta-block" class:visible={showCta}>
			<div class="cta-row">
				<Button variant="secondary" onclick={() => window.location.reload()}
					>[ try the channel again ]</Button
				>
				<Button variant="ghost" href="/" class="cta-link">[ return to stable ground ]</Button>
			</div>
			<div class="status-footer">
				<StatusDot status="fail" size={6} />
				<Label>holding for retransmission</Label>
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
				color-mix(in srgb, var(--bg) 95%, var(--text) 5%) 0%,
				var(--bg) 34%,
				color-mix(in srgb, var(--bg) 82%, black) 100%
			);
	}

	.bg-canvas {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	:global(.fail-vignette) {
		background:
			radial-gradient(
				ellipse at 50% 0%,
				transparent 58%,
				color-mix(in srgb, black 42%, transparent)
			),
			radial-gradient(
				ellipse at center,
				transparent 56%,
				color-mix(in srgb, var(--status-fail) 10%, transparent)
			);
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

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
		{ status: 'pend', message: 'access paused' },
		{ status: 'ok', message: 'data intact' },
		{ status: 'ok', message: 'maintenance window open' },
		{ status: 'pend', message: 'work in progress' },
		{ status: 'pend', message: 'no eta yet' }
	];

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame = 0;
	let time = $state(0);
	let showContent = $state(false);
	let showCta = $state(false);
	let prefersReducedMotion = $state(false);
	let acknowledged = $state(false);

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
		const spacing = 34;
		const cols = Math.ceil(width / spacing) + 1;
		const rows = Math.ceil(height / spacing) + 1;
		const activeCol = (time * 0.03) % cols;
		const activeRow = rows * (0.35 + (Math.sin(time * 0.008) * 0.5 + 0.5) * 0.3);

		time += 1;
		ctx.clearRect(0, 0, width, height);

		for (let col = 0; col < cols; col += 1) {
			for (let row = 0; row < rows; row += 1) {
				const x = col * spacing;
				const y = row * spacing;
				const cluster = Math.abs(col - activeCol) < 2.4 && Math.abs(row - activeRow) < 1.3;
				const alpha = cluster ? 0.2 : 0.08;
				ctx.beginPath();
				ctx.arc(x, y, cluster ? 1.8 : 1.3, 0, Math.PI * 2);
				ctx.fillStyle = rgba(tokens.color.accent, alpha);
				ctx.fill();
			}
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
	<title>attending to things · hyvui</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
	<canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
	<GridOverlay />
	<Vignette class="warm-vignette" />

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
			<Label class="eyebrow" color="accent">05 / maintenance</Label>
			<h1 class="heading">attending to things</h1>
			<p class="body-text">the system is receiving care. access is suspended.</p>
			<p class="body-text quiet">it will return. check back later.</p>
		</div>

		<div class="cta-block" class:visible={showCta}>
			<Button variant="ghost" echo class="cta-link" onclick={() => (acknowledged = true)}>
				[ understood ]
			</Button>
			{#if acknowledged}
				<p class="confirmation">good. check back later.</p>
			{/if}
			<div class="status-footer">
				<StatusDot status="pend" size={6} />
				<Label>maintenance active</Label>
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
				color-mix(in srgb, var(--accent) 10%, transparent),
				transparent 24%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%,
				var(--bg) 36%,
				color-mix(in srgb, var(--bg) 82%, black) 100%
			);
	}

	.bg-canvas {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	:global(.warm-vignette) {
		background:
			radial-gradient(
				ellipse at 50% 0%,
				color-mix(in srgb, var(--accent) 9%, transparent),
				transparent 36%
			),
			radial-gradient(
				ellipse at 50% 100%,
				transparent 56%,
				color-mix(in srgb, black 56%, transparent)
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

	.confirmation {
		margin: 0.9rem 0 0;
		color: var(--muted);
		font-style: italic;
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

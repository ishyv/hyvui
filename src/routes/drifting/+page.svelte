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

	interface Star {
		x: number;
		y: number;
		z: number;
		opacity: number;
		size: number;
	}

	interface Particle {
		x: number;
		y: number;
		vx: number;
		vy: number;
		life: number;
		maxLife: number;
		size: number;
		hue: 'accent' | 'signal';
	}

	interface BootLine {
		status: 'ok' | 'pend' | 'warn' | 'fail';
		message: string;
	}

	const statusLines: BootLine[] = [
		{ status: 'pend', message: 'resolving signal chain' },
		{ status: 'ok', message: 'local systems nominal' },
		{ status: 'warn', message: 'upstream capacity depleted' },
		{ status: 'fail', message: 'analysis channel closed' },
		{ status: 'pend', message: 'waiting for it to clear' }
	];

	const STAR_COUNT = 220;
	const PARTICLE_COUNT = 35;
	const DRIFT_SPEED = 0.0003;

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame = 0;
	let stars = $state<Star[]>([]);
	let particles = $state<Particle[]>([]);
	let time = $state(0);
	let mouseX = $state(0.5);
	let mouseY = $state(0.5);
	let showContent = $state(false);
	let showCta = $state(false);
	let prefersReducedMotion = $state(false);

	const timers: number[] = [];

	function rgba(hex: string, alpha: number) {
		const normalized = hex.replace('#', '');
		const full =
			normalized.length === 3
				? normalized
						.split('')
						.map((value) => value + value)
						.join('')
				: normalized;
		const value = Number.parseInt(full, 16);
		const r = (value >> 16) & 255;
		const g = (value >> 8) & 255;
		const b = value & 255;
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	function initStars(width: number, height: number) {
		stars = Array.from({ length: STAR_COUNT }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			z: Math.random(),
			opacity: Math.random() * 0.6 + 0.1,
			size: Math.random() * 1.8 + 0.3
		}));
	}

	function spawnParticle(width: number, height: number): Particle {
		const angle = Math.random() * Math.PI * 2;
		const speed = Math.random() * 0.3 + 0.1;
		return {
			x: width * 0.5 + (Math.random() - 0.5) * width * 0.3,
			y: height * 0.5 + (Math.random() - 0.5) * height * 0.3,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			life: 0,
			maxLife: Math.random() * 300 + 200,
			size: Math.random() * 2 + 0.5,
			hue: Math.random() > 0.5 ? 'accent' : 'signal'
		};
	}

	function handleResize() {
		if (!canvas || !browser) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = window.innerWidth * dpr;
		canvas.height = window.innerHeight * dpr;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;
		ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
		initStars(window.innerWidth, window.innerHeight);
	}

	function handleMouseMove(event: MouseEvent) {
		mouseX = event.clientX / window.innerWidth;
		mouseY = event.clientY / window.innerHeight;
	}

	function render() {
		if (!ctx || !canvas) return;

		const width = canvas.width / (window.devicePixelRatio || 1);
		const height = canvas.height / (window.devicePixelRatio || 1);
		time += 1;

		ctx.fillStyle = rgba(tokens.color.bg, 0.12);
		ctx.fillRect(0, 0, width, height);

		const px = (mouseX - 0.5) * 18;
		const py = (mouseY - 0.5) * 12;

		for (const star of stars) {
			star.y += DRIFT_SPEED * (1 + star.z) * 2;
			star.x += DRIFT_SPEED * Math.sin(time * 0.002 + star.z * 10) * 0.5;

			if (star.y > height) {
				star.y = 0;
				star.x = Math.random() * width;
			}

			const twinkle = Math.sin(time * 0.02 + star.z * 100) * 0.3 + 0.7;
			const finalOpacity = star.opacity * twinkle;
			const drawX = star.x + px * star.z;
			const drawY = star.y + py * star.z;

			ctx.beginPath();
			ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
			if (star.z > 0.7) {
				ctx.fillStyle = rgba(tokens.color.accent, finalOpacity);
			} else if (star.z > 0.4) {
				ctx.fillStyle = rgba(tokens.color.signal, finalOpacity * 0.7);
			} else {
				ctx.fillStyle = rgba(tokens.color.text, finalOpacity * 0.5);
			}
			ctx.fill();

			if (star.size > 1.4 && twinkle > 0.85) {
				ctx.beginPath();
				ctx.arc(drawX, drawY, star.size * 3, 0, Math.PI * 2);
				const glow = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size * 3);
				glow.addColorStop(0, rgba(tokens.color.accent, finalOpacity * 0.3));
				glow.addColorStop(1, rgba(tokens.color.accent, 0));
				ctx.fillStyle = glow;
				ctx.fill();
			}
		}

		while (particles.length < PARTICLE_COUNT) {
			particles = [...particles, spawnParticle(width, height)];
		}

		for (let index = particles.length - 1; index >= 0; index -= 1) {
			const particle = particles[index];
			particle.life += 1;

			if (particle.life > particle.maxLife) {
				particles[index] = spawnParticle(width, height);
				particles = [...particles];
				continue;
			}

			particle.x += particle.vx;
			particle.y += particle.vy;

			const lifeRatio = particle.life / particle.maxLife;
			const fade = lifeRatio < 0.1 ? lifeRatio / 0.1 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;
			const alpha = fade * 0.35;

			ctx.beginPath();
			ctx.arc(particle.x + px * 0.3, particle.y + py * 0.3, particle.size, 0, Math.PI * 2);
			ctx.fillStyle =
				particle.hue === 'accent'
					? rgba(tokens.color.accent, alpha)
					: rgba(tokens.color.signal, alpha);
			ctx.fill();
		}

		const nebulaX = width * 0.5 + px * 0.5;
		const nebulaY = height * 0.42 + py * 0.5;
		const pulse = Math.sin(time * 0.008) * 0.15 + 0.85;
		const nebulaRadius = Math.min(width, height) * 0.28 * pulse;
		const nebula = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, nebulaRadius);
		nebula.addColorStop(0, rgba(tokens.color.accent, 0.04 * pulse));
		nebula.addColorStop(0.4, rgba(tokens.color.signal, 0.025 * pulse));
		nebula.addColorStop(1, rgba(tokens.color.accent, 0));
		ctx.fillStyle = nebula;
		ctx.fillRect(0, 0, width, height);

		const ringRadius = Math.min(width, height) * 0.16;
		const ringRotation = time * 0.003;

		ctx.save();
		ctx.translate(nebulaX, nebulaY);
		ctx.rotate(ringRotation);
		ctx.scale(1, 0.35);

		ctx.beginPath();
		ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
		ctx.strokeStyle = rgba(tokens.color.accent, 0.08 * pulse);
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.rotate(-ringRotation * 2.4);
		ctx.scale(1.3, 1.1);
		ctx.beginPath();
		ctx.arc(0, 0, ringRadius * 0.7, 0, Math.PI * 2);
		ctx.strokeStyle = rgba(tokens.color.signal, 0.06 * pulse);
		ctx.lineWidth = 0.7;
		ctx.stroke();

		ctx.restore();

		animationFrame = requestAnimationFrame(render);
	}

	function revealContent() {
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

		if (ctx) {
			ctx.fillStyle = tokens.color.bg;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		animationFrame = requestAnimationFrame(render);
		window.addEventListener('resize', handleResize);
		window.addEventListener('mousemove', handleMouseMove);

		if (prefersReducedMotion) {
			revealContent();
		}
	});

	onDestroy(() => {
		if (!browser) return;

		cancelAnimationFrame(animationFrame);
		window.removeEventListener('resize', handleResize);
		window.removeEventListener('mousemove', handleMouseMove);

		for (const timer of timers) {
			window.clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<title>drifting · hyvui</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page drifting-page">
	<canvas bind:this={canvas} aria-hidden="true" class="bg-canvas"></canvas>
	<ScanBand
		axis="x"
		size="24%"
		duration="6s"
		gradient="linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 12%, transparent), transparent)"
		class="drifting-scan-band"
	/>
	<GridOverlay class="drifting-grid" />
	<Vignette class="drifting-vignette" />

	<div class="content-shell">
		<CornerBrackets
			size={32}
			color="color-mix(in srgb, var(--status-fail) 28%, transparent)"
			class="drifting-corners"
		/>

		<div class="terminal-block">
			<TerminalBoot
				lines={statusLines}
				delay={REVEAL_DELAY}
				interval={REVEAL_STEP}
				instant={prefersReducedMotion}
				showCursor
				tone="line"
				class="drifting-terminal"
				oncomplete={revealContent}
			/>
		</div>

		<div class="main-message" class:visible={showContent}>
			<p class="section-label" aria-hidden="true">00 / drifting</p>
			<h1 class="heading">the signal<br />needs rest.</h1>
			<p class="body-text">
				the analysis engine has reached its quiet threshold. it will return once the channel clears
				on its own.
			</p>
			<p class="body-text quiet">nothing is broken. just still.</p>
		</div>

		<div class="cta-block" class:visible={showCta}>
			<Button variant="ghost" href="/" class="return-link">[ return to input ]</Button>
			<div class="status-footer">
				<StatusDot status="fail" size={6} />
				<Label class="status-label">monitoring for signal recovery</Label>
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
		background: var(--bg);
	}

	.bg-canvas {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	:global(.drifting-scan-band) {
		position: fixed;
		inset: 0;
		z-index: 1;
	}

	:global(.drifting-grid) {
		position: fixed;
		inset: 0;
		z-index: 1;
		opacity: 0.5;
		background-image:
			linear-gradient(
				to right,
				transparent 0,
				transparent calc(100% - 1px),
				color-mix(in srgb, var(--accent) 18%, transparent) calc(100% - 1px)
			),
			linear-gradient(
				to bottom,
				transparent 0,
				transparent calc(100% - 1px),
				color-mix(in srgb, var(--signal) 14%, transparent) calc(100% - 1px)
			);
		mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
		-webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
	}

	:global(.drifting-vignette) {
		z-index: 2;
		background:
			radial-gradient(
				circle at center,
				transparent 30%,
				color-mix(in srgb, black 60%, transparent) 100%
			),
			radial-gradient(
				circle at top,
				color-mix(in srgb, var(--status-fail) 16%, transparent),
				transparent 40%
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

	:global(.drifting-corners) {
		inset: 0;
	}

	:global(.drifting-corners .hyvui-corner) {
		opacity: 0;
		animation: corner-fade-in 1.5s ease-out forwards;
	}

	:global(.drifting-corners .hyvui-corner-tl) {
		animation-delay: 0.3s;
	}
	:global(.drifting-corners .hyvui-corner-tr) {
		animation-delay: 0.5s;
	}
	:global(.drifting-corners .hyvui-corner-bl) {
		animation-delay: 0.7s;
	}
	:global(.drifting-corners .hyvui-corner-br) {
		animation-delay: 0.9s;
	}

	@keyframes corner-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.terminal-block {
		margin-bottom: 2.5rem;
	}

	:global(.drifting-terminal) {
		gap: 0;
	}

	:global(.drifting-terminal .hyvui-status-line) {
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		line-height: 2;
		white-space: nowrap;
		gap: 0.55rem;
	}

	:global(.drifting-terminal .hyvui-status-message) {
		color: inherit;
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

	.section-label {
		margin: 0 0 1.2rem;
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--status-fail);
	}

	.heading {
		margin: 0 0 1.6rem;
		max-width: 10ch;
		font-family: var(--font-body);
		font-size: clamp(2.2rem, 5vw, 3.6rem);
		font-weight: 400;
		line-height: 0.94;
		letter-spacing: -0.04em;
		color: var(--text);
	}

	.body-text {
		margin: 0 0 0.8rem;
		max-width: 30rem;
		font-family: var(--font-body);
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-soft);
	}

	.body-text.quiet {
		margin-top: 0.4rem;
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

	:global(.return-link) {
		justify-content: flex-start;
		padding: 0.6rem 1rem;
		border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent) 10%, transparent),
			transparent 60%
		);
		color: var(--accent);
		font-size: 0.78rem;
		letter-spacing: 0.1em;
	}

	:global(.return-link:hover) {
		border-color: color-mix(in srgb, var(--accent) 40%, transparent);
		background: linear-gradient(
			135deg,
			color-mix(in srgb, var(--accent) 18%, transparent),
			transparent 60%
		);
		color: var(--accent-strong);
	}

	.status-footer {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.4rem;
	}

	:global(.status-label) {
		font-size: 0.62rem;
		letter-spacing: 0.14em;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.drifting-corners .hyvui-corner) {
			animation: none !important;
			opacity: 1 !important;
		}

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
			font-size: clamp(1.8rem, 8vw, 2.8rem);
		}
	}
</style>

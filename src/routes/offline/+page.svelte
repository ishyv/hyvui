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
		Button
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
		{ status: 'pend', message: 'checking network path' },
		{ status: 'pend', message: 'checking alternate path' },
		{ status: 'fail', message: 'no route to host' },
		{ status: 'pend', message: 'listening for reconnection' }
	];

	let showContent = $state(false);
	let showCta = $state(false);
	let prefersReducedMotion = $state(false);

	const timers: number[] = [];

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
		if (!browser) return;
		prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) handleBootComplete();
	});

	onDestroy(() => {
		if (!browser) return;
		for (const timer of timers) window.clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>the channel is quiet · hyvui</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="system-page">
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
			<Label class="eyebrow" color="accent">06 / offline</Label>
			<h1 class="heading">the channel is quiet</h1>
			<p class="body-text">nothing is arriving. the receiver is on.</p>
			<p class="body-text quiet">when the network returns, the signal will too.</p>
		</div>

		<div class="cta-block" class:visible={showCta}>
			<Button variant="secondary" onclick={() => window.location.reload()}>[ try again ]</Button>
			<div class="status-footer">
				<StatusDot status="fail" size={6} pulse={false} />
				<Label>no signal detected</Label>
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
			radial-gradient(
				circle at 20% 20%,
				color-mix(in srgb, var(--signal) 6%, transparent),
				transparent 24%
			),
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--bg) 96%, var(--text) 4%) 0%,
				var(--bg) 35%,
				color-mix(in srgb, var(--bg) 82%, black) 100%
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
		max-width: 12ch;
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

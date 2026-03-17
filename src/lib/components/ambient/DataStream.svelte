<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { onMount } from 'svelte';

	/**
	 * Decorative scrolling hex character column. Renders `aria-hidden`.
	 * @example
	 * <DataStream width="1.4rem" speed="slow" />
	 * <DataStream active={isConnected} />
	 */
	interface Props {
		/** Enable the scrolling animation. */
		active?: boolean;
		/** Width of the stream column. */
		width?: string;
		/** Scroll speed. */
		speed?: 'slow' | 'medium';
		/** Additional CSS classes. */
		class?: string;
	}

	let { active = true, width = '1.2rem', speed = 'slow', class: className = '' }: Props = $props();

	const chars = '0123456789ABCDEF.:+-';
	const lineCount = 32;
	let rootEl: HTMLDivElement | undefined = $state();
	let visible = $state(true);
	let lines = $state<string[]>([]);
	let intervalId: ReturnType<typeof setInterval> | undefined;

	const prefersReduced =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	function randomChar(): string {
		return chars[Math.floor(Math.random() * chars.length)];
	}

	function generateLines(): string[] {
		return Array.from({ length: lineCount }, () => randomChar());
	}

	function stop() {
		if (!intervalId) return;
		clearInterval(intervalId);
		intervalId = undefined;
	}

	function start() {
		stop();
		if (!active || prefersReduced || !visible) return;
		const ms = speed === 'slow' ? 600 : 350;
		intervalId = setInterval(() => {
			// Unkeyed each blocks update in-place, so this is stable DOM churn.
			lines = [randomChar(), ...lines.slice(0, lineCount - 1)];
		}, ms);
	}

	onMount(() => {
		lines = generateLines();

		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				visible = entry.isIntersecting;
			},
			{ root: null, threshold: 0 }
		);

		if (rootEl) io.observe(rootEl);

		return () => {
			io.disconnect();
			stop();
		};
	});

	$effect(() => {
		// Restart interval when relevant inputs change.
		start();
		return stop;
	});
</script>

<div bind:this={rootEl} class={cn('hyvui-data-stream', className)} style:width aria-hidden="true">
	{#each lines as char, i}
		<span class="hyvui-data-stream-char" style:opacity={0.18 - (i / lineCount) * 0.14}>{char}</span>
	{/each}
</div>

<style>
	.hyvui-data-stream {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-family: var(--font-mono);
		font-size: 0.6rem;
		line-height: 1.4;
		letter-spacing: 0.1em;
		color: var(--accent);
		pointer-events: none;
		overflow: hidden;
	}

	.hyvui-data-stream-char {
		display: block;
		transition: opacity 0.3s var(--ease-fast);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-data-stream-char {
			transition: none;
		}
	}
</style>

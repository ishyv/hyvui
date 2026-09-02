<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { onMount } from 'svelte';
	import {
		onDocumentVisibilityChange,
		onIntersectionChange,
		onReducedMotionChange,
		type Cleanup
	} from '../../system/runtime.js';

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
		/** Stable seed for the rendered sequence. */
		seed?: string | number;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		active = true,
		width = '1.2rem',
		speed = 'slow',
		seed = 'default',
		class: className = ''
	}: Props = $props();

	const chars = '0123456789ABCDEF.:+-';
	const lineCount = 32;
	let rootEl: HTMLDivElement | undefined = $state();
	let viewportVisible = $state(true);
	let documentVisible = $state(true);
	let reduced = $state(false);
	let mounted = $state(false);
	let lines = $state<string[]>([]);
	let intervalId: number | undefined;
	let sequenceState = 0;

	function hashSeed(value: string | number): number {
		let hash = 2166136261;
		for (const character of String(value)) {
			hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
		}
		return hash >>> 0;
	}

	function nextState(value: number): number {
		return (Math.imul(value, 1664525) + 1013904223) >>> 0;
	}

	function nextChar(): string {
		sequenceState = nextState(sequenceState);
		return chars[sequenceState % chars.length];
	}

	function generateLines(): string[] {
		sequenceState = hashSeed(seed);
		return Array.from({ length: lineCount }, nextChar);
	}

	function stop() {
		if (!intervalId) return;
		window.clearInterval(intervalId);
		intervalId = undefined;
	}

	function start() {
		stop();
		if (!mounted || !active || reduced || !viewportVisible || !documentVisible) return;
		const ms = speed === 'slow' ? 600 : 350;
		intervalId = window.setInterval(() => {
			// Unkeyed each blocks update in-place, so this is stable DOM churn.
			lines = [nextChar(), ...lines.slice(0, lineCount - 1)];
		}, ms);
	}

	onMount(() => {
		lines = generateLines();
		mounted = true;
		if (!rootEl) return;
		const cleanups: Cleanup[] = [
			onReducedMotionChange((value) => (reduced = value)),
			onDocumentVisibilityChange((value) => (documentVisible = value)),
			onIntersectionChange(rootEl, (value) => (viewportVisible = value), { threshold: 0 })
		];

		return () => {
			mounted = false;
			for (const cleanup of cleanups) cleanup();
			stop();
		};
	});

	$effect(() => {
		// Restart interval when relevant inputs change.
		active;
		speed;
		mounted;
		reduced;
		viewportVisible;
		documentVisible;
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
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
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

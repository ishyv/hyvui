<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import StatusLine from '../feedback/StatusLine.svelte';
	import { onMount } from 'svelte';
	import { onReducedMotionChange } from '../../system/runtime.js';

	interface BootLine {
		status: 'ok' | 'pend' | 'warn' | 'fail';
		message: string;
	}

	/**
	 * @remarks Use in LogScene or as a standalone loading sequence for system init screens.
	 * @example
	 * <TerminalBoot
	 *   lines={[
	 *     { status: 'ok', message: 'database connected' },
	 *     { status: 'pend', message: 'loading modules...' },
	 *     { status: 'ok', message: 'system ready' }
	 *   ]}
	 *   oncomplete={() => ready = true}
	 * />
	 */
	interface Props {
		/** Lines to display in sequence. */
		lines?: BootLine[];
		/** Initial delay before the first line appears (ms). */
		delay?: number;
		/** Interval between each line appearing (ms). */
		interval?: number;
		/** When true, shows all lines immediately. */
		instant?: boolean;
		/** Passes cursor visibility to visible lines. */
		showCursor?: boolean;
		/** Status line tone mode. */
		tone?: 'split' | 'line';
		/** Additional CSS classes. */
		class?: string;
		/** Fires when all lines have appeared. */
		oncomplete?: () => void;
	}

	let {
		lines = [],
		delay = 600,
		interval = 700,
		instant = false,
		showCursor = false,
		tone = 'split',
		class: className = '',
		oncomplete
	}: Props = $props();

	let visibleCount = $state(0);

	onMount(() => {
		let reduced = false;
		let completed = false;
		let delayTimer: number | undefined;
		let stepTimer: number | undefined;

		const clearTimers = () => {
			if (delayTimer !== undefined) window.clearTimeout(delayTimer);
			if (stepTimer !== undefined) window.clearInterval(stepTimer);
			delayTimer = undefined;
			stepTimer = undefined;
		};
		const completeNow = () => {
			if (completed) return;
			completed = true;
			clearTimers();
			visibleCount = lines.length;
			oncomplete?.();
		};
		const unsubscribeReduced = onReducedMotionChange((value) => {
			reduced = value;
			if (value) completeNow();
		});

		if (lines.length === 0 || instant || reduced) completeNow();
		else {
			delayTimer = window.setTimeout(() => {
				if (completed) return;
				visibleCount = 1;

				if (lines.length === 1) {
					completeNow();
					return;
				}

				stepTimer = window.setInterval(() => {
					visibleCount += 1;
					if (visibleCount >= lines.length) completeNow();
				}, interval);
			}, delay);
		}

		return () => {
			clearTimers();
			unsubscribeReduced();
		};
	});
</script>

<div class={cn('hyvui-terminal-boot', className)}>
	{#each lines as line, i}
		<StatusLine
			status={line.status}
			message={line.message}
			visible={i < visibleCount}
			{tone}
			cursor={showCursor && i < visibleCount}
		/>
	{/each}
</div>

<style>
	.hyvui-terminal-boot {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}
</style>

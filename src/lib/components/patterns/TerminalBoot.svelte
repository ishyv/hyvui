<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import StatusLine from '../feedback/StatusLine.svelte';
	import { onMount } from 'svelte';

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
		if (lines.length === 0) {
			oncomplete?.();
			return;
		}

		if (instant) {
			visibleCount = lines.length;
			oncomplete?.();
			return;
		}

		const timers: number[] = [];
		timers.push(
			window.setTimeout(() => {
				visibleCount = 1;

				if (lines.length === 1) {
					oncomplete?.();
					return;
				}

				const stepTimer = window.setInterval(() => {
					visibleCount += 1;
					if (visibleCount >= lines.length) {
						window.clearInterval(stepTimer);
						oncomplete?.();
					}
				}, interval);

				timers.push(stepTimer);
			}, delay)
		);

		return () => {
			for (const timer of timers) {
				window.clearTimeout(timer);
				window.clearInterval(timer);
			}
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
		gap: 0.375rem;
	}
</style>

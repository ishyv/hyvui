<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Portal/gate effect wrapping content. Theme-aware: hextech reads as a
	 * horizontal scan gate; arcane as a magenta portal swirl with crackle.
	 *
	 * @example
	 * <Threshold state="pulse">
	 *   <Stack>... scene content</Stack>
	 * </Threshold>
	 */
	interface Props {
		state?: 'open' | 'closed' | 'pulse';
		orientation?: 'h' | 'v';
		class?: string;
		children?: Snippet;
	}

	let { state = 'open', orientation = 'h', class: className = '', children }: Props = $props();
</script>

<div
	class={cn(
		'hyvui-threshold',
		`hyvui-threshold-${state}`,
		`hyvui-threshold-${orientation}`,
		className
	)}
>
	<span class="hyvui-threshold-beam" aria-hidden="true"></span>
	<div class="hyvui-threshold-content">
		{#if children}{@render children()}{/if}
	</div>
</div>

<style>
	.hyvui-threshold {
		position: relative;
		display: block;
		isolation: isolate;
	}
	.hyvui-threshold-content {
		position: relative;
		z-index: 1;
	}
	.hyvui-threshold-closed .hyvui-threshold-content {
		clip-path: inset(50% 0 50% 0);
	}
	.hyvui-threshold-h.hyvui-threshold-open .hyvui-threshold-content {
		animation: threshold-open-h 0.6s var(--ease-smooth) both;
	}
	.hyvui-threshold-v.hyvui-threshold-open .hyvui-threshold-content {
		animation: threshold-open-v 0.6s var(--ease-smooth) both;
	}

	@keyframes threshold-open-h {
		from { clip-path: inset(50% 0 50% 0); }
		to   { clip-path: inset(0 0 0 0); }
	}
	@keyframes threshold-open-v {
		from { clip-path: inset(0 50% 0 50%); }
		to   { clip-path: inset(0 0 0 0); }
	}

	/* beam — only shows when pulse or during open */
	.hyvui-threshold-beam {
		position: absolute;
		pointer-events: none;
		z-index: 2;
		opacity: 0;
	}
	.hyvui-threshold-h .hyvui-threshold-beam {
		left: 0;
		right: 0;
		top: 50%;
		height: 2px;
		transform: translateY(-50%);
		background: linear-gradient(
			to right,
			transparent,
			currentColor 50%,
			transparent
		);
		color: var(--accent);
	}
	.hyvui-threshold-v .hyvui-threshold-beam {
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		transform: translateX(-50%);
		background: linear-gradient(
			to bottom,
			transparent,
			currentColor 50%,
			transparent
		);
		color: var(--accent);
	}

	.hyvui-threshold-pulse .hyvui-threshold-beam {
		animation: threshold-pulse 2.4s var(--ease-smooth) infinite;
	}
	@keyframes threshold-pulse {
		0%, 100% { opacity: 0; }
		50%      { opacity: 1; }
	}

	/* hextech: cyan precision scan */
	:global([data-theme='hextech']) .hyvui-threshold-beam {
		color: var(--htx-cyan-glow, var(--signal));
		filter: drop-shadow(0 0 6px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 60%, transparent));
	}

	/* arcane: magenta swirl portal */
	:global([data-theme='arcane']) .hyvui-threshold-beam {
		color: var(--arc-magenta, var(--accent));
		filter: drop-shadow(0 0 10px color-mix(in srgb, var(--arc-magenta, var(--accent)) 70%, transparent));
		height: 4px;
		width: 4px;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-threshold-content,
		.hyvui-threshold-beam {
			animation: none !important;
		}
		.hyvui-threshold-content {
			clip-path: none;
		}
	}
</style>

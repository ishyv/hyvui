<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Circular stamp with text rendered along its perimeter via SVG textPath.
	 * Slot accepts a centered Glyph or other content.
	 *
	 * @example
	 * <RuneStamp text="ARCHIVE • PROTECTED • 0421">
	 *   <Glyph name="compass-rose" />
	 * </RuneStamp>
	 */
	interface Props {
		text: string;
		radius?: string;
		direction?: 'cw' | 'ccw';
		class?: string;
		/** Stable id namespace used by the SVG text path. */
		id?: string;
		children?: Snippet;
	}

	let {
		text,
		radius = '88px',
		direction = 'cw',
		class: className = '',
		id,
		children
	}: Props = $props();

	/** Stable across SSR and hydration. Pass `id` when identical stamps repeat. */
	function stableId(value: string): string {
		let hash = 2166136261;
		for (let index = 0; index < value.length; index += 1) {
			hash ^= value.charCodeAt(index);
			hash = Math.imul(hash, 16777619);
		}
		return `rs-${(hash >>> 0).toString(36)}`;
	}

	const pathId = $derived(id ? `${id}-path` : stableId(`${text}|${radius}|${direction}`));
	/* cw goes clockwise from 12 o'clock; ccw uses a negated arc */
	const pathD = $derived(
		direction === 'cw'
			? 'M 50 8 A 42 42 0 1 1 49.99 8'
			: 'M 50 8 A 42 42 0 1 0 50.01 8'
	);
</script>

<span
	class={cn('hyvui-rune-stamp', className)}
	{id}
	style:width={radius}
	style:height={radius}
>
	<svg viewBox="0 0 100 100" class="hyvui-rune-stamp-svg" aria-hidden="true">
		<defs>
			<path id={pathId} d={pathD} fill="none" />
		</defs>
		<circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" stroke-width="0.7" />
		<circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="0.4" opacity="0.6" />
		<text class="hyvui-rune-stamp-text" font-size="6" letter-spacing="3">
			<textPath href="#{pathId}" startOffset="0">{text}</textPath>
		</text>
	</svg>
	{#if children}
		<span class="hyvui-rune-stamp-center">{@render children()}</span>
	{/if}
</span>

<style>
	.hyvui-rune-stamp {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--muted);
		flex-shrink: 0;
	}
	.hyvui-rune-stamp-svg {
		width: 100%;
		height: 100%;
	}
	.hyvui-rune-stamp-text {
		font-family: var(--reg-font-ui);
		fill: currentColor;
		text-transform: uppercase;
	}
	.hyvui-rune-stamp-center {
		position: absolute;
		inset: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 38%;
	}

	:global([data-theme='hextech']) .hyvui-rune-stamp {
		color: var(--htx-cyan-glow, var(--signal));
	}
	:global([data-theme='arcane']) .hyvui-rune-stamp {
		color: var(--arc-magenta, var(--accent));
		filter: drop-shadow(0 0 4px color-mix(in srgb, var(--arc-magenta, var(--accent)) 35%, transparent));
		animation: rune-stamp-pulse 5s var(--ease-smooth) infinite;
	}
	@keyframes rune-stamp-pulse {
		0%, 100% { opacity: 0.85; }
		50%      { opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='arcane']) .hyvui-rune-stamp {
			animation: none;
		}
	}
</style>

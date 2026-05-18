<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative hex grid overlay. Adapts color and character per active register:
	 * hextech → cyan precise etching; arcane → violet cracked. Parent must have
	 * `position: relative`. Renders `aria-hidden`.
	 * @example
	 * <div style="position: relative;">
	 *   <HexGrid />
	 *   content here
	 * </div>
	 */
	interface Props {
		/** Controls animation playback. */
		animated?: boolean;
		/** Override grid opacity (0–1). Defaults to register's --reg-ornament-opacity. */
		opacity?: number | undefined;
		/** Additional CSS classes. */
		class?: string;
	}

	let { animated = true, opacity = undefined, class: className = '' }: Props = $props();

	const prefersReduced =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;

	const shouldAnimate = $derived(animated && !prefersReduced);
</script>

<div
	class={cn('hyvui-hex-grid', shouldAnimate && 'hyvui-hex-grid--animated', className)}
	style={opacity !== undefined ? `--hex-opacity-override: ${opacity}` : undefined}
	aria-hidden="true"
></div>

<style>
	.hyvui-hex-grid {
		position: absolute;
		inset: 0;
		pointer-events: none;

		/* Hex pattern via three-angle stripes (vertical + two diagonals).
		   Color and opacity come from register tokens so they shift automatically. */
		background-image:
			linear-gradient(to right, var(--hg-color) 1px, transparent 1px),
			linear-gradient(60deg, var(--hg-color) 1px, transparent 1px),
			linear-gradient(-60deg, var(--hg-color) 1px, transparent 1px);
		background-size: 40px 23px;

		opacity: var(--hex-opacity-override, var(--reg-ornament-opacity));
		mask-image: linear-gradient(to bottom, transparent, black 12%, black 88%, transparent);
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent,
			black 12%,
			black 88%,
			transparent
		);

		/* default color (field-notebook) */
		--hg-color: color-mix(in srgb, var(--accent) 45%, transparent);
	}

	/* ── hextech ─ cyan precision ─────────────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-hex-grid {
		--hg-color: color-mix(in srgb, var(--htx-cyan-glow) 55%, transparent);
		background-size: 48px 28px;
	}

	/* ── arcane ─ violet instability ─────────────────────────────────── */
	:global([data-theme='arcane']) .hyvui-hex-grid {
		--hg-color: color-mix(in srgb, var(--arc-magenta) 50%, transparent);
		background-size: 40px 23px;
	}

	/* ── pulse animation ─────────────────────────────────────────────── */
	.hyvui-hex-grid--animated {
		animation: hg-pulse var(--orn-shimmer-rate, 4s) var(--orn-pulse-rhythm, ease-in-out) infinite;
	}

	:global([data-theme='arcane']) .hyvui-hex-grid--animated {
		animation:
			hg-pulse var(--orn-shimmer-rate, 2.4s) var(--orn-pulse-rhythm, ease-in-out) infinite,
			hg-flicker 7s step-end infinite;
	}

	@keyframes hg-pulse {
		0%,
		100% {
			opacity: var(--hex-opacity-override, var(--reg-ornament-opacity));
		}
		50% {
			opacity: calc(var(--hex-opacity-override, var(--reg-ornament-opacity)) * 1.8);
		}
	}

	@keyframes hg-flicker {
		0%,
		97%,
		100% {
			opacity: var(--hex-opacity-override, var(--reg-ornament-opacity));
		}
		98% {
			opacity: 0.02;
		}
		99% {
			opacity: calc(var(--hex-opacity-override, var(--reg-ornament-opacity)) * 2.2);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-hex-grid--animated {
			animation: none;
		}
	}
</style>


<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative. Parent must have `position: relative`. Renders `aria-hidden`.
	 * @example
	 * <div style="position: relative;">
	 *   <ScanBand axis="x" duration="6s" />
	 *   content with scan line
	 * </div>
	 */
	interface Props {
		/** Enable the scan animation. */
		active?: boolean;
		/** Animation axis. */
		axis?: 'x' | 'y';
		/** Thickness/width of the band. */
		size?: string;
		/** Animation duration. */
		duration?: string;
		/** Gradient used for the band. */
		gradient?: string;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		active = true,
		axis = 'y',
		size = '1px',
		duration = '8s',
		gradient = 'linear-gradient(90deg, transparent, rgba(199, 156, 87, 0.18), transparent)',
		class: className = ''
	}: Props = $props();
</script>

{#if active}
	<div
		class={cn(
			'hyvui-scan-band',
			axis === 'x' ? 'hyvui-scan-band-x' : 'hyvui-scan-band-y',
			className
		)}
		style:--scan-size={size}
		style:--scan-duration={duration}
		style:--scan-gradient={gradient}
		aria-hidden="true"
	></div>
{/if}

<style>
	.hyvui-scan-band {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
	}

	.hyvui-scan-band::after {
		content: '';
		position: absolute;
		background: var(--scan-gradient);
	}

	.hyvui-scan-band-y::after {
		left: 0;
		right: 0;
		height: var(--scan-size);
		animation: scan-band-y var(--scan-duration) linear infinite;
	}

	.hyvui-scan-band-x::after {
		top: 0;
		bottom: 0;
		width: var(--scan-size);
		animation: scan-band-x var(--scan-duration) linear infinite;
	}

	@keyframes scan-band-y {
		0% {
			transform: translateY(-100%);
		}
		100% {
			transform: translateY(100%);
		}
	}

	@keyframes scan-band-x {
		0% {
			transform: translateX(-120%);
		}
		100% {
			transform: translateX(520%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-scan-band::after {
			animation: none;
			display: none;
		}
	}
</style>

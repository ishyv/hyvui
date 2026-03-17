<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative pulsing sonar rings. Renders `aria-hidden`.
	 * @example
	 * <SignalRing size={160} color="var(--signal)" />
	 * <SignalRing active={isLive} size={200} />
	 */
	interface Props {
		/** Enable the pulsing animation. */
		active?: boolean;
		/** Ring diameter in pixels. */
		size?: number;
		/** Ring color (CSS color value). */
		color?: string;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		active = true,
		size = 200,
		color = 'var(--accent)',
		class: className = ''
	}: Props = $props();
</script>

<div
	class={cn('hyvui-signal-ring', className)}
	style:width="{size}px"
	style:height="{size}px"
	aria-hidden="true"
>
	{#if active}
		<span class="hyvui-signal-ring-pulse hyvui-signal-ring-1" style:border-color={color}></span>
		<span class="hyvui-signal-ring-pulse hyvui-signal-ring-2" style:border-color={color}></span>
		<span class="hyvui-signal-ring-pulse hyvui-signal-ring-3" style:border-color={color}></span>
	{/if}
	<span class="hyvui-signal-ring-core" style:background-color={color}></span>
</div>

<style>
	.hyvui-signal-ring {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.hyvui-signal-ring-core {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		opacity: 0.6;
	}

	.hyvui-signal-ring-pulse {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		border: 1px solid;
		opacity: 0;
		animation: signal-ring-expand 3.6s var(--ease-smooth) infinite;
	}

	.hyvui-signal-ring-1 {
		animation-delay: 0s;
	}

	.hyvui-signal-ring-2 {
		animation-delay: 1.2s;
	}

	.hyvui-signal-ring-3 {
		animation-delay: 2.4s;
	}

	@keyframes signal-ring-expand {
		0% {
			transform: scale(0.1);
			opacity: 0.4;
		}
		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-signal-ring-pulse {
			animation: none;
			opacity: 0.08;
			transform: scale(0.6);
		}

		.hyvui-signal-ring-2 {
			transform: scale(0.8);
		}

		.hyvui-signal-ring-3 {
			transform: scale(1);
		}
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <StatusDot status="ok" />
	 * <StatusDot status="pend" pulse={false} />
	 * <StatusDot status="fail" size={8} />
	 */
	interface Props {
		/** Status state determining the dot color. */
		status?: 'ok' | 'pend' | 'warn' | 'fail';
		/** Enable pulse animation. */
		pulse?: boolean;
		/** Dot diameter in pixels. */
		size?: number;
		/** Additional CSS classes. */
		class?: string;
	}

	let { status = 'ok', pulse = true, size = 6, class: className = '' }: Props = $props();

	const colorMap: Record<string, string> = {
		ok: 'var(--status-ok)',
		pend: 'var(--status-pend)',
		warn: 'var(--status-warn)',
		fail: 'var(--status-fail)'
	};
</script>

<span
	class={cn('hyvui-status-dot', pulse && 'hyvui-status-dot-pulse', className)}
	style:width="{size}px"
	style:height="{size}px"
	style:background-color={colorMap[status]}
	aria-label="{status} status"
></span>

<style>
	.hyvui-status-dot {
		display: inline-block;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.hyvui-status-dot-pulse {
		animation: pulse-dot 2s ease-in-out infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-status-dot-pulse {
			animation: none;
		}
	}
</style>

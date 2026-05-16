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
		animation: pulse-dot 2s cubic-bezier(0.37, 0, 0.63, 1) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-status-dot-pulse {
			animation: none;
		}
	}

	/* ── hextech: cyan ring pulse instead of scale ────────────────────── */
	:global([data-register='hextech']) .hyvui-status-dot-pulse {
		animation: sd-hextech-pulse 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
	}

	@keyframes sd-hextech-pulse {
		0%, 100% { box-shadow: 0 0 0 0 rgba(93, 217, 240, 0.0); }
		50%       { box-shadow: 0 0 0 4px rgba(93, 217, 240, 0.0); opacity: 1; }
		30%       { box-shadow: 0 0 0 3px rgba(93, 217, 240, 0.35); opacity: 1; }
	}

	/* ── arcane: shimmer ripple ───────────────────────────────────────── */
	:global([data-register='arcane']) .hyvui-status-dot-pulse {
		animation: sd-arcane-pulse 2s cubic-bezier(0.6, 0, 0.4, 1) infinite;
	}

	@keyframes sd-arcane-pulse {
		0%        { box-shadow: 0 0 0 0 rgba(184, 69, 201, 0.6); opacity: 1; }
		70%       { box-shadow: 0 0 0 5px rgba(184, 69, 201, 0); opacity: 0.85; }
		100%      { box-shadow: 0 0 0 0 rgba(184, 69, 201, 0); opacity: 1; }
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-register='hextech']) .hyvui-status-dot-pulse,
		:global([data-register='arcane']) .hyvui-status-dot-pulse {
			animation: none;
		}
	}
</style>

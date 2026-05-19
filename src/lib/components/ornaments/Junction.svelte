<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Node ornament for marking endpoints/intersections of Conduits.
	 *
	 * @example
	 * <Junction type="cross" />
	 * <Junction type="merge" size="14px" />
	 */
	interface Props {
		type?: 'dot' | 'cross' | 'split' | 'merge';
		size?: string;
		class?: string;
	}

	let { type = 'dot', size = '10px', class: className = '' }: Props = $props();
</script>

<span
	class={cn('hyvui-junction', `hyvui-junction-${type}`, className)}
	style:width={size}
	style:height={size}
	aria-hidden="true"
>
	<svg viewBox="0 0 24 24" width="100%" height="100%">
		{#if type === 'dot'}
			<circle cx="12" cy="12" r="6" fill="currentColor" />
		{:else if type === 'cross'}
			<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.5" />
			<path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="1.5" />
		{:else if type === 'split'}
			<circle cx="12" cy="12" r="4" fill="currentColor" />
			<path d="M12 12L4 4M12 12L20 4M12 12L12 22" stroke="currentColor" stroke-width="1.5" />
		{:else if type === 'merge'}
			<circle cx="12" cy="12" r="4" fill="currentColor" />
			<path d="M4 4L12 12M20 4L12 12M12 22L12 12" stroke="currentColor" stroke-width="1.5" />
		{/if}
	</svg>
</span>

<style>
	.hyvui-junction {
		display: inline-block;
		vertical-align: middle;
		color: var(--accent);
		flex-shrink: 0;
	}

	:global([data-theme='hextech']) .hyvui-junction {
		color: var(--htx-brass-bright, var(--accent-strong));
	}
	:global([data-theme='hextech']) .hyvui-junction-cross,
	:global([data-theme='hextech']) .hyvui-junction-split,
	:global([data-theme='hextech']) .hyvui-junction-merge {
		filter: drop-shadow(0 0 2px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 40%, transparent));
	}

	:global([data-theme='arcane']) .hyvui-junction {
		color: var(--arc-magenta, var(--accent));
		filter: drop-shadow(0 0 4px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 45%, transparent));
		animation: junction-arc-pulse 2.4s var(--ease-smooth) infinite;
	}
	@keyframes junction-arc-pulse {
		0%, 100% { transform: scale(1); }
		50%      { transform: scale(1.08); }
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='arcane']) .hyvui-junction {
			animation: none;
		}
	}
</style>

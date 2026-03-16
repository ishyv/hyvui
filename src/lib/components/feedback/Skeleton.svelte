<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <Skeleton height="1.2rem" width="60%" />
	 * <Skeleton variant="circle" width="32px" height="32px" />
	 * <Skeleton variant="card" height="120px" />
	 */
	interface Props {
		/** Width of the skeleton element. */
		width?: string;
		/** Height of the skeleton element. */
		height?: string;
		/** Shape variant. */
		variant?: 'text' | 'card' | 'circle' | 'custom';
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		width = '100%',
		height = '1rem',
		variant = 'text',
		class: className = ''
	}: Props = $props();
</script>

<div
	class={cn('hyvui-skeleton', variant === 'circle' && 'hyvui-skeleton-circle', className)}
	style:width
	style:height
	aria-hidden="true"
></div>

<style>
	.hyvui-skeleton {
		background: linear-gradient(
			90deg,
			var(--bg-elev) 0%,
			rgba(199, 156, 87, 0.06) 50%,
			var(--bg-elev) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 2s linear infinite;
	}

	.hyvui-skeleton-circle {
		border-radius: 50%;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-skeleton {
			animation: none;
			background: var(--bg-elev);
		}
	}
</style>

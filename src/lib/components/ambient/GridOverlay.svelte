<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative. Parent must have `position: relative`. Renders `aria-hidden`.
	 * @example
	 * <div style="position: relative;">
	 *   <GridOverlay />
	 *   content here
	 * </div>
	 */
	interface Props {
		/** Additional CSS classes. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class={cn('hyvui-grid-overlay', className)} aria-hidden="true"></div>

<style>
	.hyvui-grid-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background-image:
			linear-gradient(to right, rgba(199, 156, 87, 0.04) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(199, 156, 87, 0.04) 1px, transparent 1px);
		background-size: 72px 72px;
		mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
		-webkit-mask-image: linear-gradient(to bottom, transparent, black 15%, black 85%, transparent);
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Fixed-position dark vignette overlay. Place once in root layout. Renders `aria-hidden`.
	 * @example
	 * <!-- in +layout.svelte (or use AppShell which adds it automatically) -->
	 * <Vignette />
	 */
	interface Props {
		/** Additional CSS classes. */
		class?: string;
	}

	let { class: className = '' }: Props = $props();
</script>

<div class={cn('hyvui-vignette', className)} aria-hidden="true"></div>

<style>
	.hyvui-vignette {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: var(--z-overlay);
		background:
			radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(0, 0, 0, 0.4)),
			radial-gradient(ellipse at 50% 100%, transparent 60%, rgba(0, 0, 0, 0.5));
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { lockScroll } from '../../system/scroll-lock.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';

	/**
	 * @example
	 * <Drawer open={showDrawer} side="right" onclose={() => showDrawer = false}>
	 *   <SidebarNav items={navItems} />
	 * </Drawer>
	 */
	interface Props {
		/** Controls drawer visibility. */
		open?: boolean;
		/** Side the drawer slides in from. */
		side?: 'left' | 'right';
		/** Drawer width. */
		width?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Drawer content. */
		children?: Snippet;
		/** Fires when the drawer is dismissed. */
		onclose?: () => void;
	}

	let {
		open = false,
		side = 'right',
		width = '320px',
		class: className = '',
		children,
		onclose
	}: Props = $props();

	$effect(() => {
		if (!open) return;
		return lockScroll();
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!open) return;

		function onKeydown(e: KeyboardEvent) {
			if (e.key === 'Escape') onclose?.();
		}

		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	function handleBackdropClick(e: MouseEvent) {
		// Only close when the backdrop itself was clicked.
		if (e.target !== e.currentTarget) return;
		onclose?.();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="hyvui-drawer-backdrop" onclick={handleBackdropClick}>
		<div
			class={cn(
				'hyvui-drawer',
				side === 'left' ? 'hyvui-drawer-left' : 'hyvui-drawer-right',
				className
			)}
			style:--hyvui-drawer-w={width}
		>
			<Surface variant="panel" class="hyvui-drawer-surface">
				{#if children}{@render children()}{/if}
			</Surface>
		</div>
	</div>
{/if}

<style>
	.hyvui-drawer-backdrop {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: rgba(0, 0, 0, 0.72);
	}

	.hyvui-drawer {
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: var(--z-modal);
		inline-size: min(var(--hyvui-drawer-w, 320px), 100dvw);
		max-inline-size: 100dvw;
	}

	.hyvui-drawer-left {
		left: 0;
		animation: drawer-left-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-drawer-right {
		right: 0;
		animation: drawer-right-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	:global(.hyvui-drawer-surface) {
		height: 100%;
		padding: calc(var(--space-card) + var(--safe-top)) calc(var(--space-card) + var(--safe-right))
			calc(var(--space-card) + var(--safe-bottom)) calc(var(--space-card) + var(--safe-left));
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	@keyframes drawer-left-in {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(0);
		}
	}

	@keyframes drawer-right-in {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-drawer-left,
		.hyvui-drawer-right {
			animation: none;
		}
	}
</style>

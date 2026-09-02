<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { lockScroll } from '../../system/scroll-lock.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * A side-placed modal dialog. Native Escape/cancel behavior, focus return,
	 * shared scroll locking, and safe-area padding are part of the contract.
	 *
	 * @example
	 * <Drawer open={showDrawer} side="right" onclose={() => showDrawer = false} ariaLabel="navigation">
	 *   <SidebarNav items={navItems} />
	 * </Drawer>
	 */
	type Props = Omit<
		HTMLAttributes<HTMLDialogElement>,
		'class' | 'children' | 'id' | 'onclick' | 'onclose' | 'oncancel'
	> & {
		/** Controls drawer visibility. */
		open?: boolean;
		/** Side the drawer slides in from. */
		side?: 'left' | 'right';
		/** Drawer width. */
		width?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Stable dialog id. */
		id?: string;
		/** Existing element id used as the accessible name. */
		labelledBy?: string;
		/** Existing element id used as the accessible description. */
		describedBy?: string;
		/** Explicit accessible name when no labelled-by id is available. */
		ariaLabel?: string;
		/** Drawer content. */
		children?: Snippet;
		/** Fires when the drawer is dismissed. */
		onclose?: () => void;
	};

	let {
		open = false,
		side = 'right',
		width = '320px',
		class: className = '',
		id,
		labelledBy,
		describedBy,
		ariaLabel,
		children,
		onclose,
		...rest
	}: Props = $props();

	let dialogEl: HTMLDialogElement | undefined = $state();
	let previousFocus: Element | null = null;

	function restoreFocus() {
		if (previousFocus instanceof HTMLElement && document.contains(previousFocus)) {
			previousFocus.focus();
		}
		previousFocus = null;
	}

	$effect(() => {
		if (!dialogEl) return;
		if (open) {
			if (!dialogEl.open) {
				previousFocus = document.activeElement;
				dialogEl.showModal();
			}
		} else {
			if (dialogEl.open) dialogEl.close();
			restoreFocus();
		}
	});

	$effect(() => {
		if (!open) return;
		return lockScroll();
	});

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialogEl) onclose?.();
	}
</script>

<dialog
		{...rest}
		bind:this={dialogEl}
		{id}
		class={cn(
			'hyvui-drawer-backdrop',
			side === 'left' ? 'hyvui-drawer-left' : 'hyvui-drawer-right',
			className
		)}
		style:--hyvui-drawer-w={width}
		aria-labelledby={labelledBy}
		aria-describedby={describedBy}
		aria-label={labelledBy ? undefined : ariaLabel}
		onclick={handleBackdropClick}
		oncancel={(event) => {
			event.preventDefault();
			onclose?.();
		}}
		onclose={() => {
			if (open) onclose?.();
		}}
	>
		<Surface variant="panel" class="hyvui-drawer-surface">
			{#if children}{@render children()}{/if}
		</Surface>
	</dialog>

<style>
	.hyvui-drawer-backdrop {
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		display: flex;
		align-items: stretch;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		padding: 0;
		border: none;
		background: transparent;
		color: inherit;
	}

	.hyvui-drawer-backdrop:not([open]) {
		display: none;
	}

	.hyvui-drawer-backdrop::backdrop {
		background: transparent;
	}

	.hyvui-drawer-backdrop:before {
		content: '';
		position: absolute;
		inset: 0;
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		pointer-events: none;
	}

	.hyvui-drawer-backdrop {
		justify-content: flex-end;
	}

	.hyvui-drawer-left {
		justify-content: flex-start;
	}

	.hyvui-drawer-right {
		justify-content: flex-end;
	}

	:global(.hyvui-drawer-surface) {
		position: relative;
		z-index: 1;
		width: min(var(--hyvui-drawer-w, 320px), 100dvw);
		max-width: 100dvw;
		height: 100%;
		padding: calc(var(--space-card) + var(--safe-top))
			calc(var(--space-card) + var(--safe-right))
			calc(var(--space-card) + var(--safe-bottom))
			calc(var(--space-card) + var(--safe-left));
		overflow-y: auto;
		overscroll-behavior: contain;
		animation: drawer-right-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-drawer-left :global(.hyvui-drawer-surface) {
		animation-name: drawer-left-in;
	}

	@keyframes drawer-left-in {
		from { transform: translateX(-100%); }
		to { transform: translateX(0); }
	}

	@keyframes drawer-right-in {
		from { transform: translateX(100%); }
		to { transform: translateX(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.hyvui-drawer-surface) { animation: none; }
	}
</style>

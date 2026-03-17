<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';
	import {
		autoUpdate,
		computePosition,
		flip,
		offset as fuiOffset,
		shift,
		size as fuiSize,
		type Placement
	} from '@floating-ui/dom';

	// In SSR builds, Svelte strips $effect bodies, which can make these imports appear unused to Rollup.
	// Keeping a tiny reference avoids noisy build warnings without changing runtime behavior.
	const _fui = [autoUpdate, computePosition, flip, fuiOffset, shift, fuiSize];
	void _fui;

	/**
	 * Typically used via DropdownMenu. Use directly only when you need full positioning control.
	 * Requires an `anchor` HTMLElement ref and a controlled `open` boolean.
	 * @example
	 * <button bind:this={anchorEl} onclick={() => open = true}>open</button>
	 * <Popover {open} anchor={anchorEl} placement="bottom-start" onclose={() => open = false}>
	 *   <Text variant="caption">popover content</Text>
	 * </Popover>
	 */
	interface Props {
		/** Controls popover visibility. */
		open?: boolean;
		/** Anchor element the popover positions against. */
		anchor?: HTMLElement | null;
		/** Placement relative to anchor. */
		placement?: Placement;
		/** Offset in pixels from the anchor. */
		offset?: number;
		/** When true, move the popover element to document.body on mount. */
		portal?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Popover content. */
		children?: Snippet;
		/** Fires when the popover should close (outside click, Escape). */
		onclose?: () => void;
	}

	let {
		open = false,
		anchor = null,
		placement = 'bottom-start',
		offset = 8,
		portal = true,
		class: className = '',
		children,
		onclose
	}: Props = $props();

	let popoverEl: HTMLDivElement | undefined = $state();

	function close() {
		onclose?.();
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!portal) return;
		if (!popoverEl) return;

		// Manual portal: move the floating node to document.body. Svelte 5's event
		// delegation supports this (see internal render.js comment re: portals).
		document.body.appendChild(popoverEl);

		return () => {
			popoverEl?.remove();
		};
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!open) return;
		if (!anchor || !popoverEl) return;

		const a = anchor;
		const el = popoverEl;

		function position() {
			computePosition(a, el, {
				placement,
				strategy: 'fixed',
				middleware: [
					fuiOffset(offset),
					flip(),
					shift({ padding: 8 }),
					fuiSize({
						padding: 8,
						apply({ availableWidth, availableHeight, elements }) {
							Object.assign(elements.floating.style, {
								maxWidth: `${Math.max(0, availableWidth)}px`,
								maxHeight: `${Math.max(0, availableHeight)}px`
							});
						}
					})
				]
			}).then(({ x, y }) => {
				Object.assign(el.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});
		}

		position();

		const stop = autoUpdate(a, el, position);

		function onPointerDown(e: PointerEvent) {
			const t = e.target as Node | null;
			if (!t) return;
			if (a.contains(t) || el.contains(t)) return;
			close();
		}

		function onKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') close();
		}

		const pointerOpts: AddEventListenerOptions = { capture: true };
		window.addEventListener('pointerdown', onPointerDown, pointerOpts);
		window.addEventListener('keydown', onKeyDown);

		return () => {
			stop();
			window.removeEventListener('pointerdown', onPointerDown, pointerOpts);
			window.removeEventListener('keydown', onKeyDown);
		};
	});
</script>

{#if open && anchor}
	<div bind:this={popoverEl} class={cn('hyvui-popover', className)}>
		<Surface variant="card" class="hyvui-popover-surface">
			<div class="hyvui-popover-content">
				{#if children}{@render children()}{/if}
			</div>
		</Surface>
	</div>
{/if}

<style>
	.hyvui-popover {
		position: fixed;
		z-index: var(--z-overlay);
		left: 0;
		top: 0;
		backface-visibility: hidden;
		animation: popover-in 0.2s cubic-bezier(0.22, 1, 0.36, 1);
		max-inline-size: min(90dvw, 28rem);
	}

	:global(.hyvui-popover-surface) {
		padding: 0;
	}

	.hyvui-popover-content {
		padding: 0.5rem 0.75rem;
		max-block-size: min(60dvh, 32rem);
		overflow: auto;
		overscroll-behavior: contain;
	}

	@keyframes popover-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-popover {
			animation: none;
		}
	}
</style>

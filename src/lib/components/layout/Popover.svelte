<script lang="ts">
	import { onDestroy } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutAttributes } from '../../system/dom.js';
	import { onAppearanceChange, readAppearanceContext, type AppearanceContext } from '../../system/context.js';
	import {
		autoUpdate,
		computePosition,
		flip,
		offset as fuiOffset,
		shift,
		size as fuiSize,
		type Placement
	} from '@floating-ui/dom';

	const floatingUiPrimitives = [autoUpdate, computePosition, flip, fuiOffset, shift, fuiSize];
	void floatingUiPrimitives;

	/**
	 * Nonmodal, Floating UI anchored surface. The root receives a snapshot of
	 * the anchor's appearance context when portalled so material and grade do
	 * not silently fall back to the document body.
	 */
	type Props = Omit<LayoutAttributes, 'aria-describedby' | 'aria-labelledby' | 'children' | 'role'> & {
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
		/** Explicit accessible role. */
		role?: string;
		/** Existing element id used as the accessible name. */
		labelledBy?: string;
		/** Existing element id used as the accessible description. */
		describedBy?: string;
		/** Focus the first focusable descendant on open. */
		focusOnOpen?: boolean;
		/** Return focus to the previously active element on close. */
		restoreFocus?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Popover content. */
		children?: Snippet;
		/** Fires when the popover should close (outside click, Escape). */
		onclose?: () => void;
	};

	let {
		open = false,
		anchor = null,
		placement = 'bottom-start',
		offset = 8,
		portal = true,
		role = 'dialog',
		labelledBy,
		describedBy,
		focusOnOpen = true,
		restoreFocus = true,
		class: className = '',
		children,
		onclose,
		...rest
	}: Props = $props();

	let popoverEl: HTMLDivElement | undefined = $state();
	let appearance = $state<AppearanceContext>({
		weight: 'default',
		theme: 'default',
		grade: 'default'
	});
	let previousFocus: Element | null = null;

	function close() {
		onclose?.();
	}

	function restorePreviousFocus() {
		if (
			typeof document !== 'undefined' &&
			typeof HTMLElement !== 'undefined' &&
			restoreFocus &&
			previousFocus instanceof HTMLElement &&
			document.contains(previousFocus)
		) {
			previousFocus.focus();
		}
		previousFocus = null;
	}

	function focusEntry() {
		if (!popoverEl || !focusOnOpen) return;
		const candidate = popoverEl.querySelector<HTMLElement>(
			'[autofocus], button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
		);
		(candidate ?? popoverEl).focus();
	}

	$effect(() => {
		const target = anchor;
		if (!target) {
			appearance = { weight: 'default', theme: 'default', grade: 'default' };
			return;
		}
		appearance = readAppearanceContext(target);
		return onAppearanceChange(target, (next) => (appearance = next));
	});

	$effect(() => {
		if (!open) {
			restorePreviousFocus();
			return;
		}
		if (!previousFocus) previousFocus = document.activeElement;
		if (popoverEl && focusOnOpen) queueMicrotask(focusEntry);
	});

	$effect(() => {
		if (typeof document === 'undefined' || !portal || !popoverEl) return;

		if (popoverEl.parentElement !== document.body) document.body.appendChild(popoverEl);
		return () => {
			popoverEl?.remove();
		};
	});

	$effect(() => {
		if (typeof window === 'undefined' || !open || !anchor || !popoverEl) return;
		const anchorElement = anchor;
		const floatingElement = popoverEl;
		let active = true;

		function position() {
			computePosition(anchorElement, floatingElement, {
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
				if (!active) return;
				Object.assign(floatingElement.style, { left: `${x}px`, top: `${y}px` });
			});
		}

		position();
		const stop = autoUpdate(anchorElement, floatingElement, position);

		function onPointerDown(event: PointerEvent) {
			const target = event.target as Node | null;
			if (target && (anchorElement.contains(target) || floatingElement.contains(target))) return;
			close();
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				event.preventDefault();
				close();
			}
		}

		const pointerOptions: AddEventListenerOptions = { capture: true };
		window.addEventListener('pointerdown', onPointerDown, pointerOptions);
		window.addEventListener('keydown', onKeyDown);

		return () => {
			active = false;
			stop();
			window.removeEventListener('pointerdown', onPointerDown, pointerOptions);
			window.removeEventListener('keydown', onKeyDown);
		};
	});

	onDestroy(() => restorePreviousFocus());
</script>

{#if open && anchor}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		{...rest}
		bind:this={popoverEl}
		class={cn('hyvui-popover', className)}
		role={role}
		aria-labelledby={labelledBy}
		aria-describedby={describedBy}
		tabindex={focusOnOpen ? -1 : undefined}
		data-weight={appearance.weight === 'default' ? undefined : appearance.weight}
		data-theme={appearance.theme === 'default' ? undefined : appearance.theme}
		data-grade={appearance.grade === 'default' ? undefined : appearance.grade}
	>
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

	:global(.hyvui-popover-surface) { padding: 0; }

	.hyvui-popover-content {
		padding: var(--control-pad-y-sm) var(--control-pad-x-sm);
		max-block-size: min(60dvh, 32rem);
		overflow: auto;
		overscroll-behavior: contain;
	}

	@keyframes popover-in {
		from { opacity: 0; transform: translateY(4px); }
		to { opacity: 1; transform: translateY(0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-popover { animation: none; }
	}
</style>

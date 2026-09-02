<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { lockScroll } from '../../system/scroll-lock.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * @example
	 * <Modal open={showModal} title="confirm action" onclose={() => showModal = false}>
	 *   <Text>are you sure you want to proceed?</Text>
	 *   {#snippet footer()}
	 *     <Button variant="primary" onclick={confirm}>proceed</Button>
	 *     <Button variant="ghost" onclick={() => showModal = false}>cancel</Button>
	 *   {/snippet}
	 * </Modal>
	 */
	type Props = Omit<
		HTMLAttributes<HTMLDialogElement>,
		'class' | 'children' | 'id' | 'onclick' | 'onclose' | 'oncancel'
	> & {
		/** Controls modal visibility. */
		open?: boolean;
		/** Optional modal title. */
		title?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Stable dialog id. */
		id?: string;
		/** Existing element id used as the accessible name. */
		labelledBy?: string;
		/** Existing element id used as the accessible description. */
		describedBy?: string;
		/** Explicit accessible name when no title is supplied. */
		ariaLabel?: string;
		/** Optional id for the generated title heading. */
		titleId?: string;
		/** Modal header slot. */
		header?: Snippet;
		/** Modal body content. */
		children?: Snippet;
		/** Modal footer slot. */
		footer?: Snippet;
		/** Fires when the modal is dismissed. */
		onclose?: () => void;
	};

	let {
		open = false,
		title = '',
		class: className = '',
		id,
		labelledBy,
		describedBy,
		ariaLabel,
		titleId,
		header,
		children,
		footer,
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
			previousFocus = document.activeElement;
			if (!dialogEl.open) dialogEl.showModal();
		} else {
			if (dialogEl.open) dialogEl.close();
			restoreFocus();
		}
	});

	$effect(() => {
		if (!open) return;
		return lockScroll();
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogEl) {
			onclose?.();
		}
	}
</script>

	<dialog
		{...rest}
		bind:this={dialogEl}
		{id}
		class={cn('hyvui-modal-backdrop', className)}
		aria-labelledby={labelledBy ?? (titleId ? titleId : undefined)}
		aria-describedby={describedBy}
		aria-label={labelledBy || titleId ? undefined : ariaLabel ?? (title || undefined)}
		onclick={handleBackdropClick}
		oncancel={(e) => {
			e.preventDefault();
			onclose?.();
		}}
		onclose={() => {
			if (open) onclose?.();
		}}
	>
		<Surface variant="panel" class="hyvui-modal-surface">
			{#if header}
				<div class="hyvui-modal-header">
					{@render header()}
				</div>
			{:else if title}
				<div class="hyvui-modal-header">
					<h2 id={titleId} class="hyvui-modal-title">{title}</h2>
				</div>
			{/if}
			{#if children}
				<div class="hyvui-modal-body">
					{@render children()}
				</div>
			{/if}
			{#if footer}
				<div class="hyvui-modal-footer">
					{@render footer()}
				</div>
			{/if}
		</Surface>
	</dialog>

<style>
	.hyvui-modal-backdrop {
		--hyvui-modal-pad: 1.5rem;
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: color-mix(in srgb, var(--bg) 72%, transparent);
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		padding: calc(var(--hyvui-modal-pad) + var(--safe-top))
			calc(var(--hyvui-modal-pad) + var(--safe-right))
			calc(var(--hyvui-modal-pad) + var(--safe-bottom))
			calc(var(--hyvui-modal-pad) + var(--safe-left));
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
	}

	.hyvui-modal-backdrop:not([open]) {
		display: none;
	}

	.hyvui-modal-backdrop::backdrop {
		background: transparent;
	}

	:global(.hyvui-modal-surface) {
		padding: var(--space-card);
		max-width: 32rem;
		width: 100%;
		max-height: calc(100dvh - (2 * var(--hyvui-modal-pad)) - var(--safe-top) - var(--safe-bottom));
		display: flex;
		flex-direction: column;
		min-height: 0;
		backface-visibility: hidden;
		animation: modal-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-modal-header {
		flex-shrink: 0;
		margin-bottom: var(--space-md);
	}

	.hyvui-modal-title {
		font-family: var(--reg-font-primary);
		font-size: var(--text-md);
		font-weight: 400;
		line-height: 0.93;
		letter-spacing: -0.04em;
		color: var(--text);
		margin: 0;
	}

	.hyvui-modal-body {
		font-family: var(--reg-font-primary);
		color: var(--text-soft);
		line-height: 1.6;
		flex: 1;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
	}

	.hyvui-modal-footer {
		flex-shrink: 0;
		margin-top: var(--space-md);
		display: flex;
		justify-content: flex-end;
		gap: var(--space-sm);
	}

	@keyframes modal-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.hyvui-modal-surface) {
			animation: none;
		}
	}
</style>

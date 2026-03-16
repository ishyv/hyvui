<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { lockScroll } from '../../system/scroll-lock.js';
	import Surface from '../primitives/Surface.svelte';
	import type { Snippet } from 'svelte';

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
	interface Props {
		/** Controls modal visibility. */
		open?: boolean;
		/** Optional modal title. */
		title?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Modal header slot. */
		header?: Snippet;
		/** Modal body content. */
		children?: Snippet;
		/** Modal footer slot. */
		footer?: Snippet;
		/** Fires when the modal is dismissed. */
		onclose?: () => void;
	}

	let {
		open = false,
		title = '',
		class: className = '',
		header,
		children,
		footer,
		onclose
	}: Props = $props();

	let dialogEl: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (!dialogEl) return;
		if (open) {
			if (!dialogEl.open) dialogEl.showModal();
		} else {
			if (dialogEl.open) dialogEl.close();
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

{#if open}
	<dialog
		bind:this={dialogEl}
		class={cn('hyvui-modal-backdrop', className)}
		onclick={handleBackdropClick}
		oncancel={(e) => {
			e.preventDefault();
			onclose?.();
		}}
	>
		<Surface variant="panel" class="hyvui-modal-surface">
			{#if header}
				<div class="hyvui-modal-header">
					{@render header()}
				</div>
			{:else if title}
				<div class="hyvui-modal-header">
					<h2 class="hyvui-modal-title">{title}</h2>
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
{/if}

<style>
	.hyvui-modal-backdrop {
		--hyvui-modal-pad: 1.5rem;
		position: fixed;
		inset: 0;
		z-index: var(--z-modal);
		background: rgba(0, 0, 0, 0.72);
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
		animation: modal-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-modal-header {
		flex-shrink: 0;
		margin-bottom: 1rem;
	}

	.hyvui-modal-title {
		font-family: var(--font-body);
		font-size: 1.2rem;
		font-weight: 400;
		line-height: 0.93;
		letter-spacing: -0.04em;
		color: var(--text);
		margin: 0;
	}

	.hyvui-modal-body {
		font-family: var(--font-body);
		color: var(--text-soft);
		line-height: 1.6;
		flex: 1;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
	}

	.hyvui-modal-footer {
		flex-shrink: 0;
		margin-top: 1.25rem;
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
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

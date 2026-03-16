<script lang="ts">
	import Modal from '../layout/Modal.svelte';
	import Button from '../inputs/Button.svelte';
	import Stack from '../layout/Stack.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Controls dialog visibility. */
		open?: boolean;
		/** Action title. Names the action, never asks "are you sure?". */
		title?: string;
		/** Additional description. */
		description?: string;
		/** Confirm button label. */
		confirmLabel?: string;
		/** Cancel button label. */
		cancelLabel?: string;
		/** Makes the confirm button use the destructive variant. */
		destructive?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Fires when the confirm button is clicked. */
		onconfirm?: () => void;
		/** Fires when the cancel button is clicked or dialog is dismissed. */
		oncancel?: () => void;
	}

	let {
		open = false,
		title = '',
		description = '',
		confirmLabel = 'confirm',
		cancelLabel = 'cancel',
		destructive = false,
		class: className = '',
		onconfirm,
		oncancel
	}: Props = $props();
</script>

<Modal {open} {title} class={className} onclose={oncancel}>
	{#if description}
		<p class="hyvui-confirm-desc">{description}</p>
	{/if}
	{#snippet footer()}
		<Stack direction="horizontal" gap="0.75rem" justify="flex-end">
			<Button variant="ghost" onclick={() => oncancel?.()}>{cancelLabel}</Button>
			<Button variant={destructive ? 'destructive' : 'primary'} onclick={() => onconfirm?.()}
				>{confirmLabel}</Button
			>
		</Stack>
	{/snippet}
</Modal>

<style>
	.hyvui-confirm-desc {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-soft);
		line-height: 1.6;
		margin: 0;
	}
</style>

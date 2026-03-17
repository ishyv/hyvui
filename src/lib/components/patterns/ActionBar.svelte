<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Button from '../inputs/Button.svelte';
	import Label from '../primitives/Label.svelte';
	import type { Snippet } from 'svelte';

	/**
	 * @remarks Use on any multi-select list or table. Fixed, bottom-center. Renders nothing when count is 0.
	 * @example
	 * <ActionBar count={selected.length} onclear={() => selected = []}>
	 *   {#snippet actions()}
	 *     <Button variant="ghost" size="sm" onclick={exportSelected}>export</Button>
	 *     <Button variant="destructive" size="sm" onclick={deleteSelected}>delete</Button>
	 *   {/snippet}
	 * </ActionBar>
	 */
	interface Props {
		/** Number of selected items. Bar is visible when count > 0. */
		count?: number;
		/** Additional CSS classes. */
		class?: string;
		/** Bulk action buttons slot. */
		actions?: Snippet;
		/** Fires when clear selection is clicked. */
		onclear?: () => void;
	}

	let { count = 0, class: className = '', actions, onclear }: Props = $props();
</script>

{#if count > 0}
	<div class={cn('hyvui-action-bar', className)}>
		<Label color="accent">{count} selected</Label>
		{#if actions}
			<div class="hyvui-action-bar-actions">
				{@render actions()}
			</div>
		{/if}
		<Button variant="ghost" size="sm" onclick={() => onclear?.()}>clear selection</Button>
	</div>
{/if}

<style>
	.hyvui-action-bar {
		position: fixed;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: var(--z-overlay);
		display: flex;
		align-items: center;
		gap: 1rem;
		background: var(--surface-card);
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: var(--shadow-veil);
		padding: 0.625rem 1.25rem;
		backface-visibility: hidden;
		animation: actionbar-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-action-bar-actions {
		display: flex;
		gap: 0.5rem;
	}

	@keyframes actionbar-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-action-bar {
			animation: none;
		}
	}
</style>

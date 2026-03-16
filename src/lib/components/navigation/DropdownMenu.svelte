<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Popover from '../layout/Popover.svelte';
	import type { Placement } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';

	interface MenuItem {
		label: string;
		value: string;
		disabled?: boolean;
		destructive?: boolean;
	}

	/**
	 * @example
	 * <DropdownMenu
	 *   items={[
	 *     { label: 'edit', value: 'edit' },
	 *     { label: 'delete', value: 'delete', destructive: true }
	 *   ]}
	 *   onselect={(val) => handleAction(val)}
	 * >
	 *   {#snippet trigger()}<Button variant="ghost" size="sm">actions</Button>{/snippet}
	 * </DropdownMenu>
	 */
	interface Props {
		/** Menu items. */
		items?: MenuItem[];
		/** Controlled open state. If undefined, the menu manages its own state. */
		open?: boolean;
		/** Placement for the floating menu. */
		placement?: Placement;
		/** Offset in pixels from trigger. */
		offset?: number;
		/** Additional CSS classes. */
		class?: string;
		/** Trigger snippet (required for a usable menu). */
		trigger?: Snippet;
		/** Fires when an item is selected with its value. */
		onselect?: (value: string) => void;
		/** Fires when open state changes. */
		onopenchange?: (open: boolean) => void;
	}

	let {
		items = [],
		open,
		placement = 'bottom-end',
		offset = 8,
		class: className = '',
		trigger,
		onselect,
		onopenchange
	}: Props = $props();

	let triggerEl: HTMLElement | null = $state(null);
	let internalOpen = $state(false);

	const controlled = $derived(open !== undefined);
	const isOpen = $derived(controlled ? !!open : internalOpen);

	function setOpen(next: boolean) {
		if (!controlled) internalOpen = next;
		onopenchange?.(next);
	}

	function toggle() {
		setOpen(!isOpen);
	}

	function close() {
		setOpen(false);
	}
</script>

<div class={cn('hyvui-dropdown-root', className)}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span class="hyvui-dropdown-trigger" bind:this={triggerEl} onclick={toggle}>
		{#if trigger}{@render trigger()}{/if}
	</span>

	<Popover
		open={isOpen}
		anchor={triggerEl}
		{placement}
		{offset}
		onclose={close}
		class="hyvui-dropdown-popover"
	>
		<div class="hyvui-dropdown-menu" role="menu">
			{#each items as item}
				<button
					type="button"
					role="menuitem"
					class={cn(
						'hyvui-dropdown-item',
						item.disabled && 'hyvui-dropdown-item-disabled',
						item.destructive && 'hyvui-dropdown-item-destructive'
					)}
					disabled={item.disabled}
					onclick={() => {
						if (item.disabled) return;
						onselect?.(item.value);
						close();
					}}
				>
					{item.label}
				</button>
			{/each}
		</div>
	</Popover>
</div>

<style>
	.hyvui-dropdown-root {
		display: inline-flex;
		align-items: center;
	}

	.hyvui-dropdown-trigger {
		display: inline-flex;
		align-items: center;
	}

	:global(.hyvui-dropdown-popover) {
		max-inline-size: min(90dvw, 18rem);
	}

	.hyvui-dropdown-menu {
		padding: var(--space-xs);
	}

	.hyvui-dropdown-item {
		display: block;
		width: 100%;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 0.74rem;
		font-weight: 400;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-soft);
		background: none;
		border: none;
		border-radius: var(--radius-sm);
		padding: 0.75rem 0.85rem;
		cursor: pointer;
		transition:
			transform var(--transition-fast),
			color var(--transition-fast),
			background var(--transition-fast);
	}

	.hyvui-dropdown-item:hover:not(:disabled) {
		transform: translateX(4px);
		background: linear-gradient(90deg, rgba(199, 156, 87, 0.12), transparent 72%);
		color: var(--text);
	}

	.hyvui-dropdown-item-disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-dropdown-item-destructive {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-dropdown-item {
			transition: none;
		}

		.hyvui-dropdown-item:hover:not(:disabled) {
			transform: none;
		}
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	interface NavItem {
		label: string;
		href: string;
		active?: boolean;
		icon?: Snippet;
	}

	/**
	 * @see reveal — add `use:reveal={{ target: '.badge' }}` on items for hover metadata.
	 * @example
	 * <SidebarNav items={[
	 *   { label: 'overview', href: '/', active: true },
	 *   { label: 'settings', href: '/settings' },
	 *   { label: 'archive', href: '/archive' }
	 * ]} />
	 */
	interface Props {
		/** Navigation items. */
		items?: NavItem[];
		/** Additional CSS classes. */
		class?: string;
		/** Fires when a nav item is clicked. */
		onnavigate?: (item: NavItem) => void;
	}

	let { items = [], class: className = '', onnavigate }: Props = $props();
</script>

<nav class={cn('hyvui-sidebar-nav', className)}>
	{#each items as item}
		<a
			href={item.href}
			class={cn('hyvui-sidebar-link', item.active && 'hyvui-sidebar-link-active')}
			onclick={(e) => {
				if (onnavigate) {
					e.preventDefault();
					onnavigate(item);
				}
			}}
		>
			{#if item.icon}
				<span class="hyvui-sidebar-icon" aria-hidden="true">{@render item.icon()}</span>
			{/if}
			<span class="hyvui-sidebar-label">{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.hyvui-sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.hyvui-sidebar-link {
		position: relative;
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
		padding: var(--space-xs) var(--control-pad-x);
		border-left: 1px solid transparent;
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		min-width: 0;
		transition:
			color var(--transition-fast),
			transform var(--transition-fast),
			background var(--transition-fast),
			border-color var(--transition-fast);
	}

	.hyvui-sidebar-link:hover {
		color: var(--text-soft);
		background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 8%, transparent), transparent 76%);
		transform: translateX(2px);
	}

	.hyvui-sidebar-link-active {
		color: var(--accent);
		border-left-color: var(--line-strong);
		background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 14%, transparent), transparent 72%);
		transform: translateX(4px);
	}

	.hyvui-sidebar-icon {
		display: inline-flex;
		inline-size: var(--text-xs);
		block-size: var(--text-xs);
		align-items: center;
		justify-content: center;
		flex: 0 0 auto;
	}

	.hyvui-sidebar-label {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-sidebar-link {
			transition: none;
		}

		.hyvui-sidebar-link-active {
			transform: none;
		}
	}
</style>

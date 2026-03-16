<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface BreadcrumbItem {
		label: string;
		href?: string;
	}

	interface Props {
		/** Breadcrumb trail items. */
		items?: BreadcrumbItem[];
		/** Additional CSS classes. */
		class?: string;
	}

	let { items = [], class: className = '' }: Props = $props();
</script>

<nav class={cn('hyvui-breadcrumb', className)} aria-label="breadcrumb">
	{#each items as item, i}
		{#if i > 0}
			<span class="hyvui-breadcrumb-sep">/</span>
		{/if}
		{#if item.href && i < items.length - 1}
			<a href={item.href} class="hyvui-breadcrumb-link">{item.label}</a>
		{:else}
			<span class="hyvui-breadcrumb-current">{item.label}</span>
		{/if}
	{/each}
</nav>

<style>
	.hyvui-breadcrumb {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--space-xs);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		min-width: 0;
	}

	.hyvui-breadcrumb-sep {
		color: var(--muted-strong);
		opacity: 0.7;
	}

	.hyvui-breadcrumb-link {
		color: var(--muted);
		text-decoration: none;
		transition: color var(--transition-fast);
	}

	.hyvui-breadcrumb-link:hover {
		color: var(--accent);
	}

	.hyvui-breadcrumb-current {
		color: var(--text-soft);
		white-space: nowrap;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-breadcrumb-link {
			transition: none;
		}
	}
</style>

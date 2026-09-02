<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * @example
	 * <EmptyState title="no records found" description="adjust your filters to see results" />
	 * <EmptyState title="nothing here yet">
	 *   <Button variant="primary" onclick={create}>create one</Button>
	 * </EmptyState>
	 */
	interface Props {
		/** Primary message. */
		title?: string;
		/** Secondary description text. */
		description?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Optional CTA slot (e.g. a Button). */
		children?: Snippet;
	}

	let {
		title = 'nothing here yet',
		description = '',
		class: className = '',
		children
	}: Props = $props();
</script>

<div class={cn('hyvui-empty', className)}>
	<p class="hyvui-empty-title">{title}</p>
	{#if description}
		<p class="hyvui-empty-desc">{description}</p>
	{/if}
	{#if children}
		<div class="hyvui-empty-action">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.hyvui-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding: var(--space-xl);
		gap: var(--space-sm);
	}

	.hyvui-empty-title {
		font-family: var(--reg-font-primary);
		font-size: var(--text-md);
		font-weight: 400;
		line-height: 0.93;
		letter-spacing: -0.04em;
		color: var(--text);
		margin: 0;
	}

	.hyvui-empty-desc {
		font-family: var(--reg-font-primary);
		font-size: var(--text-xs);
		color: var(--muted);
		line-height: 1.5;
		max-width: 24rem;
		margin: 0;
	}

	.hyvui-empty-action {
		margin-top: var(--space-xs);
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import EmptyState from '../feedback/EmptyState.svelte';
	import type { Snippet } from 'svelte';

	interface TableColumn {
		key: string;
		label: string;
		align?: 'left' | 'center' | 'right';
	}

	/**
	 * @example
	 * <Table
	 *   columns={[{ key: 'name', label: 'name' }, { key: 'status', label: 'status' }]}
	 *   rows={[{ name: 'alpha', status: 'active' }, { name: 'beta', status: 'pending' }]}
	 * />
	 */
	interface Props {
		/** Column definitions. */
		columns?: TableColumn[];
		/** Row data objects. */
		rows?: Record<string, any>[];
		/** Additional CSS classes. */
		class?: string;
		/** Custom empty state slot. */
		empty?: Snippet;
	}

	let { columns = [], rows = [], class: className = '', empty }: Props = $props();
</script>

{#if rows.length === 0}
	{#if empty}
		{@render empty()}
	{:else}
		<EmptyState title="no data" />
	{/if}
{:else}
	<div class={cn('hyvui-table-wrap', className)}>
		<table class="hyvui-table">
			<thead>
				<tr>
					{#each columns as col}
						<th class="hyvui-table-th" style:text-align={col.align ?? 'left'}>{col.label}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each rows as row}
					<tr class="hyvui-table-row">
						{#each columns as col}
							<td class="hyvui-table-td" style:text-align={col.align ?? 'left'}>
								{row[col.key] ?? ''}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

<style>
	.hyvui-table-wrap {
		overflow-x: auto;
	}

	.hyvui-table {
		width: 100%;
		border-collapse: collapse;
	}

	.hyvui-table-th {
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		padding: var(--space-xs) var(--space-sm);
		border-bottom: 1px solid var(--line);
	}

	.hyvui-table-td {
		font-family: var(--reg-font-primary);
		font-size: var(--text-sm);
		color: var(--text-soft);
		padding: var(--space-xs) var(--space-sm);
		border-bottom: 1px solid var(--line);
	}

	.hyvui-table-row {
		transition: background-color var(--transition-fast);
	}

	.hyvui-table-row:hover {
		background-color: color-mix(in srgb, var(--accent) 4%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-table-row {
			transition: none;
		}
	}
</style>

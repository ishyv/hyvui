<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import ScanBand from '../ambient/ScanBand.svelte';
	import type { Snippet } from 'svelte';

	/**
	 * @remarks Use for dashboards, data views, log monitors. Dense, mono-forward with optional right sidebar.
	 * @example
	 * <ReadoutScene title="mission control">
	 *   {#snippet header()}<StatusDot status="ok" /><Label>all systems nominal</Label>{/snippet}
	 *   <Grid minColWidth="14rem" maxCols={4}>
	 *     <MetricCard label="uptime" value="99.9%" />
	 *   </Grid>
	 *   {#snippet sidebar()}<SidebarNav items={navItems} />{/snippet}
	 * </ReadoutScene>
	 */
	interface Props {
		/** Optional title rendered as a readout expression label. */
		title?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Top bar area for labels and status indicators. */
		header?: Snippet;
		/** Main content area. */
		children?: Snippet;
		/** Optional right sidebar. */
		sidebar?: Snippet;
		/** Sidebar width (used when sidebar is provided). */
		sidebarWidth?: string;
	}

	let {
		title = '',
		class: className = '',
		header,
		children,
		sidebar,
		sidebarWidth = '17rem'
	}: Props = $props();
</script>

<section class={cn('hyvui-readout', className)}>
	<div
		class="hyvui-readout-scan"
		aria-hidden="true"
		style:opacity="calc(0.4 * var(--reg-ornament-opacity))"
	>
		<ScanBand />
	</div>
	<div class="hyvui-readout-inner">
		{#if header || title}
			<div class="hyvui-readout-header">
				{#if title}
					<span class="expr-readout">{title}</span>
				{/if}
				{#if header}
					{@render header()}
				{/if}
			</div>
		{/if}
		<div
			class={cn('hyvui-readout-body', sidebar && 'hyvui-readout-body-sidebar')}
			style:--hyv-readout-sidebar-w={sidebarWidth}
		>
			<div class="hyvui-readout-main">
				{#if children}{@render children()}{/if}
			</div>
			{#if sidebar}
				<aside class="hyvui-readout-sidebar">
					{@render sidebar()}
				</aside>
			{/if}
		</div>
	</div>
</section>

<style>
	.hyvui-readout {
		position: relative;
		min-height: 100dvh;
		padding: var(--space-scene);
		background-color: var(--bg);
		container-type: inline-size;
	}

	.hyvui-readout-scan {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hyvui-readout-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: calc(1.5rem * var(--reg-spacing-scale));
		width: 100%;
	}

	.hyvui-readout-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		min-width: 0;
	}

	.hyvui-readout-body {
		width: 100%;
	}

	.hyvui-readout-body-sidebar {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, var(--hyv-readout-sidebar-w, 17rem));
		gap: calc(1.5rem * var(--reg-spacing-scale));
	}

	.hyvui-readout-main {
		min-width: 0;
	}

	.hyvui-readout-sidebar {
		min-width: 0;
	}

	@container (max-width: var(--cq-md)) {
		.hyvui-readout-body-sidebar {
			grid-template-columns: 1fr;
		}
	}
</style>

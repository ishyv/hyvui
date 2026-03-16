<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Grid mode. `auto` computes columns from container width. */
		mode?: 'auto' | 'template';
		/** CSS grid-template-columns value (used when mode = 'template'). */
		cols?: string | number;
		/** Minimum column width (used when mode = 'auto'). */
		minColWidth?: string;
		/** Maximum number of columns (used when mode = 'auto'). */
		maxCols?: number;
		/** Gap between grid items. */
		gap?: string;
		/** HTML tag to render. */
		as?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Grid children. */
		children?: Snippet;
	}

	let {
		mode = 'auto',
		cols = 1,
		minColWidth = '16rem',
		maxCols,
		gap = 'var(--space-md)',
		as = 'div',
		class: className = '',
		children
	}: Props = $props();

	let gridEl: HTMLElement | undefined = $state();
	let gridCols = $state('repeat(1, minmax(0, 1fr))');

	function readGapPx(el: HTMLElement): number {
		const cs = getComputedStyle(el);
		const raw = cs.columnGap || cs.gap || '0';
		const px = Number.parseFloat(raw);
		return Number.isFinite(px) ? px : 0;
	}

	function measureWidthPx(el: HTMLElement, width: string): number {
		const probe = document.createElement('div');
		probe.style.position = 'absolute';
		probe.style.visibility = 'hidden';
		probe.style.pointerEvents = 'none';
		probe.style.width = width;
		probe.style.height = '0';
		probe.style.padding = '0';
		probe.style.border = '0';
		el.appendChild(probe);
		const px = probe.getBoundingClientRect().width;
		probe.remove();
		return px > 0 ? px : 0;
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		if (!gridEl) return;
		const el = gridEl;

		if (mode === 'template') {
			gridCols = typeof cols === 'string' ? cols : `repeat(${cols}, minmax(0, 1fr))`;
			return;
		}

		// Back-compat: if callers pass a numeric `cols` in auto mode, treat it as maxCols.
		const max = maxCols ?? (typeof cols === 'number' ? cols : undefined);

		let minPx = measureWidthPx(el, minColWidth);
		if (minPx <= 0) minPx = 16 * 16; // fallback: 16rem at 16px root

		let last = 0;
		const ro = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const width = entry.contentRect.width;
			const gapPx = readGapPx(el);
			const next = Math.max(1, Math.floor((width + gapPx) / (minPx + gapPx)));
			const clamped = max ? Math.min(next, max) : next;
			if (clamped === last) return;
			last = clamped;
			gridCols = `repeat(${clamped}, minmax(0, 1fr))`;
		});

		ro.observe(el);

		// Seed with initial measurement.
		const width = el.getBoundingClientRect().width;
		const gapPx = readGapPx(el);
		const next = Math.max(1, Math.floor((width + gapPx) / (minPx + gapPx)));
		last = max ? Math.min(next, max) : next;
		gridCols = `repeat(${last}, minmax(0, 1fr))`;

		return () => ro.disconnect();
	});
</script>

<svelte:element
	this={as}
	bind:this={gridEl}
	class={cn('hyvui-grid', className)}
	style:--hyv-grid-cols={gridCols}
	style:gap
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-grid {
		display: grid;
		min-width: 0;
		grid-template-columns: var(--hyv-grid-cols);
	}
</style>

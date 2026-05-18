<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Decorative corner brackets with an Art Deco / Hextech filigree motif.
	 * Renders four corners as SVG ornaments. Parent must have `position: relative`.
	 * Under `hextech`: bright brass. Under `arcane`: subdued violet-tinted.
	 * Renders `aria-hidden`.
	 * @example
	 * <div style="position: relative; padding: var(--space-xl);">
	 *   <BrassFiligree size={40} />
	 *   framed content
	 * </div>
	 */
	interface Props {
		/** Arm length in pixels. */
		size?: number;
		/** Additional CSS classes. */
		class?: string;
	}

	let { size = 40, class: className = '' }: Props = $props();

	// Filigree corner SVG path:
	// - Two arms (top+left or equivalent) of the given length
	// - Small interior notch at 45° angle (the "filigree" detail)
	// - Tiny rivet dot at the corner apex
	// All paths are for a top-left oriented corner; CSS rotation handles others.
	const arm = $derived(size);
	const notch = $derived(Math.round(size * 0.28));
	const rivet = $derived(Math.round(size * 0.09));
</script>

<div class={cn('hyvui-brass-filigree', className)} aria-hidden="true">
	{#each ['tl', 'tr', 'bl', 'br'] as pos}
		<svg
			class="hyvui-bf-corner hyvui-bf-{pos}"
			width={arm}
			height={arm}
			viewBox="0 0 {arm} {arm}"
			fill="none"
		>
			<!-- main bracket arms -->
			<polyline
				class="hyvui-bf-arm"
				points="{arm},1 1,1 1,{arm}"
				stroke-width="1"
			/>
			<!-- interior notch (diagonal filigree detail) -->
			<line
				class="hyvui-bf-notch"
				x1={notch}
				y1="1"
				x2="1"
				y2={notch}
				stroke-width="0.75"
			/>
			<!-- apex rivet dot -->
			<circle class="hyvui-bf-rivet" cx="1" cy="1" r={rivet} />
		</svg>
	{/each}
</div>

<style>
	.hyvui-brass-filigree {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hyvui-bf-corner {
		position: absolute;
		overflow: visible;
	}

	.hyvui-bf-tl { top: 0; left: 0; }
	.hyvui-bf-tr { top: 0; right: 0; transform: scaleX(-1); }
	.hyvui-bf-bl { bottom: 0; left: 0; transform: scaleY(-1); }
	.hyvui-bf-br { bottom: 0; right: 0; transform: scale(-1); }

	/* ── default (field-notebook) ─────────────────────────────────────── */
	.hyvui-bf-arm   { stroke: color-mix(in srgb, var(--accent) 30%, transparent); }
	.hyvui-bf-notch { stroke: color-mix(in srgb, var(--accent) 15%, transparent); }
	.hyvui-bf-rivet { fill: color-mix(in srgb, var(--accent) 35%, transparent); }

	/* ── hextech: bright brass precision ──────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-bf-arm {
		stroke: color-mix(in srgb, var(--htx-brass-bright) 65%, transparent);
		stroke-width: 1.2px;
	}
	:global([data-theme='hextech']) .hyvui-bf-notch {
		stroke: color-mix(in srgb, var(--htx-cyan-glow) 35%, transparent);
	}
	:global([data-theme='hextech']) .hyvui-bf-rivet {
		fill: color-mix(in srgb, var(--htx-brass-bright) 80%, transparent);
	}

	/* ── arcane: dim violet-tinted, thinner ───────────────────────────── */
	:global([data-theme='arcane']) .hyvui-bf-arm {
		stroke: color-mix(in srgb, var(--arc-magenta) 28%, transparent);
		stroke-width: 0.8px;
	}
	:global([data-theme='arcane']) .hyvui-bf-notch {
		stroke: color-mix(in srgb, var(--arc-shimmer) 18%, transparent);
	}
	:global([data-theme='arcane']) .hyvui-bf-rivet {
		fill: color-mix(in srgb, var(--arc-shimmer) 30%, transparent);
	}
</style>


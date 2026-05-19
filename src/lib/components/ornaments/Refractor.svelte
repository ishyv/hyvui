<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Prism / facet content break — a series of clip-path triangles with theme
	 * tints. Used as a decorative section transition. Sits between sections,
	 * about 16-32px tall by default.
	 *
	 * @example
	 * <section>...</section>
	 * <Refractor facets={7} />
	 * <section>...</section>
	 */
	interface Props {
		facets?: number;
		axis?: 'h' | 'v';
		intensity?: 'subtle' | 'normal' | 'shatter';
		class?: string;
	}

	let {
		facets = 5,
		axis = 'h',
		intensity = 'normal',
		class: className = ''
	}: Props = $props();

	const widths = $derived(
		Array.from({ length: facets }, () => 1 / facets)
	);
	const opacityScale = {
		subtle: 0.22,
		normal: 0.42,
		shatter: 0.7
	} as const;
</script>

<div
	class={cn(
		'hyvui-refractor',
		`hyvui-refractor-${axis}`,
		`hyvui-refractor-${intensity}`,
		className
	)}
	style:--refr-opacity={opacityScale[intensity]}
	aria-hidden="true"
>
	{#each widths as w, i}
		<span
			class="hyvui-refractor-facet"
			style:flex="0 0 {w * 100}%"
			style:--refr-i={i}
		></span>
	{/each}
</div>

<style>
	.hyvui-refractor {
		display: flex;
		width: 100%;
		height: 1.5rem;
		gap: 1px;
		pointer-events: none;
	}
	.hyvui-refractor-v {
		flex-direction: column;
		width: 1.5rem;
		height: 100%;
	}
	.hyvui-refractor-facet {
		background: color-mix(in srgb, var(--accent) calc(var(--refr-opacity, 0.42) * 100%), transparent);
		clip-path: polygon(0 0, 100% 0, 50% 100%);
		filter: brightness(calc(0.6 + 0.15 * var(--refr-i, 0)));
	}
	.hyvui-refractor-shatter .hyvui-refractor-facet {
		clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
	}
	.hyvui-refractor-v .hyvui-refractor-facet {
		clip-path: polygon(0 0, 100% 50%, 0 100%);
	}

	:global([data-theme='hextech']) .hyvui-refractor-facet {
		background: color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) calc(var(--refr-opacity, 0.42) * 100%), transparent);
	}
	:global([data-theme='arcane']) .hyvui-refractor-facet {
		background: color-mix(in srgb, var(--arc-magenta, var(--accent)) calc(var(--refr-opacity, 0.42) * 100%), transparent);
		filter: brightness(calc(0.6 + 0.2 * var(--refr-i, 0)))
			drop-shadow(0 0 4px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 25%, transparent));
	}
</style>

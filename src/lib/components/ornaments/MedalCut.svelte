<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Clip-path wrapper. Renders children inside a chosen polygon shape.
	 * Theme overlays add a tinted outline matching the cut.
	 *
	 * @example
	 * <MedalCut cut="shield">
	 *   <Badge variant="accent">tier 3</Badge>
	 * </MedalCut>
	 */
	interface Props {
		cut?: 'shield' | 'hex' | 'parallelogram' | 'banner' | 'tab';
		class?: string;
		children?: Snippet;
	}

	let { cut = 'shield', class: className = '', children }: Props = $props();

	const clipPaths = {
		shield: 'polygon(50% 0%, 100% 22%, 100% 78%, 50% 100%, 0% 78%, 0% 22%)',
		hex: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
		parallelogram: 'polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)',
		banner: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
		tab: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)'
	} as const;
</script>

<span
	class={cn('hyvui-medal-cut', `hyvui-medal-cut-${cut}`, className)}
	style:clip-path={clipPaths[cut]}
>
	{#if children}{@render children()}{/if}
</span>

<style>
	.hyvui-medal-cut {
		display: inline-flex;
		position: relative;
	}

	/* ── hextech: brass outline echo ─────────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-medal-cut {
		filter:
			drop-shadow(0 0 0.5px var(--htx-brass-bright, var(--accent-strong)))
			drop-shadow(0 0 4px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 25%, transparent));
	}

	/* ── arcane: magenta gradient halo ───────────────────────────────── */
	:global([data-theme='arcane']) .hyvui-medal-cut {
		filter:
			drop-shadow(0 0 0.5px var(--arc-magenta, var(--accent)))
			drop-shadow(0 0 6px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 35%, transparent));
	}
</style>

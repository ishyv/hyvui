<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Circular emblem with concentric rings and optional radial spokes.
	 * Slot accepts a centered child — typically a Glyph. Theme overlays
	 * transform the seal: hextech reads as a compass rose, arcane as a
	 * pulsing void emblem.
	 *
	 * @example
	 * <Seal rings={3} spokes={8}>
	 *   <Glyph name="compass-rose" />
	 * </Seal>
	 */
	interface Props {
		rings?: number;
		spokes?: number;
		radius?: string;
		tone?: 'accent' | 'signal' | 'muted' | 'text';
		class?: string;
		children?: Snippet;
	}

	let {
		rings = 2,
		spokes = 0,
		radius = '64px',
		tone = 'muted',
		class: className = '',
		children
	}: Props = $props();

	const toneColor = {
		accent: 'var(--accent)',
		signal: 'var(--signal)',
		muted: 'var(--muted)',
		text: 'var(--text)'
	} as const;

	const ringRadii = $derived(
		Array.from({ length: rings }, (_, i) => 50 - i * (40 / Math.max(rings, 1)))
	);
	const spokeAngles = $derived(
		Array.from({ length: spokes }, (_, i) => (i * 360) / spokes)
	);
</script>

<span
	class={cn('hyvui-seal', className)}
	style:width={radius}
	style:height={radius}
	style:color={toneColor[tone]}
>
	<svg viewBox="0 0 100 100" class="hyvui-seal-svg" aria-hidden="true">
		{#each ringRadii as r, i}
			<circle
				cx="50"
				cy="50"
				r={r}
				fill="none"
				stroke="currentColor"
				stroke-width={i === 0 ? 1.5 : 0.6}
				opacity={1 - i * 0.18}
			/>
		{/each}
		{#each spokeAngles as a}
			{@const rad = (a * Math.PI) / 180}
			<line
				x1={50 + Math.cos(rad) * (ringRadii[ringRadii.length - 1] - 4)}
				y1={50 + Math.sin(rad) * (ringRadii[ringRadii.length - 1] - 4)}
				x2={50 + Math.cos(rad) * (ringRadii[0] - 2)}
				y2={50 + Math.sin(rad) * (ringRadii[0] - 2)}
				stroke="currentColor"
				stroke-width="0.6"
				opacity="0.45"
			/>
		{/each}
	</svg>
	{#if children}
		<span class="hyvui-seal-center">{@render children()}</span>
	{/if}
</span>

<style>
	.hyvui-seal {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.hyvui-seal-svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.hyvui-seal-center {
		position: absolute;
		inset: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 40%;
	}

	/* ── hextech: brass color, sharper rings ─────────────────────────── */
	:global([data-theme='hextech']) .hyvui-seal {
		color: var(--htx-brass-bright, var(--accent-strong));
		filter: drop-shadow(0 0 4px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 25%, transparent));
	}

	/* ── arcane: magenta breathing pulse ─────────────────────────────── */
	:global([data-theme='arcane']) .hyvui-seal {
		color: var(--arc-magenta, var(--accent));
		filter: drop-shadow(0 0 6px color-mix(in srgb, var(--arc-magenta, var(--accent)) 35%, transparent));
		animation: seal-arcane-pulse 4s var(--ease-smooth) infinite;
	}
	@keyframes seal-arcane-pulse {
		0%, 100% { transform: scale(1); }
		50%      { transform: scale(1.03); }
	}

	/* ── register overlays ───────────────────────────────────────────── */
	:global([data-weight='archive']) .hyvui-seal {
		filter: blur(0.2px) drop-shadow(0 0 1px color-mix(in srgb, currentColor 20%, transparent));
		opacity: 0.85;
	}
	:global([data-weight='field-notebook']) .hyvui-seal {
		transform: rotate(-2deg);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='arcane']) .hyvui-seal {
			animation: none;
		}
	}
</style>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { cn } from '../../utils/cn.js';
	import {
		currentRegister,
		onRegisterChange
	} from '../../system/motion/registerObserver.js';
	import {
		resolveGlyph,
		type GlyphName,
		type GlyphSource
	} from './glyphs/index.js';

	/**
	 * Renders a register- or theme-aware glyph from the library.
	 *
	 * Resolution order:
	 *   1. explicit `source` prop, if given
	 *   2. active theme (hextech / arcane), if not 'default'
	 *   3. active register (field-notebook / mission-control / archive)
	 *   4. default library
	 *
	 * @example
	 * <Glyph name="asterisk" />
	 * <Glyph name="hex-rune-a" source="hextech" size="20" />
	 * <Glyph name="dagger" tone="accent" />
	 */
	interface Props {
		/** Glyph name. Falls through to default if the chosen library doesn't define it. */
		name: GlyphName;
		/** Override library source. If omitted, follows the active theme/register. */
		source?: GlyphSource;
		/** Color tone — picks up a CSS variable. */
		tone?: 'inherit' | 'accent' | 'signal' | 'muted' | 'text';
		/** SVG width/height in CSS units. */
		size?: string;
		/** Stroke-width override (when applicable). */
		strokeWidth?: number;
		class?: string;
	}

	let {
		name,
		source,
		tone = 'inherit',
		size = '1em',
		strokeWidth,
		class: className = ''
	}: Props = $props();

	let snapshot = $state(currentRegister());
	const unsub = onRegisterChange((s) => (snapshot = s));
	onDestroy(unsub);

	const resolvedSource = $derived(
		source ??
			(snapshot.theme !== 'default'
				? (snapshot.theme as GlyphSource)
				: (snapshot.register as GlyphSource))
	);

	const glyph = $derived(resolveGlyph(name, resolvedSource, 'default'));

	const toneColor: Record<NonNullable<Props['tone']>, string> = {
		inherit: 'currentColor',
		accent: 'var(--accent)',
		signal: 'var(--signal)',
		muted: 'var(--muted)',
		text: 'var(--text)'
	};
</script>

<svg
	class={cn('hyvui-glyph', `hyvui-glyph-${name}`, className)}
	viewBox={glyph.viewBox}
	width={size}
	height={size}
	fill={glyph.filled ? 'currentColor' : 'none'}
	stroke={glyph.filled ? 'none' : 'currentColor'}
	stroke-width={strokeWidth ?? glyph.strokeWidth ?? 1.5}
	stroke-linecap="round"
	stroke-linejoin="round"
	style:color={toneColor[tone]}
	aria-hidden="true"
>
	{@html glyph.content}
</svg>

<style>
	.hyvui-glyph {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
	}

	/* ── hextech: add cyan glow halo ──────────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-glyph {
		filter: drop-shadow(0 0 2px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 30%, transparent));
	}

	/* ── arcane: add magenta breathing glow ───────────────────────────── */
	:global([data-theme='arcane']) .hyvui-glyph {
		filter: drop-shadow(0 0 3px color-mix(in srgb, var(--arc-magenta, var(--accent)) 40%, transparent));
		animation: glyph-arcane-pulse 3s var(--ease-smooth) infinite;
	}

	@keyframes glyph-arcane-pulse {
		0%, 100% {
			filter: drop-shadow(0 0 3px color-mix(in srgb, var(--arc-magenta, var(--accent)) 40%, transparent));
		}
		50% {
			filter: drop-shadow(0 0 6px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 55%, transparent));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='arcane']) .hyvui-glyph {
			animation: none;
		}
	}
</style>

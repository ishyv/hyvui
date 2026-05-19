<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { divider, type DividerVariants } from './Divider.tv.js';

	/**
	 * @example
	 * <Divider />
	 * <Divider strength="strong" pattern="dashed" />
	 * <Divider pattern="chevron" />
	 * <Divider orientation="v" />
	 */
	interface Props {
		strength?: DividerVariants['strength'];
		pattern?: DividerVariants['pattern'];
		orientation?: DividerVariants['orientation'];
		class?: string;
	}

	let {
		strength = 'default',
		pattern = 'solid',
		orientation = 'h',
		class: className = ''
	}: Props = $props();
</script>

{#if pattern === 'chevron'}
	<div class={cn(divider({ strength, pattern, orientation }), className)} aria-hidden="true">
		<svg viewBox="0 0 200 8" preserveAspectRatio="none" class="hyvui-divider-svg">
			<path d="M0 4 L10 0 L20 4 L30 0 L40 4 L50 0 L60 4 L70 0 L80 4 L90 0 L100 4 L110 0 L120 4 L130 0 L140 4 L150 0 L160 4 L170 0 L180 4 L190 0 L200 4" stroke="currentColor" fill="none" stroke-width="1" />
		</svg>
	</div>
{:else if pattern === 'scribed'}
	<div class={cn(divider({ strength, pattern, orientation }), className)} aria-hidden="true">
		<svg viewBox="0 0 200 6" preserveAspectRatio="none" class="hyvui-divider-svg">
			<path d="M0 3 C 20 1, 40 5, 60 3 S 100 1, 120 3 S 160 5, 180 3 L 200 3" stroke="currentColor" fill="none" stroke-width="0.8" />
		</svg>
	</div>
{:else if pattern === 'stepped'}
	<div class={cn(divider({ strength, pattern, orientation }), className)} aria-hidden="true">
		<svg viewBox="0 0 200 6" preserveAspectRatio="none" class="hyvui-divider-svg">
			<path d="M0 4 L25 4 L25 2 L50 2 L50 4 L75 4 L75 2 L100 2 L100 4 L125 4 L125 2 L150 2 L150 4 L175 4 L175 2 L200 2" stroke="currentColor" fill="none" stroke-width="1" />
		</svg>
	</div>
{:else}
	<hr class={cn(divider({ strength, pattern, orientation }), className)} />
{/if}

<style>
	.hyvui-divider {
		border: none;
		margin: 0;
		display: block;
	}
	.hyvui-divider-h {
		width: 100%;
		height: 1px;
	}
	.hyvui-divider-v {
		width: 1px;
		height: 100%;
		min-height: 1rem;
	}

	/* color (strength) — applied via currentColor / border-color */
	.hyvui-divider {
		color: var(--line);
	}
	.hyvui-divider-strong {
		color: var(--line-strong);
	}

	/* ── solid ────────────────────────────────────────────────────────── */
	.hyvui-divider-solid.hyvui-divider-h {
		border-top: 1px solid currentColor;
	}
	.hyvui-divider-solid.hyvui-divider-v {
		border-left: 1px solid currentColor;
	}

	/* ── dashed ───────────────────────────────────────────────────────── */
	.hyvui-divider-dashed.hyvui-divider-h {
		border-top: 1px dashed currentColor;
	}
	.hyvui-divider-dashed.hyvui-divider-v {
		border-left: 1px dashed currentColor;
	}

	/* ── dotted ───────────────────────────────────────────────────────── */
	.hyvui-divider-dotted.hyvui-divider-h {
		border-top: 1.5px dotted currentColor;
	}
	.hyvui-divider-dotted.hyvui-divider-v {
		border-left: 1.5px dotted currentColor;
	}

	/* ── double ───────────────────────────────────────────────────────── */
	.hyvui-divider-double.hyvui-divider-h {
		border-top: 3px double currentColor;
		height: 3px;
	}
	.hyvui-divider-double.hyvui-divider-v {
		border-left: 3px double currentColor;
		width: 3px;
	}

	/* ── chevron / scribed / stepped — SVG-rendered ──────────────────── */
	.hyvui-divider-chevron,
	.hyvui-divider-scribed,
	.hyvui-divider-stepped {
		height: 0.5rem;
		width: 100%;
		color: var(--line-strong);
	}
	.hyvui-divider-svg {
		display: block;
		width: 100%;
		height: 100%;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	/* ── hextech overlay: brass-cyan-brass gradient on solid; tinted color for SVG patterns ── */
	:global([data-theme='hextech']) .hyvui-divider-solid.hyvui-divider-h,
	:global([data-theme='hextech']) .hyvui-divider-dashed.hyvui-divider-h,
	:global([data-theme='hextech']) .hyvui-divider-dotted.hyvui-divider-h,
	:global([data-theme='hextech']) .hyvui-divider-double.hyvui-divider-h {
		border-image: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--htx-brass) 50%, transparent) 20%,
			color-mix(in srgb, var(--htx-cyan-glow) 35%, transparent) 50%,
			color-mix(in srgb, var(--htx-brass) 50%, transparent) 80%,
			transparent
		) 1;
	}
	:global([data-theme='hextech']) .hyvui-divider-chevron,
	:global([data-theme='hextech']) .hyvui-divider-scribed,
	:global([data-theme='hextech']) .hyvui-divider-stepped {
		color: color-mix(in srgb, var(--htx-cyan-glow) 65%, transparent);
	}

	/* ── arcane overlay: magenta glow gradient ───────────────────────── */
	:global([data-theme='arcane']) .hyvui-divider-solid.hyvui-divider-h,
	:global([data-theme='arcane']) .hyvui-divider-dashed.hyvui-divider-h,
	:global([data-theme='arcane']) .hyvui-divider-dotted.hyvui-divider-h,
	:global([data-theme='arcane']) .hyvui-divider-double.hyvui-divider-h {
		border-image: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--arc-magenta) 55%, transparent) 25%,
			color-mix(in srgb, var(--arc-shimmer) 65%, transparent) 50%,
			color-mix(in srgb, var(--arc-magenta) 55%, transparent) 75%,
			transparent
		) 1;
		filter: drop-shadow(0 0 3px color-mix(in srgb, var(--arc-magenta) 30%, transparent));
	}
	:global([data-theme='arcane']) .hyvui-divider-chevron,
	:global([data-theme='arcane']) .hyvui-divider-scribed,
	:global([data-theme='arcane']) .hyvui-divider-stepped {
		color: var(--arc-magenta);
		filter: drop-shadow(0 0 3px color-mix(in srgb, var(--arc-magenta) 40%, transparent));
	}
</style>

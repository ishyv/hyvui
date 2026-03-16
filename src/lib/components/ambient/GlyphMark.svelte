<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Glyph variant. */
		variant?: 'cross' | 'reticle' | 'coord' | 'mark';
		/** Size in pixels. */
		size?: number;
		/** Glyph color. */
		color?: string;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		variant = 'cross',
		size = 24,
		color = 'var(--muted-strong)',
		class: className = ''
	}: Props = $props();
</script>

<svg
	class={cn('hyvui-glyph-mark', className)}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke={color}
	stroke-width="1"
	aria-hidden="true"
>
	{#if variant === 'cross'}
		<!-- coordinate cross -->
		<line x1="12" y1="4" x2="12" y2="20" />
		<line x1="4" y1="12" x2="20" y2="12" />
		<circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
	{:else if variant === 'reticle'}
		<!-- targeting reticle -->
		<circle cx="12" cy="12" r="8" />
		<circle cx="12" cy="12" r="3" />
		<line x1="12" y1="1" x2="12" y2="5" />
		<line x1="12" y1="19" x2="12" y2="23" />
		<line x1="1" y1="12" x2="5" y2="12" />
		<line x1="19" y1="12" x2="23" y2="12" />
	{:else if variant === 'coord'}
		<!-- cartographic coordinate marker -->
		<line x1="12" y1="2" x2="12" y2="8" />
		<line x1="12" y1="16" x2="12" y2="22" />
		<line x1="2" y1="12" x2="8" y2="12" />
		<line x1="16" y1="12" x2="22" y2="12" />
		<rect x="9" y="9" width="6" height="6" rx="0.5" />
	{:else if variant === 'mark'}
		<!-- measurement mark -->
		<line x1="4" y1="20" x2="20" y2="4" />
		<line x1="4" y1="20" x2="4" y2="15" />
		<line x1="4" y1="20" x2="9" y2="20" />
		<circle cx="12" cy="12" r="1" fill={color} stroke="none" />
	{/if}
</svg>

<style>
	.hyvui-glyph-mark {
		display: inline-block;
		pointer-events: none;
		flex-shrink: 0;
		opacity: 0.5;
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Motion multiplier applied to --px/--py custom properties. */
		strength?: number;
		/** Additional CSS classes. */
		class?: string;
		/** Content to apply parallax to. */
		children?: Snippet;
	}

	let { strength = 18, class: className = '', children }: Props = $props();
</script>

<div
	class={cn('hyvui-parallax', className)}
	style:transform="translate(calc(var(--px, 0) * {strength}px), calc(var(--py, 0) * {strength}px))"
	aria-hidden="true"
>
	{#if children}{@render children()}{/if}
</div>

<style>
	.hyvui-parallax {
		will-change: transform;
		transition: transform 0.15s ease-out;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-parallax {
			transform: none !important;
			transition: none;
		}
	}
</style>

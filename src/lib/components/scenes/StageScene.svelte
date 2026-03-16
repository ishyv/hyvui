<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import CornerBrackets from '../ambient/CornerBrackets.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Additional CSS classes. */
		class?: string;
		/** Above heading (Label or chapter expression). */
		label?: Snippet;
		/** Primary statement. */
		heading?: Snippet;
		/** Secondary line. */
		subheading?: Snippet;
		/** CTA area. */
		actions?: Snippet;
		/** Behind everything (GridOverlay, ParallaxLayer, etc.). */
		ambient?: Snippet;
	}

	let { class: className = '', label, heading, subheading, actions, ambient }: Props = $props();
</script>

<section class={cn('hyvui-stage', className)}>
	{#if ambient}
		<div class="hyvui-stage-ambient" aria-hidden="true">
			{@render ambient()}
		</div>
	{/if}
	<div class="hyvui-stage-brackets" aria-hidden="true" style:opacity="var(--reg-ornament-opacity)">
		<CornerBrackets />
	</div>
	<div class="hyvui-stage-content">
		{#if label}
			<div class="hyvui-stage-label">
				{@render label()}
			</div>
		{/if}
		{#if heading}
			<div class="hyvui-stage-heading">
				{@render heading()}
			</div>
		{/if}
		{#if subheading}
			<div class="hyvui-stage-subheading">
				{@render subheading()}
			</div>
		{/if}
		{#if actions}
			<div class="hyvui-stage-actions">
				{@render actions()}
			</div>
		{/if}
	</div>
</section>

<style>
	.hyvui-stage {
		position: relative;
		min-height: 100dvh;
		padding: var(--space-scene);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.hyvui-stage-ambient {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hyvui-stage-brackets {
		position: absolute;
		inset: var(--space-scene);
		pointer-events: none;
	}

	.hyvui-stage-content {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: calc(2rem * var(--reg-spacing-scale));
	}

	.hyvui-stage-subheading {
		max-width: 32rem;
	}

	.hyvui-stage-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: calc(-1rem * var(--reg-spacing-scale));
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import GridOverlay from '../ambient/GridOverlay.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Section label rendered as a chapter expression above the heading. */
		chapter?: string;
		/** Additional CSS classes. */
		class?: string;
		/** The scene's title content. */
		heading?: Snippet;
		/** Prose content in the narrow left column. */
		copy?: Snippet;
		/** Open canvas area in the right column. */
		canvas?: Snippet;
	}

	let { chapter = '', class: className = '', heading, copy, canvas }: Props = $props();
</script>

<section class={cn('hyvui-narrative', className)}>
	<div
		class="hyvui-narrative-grid-bg"
		aria-hidden="true"
		style:opacity="var(--reg-ornament-opacity)"
	>
		<GridOverlay />
	</div>
	<div class="hyvui-narrative-grid">
		<div class="hyvui-narrative-copy">
			{#if chapter}
				<span class="expr-chapter">{chapter}</span>
			{/if}
			{#if heading}
				<div class="hyvui-narrative-heading">
					{@render heading()}
				</div>
			{/if}
			{#if copy}
				<div class="hyvui-narrative-prose">
					{@render copy()}
				</div>
			{/if}
		</div>
		{#if canvas}
			<div class="hyvui-narrative-canvas">
				{@render canvas()}
			</div>
		{/if}
	</div>
</section>

<style>
	.hyvui-narrative {
		position: relative;
		min-height: 100dvh;
		padding: var(--space-scene);
		display: flex;
		align-items: center;
		container-type: inline-size;
	}

	.hyvui-narrative-grid-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hyvui-narrative-grid {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
		gap: calc(2rem * var(--reg-spacing-scale));
		width: 100%;
		align-items: center;
	}

	.hyvui-narrative-copy {
		display: flex;
		flex-direction: column;
		gap: calc(1.25rem * var(--reg-spacing-scale));
		max-width: 30rem;
	}

	@container (max-width: var(--cq-md)) {
		.hyvui-narrative-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

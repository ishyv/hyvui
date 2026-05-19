<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Content shell. Caps width at --shell-max, pads inline with --shell-pad,
	 * centers via margin-inline. Wrap scenes or top-level routes with this so
	 * ultrawide displays stop spilling content edge-to-edge.
	 *
	 * @example
	 * <Shell as="main">
	 *   <PageHeader title="docs" />
	 *   <Stack gap="var(--space-lg)">{ ... }</Stack>
	 * </Shell>
	 *
	 * <Shell max="56rem" pad="var(--space-lg)">narrow long-form content</Shell>
	 */
	interface Props {
		/** Override --shell-max for this instance (any CSS length, clamp(), etc.). */
		max?: string;
		/** Override --shell-pad inline padding. */
		pad?: string;
		/** Vertical padding. Defaults to none — let scenes set their own rhythm. */
		padY?: string;
		/** HTML tag. Use 'main' for the top-level route shell. */
		as?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		max,
		pad,
		padY = '0',
		as = 'div',
		class: className = '',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class={cn('hyvui-shell', className)}
	style:--shell-max-local={max}
	style:--shell-pad-local={pad}
	style:padding-block={padY}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-shell {
		width: 100%;
		max-width: var(--shell-max-local, var(--shell-max));
		margin-inline: auto;
		padding-inline: var(--shell-pad-local, var(--shell-pad));
		box-sizing: border-box;
	}
</style>

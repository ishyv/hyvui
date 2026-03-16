<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * @see surface — add `use:surface` on Stack for an entrance animation on mount.
	 * @example
	 * <Stack gap="var(--space-lg)">
	 *   <Text variant="heading">title</Text>
	 *   <Text>body text here.</Text>
	 * </Stack>
	 * <Stack direction="horizontal" align="center" gap="0.75rem">
	 *   <Button variant="primary">confirm</Button>
	 *   <Button variant="ghost">cancel</Button>
	 * </Stack>
	 */
	interface Props {
		/** Stack direction. */
		direction?: 'vertical' | 'horizontal';
		/** Gap between items (CSS size string). */
		gap?: string;
		/** CSS align-items value. */
		align?: string;
		/** CSS justify-content value. */
		justify?: string;
		/** Enable flex-wrap. */
		wrap?: boolean;
		/** HTML tag to render. */
		as?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Stack children. */
		children?: Snippet;
	}

	let {
		direction = 'vertical',
		gap = 'var(--space-md)',
		align = 'stretch',
		justify = 'flex-start',
		wrap = false,
		as = 'div',
		class: className = '',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class={cn('hyvui-stack', className)}
	style:flex-direction={direction === 'horizontal' ? 'row' : 'column'}
	style:gap
	style:align-items={align}
	style:justify-content={justify}
	style:flex-wrap={wrap ? 'wrap' : 'nowrap'}
>
	{#if children}{@render children()}{/if}
</svelte:element>

<style>
	.hyvui-stack {
		display: flex;
		min-width: 0;
	}
</style>

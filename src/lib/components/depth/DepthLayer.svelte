<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { DepthLevel } from '../../system/depth/depth.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Z-level within a parent DepthStage. */
		level?: DepthLevel;
		/** HTML tag to render. */
		as?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Layer content. */
		children?: Snippet;
	}

	let { level = 'ground', as = 'div', class: className = '', children }: Props = $props();
</script>

<svelte:element this={as} class={cn(`depth-${level}`, className)}>
	{#if children}{@render children()}{/if}
</svelte:element>

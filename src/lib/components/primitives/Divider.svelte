<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <Divider />
	 * <Divider strength="strong" />
	 */
	interface Props {
		/** Line visibility strength. */
		strength?: 'default' | 'strong';
		/** Additional CSS classes. */
		class?: string;
	}

	let { strength = 'default', class: className = '' }: Props = $props();
</script>

<hr
	class={cn('hyvui-divider', className)}
	style:border-color={strength === 'strong' ? 'var(--line-strong)' : 'var(--line)'}
/>

<style>
	.hyvui-divider {
		border: none;
		border-top: 1px solid;
		margin: 0;
		width: 100%;
	}

	/* ── hextech: fade to brass at edges ──────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-divider {
		border-image: linear-gradient(
			to right,
			transparent,
			color-mix(in srgb, var(--htx-brass) 50%, transparent) 20%,
			color-mix(in srgb, var(--htx-cyan-glow) 35%, transparent) 50%,
			color-mix(in srgb, var(--htx-brass) 50%, transparent) 80%,
			transparent
		) 1;
	}

	/* ── arcane: violet glow, center-bright ───────────────────────────── */
	:global([data-theme='arcane']) .hyvui-divider {
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
</style>


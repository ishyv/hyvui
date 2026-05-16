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
	:global([data-register='hextech']) .hyvui-divider {
		border-image: linear-gradient(
			to right,
			transparent,
			rgba(184, 115, 51, 0.5) 20%,
			rgba(93, 217, 240, 0.35) 50%,
			rgba(184, 115, 51, 0.5) 80%,
			transparent
		) 1;
	}

	/* ── arcane: violet glow, center-bright ───────────────────────────── */
	:global([data-register='arcane']) .hyvui-divider {
		border-image: linear-gradient(
			to right,
			transparent,
			rgba(184, 69, 201, 0.55) 25%,
			rgba(233, 76, 188, 0.65) 50%,
			rgba(184, 69, 201, 0.55) 75%,
			transparent
		) 1;
		filter: drop-shadow(0 0 3px rgba(184, 69, 201, 0.3));
	}
</style>

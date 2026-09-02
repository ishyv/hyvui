<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import { badge, type BadgeVariants } from './Badge.tv.js';

	/**
	 * @example
	 * <Badge variant="ok">online</Badge>
	 * <Badge variant="warn">degraded</Badge>
	 * <Badge variant="accent">new</Badge>
	 */
	interface Props {
		/** Badge color variant. */
		variant?: BadgeVariants['variant'];
		/** Additional CSS classes. */
		class?: string;
		/** Badge text. */
		children?: Snippet;
	}

	let { variant = 'default', class: className = '', children }: Props = $props();

	const colorMap: Record<string, string> = {
		default: 'var(--muted)',
		accent: 'var(--accent)',
		signal: 'var(--signal)',
		ok: 'var(--status-ok)',
		warn: 'var(--status-warn)',
		fail: 'var(--status-fail)'
	};

	const bgMap: Record<string, string> = {
		default: 'color-mix(in srgb, var(--muted) 8%, transparent)',
		accent: 'color-mix(in srgb, var(--accent) 8%, transparent)',
		signal: 'color-mix(in srgb, var(--signal) 8%, transparent)',
		ok: 'color-mix(in srgb, var(--signal) 8%, transparent)',
		warn: 'color-mix(in srgb, var(--accent) 8%, transparent)',
		fail: 'color-mix(in srgb, var(--status-fail) 8%, transparent)'
	};
</script>

<span
	class={cn(badge({ variant }), className)}
	style:color={colorMap[variant]}
	style:background-color={bgMap[variant]}
	style:border-color={colorMap[variant]}
>
	{#if children}{@render children()}{/if}
</span>

<style>
	.hyvui-badge {
		display: inline-flex;
		align-items: center;
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		line-height: 1;
		padding: var(--space-2xs) var(--space-xs);
		border: 1px solid;
		border-color: currentColor;
		opacity: 0.8;
	}

	/* ── hextech: clipped top-left corner (hex gem cut) ───────────────── */
	:global([data-theme='hextech']) .hyvui-badge {
		clip-path: polygon(6px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 6px);
	}

	/* ── arcane: diagonal parallelogram cut ───────────────────────────── */
	:global([data-theme='arcane']) .hyvui-badge {
		clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
	}
</style>


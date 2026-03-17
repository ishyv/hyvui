<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * @example
	 * <Alert variant="warn" title="rate limited">requests paused for 60 seconds</Alert>
	 * <Alert variant="error">connection refused</Alert>
	 * <Alert variant="ok" title="deployment complete">all services nominal</Alert>
	 */
	interface Props {
		/** Alert variant determining accent color. */
		variant?: 'info' | 'warn' | 'error' | 'ok';
		/** Optional title text. */
		title?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Alert body content. */
		children?: Snippet;
	}

	let { variant = 'info', title = '', class: className = '', children }: Props = $props();

	const colorMap: Record<string, string> = {
		info: 'var(--signal)',
		warn: 'var(--status-warn)',
		error: 'var(--status-fail)',
		ok: 'var(--status-ok)'
	};

	const bgMap: Record<string, string> = {
		info: 'rgba(121, 166, 163, 0.06)',
		warn: 'rgba(199, 156, 87, 0.06)',
		error: 'rgba(182, 106, 72, 0.06)',
		ok: 'rgba(121, 166, 163, 0.06)'
	};
</script>

<div
	class={cn('hyvui-alert', className)}
	style:border-left-color={colorMap[variant]}
	style:background-color={bgMap[variant]}
	role="alert"
>
	{#if title}
		<div class="hyvui-alert-title">{title}</div>
	{/if}
	{#if children}
		<div class="hyvui-alert-body">
			{@render children()}
		</div>
	{/if}
</div>

<style>
	.hyvui-alert {
		border-left: 2px solid;
		padding: 0.75rem 1rem;
		animation: alert-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes alert-in {
		from {
			opacity: 0;
			transform: translateX(-6px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-alert {
			animation: none;
		}
	}

	.hyvui-alert-title {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 400;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-soft);
		margin-bottom: 0.375rem;
	}

	.hyvui-alert-body {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--text-soft);
		line-height: 1.5;
	}
</style>

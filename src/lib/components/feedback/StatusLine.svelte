<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <StatusLine status="ok" message="database connected" visible={true} />
	 * <StatusLine status="pend" message="waiting for signal" visible={show} cursor />
	 * <StatusLine status="fail" message="stream interrupted" visible={true} tone="line" />
	 */
	interface Props {
		/** Status determining the glyph and color. */
		status?: 'ok' | 'pend' | 'warn' | 'fail';
		/** Message text displayed after the status glyph. */
		message?: string;
		/** Controls visibility with stagger animation. */
		visible?: boolean;
		/** When true, the full line inherits the status tone. */
		tone?: 'split' | 'line';
		/** Shows a blinking cursor after the message. */
		cursor?: boolean;
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		status = 'ok',
		message = '',
		visible = false,
		tone = 'split',
		cursor = false,
		class: className = ''
	}: Props = $props();

	const glyphMap: Record<string, string> = {
		ok: '[ OK ]',
		pend: '[ .. ]',
		warn: '[WARN]',
		fail: '[FAIL]'
	};

	const colorMap: Record<string, string> = {
		ok: 'var(--status-ok)',
		pend: 'var(--status-pend)',
		warn: 'var(--status-warn)',
		fail: 'var(--status-fail)'
	};
</script>

<div
	class={cn(
		'hyvui-status-line',
		visible && 'hyvui-status-line-visible',
		tone === 'line' && 'hyvui-status-line-tone-line',
		className
	)}
	style:color={tone === 'line' ? colorMap[status] : undefined}
	aria-live="polite"
>
	<span class="hyvui-status-glyph" style:color={tone === 'split' ? colorMap[status] : undefined}>
		{glyphMap[status]}
	</span>
	<span class="hyvui-status-message">{message}</span>
	{#if cursor}
		<span class="hyvui-status-cursor" aria-hidden="true">_</span>
	{/if}
</div>

<style>
	.hyvui-status-line {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		opacity: 0;
		transform: translateY(6px);
		transition:
			opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-status-line-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hyvui-status-glyph {
		font-weight: 400;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.hyvui-status-message {
		color: var(--text-soft);
	}

	.hyvui-status-line-tone-line .hyvui-status-message,
	.hyvui-status-line-tone-line .hyvui-status-glyph {
		color: inherit;
	}

	.hyvui-status-cursor {
		color: var(--muted-strong);
		animation: blink 1s step-end infinite;
		margin-left: 2px;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-status-line {
			transition: none;
			transform: none;
		}

		.hyvui-status-line-visible {
			opacity: 1;
		}

		.hyvui-status-cursor {
			animation: none;
		}
	}
</style>

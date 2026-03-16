<script lang="ts">
	import { cn } from '../../utils/cn.js';

	interface Props {
		/** Current value (bindable). */
		value?: string;
		/** Number of visible rows. */
		rows?: number;
		/** Placeholder text. */
		placeholder?: string;
		/** Label text displayed above the textarea. */
		label?: string;
		/** Error message. */
		error?: string;
		/** Hint text. */
		hint?: string;
		/** Auto-expand height based on content. */
		autoresize?: boolean;
		/** Disables the textarea. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Input handler. */
		oninput?: (e: Event) => void;
	}

	let {
		value = $bindable(''),
		rows = 4,
		placeholder = '',
		label = '',
		error = '',
		hint = '',
		autoresize = false,
		disabled = false,
		class: className = '',
		oninput
	}: Props = $props();

	const textareaId = `hyvui-textarea-${Math.random().toString(36).slice(2, 8)}`;

	let textareaEl: HTMLTextAreaElement | undefined = $state();

	function handleInput(e: Event) {
		if (autoresize && textareaEl) {
			textareaEl.style.height = 'auto';
			textareaEl.style.height = textareaEl.scrollHeight + 'px';
		}
		oninput?.(e);
	}
</script>

<div class={cn('hyvui-textarea-wrap', className)}>
	{#if label}
		<label class="hyvui-textarea-label" for={textareaId}>{label}</label>
	{/if}
	<textarea
		id={textareaId}
		bind:this={textareaEl}
		bind:value
		{rows}
		{placeholder}
		{disabled}
		class={cn('hyvui-textarea', error && 'hyvui-textarea-error')}
		oninput={handleInput}
	></textarea>
	{#if error}
		<span class="hyvui-textarea-message hyvui-textarea-message-error">{error}</span>
	{:else if hint}
		<span class="hyvui-textarea-message">{hint}</span>
	{/if}
</div>

<style>
	.hyvui-textarea-wrap {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.hyvui-textarea-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-textarea {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 400;
		color: var(--text);
		min-height: calc(var(--control-height-md) * 2.4);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.018), transparent 46%),
			linear-gradient(135deg, rgba(199, 156, 87, 0.045), transparent 44%), var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		padding: var(--control-pad-y) var(--control-pad-x);
		outline: none;
		resize: vertical;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast),
			box-shadow var(--transition-fast);
		width: 100%;
		box-shadow: inset 0 1px 0 rgba(240, 232, 218, 0.03);
	}

	.hyvui-textarea::placeholder {
		color: var(--muted);
	}

	.hyvui-textarea:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--line-strong) 82%, transparent);
	}

	.hyvui-textarea:focus {
		border-color: var(--line-strong);
	}

	.hyvui-textarea:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-textarea-error {
		border-color: var(--status-fail);
	}

	.hyvui-textarea-message {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.3;
	}

	.hyvui-textarea-message-error {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-textarea {
			transition: none;
		}
	}
</style>

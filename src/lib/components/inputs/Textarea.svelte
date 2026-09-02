<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	/**
	 * @see resolve — wrap parent `<form>` with `use:resolve` to flash status on submit.
	 * @example
	 * <Textarea label="notes" bind:value={notes} placeholder="enter notes..." />
	 * <Textarea label="message" rows={6} bind:value={msg} autoresize error={msgError} />
	 */
	interface Props extends Omit<
		HTMLTextareaAttributes,
		'class' | 'children' | 'disabled' | 'id' | 'onchange' | 'oninput' | 'placeholder' | 'rows' | 'value'
	> {
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
		/** Description text. */
		description?: string;
		/** Auto-expand height based on content. */
		autoresize?: boolean;
		/** Disables the textarea. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Stable DOM id. Required when an external label or description association is needed. */
		id?: string;
		/** Input handler. */
		oninput?: (e: Event) => void;
		/** Change handler. */
		onchange?: HTMLTextareaAttributes['onchange'];
	}

	let {
		value = $bindable(''),
		rows = 4,
		placeholder = '',
		label = '',
		error = '',
		description = '',
		autoresize = false,
		disabled = false,
		class: className = '',
		id,
		oninput,
		onchange,
		...rest
	}: Props = $props();

	const message = $derived(error || description);
	const messageId = $derived(id ? `${id}-desc` : undefined);

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
	{#snippet control()}
		<textarea
			{...rest}
			{id}
			bind:this={textareaEl}
			bind:value
			{rows}
			{placeholder}
			{disabled}
			aria-describedby={messageId}
			aria-invalid={error ? 'true' : undefined}
			class={cn('hyvui-textarea', error && 'hyvui-textarea-error')}
			oninput={handleInput}
			{onchange}
		></textarea>
	{/snippet}
	{#if label && !id}
		<label class="hyvui-textarea-label hyvui-textarea-label-nested">
			<span>{label}</span>
			{@render control()}
		</label>
	{:else}
		{#if label}
			<label class="hyvui-textarea-label" for={id}>{label}</label>
		{/if}
		{@render control()}
	{/if}
	{#if error}
		<span id={messageId} class="hyvui-textarea-message hyvui-textarea-message-error">{error}</span>
	{:else if message}
		<span id={messageId} class="hyvui-textarea-message">{message}</span>
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
		display: block;
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-textarea-label-nested {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.hyvui-textarea {
		font-family: var(--reg-font-ui);
		font-size: var(--text-xs);
		font-weight: 400;
		color: var(--text);
		min-height: calc(var(--control-height-md) * 2.4);
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--text) 1.8%, transparent), transparent 46%),
			linear-gradient(135deg, color-mix(in srgb, var(--accent) 4.5%, transparent), transparent 44%), var(--bg-elev);
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
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 3%, transparent);
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
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
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

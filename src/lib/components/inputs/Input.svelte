<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @see resolve — wrap parent `<form>` with `use:resolve` to flash status on submit.
	 * @example
	 * <Input label="api key" bind:value={key} placeholder="sk-..." />
	 * <Input label="email" type="email" bind:value={email} error={emailError} />
	 * <Input label="search" type="search" bind:value={query} hint="press enter to search" />
	 */
	interface Props {
		/** Input type. */
		type?: 'text' | 'number' | 'password' | 'email' | 'search';
		/** Current value (bindable). */
		value?: string;
		/** Placeholder text. */
		placeholder?: string;
		/** Disables the input. */
		disabled?: boolean;
		/** Error message. Displays below the input and activates error styling. */
		error?: string;
		/** Hint text displayed below the input. */
		hint?: string;
		/** Label text displayed above the input. */
		label?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Input handler. */
		oninput?: (e: Event) => void;
		/** Change handler. */
		onchange?: (e: Event) => void;
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		error = '',
		hint = '',
		label = '',
		class: className = '',
		oninput,
		onchange
	}: Props = $props();

	const inputId = `hyvui-input-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class={cn('hyvui-input-wrap', className)}>
	{#if label}
		<label class="hyvui-input-label" for={inputId}>{label}</label>
	{/if}
	<input
		id={inputId}
		{type}
		bind:value
		{placeholder}
		{disabled}
		aria-describedby={(error || hint) ? `${inputId}-desc` : undefined}
		class={cn('hyvui-input', error && 'hyvui-input-error')}
		{oninput}
		{onchange}
	/>
	{#if error}
		<span id="{inputId}-desc" class="hyvui-input-message hyvui-input-message-error">{error}</span>
	{:else if hint}
		<span id="{inputId}-desc" class="hyvui-input-message">{hint}</span>
	{/if}
</div>

<style>
	.hyvui-input-wrap {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.hyvui-input-label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-input {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		font-weight: 400;
		color: var(--text);
		min-height: var(--control-height-md);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.018), transparent 46%),
			linear-gradient(135deg, rgba(199, 156, 87, 0.045), transparent 44%), var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		padding: var(--control-pad-y) var(--control-pad-x);
		outline: none;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast),
			box-shadow var(--transition-fast);
		width: 100%;
		box-shadow: inset 0 1px 0 rgba(240, 232, 218, 0.03);
	}

	.hyvui-input::placeholder {
		color: var(--muted);
	}

	.hyvui-input:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--line-strong) 82%, transparent);
	}

	.hyvui-input:focus {
		border-color: var(--line-strong);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.022), transparent 46%),
			linear-gradient(135deg, rgba(199, 156, 87, 0.06), transparent 44%), var(--bg-elev);
	}

	.hyvui-input:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-input-error {
		border-color: var(--status-fail);
	}

	.hyvui-input-message {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.3;
	}

	.hyvui-input-message-error {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-input {
			transition: none;
		}
	}
</style>

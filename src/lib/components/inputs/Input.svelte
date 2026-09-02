<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	/**
	 * @see resolve — wrap parent `<form>` with `use:resolve` to flash status on submit.
	 * @example
	 * <Input label="api key" bind:value={key} placeholder="sk-..." />
	 * <Input label="email" type="email" bind:value={email} error={emailError} />
	 * <Input label="search" type="search" bind:value={query} description="press enter to search" />
	 */
	interface Props extends Omit<
		HTMLInputAttributes,
		'class' | 'children' | 'disabled' | 'id' | 'onchange' | 'oninput' | 'placeholder' | 'type' | 'value'
	> {
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
		/** Description text displayed below the input. */
		description?: string;
		/** Label text displayed above the input. */
		label?: string;
		/** Additional CSS classes. */
		class?: string;
		/** Stable DOM id. Required when an external label or description association is needed. */
		id?: string;
		/** Input handler. */
		oninput?: HTMLInputAttributes['oninput'];
		/** Change handler. */
		onchange?: HTMLInputAttributes['onchange'];
	}

	let {
		type = 'text',
		value = $bindable(''),
		placeholder = '',
		disabled = false,
		error = '',
		description = '',
		label = '',
		class: className = '',
		id,
		oninput,
		onchange,
		...rest
	}: Props = $props();

	const message = $derived(error || description);
	const messageId = $derived(id ? `${id}-desc` : undefined);
</script>

<div class={cn('hyvui-input-wrap', className)}>
	{#snippet control()}
		<input
			{...rest}
			{id}
			{type}
			bind:value
			{placeholder}
			{disabled}
			aria-describedby={messageId}
			aria-invalid={error ? 'true' : undefined}
			class={cn('hyvui-input', error && 'hyvui-input-error')}
			{oninput}
			{onchange}
		/>
	{/snippet}
	{#if label && !id}
		<label class="hyvui-input-label hyvui-input-label-nested">
			<span>{label}</span>
			{@render control()}
		</label>
	{:else}
		{#if label}
			<label class="hyvui-input-label" for={id}>{label}</label>
		{/if}
		{@render control()}
	{/if}
	{#if error}
		<span id={messageId} class="hyvui-input-message hyvui-input-message-error">{error}</span>
	{:else if message}
		<span id={messageId} class="hyvui-input-message">{message}</span>
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
		display: block;
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-input-label-nested {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.hyvui-input {
		font-family: var(--reg-font-ui);
		font-size: var(--text-xs);
		font-weight: 400;
		color: var(--text);
		min-height: var(--control-height-md);
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--text) 1.8%, transparent), transparent 46%),
			linear-gradient(135deg, color-mix(in srgb, var(--accent) 4.5%, transparent), transparent 44%), var(--bg-elev);
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		padding: var(--control-pad-y) var(--control-pad-x);
		outline: none;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast),
			box-shadow var(--transition-fast);
		width: 100%;
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 3%, transparent);
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
			linear-gradient(180deg, color-mix(in srgb, var(--text) 2.2%, transparent), transparent 46%),
			linear-gradient(135deg, color-mix(in srgb, var(--accent) 6%, transparent), transparent 44%), var(--bg-elev);
	}

	.hyvui-input:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-input-error {
		border-color: var(--status-fail);
	}

	.hyvui-input-message {
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
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

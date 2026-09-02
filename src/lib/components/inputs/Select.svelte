<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface SelectOption {
		value: string;
		label: string;
	}

	/**
	 * @example
	 * <Select label="region" bind:value={region} options={[
	 *   { value: 'us', label: 'united states' },
	 *   { value: 'eu', label: 'europe' }
	 * ]} />
	 * <Select label="status" bind:value={status} options={statusOptions} error={statusError} />
	 */
	interface Props extends Omit<HTMLSelectAttributes, 'class' | 'children' | 'disabled' | 'id' | 'onchange' | 'value'> {
		/** Available options. */
		options?: readonly SelectOption[];
		/** Current selected value (bindable). */
		value?: string;
		/** Label text displayed above the select. */
		label?: string;
		/** Description text displayed below the select. */
		description?: string;
		/** Error message. */
		error?: string;
		/** Disables the select. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Stable DOM id. Required when an external label or description association is needed. */
		id?: string;
		/** Change handler. */
		onchange?: HTMLSelectAttributes['onchange'];
	}

	let {
		options = [],
		value = $bindable(''),
		label = '',
		description = '',
		error = '',
		disabled = false,
		class: className = '',
		id,
		onchange,
		...rest
	}: Props = $props();

	const message = $derived(error || description);
	const messageId = $derived(id ? `${id}-desc` : undefined);
</script>

<div class={cn('hyvui-select-wrap', className)}>
	{#snippet control()}
		<span class="hyvui-select-container">
			<select
				{...rest}
				{id}
				bind:value
				{disabled}
				aria-describedby={messageId}
				aria-invalid={error ? 'true' : undefined}
				class={cn('hyvui-select', error && 'hyvui-select-error')}
				{onchange}
			>
				{#each options as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
			<svg class="hyvui-select-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
				<path
					d="M2.5 4.5L6 8L9.5 4.5"
					stroke="var(--accent)"
					stroke-width="1.5"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	{/snippet}
	{#if label && !id}
		<label class="hyvui-select-label hyvui-select-label-nested">
			<span>{label}</span>
			{@render control()}
		</label>
	{:else}
		{#if label}
			<label class="hyvui-select-label" for={id}>{label}</label>
		{/if}
		{@render control()}
	{/if}
	{#if error}
		<span id={messageId} class="hyvui-select-message hyvui-select-message-error">{error}</span>
	{:else if message}
		<span id={messageId} class="hyvui-select-message">{message}</span>
	{/if}
</div>

<style>
	.hyvui-select-wrap {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.hyvui-select-label {
		display: block;
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-select-label-nested {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.hyvui-select-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.hyvui-select {
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
		padding: var(--control-pad-y) 2.3rem var(--control-pad-y) var(--control-pad-x);
		outline: none;
		appearance: none;
		width: 100%;
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast),
			box-shadow var(--transition-fast);
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 3%, transparent);
	}

	.hyvui-select:hover:not(:disabled) {
		border-color: color-mix(in srgb, var(--line-strong) 82%, transparent);
	}

	.hyvui-select:focus {
		border-color: var(--line-strong);
	}

	.hyvui-select:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-select-error {
		border-color: var(--status-fail);
	}

	.hyvui-select-chevron {
		position: absolute;
		right: var(--control-pad-x-compact);
		pointer-events: none;
		opacity: 0.8;
	}

	.hyvui-select-message {
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.3;
	}

	.hyvui-select-message-error {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-select {
			transition: none;
		}
	}
</style>

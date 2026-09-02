<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	/**
	 * @example
	 * <Checkbox label="accept terms" bind:checked={accepted} />
	 * <Checkbox label="notify me" bind:checked={notify} onchange={handleChange} />
	 */
	interface Props extends Omit<
		HTMLInputAttributes,
		'class' | 'children' | 'checked' | 'disabled' | 'id' | 'onchange' | 'type'
	> {
		/** Whether the checkbox is checked (bindable). */
		checked?: boolean;
		/** Label text. */
		label?: string;
		/** Description text displayed below the label. */
		description?: string;
		/** Error message. */
		error?: string;
		/** Disables the checkbox. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Stable DOM id used for the native control and description. */
		id?: string;
		/** Change handler. */
		onchange?: HTMLInputAttributes['onchange'];
	}

	let {
		checked = $bindable(false),
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

<label class={cn('hyvui-checkbox', disabled && 'hyvui-checkbox-disabled', className)}>
	<input
		{...rest}
		{id}
		type="checkbox"
		bind:checked
		{disabled}
		aria-describedby={messageId}
		aria-invalid={error ? 'true' : undefined}
		class="hyvui-checkbox-input"
		{onchange}
	/>
	<span
		class={cn('hyvui-checkbox-box', error && 'hyvui-checkbox-box-error')}
		class:hyvui-checkbox-checked={checked}
	>
		{#if checked}
			<svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
				<path
					d="M2 5.5L4 7.5L8 3"
					stroke="var(--bg)"
					stroke-width="1.5"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</span>
	{#if label || message}
		<span class="hyvui-checkbox-copy">
			{#if label}
				<span class="hyvui-checkbox-label">{label}</span>
			{/if}
			{#if message}
				<span
					id={messageId}
					class={cn('hyvui-checkbox-message', error && 'hyvui-checkbox-message-error')}
				>
					{message}
				</span>
			{/if}
		</span>
	{/if}
</label>

<style>
	.hyvui-checkbox {
		display: inline-flex;
		align-items: flex-start;
		gap: var(--space-sm);
		cursor: pointer;
		min-width: 0;
	}

	.hyvui-checkbox-disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-checkbox-input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.hyvui-checkbox-box {
		width: 16px;
		height: 16px;
		margin-top: 0.1rem;
		border: 1px solid var(--line-strong);
		border-radius: var(--radius-sm);
		background: linear-gradient(180deg, color-mix(in srgb, var(--text) 2%, transparent), transparent 48%), var(--bg-elev);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 3%, transparent);
	}

	.hyvui-checkbox-box-error {
		border-color: var(--status-fail);
	}

	.hyvui-checkbox-checked {
		background-color: var(--accent);
		border-color: var(--accent);
	}

	.hyvui-checkbox-label {
		font-family: var(--reg-font-primary);
		font-size: var(--text-sm);
		color: var(--text-soft);
		line-height: 1.5;
	}

	.hyvui-checkbox-copy {
		display: flex;
		flex-direction: column;
		gap: var(--space-3xs);
	}

	.hyvui-checkbox-message {
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.3;
	}

	.hyvui-checkbox-message-error {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-checkbox-box {
			transition: none;
		}
	}
</style>

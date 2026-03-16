<script lang="ts">
	import { cn } from '../../utils/cn.js';

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
	interface Props {
		/** Available options. */
		options?: SelectOption[];
		/** Current selected value (bindable). */
		value?: string;
		/** Label text displayed above the select. */
		label?: string;
		/** Error message. */
		error?: string;
		/** Disables the select. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Change handler. */
		onchange?: (e: Event) => void;
	}

	let {
		options = [],
		value = $bindable(''),
		label = '',
		error = '',
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	const selectId = `hyvui-select-${Math.random().toString(36).slice(2, 8)}`;
</script>

<div class={cn('hyvui-select-wrap', className)}>
	{#if label}
		<label class="hyvui-select-label" for={selectId}>{label}</label>
	{/if}
	<div class="hyvui-select-container">
		<select
			id={selectId}
			bind:value
			{disabled}
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
	</div>
	{#if error}
		<span class="hyvui-select-message">{error}</span>
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
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-select-container {
		position: relative;
		display: flex;
		align-items: center;
	}

	.hyvui-select {
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
		padding: var(--control-pad-y) 2.3rem var(--control-pad-y) var(--control-pad-x);
		outline: none;
		appearance: none;
		width: 100%;
		cursor: pointer;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast),
			box-shadow var(--transition-fast);
		box-shadow: inset 0 1px 0 rgba(240, 232, 218, 0.03);
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
		right: 0.85rem;
		pointer-events: none;
		opacity: 0.8;
	}

	.hyvui-select-message {
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--status-fail);
		line-height: 1.3;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-select {
			transition: none;
		}
	}
</style>

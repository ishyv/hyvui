<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <Checkbox label="accept terms" bind:checked={accepted} />
	 * <Checkbox label="notify me" bind:checked={notify} onchange={handleChange} />
	 */
	interface Props {
		/** Whether the checkbox is checked (bindable). */
		checked?: boolean;
		/** Label text. */
		label?: string;
		/** Disables the checkbox. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Change handler. */
		onchange?: (e: Event) => void;
	}

	let {
		checked = $bindable(false),
		label = '',
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();
</script>

<label class={cn('hyvui-checkbox', disabled && 'hyvui-checkbox-disabled', className)}>
	<input type="checkbox" bind:checked {disabled} class="hyvui-checkbox-input" {onchange} />
	<span class="hyvui-checkbox-box" class:hyvui-checkbox-checked={checked}>
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
	{#if label}
		<span class="hyvui-checkbox-label">{label}</span>
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
		background: linear-gradient(180deg, rgba(240, 232, 218, 0.02), transparent 48%), var(--bg-elev);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
		box-shadow: inset 0 1px 0 rgba(240, 232, 218, 0.03);
	}

	.hyvui-checkbox-checked {
		background-color: var(--accent);
		border-color: var(--accent);
	}

	.hyvui-checkbox-label {
		font-family: var(--font-body);
		font-size: 0.98rem;
		color: var(--text-soft);
		line-height: 1.5;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-checkbox-box {
			transition: none;
		}
	}
</style>

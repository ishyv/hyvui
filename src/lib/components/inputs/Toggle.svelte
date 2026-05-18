<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @example
	 * <Toggle label="enable notifications" bind:checked={enabled} />
	 * <Toggle label="dark mode" bind:checked={dark} onchange={applyTheme} />
	 */
	interface Props {
		/** Whether the toggle is on (bindable). */
		checked?: boolean;
		/** Label text. */
		label?: string;
		/** Description text displayed below the label. */
		description?: string;
		/** Error message. */
		error?: string;
		/** Disables the toggle. */
		disabled?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Change handler. */
		onchange?: (e: Event) => void;
	}

	let {
		checked = $bindable(false),
		label = '',
		description = '',
		error = '',
		disabled = false,
		class: className = '',
		onchange
	}: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(new Event('change'));
	}

	const toggleId = `hyvui-toggle-${Math.random().toString(36).slice(2, 8)}`;
	const message = $derived(error || description);
</script>

<div class={cn('hyvui-toggle-field', disabled && 'hyvui-toggle-disabled', className)}>
	<label class="hyvui-toggle">
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			{disabled}
			aria-label={label || 'toggle'}
			aria-describedby={message ? `${toggleId}-desc` : undefined}
			aria-invalid={error ? 'true' : undefined}
			class={cn('hyvui-toggle-track', error && 'hyvui-toggle-track-error')}
			class:hyvui-toggle-on={checked}
			onclick={toggle}
		>
			<span class="hyvui-toggle-thumb" class:hyvui-toggle-thumb-on={checked}></span>
		</button>
		{#if label}
			<span class="hyvui-toggle-label">{label}</span>
		{/if}
	</label>
	{#if message}
		<span
			id="{toggleId}-desc"
			class={cn('hyvui-toggle-message', error && 'hyvui-toggle-message-error')}
		>
			{message}
		</span>
	{/if}
</div>

<style>
	.hyvui-toggle-field {
		display: inline-flex;
		flex-direction: column;
		gap: var(--space-xs);
		min-width: 0;
	}

	.hyvui-toggle {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		cursor: pointer;
		min-width: 0;
	}

	.hyvui-toggle-disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.hyvui-toggle-track {
		width: 42px;
		height: 24px;
		border-radius: 999px;
		background: linear-gradient(180deg, color-mix(in srgb, var(--text) 2%, transparent), transparent 48%), var(--bg-elev);
		border: 1px solid var(--line-strong);
		position: relative;
		cursor: pointer;
		padding: 0;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			box-shadow var(--transition-fast);
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--text) 3%, transparent);
	}

	.hyvui-toggle-track:disabled {
		cursor: not-allowed;
	}

	.hyvui-toggle-on {
		background-color: var(--accent);
		border-color: var(--accent);
	}

	.hyvui-toggle-track-error {
		border-color: var(--status-fail);
	}

	.hyvui-toggle-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background-color: var(--muted);
		transition:
			transform var(--transition-smooth),
			background-color var(--transition-fast);
	}

	.hyvui-toggle-thumb-on {
		transform: translateX(18px);
		background-color: var(--bg);
	}

	.hyvui-toggle-label {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--text-soft);
		line-height: 1.5;
	}

	.hyvui-toggle-message {
		margin-left: calc(42px + var(--space-sm));
		font-family: var(--font-mono);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.3;
	}

	.hyvui-toggle-message-error {
		color: var(--status-fail);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-toggle-track,
		.hyvui-toggle-thumb {
			transition: none;
		}
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { echo as echoAction } from '../../system/actions/echo.js';
	import { button, type ButtonVariants } from './Button.tv.js';

	/**
	 * @see echo — add `echo` prop (or `use:echo` directly) for a gold click-pulse ripple.
	 * @example
	 * <Button variant="primary" onclick={handleSubmit}>submit</Button>
	 * <Button variant="ghost" href="/back">go back</Button>
	 * <Button variant="destructive" loading>deleting...</Button>
	 * <Button variant="primary" echo onclick={confirm}>confirm</Button>
	 */
	type Props = Omit<
		HTMLButtonAttributes,
		'aria-disabled' | 'class' | 'children' | 'disabled' | 'id' | 'onclick' | 'type'
	> & {
		/** Button visual style. */
		variant?: ButtonVariants['variant'];
		/** Button size. */
		size?: ButtonVariants['size'];
		/** Disables the button. */
		disabled?: boolean;
		/** Shows a pending status indicator instead of the label. */
		loading?: boolean;
		/** Enables the click echo ripple. */
		echo?: boolean;
		/** Additional CSS classes. */
		class?: string;
		/** Stable DOM id. */
		id?: string;
		/** Button type attribute. */
		type?: 'button' | 'submit' | 'reset';
		/** Optional href to render an anchor instead of a button. */
		href?: string;
		/** Anchor target. */
		target?: string;
		/** Anchor rel. */
		rel?: string;
		/** Anchor download behavior. */
		download?: HTMLAnchorAttributes['download'];
		/** Click handler. */
		onclick?: (e: MouseEvent) => void;
		/** Button label content. */
		children?: Snippet;
	};

	let {
		variant = 'secondary',
		size = 'md',
		disabled = false,
		loading = false,
		echo = false,
		class: className = '',
		type = 'button',
		href,
		target,
		rel,
		download,
		id,
		onclick,
		children,
		...rest
	}: Props = $props();

	const nativeRest = $derived(rest as Record<string, unknown>);

	const btnClass = $derived(
		cn(button({ variant, size, loading, disabled: disabled || loading }), className)
	);

	function activeEcho(node: HTMLElement) {
		if (!echo) return {};
		return echoAction(node);
	}

	function handleAnchorClick(e: MouseEvent) {
		if (disabled || loading) {
			e.preventDefault();
			return;
		}

		onclick?.(e);
	}
</script>

{#if href}
	<a
		{...nativeRest}
		{href}
		{id}
		{target}
		{rel}
		{download}
		use:activeEcho
		class={btnClass}
		aria-disabled={disabled || loading}
		tabindex={disabled || loading ? -1 : undefined}
		onclick={handleAnchorClick}
	>
		{#if loading}
			<span class="hyvui-btn-dot" aria-label="loading"></span>
		{:else if children}
			{@render children()}
		{/if}
	</a>
{:else}
	<button
		{...nativeRest}
		{id}
		{type}
		use:activeEcho
		class={btnClass}
		disabled={disabled || loading}
		{onclick}
	>
		{#if loading}
			<span class="hyvui-btn-dot" aria-label="loading"></span>
		{:else if children}
			{@render children()}
		{/if}
	</button>
{/if}

<style>
	.hyvui-btn {
		position: relative;
		overflow: clip;
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--control-gap);
		transition:
			color var(--transition-fast),
			border-color var(--transition-fast),
			background var(--transition-fast),
			filter var(--transition-fast),
			transform var(--transition-smooth),
			box-shadow var(--transition-smooth);
		white-space: nowrap;
		text-decoration: none;
		line-height: 1;
		max-width: 100%;
		box-shadow: var(--surface-stroke);
	}

	.hyvui-btn:disabled,
	.hyvui-btn-disabled {
		opacity: 0.46;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none;
	}

	.hyvui-btn-md {
		min-height: var(--control-height-md);
		padding: var(--control-pad-y) var(--control-pad-x);
	}

	.hyvui-btn-sm {
		min-height: var(--control-height-sm);
		padding: var(--control-pad-y-sm) var(--control-pad-x-sm);
		font-size: var(--text-2xs);
	}

	/* primary */
	.hyvui-btn-primary {
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--accent-strong) 22%, transparent),
				transparent 70%
			),
			linear-gradient(135deg, var(--accent), var(--accent-strong));
		color: var(--bg);
		border-color: color-mix(in srgb, var(--accent-strong) 45%, var(--accent));
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--text) 16%, transparent),
			0 14px 26px color-mix(in srgb, var(--accent) 16%, transparent);
	}

	.hyvui-btn-primary:hover:not(:disabled):not(.hyvui-btn-disabled) {
		transform: translateY(-2px);
		filter: brightness(1.03);
	}

	/* secondary */
	.hyvui-btn-secondary {
		background:
			linear-gradient(180deg, color-mix(in srgb, var(--signal) 6%, transparent), transparent 62%), color-mix(in srgb, var(--bg-elev-soft) 74%, transparent);
		color: var(--text-soft);
		border-color: var(--line-strong);
	}

	.hyvui-btn-secondary:hover:not(:disabled):not(.hyvui-btn-disabled) {
		transform: translateY(-2px);
		border-color: color-mix(in srgb, var(--accent) 46%, var(--line-strong));
		color: var(--text);
	}

	/* ghost */
	.hyvui-btn-ghost {
		background: transparent;
		color: var(--muted);
		border-color: transparent;
		box-shadow: none;
	}

	.hyvui-btn-ghost:hover:not(:disabled):not(.hyvui-btn-disabled) {
		background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 12%, transparent), transparent 78%);
		color: var(--text);
		transform: translateX(2px);
	}

	/* destructive */
	.hyvui-btn-destructive {
		background: color-mix(in srgb, var(--bg-elev-soft) 74%, transparent);
		color: var(--text-soft);
		border-color: color-mix(in srgb, var(--status-fail) 34%, transparent);
	}

	.hyvui-btn-destructive:hover:not(:disabled):not(.hyvui-btn-disabled) {
		background-color: color-mix(in srgb, var(--status-fail) 10%, transparent);
		transform: translateY(-2px);
	}

	/* loading dot */
	.hyvui-btn-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: var(--status-pend);
		animation: pulse-dot 2s cubic-bezier(0.37, 0, 0.63, 1) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-btn {
			transition: none;
		}

		.hyvui-btn:hover:not(:disabled):not(.hyvui-btn-disabled) {
			transform: none;
		}

		.hyvui-btn-dot {
			animation: none;
		}
	}

	/* ── hextech ornament ─────────────────────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-btn {
		border-radius: var(--radius-sm);
	}

	/* brass corner pip — top-left notch */
	:global([data-theme='hextech']) .hyvui-btn::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 7px;
		height: 7px;
		border-top: 1.5px solid color-mix(in srgb, var(--htx-brass-bright) 55%, transparent);
		border-left: 1.5px solid color-mix(in srgb, var(--htx-brass-bright) 55%, transparent);
		pointer-events: none;
	}

	:global([data-theme='hextech']) .hyvui-btn-primary:hover:not(:disabled):not(.hyvui-btn-disabled),
	:global([data-theme='hextech']) .hyvui-btn-primary:focus-visible {
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--text) 20%, transparent),
			0 0 18px color-mix(in srgb, var(--htx-cyan-glow) 30%, transparent),
			0 14px 26px color-mix(in srgb, var(--htx-brass) 18%, transparent);
	}

	:global([data-theme='hextech']) .hyvui-btn-secondary:hover:not(:disabled):not(.hyvui-btn-disabled),
	:global([data-theme='hextech']) .hyvui-btn-secondary:focus-visible {
		box-shadow: 0 0 12px color-mix(in srgb, var(--htx-cyan-glow) 20%, transparent);
		border-color: color-mix(in srgb, var(--htx-cyan-glow) 40%, transparent);
	}

	/* ── arcane ornament ──────────────────────────────────────────────── */

	/* crystal accent — top-right shard corner */
	:global([data-theme='arcane']) .hyvui-btn::after {
		content: '';
		position: absolute;
		top: -1px;
		right: -1px;
		width: 8px;
		height: 8px;
		background: color-mix(in srgb, var(--arc-shimmer) 55%, transparent);
		clip-path: polygon(100% 0, 100% 100%, 0 0);
		pointer-events: none;
	}

	:global([data-theme='arcane']) .hyvui-btn-primary:hover:not(:disabled):not(.hyvui-btn-disabled),
	:global([data-theme='arcane']) .hyvui-btn-primary:focus-visible {
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--text) 14%, transparent),
			0 0 22px color-mix(in srgb, var(--arc-magenta) 38%, transparent),
			0 14px 26px color-mix(in srgb, var(--arc-magenta) 14%, transparent);
	}

	:global([data-theme='arcane']) .hyvui-btn-secondary:hover:not(:disabled):not(.hyvui-btn-disabled),
	:global([data-theme='arcane']) .hyvui-btn-secondary:focus-visible {
		box-shadow: 0 0 14px color-mix(in srgb, var(--arc-magenta) 28%, transparent);
		border-color: color-mix(in srgb, var(--arc-magenta) 50%, transparent);
	}
</style>


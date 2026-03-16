<script lang="ts" module>
	import { writable } from 'svelte/store';

	interface ToastItem {
		id: number;
		message: string;
		variant: 'ok' | 'pend' | 'warn' | 'fail';
		duration: number;
	}

	let nextId = 0;
	const _items = writable<ToastItem[]>([]);

	/** Toast store. Use toastStore.push() to show a toast. */
	export const toastStore = {
		subscribe: _items.subscribe,
		/** Push a new toast notification. */
		push(message: string, variant: 'ok' | 'pend' | 'warn' | 'fail' = 'ok', duration = 4000) {
			const id = nextId++;
			_items.update((items) => [...items, { id, message, variant, duration }]);
			setTimeout(() => {
				_items.update((items) => items.filter((t) => t.id !== id));
			}, duration);
		}
	};
</script>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { flip } from 'svelte/animate';

	interface Props {
		/** Position of the toast stack. */
		position?: 'bottom-right' | 'bottom-center';
		/** Additional CSS classes. */
		class?: string;
	}

	let { position = 'bottom-right', class: className = '' }: Props = $props();

	let items: ToastItem[] = $state([]);

	toastStore.subscribe((v) => {
		items = v;
	});

	const statusColorMap: Record<string, string> = {
		ok: 'var(--status-ok)',
		pend: 'var(--status-pend)',
		warn: 'var(--status-warn)',
		fail: 'var(--status-fail)'
	};
</script>

<div
	class={cn(
		'hyvui-toast-container',
		position === 'bottom-center' && 'hyvui-toast-center',
		className
	)}
	aria-live="polite"
>
	{#each items as item (item.id)}
		<div class="hyvui-toast" animate:flip={{ duration: 200 }}>
			<span class="hyvui-toast-dot" style:background-color={statusColorMap[item.variant]}></span>
			<span class="hyvui-toast-message">{item.message}</span>
		</div>
	{/each}
</div>

<style>
	.hyvui-toast-container {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		z-index: var(--z-toast);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		pointer-events: none;
	}

	.hyvui-toast-center {
		right: auto;
		left: 50%;
		transform: translateX(-50%);
	}

	.hyvui-toast {
		background: var(--surface-card);
		border: 1px solid rgba(255, 255, 255, 0.05);
		box-shadow: var(--shadow-veil);
		padding: 0.625rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.625rem;
		pointer-events: auto;
		animation: toast-in 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.hyvui-toast-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.hyvui-toast-message {
		font-family: var(--font-body);
		font-size: 0.88rem;
		color: var(--text-soft);
	}

	@keyframes toast-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-toast {
			animation: none;
		}
	}
</style>

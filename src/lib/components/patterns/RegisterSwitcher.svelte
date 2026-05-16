<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import { applyRegister, registers } from '../../system/register.js';
	import type { Register } from '../../system/register.js';

	/**
	 * A compact three-state toggle for switching between aesthetic registers.
	 * Persists choice to localStorage. Mounts invisibly until hovered.
	 *
	 * @example
	 * <RegisterSwitcher />
	 * <RegisterSwitcher defaultRegister="hextech" />
	 * <RegisterSwitcher choices={['field-notebook', 'hextech', 'arcane']} />
	 */
	interface Props {
		/** Which register to apply on first load (if no localStorage entry). */
		defaultRegister?: Register;
		/** Subset of registers to expose. Defaults to field-notebook, hextech, arcane. */
		choices?: Register[];
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		defaultRegister = 'field-notebook',
		choices = ['field-notebook', 'hextech', 'arcane'],
		class: className = ''
	}: Props = $props();

	const STORAGE_KEY = 'hyvui-register';

	const labels: Record<Register, string> = {
		'field-notebook': 'FN',
		'mission-control': 'MC',
		archive: 'AV',
		hextech: 'HX',
		arcane: 'ARC'
	};

	const titles: Record<Register, string> = {
		'field-notebook': 'Field Notebook',
		'mission-control': 'Mission Control',
		archive: 'Archive',
		hextech: 'Hextech',
		arcane: 'Arcane'
	};

	let current: Register = $state(defaultRegister);

	function init() {
		if (typeof localStorage === 'undefined') return;
		const saved = localStorage.getItem(STORAGE_KEY) as Register | null;
		if (saved && (registers as string[]).includes(saved)) {
			current = saved;
		}
		applyRegister(current);
	}

	function select(reg: Register) {
		current = reg;
		applyRegister(reg);
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(STORAGE_KEY, reg);
		}
	}

	$effect(() => {
		init();
	});
</script>

<div class={cn('hyvui-reg-switcher', className)} role="group" aria-label="Theme register">
	{#each choices as reg}
		<button
			class={cn('hyvui-reg-btn', current === reg && 'hyvui-reg-btn--active')}
			onclick={() => select(reg)}
			title={titles[reg]}
			aria-pressed={current === reg}
		>
			{labels[reg]}
		</button>
	{/each}
</div>

<style>
	.hyvui-reg-switcher {
		display: inline-flex;
		gap: 1px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--line);
		padding: 2px;
		opacity: 0.4;
		transition: opacity var(--transition-smooth);
	}

	.hyvui-reg-switcher:hover,
	.hyvui-reg-switcher:focus-within {
		opacity: 1;
	}

	.hyvui-reg-btn {
		font-family: var(--font-mono);
		font-size: 0.58rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		background: transparent;
		border: none;
		padding: 0.25rem 0.4rem;
		cursor: pointer;
		transition:
			color var(--transition-fast),
			background var(--transition-fast);
		line-height: 1;
	}

	.hyvui-reg-btn:hover {
		color: var(--text-soft);
		background: rgba(255, 255, 255, 0.06);
	}

	.hyvui-reg-btn--active {
		color: var(--accent);
		background: rgba(255, 255, 255, 0.05);
	}

	/* switcher itself stays visually neutral — never adopts register ornaments */
	.hyvui-reg-btn:focus-visible {
		outline: none;
		box-shadow: var(--focus-ring);
	}
</style>

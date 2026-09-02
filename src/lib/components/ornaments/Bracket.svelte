<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import type { Snippet } from 'svelte';

	/**
	 * Wraps inline or block content with bracket-style framing. Multiple visual
	 * styles. Theme overlays add terminators (hextech brass tips, arcane glow).
	 *
	 * @example
	 * <Bracket style="angle"><Glyph name="asterisk" /></Bracket>
	 * <Bracket style="curly" tone="signal">key value</Bracket>
	 */
	interface Props {
		style?: 'angle' | 'full' | 'curly' | 'square';
		weight?: 'thin' | 'normal' | 'bold';
		tone?: 'accent' | 'signal' | 'muted' | 'text';
		class?: string;
		children?: Snippet;
	}

	let {
		style = 'angle',
		weight = 'normal',
		tone = 'muted',
		class: className = '',
		children
	}: Props = $props();

	const toneColor = {
		accent: 'var(--accent)',
		signal: 'var(--signal)',
		muted: 'var(--muted)',
		text: 'var(--text)'
	} as const;

	const weightPx = {
		thin: '1px',
		normal: '1.5px',
		bold: '2.5px'
	} as const;

	const openChar = {
		angle: '⟨',
		full: '[',
		curly: '{',
		square: '⟦'
	} as const;
	const closeChar = {
		angle: '⟩',
		full: ']',
		curly: '}',
		square: '⟧'
	} as const;
</script>

<span
	class={cn(
		'hyvui-bracket',
		`hyvui-bracket-${style}`,
		`hyvui-bracket-w-${weight}`,
		className
	)}
	style:color={toneColor[tone]}
	style:--bracket-w={weightPx[weight]}
>
	<span class="hyvui-bracket-mark hyvui-bracket-open" aria-hidden="true">{openChar[style]}</span>
	<span class="hyvui-bracket-body">
		{#if children}{@render children()}{/if}
	</span>
	<span class="hyvui-bracket-mark hyvui-bracket-close" aria-hidden="true">{closeChar[style]}</span>
</span>

<style>
	.hyvui-bracket {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
		font-family: var(--reg-font-ui);
	}
	.hyvui-bracket-mark {
		font-family: var(--reg-font-ui);
		font-size: 1.1em;
		line-height: 1;
		opacity: 0.85;
		font-weight: 400;
	}
	.hyvui-bracket-body {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2xs);
	}

	.hyvui-bracket-w-thin .hyvui-bracket-mark {
		opacity: 0.65;
	}
	.hyvui-bracket-w-bold .hyvui-bracket-mark {
		opacity: 1;
		font-weight: 500;
	}

	/* ── hextech: brass tip terminator before/after the bracket ──────── */
	:global([data-theme='hextech']) .hyvui-bracket-open::before,
	:global([data-theme='hextech']) .hyvui-bracket-close::after {
		content: '';
		display: inline-block;
		width: 4px;
		height: 4px;
		background: var(--htx-brass-bright, var(--accent-strong));
		margin: 0 2px;
		clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
	}

	/* ── arcane: glow at apex of bracket ─────────────────────────────── */
	:global([data-theme='arcane']) .hyvui-bracket-mark {
		text-shadow: 0 0 6px color-mix(in srgb, var(--arc-magenta, var(--accent)) 60%, transparent);
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import { cn } from '../../utils/cn.js';
	import { currentRegister } from '../../system/motion/registerObserver.js';
	import { presets, cascadeStagger } from '../../system/motion/presets.js';

	/**
	 * Type that performs. Register-aware timing; theme overlays add scan lines
	 * (hextech) or crackle pulse (arcane) during reveal.
	 *
	 * @example
	 * <KineticText text="signal acquired" mode="letter" as="h1" />
	 * <KineticText text="cooling" mode="telegraph" />
	 * <KineticText text="archive" mode="mask" />
	 */
	interface Props {
		text: string;
		mode?: 'letter' | 'word' | 'mask' | 'telegraph';
		/** Per-unit reveal duration (seconds). Overrides register default. */
		speed?: number;
		/** Initial delay before the first character reveals (seconds). */
		delay?: number;
		as?: string;
		class?: string;
	}

	let {
		text,
		mode = 'letter',
		speed,
		delay = 0,
		as = 'span',
		class: className = ''
	}: Props = $props();

	let host: HTMLElement | null = $state(null);

	const units = $derived(
		mode === 'word' ? text.split(/(\s+)/) : mode === 'letter' ? Array.from(text) : []
	);

	onMount(() => {
		if (!host) return;
		const reduced =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (mode === 'mask') {
			revealMask(host, reduced);
			return;
		}

		const spans = Array.from(host.querySelectorAll<HTMLElement>('.hyvui-kt-unit'));

		if (reduced) {
			for (const s of spans) s.style.opacity = '1';
			return;
		}

		const { register } = currentRegister();
		const preset = presets[register]?.cascade ?? presets.default.cascade;
		const stagger =
			speed ?? cascadeStagger[register] ?? cascadeStagger.default;

		for (const s of spans) s.style.opacity = '0';

		spans.forEach((span, i) => {
			const isPause = mode === 'telegraph' && i % 3 === 2;
			animate(
				span,
				preset.keyframes as never,
				{
					...preset.options,
					delay: delay + i * stagger + (isPause ? stagger * 1.5 : 0)
				} as never
			);
		});
	});

	function revealMask(el: HTMLElement, reduced: boolean) {
		if (reduced) {
			el.style.clipPath = 'inset(0 0 0 0)';
			return;
		}
		el.style.clipPath = 'inset(0 100% 0 0)';
		animate(
			el,
			{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'] } as never,
			{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay } as never
		);
	}
</script>

<svelte:element
	this={as}
	bind:this={host}
	class={cn('hyvui-kt', `hyvui-kt-${mode}`, className)}
	aria-label={text}
>
	{#if mode === 'mask'}
		<span aria-hidden="true">{text}</span>
	{:else}
		{#each units as unit, i}
			{#if unit.match(/\s+/)}<!-- preserve whitespace -->{unit}{:else}
				<span class="hyvui-kt-unit" aria-hidden="true" data-i={i}>{unit}</span>
			{/if}
		{/each}
	{/if}
</svelte:element>

<style>
	.hyvui-kt {
		display: inline-block;
	}
	.hyvui-kt-unit {
		display: inline-block;
		will-change: opacity, transform;
	}

	/* hextech: cyan scan line passing left-to-right during reveal */
	:global([data-theme='hextech']) .hyvui-kt {
		position: relative;
		overflow: hidden;
	}
	:global([data-theme='hextech']) .hyvui-kt::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			90deg,
			transparent,
			color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 40%, transparent) 50%,
			transparent
		);
		transform: translateX(-100%);
		animation: kt-hextech-scan 1.8s cubic-bezier(0.4, 0, 0.2, 1) 1 forwards;
	}
	@keyframes kt-hextech-scan {
		to { transform: translateX(100%); }
	}

	/* arcane: magenta crackle pulse on each letter as it reveals */
	:global([data-theme='arcane']) .hyvui-kt-unit {
		text-shadow: 0 0 8px color-mix(in srgb, var(--arc-magenta, var(--accent)) 50%, transparent);
		animation: kt-arcane-crackle 0.5s var(--ease-smooth) 1;
	}
	@keyframes kt-arcane-crackle {
		0%   { text-shadow: 0 0 12px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 80%, transparent); }
		50%  { text-shadow: 0 0 18px color-mix(in srgb, var(--arc-magenta, var(--accent)) 100%, transparent); }
		100% { text-shadow: 0 0 8px color-mix(in srgb, var(--arc-magenta, var(--accent)) 50%, transparent); }
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='hextech']) .hyvui-kt::after,
		:global([data-theme='arcane']) .hyvui-kt-unit {
			animation: none;
		}
	}
</style>

<script lang="ts">
import { onMount } from 'svelte';
import { animate } from 'motion';
import { currentRegister } from '../../system/motion/registerObserver.js';
import { reducedMotionNow } from '../../system/runtime.js';
	import {
		presets,
		cascadeStagger,
		type Intent
	} from '../../system/motion/presets.js';
	import type { Snippet } from 'svelte';

	/**
	 * Wraps a list of children; reveals them in register-appropriate cascade.
	 * mission-control snaps near-parallel; field-notebook springs serial;
	 * archive eases through a slow ceremony.
	 *
	 * @example
	 * <Sequence stagger={0.1} from="first">
	 *   <Card>one</Card>
	 *   <Card>two</Card>
	 *   <Card>three</Card>
	 * </Sequence>
	 */
	interface Props {
		/** Override the register's default stagger duration (seconds). */
		stagger?: number;
		/** Reveal order. */
		from?: 'first' | 'last' | 'center';
		/** Motion preset key. Defaults to 'cascade'. */
		intent?: Intent;
		/** Initial delay before the first child reveals (seconds). */
		delay?: number;
		class?: string;
		children?: Snippet;
	}

	let {
		stagger: staggerOverride,
		from = 'first',
		intent = 'cascade',
		delay = 0,
		class: className = '',
		children
	}: Props = $props();

	let host: HTMLElement | null = $state(null);

	onMount(() => {
		if (!host) return;
		const reduced = reducedMotionNow();

		const kids = Array.from(host.children) as HTMLElement[];
		const animations: ReturnType<typeof animate>[] = [];

		if (reduced) {
			for (const k of kids) k.style.opacity = '1';
			return () => undefined;
		}

		const { register } = currentRegister(host);
		const preset = presets[register]?.[intent] ?? presets.default[intent];
		const s = staggerOverride ?? cascadeStagger[register] ?? cascadeStagger.default;

		// Pre-hide children to avoid flash before first frame
		for (const k of kids) k.style.opacity = '0';

		const order =
			from === 'last'
				? [...kids].reverse()
				: from === 'center'
					? centerOrder(kids)
					: kids;

		order.forEach((kid, i) => {
			animations.push(animate(
				kid,
				preset.keyframes as never,
				{ ...preset.options, delay: delay + i * s } as never
			));
		});

		return () => {
			for (const animation of animations) animation.stop();
		};
	});

	function centerOrder<T>(arr: T[]): T[] {
		const mid = Math.floor(arr.length / 2);
		const out: T[] = [];
		for (let offset = 0; offset <= mid; offset++) {
			if (mid - offset >= 0 && !out.includes(arr[mid - offset]))
				out.push(arr[mid - offset]);
			if (mid + offset < arr.length && !out.includes(arr[mid + offset]))
				out.push(arr[mid + offset]);
		}
		return out;
	}
</script>

<div bind:this={host} class={className} style:display="contents">
	{#if children}{@render children()}{/if}
</div>

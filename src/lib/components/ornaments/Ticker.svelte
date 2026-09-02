<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Scrolling readout band. Items animate continuously with a tone-tinted
	 * separator glyph between each. Pauses on hover. Respects reduced motion
	 * by switching to a static list.
	 *
	 * @example
	 * <Ticker items={['system nominal', 'queue: 12', 'last sync 3m ago']} />
	 */
	interface Props {
		items: string[];
		speed?: 'slow' | 'normal' | 'fast';
		direction?: 'left' | 'right';
		separator?: string;
		class?: string;
	}

	let {
		items,
		speed = 'normal',
		direction = 'left',
		separator = '·',
		class: className = ''
	}: Props = $props();

	const dur = {
		slow: '60s',
		normal: '40s',
		fast: '20s'
	} as const;
</script>

<div
	class={cn('hyvui-ticker', `hyvui-ticker-${direction}`, className)}
	style:--ticker-dur={dur[speed]}
	role="marquee"
	aria-label="scrolling status"
>
	<div class="hyvui-ticker-track">
		{#each [...items, ...items] as item, i}
			<span class="hyvui-ticker-item">{item}</span>
			{#if i < items.length * 2 - 1}
				<span class="hyvui-ticker-sep" aria-hidden="true">{separator}</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.hyvui-ticker {
		overflow: hidden;
		white-space: nowrap;
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
		padding-block: var(--space-2xs);
		border-top: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
	}
	.hyvui-ticker-track {
		display: inline-flex;
		gap: var(--space-md);
		animation: ticker-scroll var(--ticker-dur, 40s) linear infinite;
	}
	.hyvui-ticker-right .hyvui-ticker-track {
		animation-direction: reverse;
	}
	.hyvui-ticker:hover .hyvui-ticker-track {
		animation-play-state: paused;
	}

	.hyvui-ticker-item {
		flex-shrink: 0;
	}
	.hyvui-ticker-sep {
		color: var(--accent);
		flex-shrink: 0;
	}

	@keyframes ticker-scroll {
		from { transform: translateX(0); }
		to   { transform: translateX(-50%); }
	}

	/* hextech: cyan precision pip separator */
	:global([data-theme='hextech']) .hyvui-ticker-sep {
		color: var(--htx-cyan-glow, var(--signal));
		filter: drop-shadow(0 0 2px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 35%, transparent));
	}

	/* arcane: magenta crackle separator */
	:global([data-theme='arcane']) .hyvui-ticker-sep {
		color: var(--arc-magenta, var(--accent));
		text-shadow: 0 0 6px color-mix(in srgb, var(--arc-magenta, var(--accent)) 55%, transparent);
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-ticker {
			overflow-x: auto;
		}
		.hyvui-ticker-track {
			animation: none;
		}
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';
	import Surface from '../primitives/Surface.svelte';

	interface Props {
		/** Metric label. */
		label?: string;
		/** Metric value. */
		value?: string | number;
		/** Trend direction. */
		trend?: 'up' | 'down' | 'neutral';
		/** Trend value string (e.g. "+12%"). */
		trendValue?: string;
		/** Additional CSS classes. */
		class?: string;
	}

	let { label = '', value = '', trend, trendValue = '', class: className = '' }: Props = $props();

	const trendArrow: Record<string, string> = {
		up: '\u2191',
		down: '\u2193',
		neutral: '\u2014'
	};

	const trendColor: Record<string, string> = {
		up: 'var(--status-ok)',
		down: 'var(--status-fail)',
		neutral: 'var(--muted)'
	};
</script>

<Surface variant="card" class={cn('hyvui-metric', className)}>
	<span class="hyvui-metric-label">{label}</span>
	<span class="hyvui-metric-value">{value}</span>
	{#if trend}
		<span class="hyvui-metric-trend" style:color={trendColor[trend]}>
			{trendArrow[trend]}{#if trendValue}{' '}{trendValue}{/if}
		</span>
	{/if}
</Surface>

<style>
	:global(.hyvui-metric) {
		padding: var(--space-card);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.hyvui-metric-label {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1.2;
	}

	.hyvui-metric-value {
		font-family: var(--font-body);
		font-size: clamp(2rem, 5vw, 3rem);
		font-weight: 400;
		line-height: 0.95;
		letter-spacing: -0.05em;
		color: var(--text);
	}

	.hyvui-metric-trend {
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
</style>

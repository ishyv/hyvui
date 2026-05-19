<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Static thin connector line. No particles. Lighter cousin of Conduit
	 * for diagrammatic flourishes.
	 *
	 * @example
	 * <Wire direction="h" style="dashed" length="80px" />
	 */
	interface Props {
		direction?: 'h' | 'v' | 'diag';
		style?: 'solid' | 'dashed' | 'jagged';
		length?: string;
		class?: string;
	}

	let {
		direction = 'h',
		style = 'solid',
		length = '4rem',
		class: className = ''
	}: Props = $props();
</script>

<span
	class={cn(
		'hyvui-wire',
		`hyvui-wire-${direction}`,
		`hyvui-wire-${style}`,
		className
	)}
	style:--wire-length={length}
	aria-hidden="true"
></span>

<style>
	.hyvui-wire {
		display: inline-block;
		background-color: var(--accent);
		opacity: 0.5;
		vertical-align: middle;
	}
	.hyvui-wire-h {
		width: var(--wire-length);
		height: 1px;
	}
	.hyvui-wire-v {
		width: 1px;
		height: var(--wire-length);
	}
	.hyvui-wire-diag {
		width: var(--wire-length);
		height: 1px;
		transform: rotate(-25deg);
		transform-origin: left center;
	}

	.hyvui-wire-dashed {
		background-color: transparent;
		background-image: linear-gradient(
			to right,
			var(--accent) 50%,
			transparent 50%
		);
		background-size: 6px 1px;
		background-repeat: repeat-x;
	}
	.hyvui-wire-v.hyvui-wire-dashed {
		background-image: linear-gradient(to bottom, var(--accent) 50%, transparent 50%);
		background-size: 1px 6px;
		background-repeat: repeat-y;
	}

	.hyvui-wire-jagged {
		background: transparent;
		height: 6px;
		background-image: linear-gradient(
			135deg,
			var(--accent) 25%,
			transparent 25%,
			transparent 50%,
			var(--accent) 50%,
			var(--accent) 75%,
			transparent 75%
		);
		background-size: 4px 4px;
	}

	:global([data-theme='hextech']) .hyvui-wire {
		background-color: var(--htx-brass-bright, var(--accent-strong));
	}
	:global([data-theme='hextech']) .hyvui-wire-dashed {
		background-image: linear-gradient(
			to right,
			var(--htx-brass-bright, var(--accent-strong)) 50%,
			transparent 50%
		);
	}

	:global([data-theme='arcane']) .hyvui-wire {
		background-color: var(--arc-magenta, var(--accent));
		filter: drop-shadow(0 0 2px color-mix(in srgb, var(--arc-magenta, var(--accent)) 50%, transparent));
	}
	:global([data-theme='arcane']) .hyvui-wire-dashed {
		background-image: linear-gradient(
			to right,
			var(--arc-magenta, var(--accent)) 50%,
			transparent 50%
		);
	}
</style>

<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Single corner ornament. Drop four (one per corner) inside a positioned
	 * parent (Surface, Card, etc.) to frame it. Shape and color shift per theme.
	 *
	 * @example
	 * <Surface>
	 *   <Cornerstone corner="tl" />
	 *   <Cornerstone corner="tr" />
	 *   <Cornerstone corner="bl" />
	 *   <Cornerstone corner="br" />
	 *   ...content
	 * </Surface>
	 */
	interface Props {
		corner: 'tl' | 'tr' | 'bl' | 'br';
		shape?: 'pip' | 'nub' | 'shard' | 'serif';
		size?: string;
		class?: string;
	}

	let {
		corner,
		shape = 'pip',
		size = '8px',
		class: className = ''
	}: Props = $props();
</script>

<span
	class={cn(
		'hyvui-cornerstone',
		`hyvui-cornerstone-${corner}`,
		`hyvui-cornerstone-shape-${shape}`,
		className
	)}
	style:--cornerstone-size={size}
	aria-hidden="true"
></span>

<style>
	.hyvui-cornerstone {
		position: absolute;
		width: var(--cornerstone-size);
		height: var(--cornerstone-size);
		pointer-events: none;
		color: var(--accent);
	}

	/* corner placement */
	.hyvui-cornerstone-tl {
		top: 0;
		left: 0;
	}
	.hyvui-cornerstone-tr {
		top: 0;
		right: 0;
	}
	.hyvui-cornerstone-bl {
		bottom: 0;
		left: 0;
	}
	.hyvui-cornerstone-br {
		bottom: 0;
		right: 0;
	}

	/* shape: pip — small filled dot */
	.hyvui-cornerstone-shape-pip {
		background: currentColor;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}
	.hyvui-cornerstone-tr.hyvui-cornerstone-shape-pip {
		transform: translate(50%, -50%);
	}
	.hyvui-cornerstone-bl.hyvui-cornerstone-shape-pip {
		transform: translate(-50%, 50%);
	}
	.hyvui-cornerstone-br.hyvui-cornerstone-shape-pip {
		transform: translate(50%, 50%);
	}

	/* shape: nub — triangle pointing diagonally inward */
	.hyvui-cornerstone-shape-nub {
		background: currentColor;
	}
	.hyvui-cornerstone-tl.hyvui-cornerstone-shape-nub {
		clip-path: polygon(0 0, 100% 0, 0 100%);
	}
	.hyvui-cornerstone-tr.hyvui-cornerstone-shape-nub {
		clip-path: polygon(0 0, 100% 0, 100% 100%);
	}
	.hyvui-cornerstone-bl.hyvui-cornerstone-shape-nub {
		clip-path: polygon(0 0, 0 100%, 100% 100%);
	}
	.hyvui-cornerstone-br.hyvui-cornerstone-shape-nub {
		clip-path: polygon(100% 0, 0 100%, 100% 100%);
	}

	/* shape: shard — narrow inward-pointing wedge */
	.hyvui-cornerstone-shape-shard {
		background: currentColor;
		width: calc(var(--cornerstone-size) * 1.6);
		height: calc(var(--cornerstone-size) * 0.6);
	}
	.hyvui-cornerstone-tl.hyvui-cornerstone-shape-shard {
		clip-path: polygon(0 0, 100% 0, 0 100%);
	}
	.hyvui-cornerstone-tr.hyvui-cornerstone-shape-shard {
		clip-path: polygon(0 0, 100% 0, 100% 100%);
		right: 0;
	}
	.hyvui-cornerstone-bl.hyvui-cornerstone-shape-shard {
		clip-path: polygon(0 0, 0 100%, 100% 100%);
	}
	.hyvui-cornerstone-br.hyvui-cornerstone-shape-shard {
		clip-path: polygon(100% 0, 0 100%, 100% 100%);
		right: 0;
	}

	/* shape: serif — L-bracket arm (two strokes meeting at the corner) */
	.hyvui-cornerstone-shape-serif {
		width: calc(var(--cornerstone-size) * 2);
		height: calc(var(--cornerstone-size) * 2);
		background:
			linear-gradient(to right, currentColor 0, currentColor 1.5px, transparent 1.5px) top left/100% 1.5px no-repeat,
			linear-gradient(to bottom, currentColor 0, currentColor 1.5px, transparent 1.5px) top left/1.5px 100% no-repeat;
	}
	.hyvui-cornerstone-tr.hyvui-cornerstone-shape-serif {
		background:
			linear-gradient(to right, transparent calc(100% - 1.5px), currentColor 0) top right/100% 1.5px no-repeat,
			linear-gradient(to bottom, currentColor 0, currentColor 1.5px, transparent 1.5px) top right/1.5px 100% no-repeat;
	}
	.hyvui-cornerstone-bl.hyvui-cornerstone-shape-serif {
		background:
			linear-gradient(to right, currentColor 0, currentColor 1.5px, transparent 1.5px) bottom left/100% 1.5px no-repeat,
			linear-gradient(to bottom, transparent calc(100% - 1.5px), currentColor 0) bottom left/1.5px 100% no-repeat;
	}
	.hyvui-cornerstone-br.hyvui-cornerstone-shape-serif {
		background:
			linear-gradient(to right, transparent calc(100% - 1.5px), currentColor 0) bottom right/100% 1.5px no-repeat,
			linear-gradient(to bottom, transparent calc(100% - 1.5px), currentColor 0) bottom right/1.5px 100% no-repeat;
	}

	/* ── theme overlays ──────────────────────────────────────────────── */
	:global([data-theme='hextech']) .hyvui-cornerstone {
		color: var(--htx-brass-bright, var(--accent-strong));
	}
	:global([data-theme='hextech']) .hyvui-cornerstone-shape-nub,
	:global([data-theme='hextech']) .hyvui-cornerstone-shape-shard {
		filter: drop-shadow(0 0 2px color-mix(in srgb, var(--htx-cyan-glow, var(--signal)) 35%, transparent));
	}

	:global([data-theme='arcane']) .hyvui-cornerstone {
		color: var(--arc-magenta, var(--accent));
	}
	:global([data-theme='arcane']) .hyvui-cornerstone-shape-shard,
	:global([data-theme='arcane']) .hyvui-cornerstone-shape-nub {
		filter: drop-shadow(0 0 4px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 50%, transparent));
	}
</style>

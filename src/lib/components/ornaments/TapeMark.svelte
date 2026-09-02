<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * Archival sticker / pull-tab. Overlay on any positioned parent to mark its
	 * origin or state with a tilted label. Theme overlays change the material:
	 * default = legal-pad yellow tape; hextech = brass plate with rivet detail;
	 * arcane = magenta sticker with crackle edge.
	 *
	 * @example
	 * <Surface variant="card" style="position: relative;">
	 *   <TapeMark label="draft" position="tr" />
	 *   ... content
	 * </Surface>
	 */
	interface Props {
		label: string;
		angle?: number;
		position?: 'tl' | 'tr' | 'bl' | 'br' | 'free';
		top?: string;
		left?: string;
		right?: string;
		bottom?: string;
		class?: string;
	}

	let {
		label,
		angle = -2,
		position = 'tl',
		top,
		left,
		right,
		bottom,
		class: className = ''
	}: Props = $props();
</script>

<span
	class={cn('hyvui-tape-mark', `hyvui-tape-${position}`, className)}
	style:transform="rotate({angle}deg)"
	style:top={top ?? null}
	style:left={left ?? null}
	style:right={right ?? null}
	style:bottom={bottom ?? null}
	aria-hidden="true"
>
	<span class="hyvui-tape-label">{label}</span>
</span>

<style>
	.hyvui-tape-mark {
		position: absolute;
		z-index: var(--z-raised, 10);
		font-family: var(--reg-font-ui);
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.18em;
		padding: var(--space-2xs) var(--space-sm);
		background: color-mix(in srgb, var(--accent-strong, var(--accent)) 78%, transparent);
		color: var(--bg);
		box-shadow:
			0 1px 0 color-mix(in srgb, var(--bg) 30%, transparent) inset,
			0 4px 8px rgba(0, 0, 0, 0.35);
		transform-origin: center;
		pointer-events: none;
	}

	.hyvui-tape-tl { top: 0; left: 0; transform-origin: top left; translate: -6% -32%; }
	.hyvui-tape-tr { top: 0; right: 0; transform-origin: top right; translate: 6% -32%; }
	.hyvui-tape-bl { bottom: 0; left: 0; transform-origin: bottom left; translate: -6% 32%; }
	.hyvui-tape-br { bottom: 0; right: 0; transform-origin: bottom right; translate: 6% 32%; }

	/* ── hextech: brass plate with rivet dots at the ends ────────────── */
	:global([data-theme='hextech']) .hyvui-tape-mark {
		background: linear-gradient(
			180deg,
			color-mix(in srgb, var(--htx-brass-bright, var(--accent-strong)) 90%, transparent),
			color-mix(in srgb, var(--htx-brass, var(--accent)) 95%, transparent)
		);
		border: 1px solid color-mix(in srgb, var(--htx-brass, var(--accent)) 70%, transparent);
		color: var(--bg);
	}
	:global([data-theme='hextech']) .hyvui-tape-mark::before,
	:global([data-theme='hextech']) .hyvui-tape-mark::after {
		content: '';
		position: absolute;
		width: 3px;
		height: 3px;
		background: color-mix(in srgb, var(--bg) 70%, transparent);
		border-radius: 50%;
		top: 50%;
		transform: translateY(-50%);
	}
	:global([data-theme='hextech']) .hyvui-tape-mark::before { left: 4px; }
	:global([data-theme='hextech']) .hyvui-tape-mark::after { right: 4px; }

	/* ── arcane: magenta sticker with jagged crackle edge ────────────── */
	:global([data-theme='arcane']) .hyvui-tape-mark {
		background: color-mix(in srgb, var(--arc-magenta, var(--accent)) 85%, transparent);
		color: var(--text);
		clip-path: polygon(2% 0, 100% 0, 98% 50%, 100% 100%, 2% 100%, 0 50%);
		text-shadow: 0 0 6px color-mix(in srgb, var(--arc-shimmer, var(--accent-strong)) 60%, transparent);
	}

	/* ── register overlays ───────────────────────────────────────────── */
	:global([data-weight='field-notebook']) .hyvui-tape-mark {
		filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
	}
	:global([data-weight='archive']) .hyvui-tape-mark {
		opacity: 0.85;
		filter: blur(0.15px);
	}
</style>

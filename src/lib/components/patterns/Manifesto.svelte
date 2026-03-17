<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @remarks Full editorial statement block. Text in space, not text in a box.
	 * Use for philosophical statements, design principles, section intros.
	 * @example
	 * <Manifesto
	 *   statement="quiet confidence. technical depth. no ornamental sludge."
	 *   attribution="design posture"
	 *   accent="gold"
	 * />
	 */
	interface Props {
		/** The statement text. */
		statement: string;
		/** Optional attribution label rendered below in readout style. */
		attribution?: string;
		/** Side accent rule color. */
		accent?: 'gold' | 'signal' | 'none';
		/** Text alignment. */
		align?: 'left' | 'center';
		/** Additional CSS classes. */
		class?: string;
	}

	let {
		statement,
		attribution,
		accent = 'none',
		align = 'left',
		class: className = ''
	}: Props = $props();
</script>

<blockquote
	class={cn('hyvui-manifesto', `hyvui-manifesto--accent-${accent}`, `hyvui-manifesto--${align}`, className)}
>
	<p class="hyvui-manifesto-statement">{statement}</p>
	{#if attribution}
		<footer class="hyvui-manifesto-attribution">
			<span class="hyvui-manifesto-rule" aria-hidden="true"></span>
			<cite class="hyvui-manifesto-cite">{attribution}</cite>
		</footer>
	{/if}
</blockquote>

<style>
	.hyvui-manifesto {
		margin: 0;
		padding: 0;
		border: none;
		display: flex;
		flex-direction: column;
		gap: calc(1rem * var(--reg-spacing-scale, 1));
	}

	/* accent rule — pseudo-element so it can animate scaleY */
	.hyvui-manifesto--accent-gold,
	.hyvui-manifesto--accent-signal {
		position: relative;
		padding-left: 1.25rem;
	}

	.hyvui-manifesto--accent-gold::before,
	.hyvui-manifesto--accent-signal::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		height: 100%;
		transform-origin: top;
		animation: manifesto-rule-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.hyvui-manifesto--accent-gold::before {
		background: rgba(199, 156, 87, 0.5);
	}

	.hyvui-manifesto--accent-signal::before {
		background: rgba(121, 166, 163, 0.5);
	}

	@keyframes manifesto-rule-in {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	.hyvui-manifesto--center {
		align-items: center;
		text-align: center;
		padding-left: 0;
	}

	.hyvui-manifesto--center::before {
		display: none;
	}

	/* statement */
	.hyvui-manifesto-statement {
		margin: 0;
		font-family: var(--font-body);
		font-style: italic;
		font-size: clamp(1.1rem, 2.5vw, 1.6rem);
		line-height: 1.45;
		color: var(--text-soft);
		max-width: 30rem;
		text-wrap: pretty;
		animation: manifesto-text-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
	}

	@keyframes manifesto-text-in {
		from {
			opacity: 0;
			transform: translateX(4px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-manifesto--accent-gold::before,
		.hyvui-manifesto--accent-signal::before {
			animation: none;
		}

		.hyvui-manifesto-statement {
			animation: none;
		}
	}

	.hyvui-manifesto--center .hyvui-manifesto-statement {
		text-align: center;
		max-width: 36rem;
	}

	/* attribution */
	.hyvui-manifesto-attribution {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}

	.hyvui-manifesto-rule {
		display: block;
		width: 2rem;
		height: 1px;
		background: var(--line);
		flex-shrink: 0;
	}

	.hyvui-manifesto-cite {
		font-style: normal;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--muted);
		line-height: 1.6;
	}

	.hyvui-manifesto--center .hyvui-manifesto-attribution {
		justify-content: center;
	}
</style>

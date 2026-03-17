<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @remarks Breakout quotation — larger than Blockquote, a page-level element.
	 * Use for testimonials, design maxims, and editorial pull-quotes.
	 * @example
	 * <PullQuote
	 *   quote="every detail should look placed, not merely present."
	 *   attribution="design constraints"
	 *   source="hyvui"
	 * />
	 */
	interface Props {
		/** The quotation text. */
		quote: string;
		/** Who said it. */
		attribution?: string;
		/** Where it came from. */
		source?: string;
		/** Additional CSS classes. */
		class?: string;
	}

	let { quote, attribution, source, class: className = '' }: Props = $props();
</script>

<figure class={cn('hyvui-pull-quote', className)}>
	<div class="hyvui-pull-quote-bracket" aria-hidden="true">[</div>
	<blockquote class="hyvui-pull-quote-body">
		<p class="hyvui-pull-quote-text">{quote}</p>
	</blockquote>
	{#if attribution || source}
		<figcaption class="hyvui-pull-quote-caption">
			{#if attribution}
				<cite class="hyvui-pull-quote-attribution">{attribution}</cite>
			{/if}
			{#if attribution && source}
				<span class="hyvui-pull-quote-sep" aria-hidden="true">·</span>
			{/if}
			{#if source}
				<span class="hyvui-pull-quote-source">{source}</span>
			{/if}
		</figcaption>
	{/if}
</figure>

<style>
	.hyvui-pull-quote {
		margin: 0;
		padding: 0;
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		padding-left: 1.5rem;
	}

	.hyvui-pull-quote::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		height: 100%;
		background: rgba(199, 156, 87, 0.45);
		transform-origin: top;
		animation: pullquote-border-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes pullquote-border-in {
		from {
			transform: scaleY(0);
		}
		to {
			transform: scaleY(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-pull-quote::before {
			animation: none;
		}
	}

	.hyvui-pull-quote-bracket {
		font-family: var(--font-body);
		font-size: clamp(1.1rem, 2.5vw, 1.6rem);
		line-height: 1.45;
		color: rgba(199, 156, 87, 0.4);
		pointer-events: none;
		user-select: none;
		align-self: start;
		margin-top: 0.05em;
	}

	.hyvui-pull-quote-body {
		margin: 0;
		padding: 0;
		border: none;
		display: flex;
		flex-direction: column;
		gap: calc(0.9rem * var(--reg-spacing-scale, 1));
	}

	.hyvui-pull-quote-text {
		margin: 0;
		font-family: var(--font-body);
		font-style: italic;
		font-size: clamp(1.1rem, 2.5vw, 1.6rem);
		line-height: 1.45;
		color: var(--text-soft);
		text-wrap: pretty;
	}

	.hyvui-pull-quote-caption {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.hyvui-pull-quote-attribution {
		font-style: italic;
		font-family: var(--font-body);
		font-size: 0.88rem;
		color: var(--muted-strong);
		line-height: 1.5;
	}

	.hyvui-pull-quote-sep {
		color: var(--muted);
		opacity: 0.75;
		font-family: var(--font-mono);
		font-size: 0.75rem;
	}

	.hyvui-pull-quote-source {
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--muted);
		line-height: 1.6;
	}
</style>

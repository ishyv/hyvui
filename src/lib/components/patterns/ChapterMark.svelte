<script lang="ts">
	import { cn } from '../../utils/cn.js';

	/**
	 * @remarks Architectural section header. Creates structural rhythm without a container.
	 * Use for section openers in long-form pages, portfolios, documentation.
	 * @example
	 * <ChapterMark index="01" title="signal architecture" descriptor="how the system speaks" />
	 */
	interface Props {
		/** Chapter index — a number, roman numeral, or label. */
		index?: string | number;
		/** Chapter title. */
		title: string;
		/** Optional descriptor rendered in readout style below the title. */
		descriptor?: string;
		/** Additional CSS classes. */
		class?: string;
	}

	let { index, title, descriptor, class: className = '' }: Props = $props();
</script>

<header class={cn('hyvui-chapter-mark', className)}>
	<div class="hyvui-chapter-mark-rule" aria-hidden="true"></div>
	<div class="hyvui-chapter-mark-body">
		{#if index !== undefined}
			<div class="hyvui-chapter-mark-index" aria-hidden="true">
				<span class="hyvui-chapter-mark-index-text">{index}</span>
				<span class="hyvui-chapter-mark-index-line"></span>
			</div>
		{/if}
		<div class="hyvui-chapter-mark-text">
			<h2 class="hyvui-chapter-mark-title">{title}</h2>
			{#if descriptor}
				<p class="hyvui-chapter-mark-descriptor">{descriptor}</p>
			{/if}
		</div>
	</div>
</header>

<style>
	.hyvui-chapter-mark {
		display: flex;
		flex-direction: column;
		gap: calc(1.25rem * var(--reg-spacing-scale, 1));
	}

	.hyvui-chapter-mark-rule {
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 1px;
		background: var(--line);
	}

	.hyvui-chapter-mark-rule::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--bg);
		transform-origin: right;
		animation: chapter-rule-wipe 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes chapter-rule-wipe {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-chapter-mark-rule::after {
			animation: none;
			display: none;
		}
	}

	.hyvui-chapter-mark-body {
		display: flex;
		gap: calc(1.5rem * var(--reg-spacing-scale, 1));
		align-items: baseline;
	}

	.hyvui-chapter-mark-index {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		flex-shrink: 0;
		padding-top: 0.3em;
	}

	.hyvui-chapter-mark-index-text {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--muted-strong);
		line-height: 1;
	}

	.hyvui-chapter-mark-index-line {
		display: block;
		width: 2.5rem;
		height: 1px;
		background: var(--line);
	}

	.hyvui-chapter-mark-text {
		display: flex;
		flex-direction: column;
		gap: calc(0.5rem * var(--reg-spacing-scale, 1));
	}

	.hyvui-chapter-mark-title {
		margin: 0;
		font-family: var(--font-body);
		font-weight: 400;
		font-size: clamp(1.8rem, 4vw, 3rem);
		letter-spacing: -0.03em;
		line-height: 1.05;
		color: var(--text);
		animation: chapter-title-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;
	}

	@keyframes chapter-title-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hyvui-chapter-mark-title {
			animation: none;
		}
	}

	.hyvui-chapter-mark-descriptor {
		margin: 0;
		font-family: var(--font-mono);
		font-size: 0.82rem;
		letter-spacing: 0.06em;
		color: var(--muted);
		line-height: 1.6;
	}
</style>

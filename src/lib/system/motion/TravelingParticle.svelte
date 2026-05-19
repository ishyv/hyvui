<script lang="ts">
	/**
	 * SVG circle that travels along a linear path between two endpoints. Used
	 * by ArcaneVein, Conduit, Wire. Lives inside an existing <svg> — does NOT
	 * render its own root. Animates `cx`/`cy`/`opacity` directly, which avoids
	 * the percentage-unit pitfalls of <animateMotion>+<mpath>.
	 *
	 * For curved/multi-segment paths, render an SVG <path> elsewhere and pass
	 * its id via `mpathId` — falls back to <animateMotion> referencing that id.
	 *
	 * Respects prefers-reduced-motion by hiding the particle entirely.
	 */
	interface Props {
		x1?: string | number;
		y1?: string | number;
		x2?: string | number;
		y2?: string | number;
		mpathId?: string;
		speed?: number;
		radius?: number;
		fill?: string;
		class?: string;
	}

	let {
		x1 = '0%',
		y1 = '0%',
		x2 = '100%',
		y2 = '100%',
		mpathId,
		speed = 3,
		radius = 2.5,
		fill = 'currentColor',
		class: className = ''
	}: Props = $props();

	const dur = $derived(`${speed}s`);
</script>

<circle r={radius} {fill} class={className}>
	{#if mpathId}
		<animateMotion {dur} repeatCount="indefinite">
			<mpath href="#{mpathId}" />
		</animateMotion>
	{:else}
		<animate attributeName="cx" from={x1} to={x2} {dur} repeatCount="indefinite" />
		<animate attributeName="cy" from={y1} to={y2} {dur} repeatCount="indefinite" />
	{/if}
	<animate
		attributeName="opacity"
		values="0;0.9;0.9;0"
		keyTimes="0;0.08;0.88;1"
		{dur}
		repeatCount="indefinite"
	/>
</circle>

<style>
	@media (prefers-reduced-motion: reduce) {
		circle {
			display: none;
		}
	}
</style>

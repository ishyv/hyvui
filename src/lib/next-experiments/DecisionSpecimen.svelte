<script lang="ts">
  import type { DecisionSpecimen } from "./measuredSublime.js";

  interface Props {
    specimen: DecisionSpecimen;
    activeId?: string;
  }

  let { specimen, activeId = "" }: Props = $props();
  const titleId = $derived(`${specimen.phenomenonId}-title`);
  const descriptionId = $derived(`${specimen.phenomenonId}-description`);
  const materialId = $derived(`${specimen.phenomenonId}-material`);
  const activeTrace = $derived(
    specimen.trace.find((segment) => segment.relationId === activeId),
  );
</script>

<figure
  class="decision-specimen"
  data-phenomenon={specimen.phenomenonId}
  data-active-evidence={activeId || undefined}
>
  <svg
    viewBox="0 0 1000 1000"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
    preserveAspectRatio="xMidYMid meet"
  >
    <title id={titleId}>decision specimen</title>
    <desc id={descriptionId}>
      a material specimen derived from composition decisions, nodes, and
      relations
    </desc>

    <defs>
      <linearGradient id={materialId} x1="0" y1="0" x2="1" y2="1">
        <stop class="specimen-light" offset="0" />
        <stop class="specimen-dark" offset="0.72" />
      </linearGradient>
    </defs>

    <path
      class="specimen-body"
      d={specimen.bodyPath}
      fill={`url(#${materialId})`}
      aria-hidden="true"
    />

    <g class="specimen-facets" aria-hidden="true">
      {#each specimen.facets as facet}
        <path
          class="specimen-facet"
          class:active={activeId === facet.nodeId}
          d={facet.path}
          data-specimen-facet={facet.nodeId}
          data-specimen-role={facet.role}
          data-active={activeId === facet.nodeId ? "true" : "false"}
        />
        <circle
          class="specimen-registration"
          cx={facet.registration.x}
          cy={facet.registration.y}
          r="7"
        />
        <text
          class="specimen-node-label"
          x={facet.label.x}
          y={facet.label.y}
          text-anchor={facet.label.anchor}
          data-specimen-node-label={facet.nodeId}
        >
          {facet.nodeId}
        </text>
      {/each}
    </g>

    <g class="specimen-trace" aria-hidden="true">
      {#each specimen.trace as segment}
        <path
          class="specimen-trace-segment"
          class:active={activeId === segment.relationId}
          d={segment.path}
          data-specimen-trace={segment.relationId}
          data-decision-status={segment.status}
          data-active={activeId === segment.relationId ? "true" : "false"}
        />
      {/each}
    </g>

    {#if specimen.rupture}
      <g data-specimen-rupture={specimen.rupture.relationId} aria-hidden="true">
        <path
          class="specimen-rupture"
          d={specimen.rupture.path}
          pathLength="1000"
        />
        <circle
          class="specimen-decision-point"
          cx={specimen.rupture.point.x}
          cy={specimen.rupture.point.y}
          r="12"
        />
      </g>
    {/if}

    {#if activeTrace && specimen.rupture}
      <path
        class="specimen-annotation-leader"
        d={`M ${specimen.rupture.point.x} ${specimen.rupture.point.y} L 420 665`}
        aria-hidden="true"
      />
    {/if}
  </svg>

  {#if activeTrace}
    <figcaption data-active-annotation>
      <span>{activeTrace.relationId}</span>
      <p>{activeTrace.reason}</p>
    </figcaption>
  {/if}
</figure>

<style>
  .decision-specimen {
    position: relative;
    width: 100%;
    margin: 0;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .specimen-light {
    stop-color: var(--ms-specimen-edge);
  }

  .specimen-dark {
    stop-color: var(--ms-specimen);
  }

  .specimen-facet {
    fill: none;
    stroke: transparent;
    stroke-width: 2;
  }

  .specimen-registration {
    fill: var(--ms-field);
    opacity: 0.7;
  }

  .specimen-node-label {
    fill: color-mix(in srgb, var(--ms-field) 78%, transparent);
    font-family: var(--font-mono);
    font-size: 22px;
    letter-spacing: 0.05em;
  }

  .specimen-trace-segment {
    fill: none;
    stroke: color-mix(in srgb, var(--ms-field) 48%, transparent);
    stroke-width: 3;
  }

  .specimen-rupture {
    fill: none;
    stroke: var(--ms-rupture);
    stroke-width: 11;
    stroke-dasharray: 190 28 140 642;
    stroke-dashoffset: -400;
    stroke-linecap: butt;
  }

  .specimen-decision-point {
    fill: var(--ms-specimen);
    stroke: var(--ms-rupture);
    stroke-width: 5;
  }

  .specimen-annotation-leader {
    fill: none;
    stroke: color-mix(in srgb, var(--ms-field) 68%, transparent);
    stroke-width: 2;
  }

  .specimen-facet.active,
  .specimen-trace-segment.active {
    stroke: var(--ms-rupture);
  }

  .specimen-trace-segment.active {
    stroke-width: 5;
    transition:
      stroke 320ms ease,
      stroke-width 320ms ease,
      opacity 320ms ease;
  }

  figcaption {
    position: absolute;
    top: 67%;
    left: 42%;
    max-width: 13rem;
    color: var(--ms-field);
  }

  figcaption span {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  figcaption p {
    margin: var(--space-xs) 0 0;
    font-family: var(--font-serif);
    font-size: var(--text-sm);
    line-height: 1.2;
  }

  @media (prefers-reduced-motion: reduce) {
    .specimen-trace-segment.active {
      transition-duration: 0s;
    }
  }
</style>

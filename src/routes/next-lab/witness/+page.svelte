<script lang="ts">
  import Composition from "$lib/next-experiments/Composition.svelte";
  import CompositionNode from "$lib/next-experiments/Node.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";
  import {
    recordWitnessAttention,
    resolveWitnessView,
    witnessObservationIds,
    witnessObservations,
    type WitnessMode,
    type WitnessObservationId,
  } from "$lib/next-experiments/witness.js";

  let { data }: { data: PageData } = $props();
  const showcaseManifest = getShowcaseManifest("next-witness");

  let selectedId = $state<WitnessObservationId>("horizon");
  let mode = $state<WitnessMode>("focus");
  let attentionTrail = $state<WitnessObservationId[]>(["horizon"]);

  const view = $derived(resolveWitnessView(selectedId, mode, attentionTrail));
  const focusPaths: Record<WitnessObservationId, string> = {
    canopy: "M500 352 L620 154",
    horizon: "M500 352 C492 358 486 362 480 364 L360 332",
    ground: "M500 352 L340 546",
  };
  const focusPoints: Record<WitnessObservationId, { x: number; y: number }> = {
    canopy: { x: 620, y: 154 },
    horizon: { x: 480, y: 364 },
    ground: { x: 340, y: 546 },
  };
  const focusPath = $derived(focusPaths[selectedId]);
  const trailLabels = $derived(
    attentionTrail.map(
      (id) =>
        witnessObservations.find((observation) => observation.id === id)?.label,
    ),
  );

  function selectObservation(id: WitnessObservationId): void {
    selectedId = id;
    attentionTrail = recordWitnessAttention(attentionTrail, id);
  }

  function moveObservation(
    delta: number,
    origin: WitnessObservationId = selectedId,
  ): void {
    const originIndex = witnessObservationIds.indexOf(origin);
    const nextIndex =
      (originIndex + delta + witnessObservationIds.length) %
      witnessObservationIds.length;
    const nextId = witnessObservationIds[nextIndex];
    selectObservation(nextId);
    document
      .querySelector<HTMLButtonElement>(`[data-witness-marker-id="${nextId}"]`)
      ?.focus();
  }

  function handleMarkerKeydown(
    event: KeyboardEvent,
    origin: WitnessObservationId,
  ): void {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveObservation(1, origin);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveObservation(-1, origin);
    }
  }
</script>

<svelte:head>
  <title>next lab / focus and context</title>
  <meta
    name="description"
    content="An observation field where focus shows one marker and context shows all three."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
  <main
    class="witness-page"
    data-witness
    data-view-mode={mode}
    data-active-observation={selectedId}
    data-attention-count={attentionTrail.length}
  >
  <a class="witness-back" href="/next-lab/biomes">next lab / biome gallery</a>

  <div class="witness-topline" aria-hidden="true">
    <span>field note / 08</span>
    <span>observation / unstable</span>
    <span>02:14 → now</span>
  </div>

  <header class="witness-title-block">
    <span class="witness-kicker">selection changes the record</span>
    <h1>focus and context</h1>
    <p>
      focus shows one marker. context shows all three and lowers the certainty
      label.
    </p>
  </header>

  <Composition
    id="witness-composition"
    artDirection={data.artDirection}
    nodes={data.nodes}
    relations={data.relations}
    biomePlan={data.plan}
    inspect
    class="witness-composition"
  >
    <CompositionNode id="field" as="div" class="witness-field-node">
      <div class="witness-field" data-witness-field>
        <svg
          class="witness-landscape"
          viewBox="0 0 1000 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="witness-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="var(--bg)" />
              <stop offset="0.62" stop-color="var(--bg-subtle)" />
              <stop offset="1" stop-color="var(--surface)" />
            </linearGradient>
            <linearGradient id="witness-ground" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stop-color="var(--bg)" />
              <stop offset="0.56" stop-color="var(--signal)" />
              <stop offset="1" stop-color="var(--bg)" />
            </linearGradient>
          </defs>
          <rect width="1000" height="700" fill="url(#witness-sky)" />
          <path
            class="landscape-ridge landscape-ridge-back"
            d="M0 418 C140 350 220 398 334 364 S552 378 682 334 S858 375 1000 318"
          />
          <path
            class="landscape-ridge landscape-ridge-mid"
            d="M0 500 C120 442 218 508 324 448 S512 468 620 414 S812 472 1000 398"
          />
          <path
            class="landscape-ridge landscape-ridge-front"
            d="M0 596 C142 514 260 588 376 526 S610 562 746 484 S890 546 1000 478"
          />
          <path
            class="landscape-thread landscape-thread-one"
            d="M0 518 C184 484 270 548 414 494 S668 512 1000 448"
          />
          <path
            class="landscape-thread landscape-thread-two"
            d="M0 560 C164 528 244 592 398 548 S684 546 1000 520"
          />
          <path class="horizon-line" d="M0 366 H1000" />
          {#if mode === "context"}
            {#each witnessObservations as observation}
              <path
                class="focus-connection"
                data-witness-focus-connection={observation.id}
                data-focus-connection={observation.id}
                d={focusPaths[observation.id]}
              />
            {/each}
          {:else}
            <path
              class="focus-connection"
              data-witness-focus-connection
              data-focus-connection={selectedId}
              d={focusPath}
            />
          {/if}
          {#if mode === "context"}
            {#each witnessObservations as observation}
              <circle
                class="focus-connection-point"
                data-focus-point={observation.id}
                cx={focusPoints[observation.id].x}
                cy={focusPoints[observation.id].y}
                r="5"
              />
            {/each}
          {:else}
            <circle
              class="focus-connection-point"
              data-focus-point={selectedId}
              cx={focusPoints[selectedId].x}
              cy={focusPoints[selectedId].y}
              r="6"
            />
          {/if}
          <path class="frame-line frame-line-vertical" d="M744 0 V700" />
          <path class="frame-line frame-line-horizontal" d="M0 116 H1000" />
          <g class="aperture-drawing">
            <ellipse cx="500" cy="352" rx="235" ry="104" />
            <path d="M286 350 C374 286 474 278 574 316 S704 400 756 358" />
            <path d="M302 384 C398 350 494 358 588 382 S686 410 724 392" />
            <path
              class="aperture-slit"
              d="M424 351 C464 337 540 337 582 352 C540 368 466 368 424 351Z"
            />
            <circle cx="503" cy="352" r="18" />
          </g>
          <g class="peripheral-marks">
            <path d="M78 146 H202 M78 156 H164" />
            <path d="M814 182 H916 M842 192 H916" />
            <path d="M70 630 H190 M70 640 H142" />
            <path d="M830 620 H948 M874 630 H948" />
          </g>
        </svg>

        <div class="aperture-shadow" aria-hidden="true"></div>
        <div
          class="witness-aperture"
          data-witness-aperture
          data-witness-aperture-mode={mode}
          style={`--witness-aperture-x: ${view.observation?.position.x ?? "48%"}; --witness-aperture-y: ${view.observation?.position.y ?? "52%"};`}
          aria-hidden="true"
        >
          <span class="aperture-inner-line"></span>
          <span class="aperture-inner-point"></span>
        </div>

        {#each witnessObservations as observation, index}
          <button
            type="button"
            class="witness-marker"
            data-witness-marker-id={observation.id}
            data-witness-marker-state={mode === "context"
              ? "visible"
              : selectedId === observation.id
                ? "active"
                : "quiet"}
            style={`--witness-x: ${observation.position.x}; --witness-y: ${observation.position.y};`}
            aria-label={`observe ${observation.label}`}
            aria-pressed={selectedId === observation.id}
            onclick={() => selectObservation(observation.id)}
            onfocus={() => selectObservation(observation.id)}
            onkeydown={(event) => handleMarkerKeydown(event, observation.id)}
          >
            <span class="marker-index">0{index + 1}</span>
            <span class="marker-label">{observation.label}</span>
          </button>
        {/each}

        <p class="field-coordinates" aria-hidden="true">
          <span>field / observation frame</span>
          <span
            >lat. 47° / confidence {view.observation?.certainty ??
              "unknown"}</span
          >
        </p>
      </div>
    </CompositionNode>

    <CompositionNode id="trace" as="div" class="witness-trace-node" ariaHidden>
      <div class="witness-trace" data-witness-trace aria-hidden="true">
        <span class="trace-origin"></span>
        <span class="trace-seam"></span>
        <span class="trace-end"></span>
      </div>
    </CompositionNode>

    <CompositionNode id="record" as="aside" class="witness-record">
      <div class="record-heading">
        <span>record / {view.observation?.label ?? "unknown"}</span>
        <span data-witness-certainty>{view.certainty}</span>
      </div>

      <fieldset class="view-switch">
        <legend>act of looking</legend>
        <button
          type="button"
          data-witness-mode="focus"
          aria-pressed={mode === "focus"}
          onclick={() => (mode = "focus")}>focus / one signal</button
        >
        <button
          type="button"
          data-witness-mode="context"
          aria-pressed={mode === "context"}
          onclick={() => (mode = "context")}>context / the field</button
        >
      </fieldset>

      <div
        class="record-reading"
        id="witness-reading"
        data-witness-reading
        aria-live="polite"
      >
        <span class="reading-index"
          >{view.observation?.title ?? "observation unavailable"}</span
        >
        <p>{view.primaryText}</p>
      </div>

      <div class="record-observations">
        <div class="record-label">observations / select a point</div>
        <div class="observation-list">
          {#each witnessObservations as observation, index}
            <button
              type="button"
              data-witness-target={observation.id}
              aria-controls="witness-reading"
              aria-pressed={selectedId === observation.id}
              onclick={() => selectObservation(observation.id)}
            >
              <span>0{index + 1}</span>
              <span>{observation.label}</span>
              <span>{observation.relationText}</span>
            </button>
          {/each}
        </div>
      </div>

      <div class="attention-record">
        <span class="record-label">attention trail</span>
        <p data-witness-trail>
          {#if trailLabels.length}
            {#each trailLabels as label, index}
              <span>{label}</span>{#if index < trailLabels.length - 1}<i
                  aria-hidden="true">→</i
                >{/if}
            {/each}
          {:else}
            <span>not yet observed</span>
          {/if}
        </p>
      </div>

      <p class="record-instruction">
        <span>arrow keys / traverse the field</span>
        <span>focus / one marker. context / three markers.</span>
      </p>
    </CompositionNode>

    {#if data.plan.issues.length}
      <pre class="witness-inspector" data-witness-inspector>{JSON.stringify(
          data.plan,
          null,
          2,
        )}</pre>
    {/if}
  </Composition>

  <footer class="witness-footer">
    <span>host / operational apparatus</span>
    <span>graft / celestial framing</span>
    <span>required content / field · aperture · trace · record</span>
  </footer>
  </main>
</ShowcaseShell>

<style>
  .witness-page {
    --witness-label-size: clamp(
      var(--text-2xs),
      calc(var(--text-2xs) + 0.35vw),
      var(--text-xs)
    );
    position: relative;
    min-height: 100svh;
    overflow-x: clip;
    background: var(--bg);
    color: var(--text);
  }

  .witness-back,
  .witness-topline,
  .witness-kicker,
  .field-coordinates,
  .witness-footer,
  .observation-list {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .record-heading,
  .view-switch,
  .record-label,
  .record-instruction,
  .reading-index {
    font-family: var(--font-mono);
    font-size: var(--witness-label-size);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .record-instruction {
    font-size: var(--text-2xs);
  }

  .witness-back {
    position: absolute;
    z-index: 12;
    top: var(--space-lg);
    left: var(--space-lg);
    color: var(--muted);
    text-decoration: none;
  }

  .witness-back:hover,
  .witness-back:focus-visible {
    color: var(--accent);
  }

  .witness-topline {
    position: absolute;
    z-index: 12;
    top: var(--space-lg);
    right: var(--space-lg);
    left: 38%;
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    color: var(--muted);
  }

  .witness-topline span:nth-child(2) {
    color: var(--accent);
  }

  .witness-title-block {
    position: absolute;
    z-index: 10;
    right: auto;
    bottom: clamp(6rem, 13vh, 10rem);
    left: clamp(1.25rem, 6vw, 6rem);
    width: min(25rem, 29vw);
    padding: var(--space-sm) var(--space-md) var(--space-md) 0;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bg) 96%, transparent),
      color-mix(in srgb, var(--bg) 82%, transparent) 78%,
      transparent
    );
    pointer-events: none;
  }

  .witness-kicker {
    color: var(--signal);
  }

  .witness-title-block h1 {
    max-width: 8.5ch;
    margin: var(--space-sm) 0;
    font-family: var(--font-body);
    font-size: clamp(3rem, 4.8vw, 5.4rem);
    font-weight: 400;
    letter-spacing: -0.08em;
    line-height: 0.82;
  }

  .witness-title-block p {
    max-width: 26rem;
    margin: 0;
    color: var(--muted);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.28;
  }

  :global(.witness-composition) {
    position: relative;
    min-height: 100svh;
    overflow: hidden;
    background:
      linear-gradient(
        90deg,
        transparent 0 72%,
        color-mix(in srgb, var(--accent) 5%, transparent) 72% 72.1%,
        transparent 72.1%
      ),
      linear-gradient(
        180deg,
        transparent 0 13%,
        color-mix(in srgb, var(--signal) 6%, transparent) 13% 13.1%,
        transparent 13.1%
      ),
      var(--bg);
  }

  :global(.witness-field-node) {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .witness-field {
    position: absolute;
    inset: clamp(5rem, 8vw, 8rem) 28% clamp(4rem, 7vw, 7rem) 3%;
    outline: none;
  }

  .witness-field:focus-visible {
    outline: 1px solid color-mix(in srgb, var(--accent) 68%, transparent);
    outline-offset: var(--space-xs);
  }

  .witness-landscape {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  .landscape-ridge,
  .landscape-thread,
  .horizon-line,
  .focus-connection,
  .frame-line,
  .peripheral-marks path,
  .aperture-drawing ellipse,
  .aperture-drawing path,
  .aperture-drawing circle {
    fill: none;
    vector-effect: non-scaling-stroke;
  }

  .landscape-ridge-back {
    stroke: color-mix(in srgb, var(--signal) 22%, transparent);
    stroke-width: 1.2;
  }

  .landscape-ridge-mid {
    stroke: color-mix(in srgb, var(--signal) 34%, transparent);
    stroke-width: 1.6;
  }

  .landscape-ridge-front {
    stroke: color-mix(in srgb, var(--accent) 27%, transparent);
    stroke-width: 2;
  }

  .landscape-thread {
    stroke: color-mix(in srgb, var(--text) 22%, transparent);
    stroke-width: 0.7;
    stroke-dasharray: 2 12;
  }

  .horizon-line {
    stroke: color-mix(in srgb, var(--text) 38%, transparent);
    stroke-width: 1;
    stroke-dasharray: 1 8;
  }

  .focus-connection {
    stroke: color-mix(in srgb, var(--accent) 82%, transparent);
    stroke-width: 2.6;
    stroke-dasharray: 1 7;
    stroke-linecap: round;
  }

  .focus-connection[data-witness-focus-connection="canopy"],
  .focus-connection[data-witness-focus-connection="ground"] {
    opacity: 0.42;
  }

  .focus-connection-point {
    fill: var(--bg);
    stroke: var(--accent);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }

  .frame-line {
    stroke: color-mix(in srgb, var(--signal) 28%, transparent);
    stroke-width: 1;
  }

  .frame-line-vertical {
    stroke: color-mix(in srgb, var(--accent) 42%, transparent);
    stroke-dasharray: 1 9;
  }

  .frame-line-horizontal {
    stroke: color-mix(in srgb, var(--signal) 18%, transparent);
    stroke-dasharray: 1 7;
  }

  .peripheral-marks path {
    stroke: color-mix(in srgb, var(--muted) 52%, transparent);
    stroke-width: 1;
  }

  .peripheral-marks {
    opacity: 0.42;
  }

  .aperture-drawing ellipse {
    stroke: color-mix(in srgb, var(--text) 48%, transparent);
    stroke-width: 1.2;
  }

  .aperture-drawing path:not(.aperture-slit) {
    stroke: color-mix(in srgb, var(--signal) 58%, transparent);
    stroke-width: 1;
  }

  .aperture-drawing .aperture-slit {
    fill: color-mix(in srgb, var(--accent) 36%, transparent);
    stroke: color-mix(in srgb, var(--accent) 72%, transparent);
    stroke-width: 1.4;
  }

  .aperture-drawing circle {
    fill: var(--bg);
    stroke: var(--accent);
    stroke-width: 2;
  }

  .aperture-shadow {
    position: absolute;
    top: 51%;
    left: 49%;
    width: 35%;
    height: 18%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: color-mix(in srgb, var(--bg) 82%, transparent);
    filter: blur(1.8rem);
    opacity: 0.82;
  }

  .witness-aperture {
    position: absolute;
    top: var(--witness-aperture-y);
    left: var(--witness-aperture-x);
    width: clamp(9rem, 23vw, 24rem);
    aspect-ratio: 2.3;
    transform: translate(-50%, -50%);
    border: 1px solid color-mix(in srgb, var(--text) 52%, transparent);
    border-radius: 50%;
    background:
      linear-gradient(
        90deg,
        transparent 48%,
        color-mix(in srgb, var(--accent) 50%, transparent) 49% 51%,
        transparent 52%
      ),
      radial-gradient(
        ellipse at 50% 48%,
        color-mix(in srgb, var(--accent) 18%, transparent),
        transparent 52%
      ),
      color-mix(in srgb, var(--bg) 42%, transparent);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--signal) 27%, transparent),
      0 0 2.5rem color-mix(in srgb, var(--signal) 12%, transparent);
    transition:
      top var(--transition-smooth),
      left var(--transition-smooth),
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);
    pointer-events: none;
  }

  .witness-aperture[data-witness-aperture-mode="context"] {
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    box-shadow:
      inset 0 0 0 1px color-mix(in srgb, var(--accent) 35%, transparent),
      0 0 3rem color-mix(in srgb, var(--accent) 16%, transparent);
  }

  .aperture-inner-line,
  .aperture-inner-point {
    position: absolute;
    display: block;
  }

  .aperture-inner-line {
    top: 50%;
    right: 12%;
    left: 12%;
    border-top: 1px solid color-mix(in srgb, var(--signal) 48%, transparent);
  }

  .aperture-inner-point {
    top: 50%;
    left: 50%;
    width: 0.46rem;
    height: 0.46rem;
    transform: translate(-50%, -50%);
    border: 1px solid var(--accent);
    background: var(--bg);
  }

  .witness-marker {
    position: absolute;
    top: var(--witness-y);
    left: var(--witness-x);
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.3rem 0.5rem;
    min-width: 7.2rem;
    padding: 0.4rem 0.55rem;
    transform: translate(-50%, -50%);
    border: 0;
    border-top: 1px solid color-mix(in srgb, var(--signal) 45%, transparent);
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-align: left;
    text-transform: uppercase;
    transition:
      color var(--transition-fast),
      border-color var(--transition-fast),
      opacity var(--transition-fast),
      transform var(--transition-fast);
    cursor: pointer;
  }

  .witness-marker::before {
    position: absolute;
    top: -0.22rem;
    left: -0.22rem;
    width: 0.35rem;
    height: 0.35rem;
    border: 1px solid currentColor;
    background: var(--bg);
    content: "";
  }

  .witness-marker[data-witness-marker-state="active"] {
    z-index: 3;
    border-color: var(--accent);
    color: var(--text);
    transform: translate(-50%, -50%) scale(1.04);
  }

  .witness-marker[data-witness-marker-state="visible"] {
    z-index: 3;
    border-color: color-mix(in srgb, var(--accent) 56%, transparent);
    color: var(--text);
  }

  .witness-marker[data-witness-marker-state="quiet"] {
    opacity: 0.42;
  }

  .witness-marker:hover,
  .witness-marker:focus-visible {
    opacity: 1;
    border-color: var(--accent);
    color: var(--text);
    outline: none;
  }

  .marker-index {
    color: var(--accent);
  }

  .marker-label {
    grid-column: 1 / -1;
  }

  .field-coordinates {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    margin: 0;
    color: color-mix(in srgb, var(--muted) 70%, transparent);
  }

  :global(.witness-trace-node) {
    position: absolute;
    top: 26%;
    right: 27%;
    bottom: 26%;
    left: 3%;
    z-index: 2;
    pointer-events: none;
  }

  .witness-trace {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .witness-trace::before {
    position: absolute;
    top: 48%;
    right: 4%;
    left: 18%;
    border-top: 1px solid color-mix(in srgb, var(--accent) 44%, transparent);
    transform: rotate(-8deg);
    transform-origin: left center;
    content: "";
  }

  .trace-origin,
  .trace-seam,
  .trace-end {
    position: absolute;
    display: block;
    width: 0.4rem;
    height: 0.4rem;
    border: 1px solid var(--accent);
    background: var(--bg);
  }

  .trace-origin {
    top: 53%;
    left: 18%;
  }

  .trace-seam {
    top: 44%;
    left: 53%;
    border-color: var(--signal);
  }

  .trace-end {
    top: 35%;
    right: 4%;
  }

  :global(.witness-record) {
    position: absolute;
    top: 3rem;
    right: 3%;
    bottom: 0;
    z-index: 8;
    display: flex;
    width: 24%;
    min-width: 17rem;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-md) 0 var(--space-md) var(--space-lg);
    border-left: 1px solid color-mix(in srgb, var(--signal) 30%, transparent);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bg) 45%, transparent),
      transparent
    );
  }

  .record-heading {
    display: flex;
    justify-content: space-between;
    gap: var(--space-sm);
    color: var(--muted);
  }

  .record-heading span:first-child {
    color: var(--text);
  }

  .record-heading span:last-child {
    color: var(--accent);
    text-align: right;
  }

  .view-switch {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xs);
    margin: 0;
    padding: 0;
    border: 0;
  }

  .view-switch legend {
    grid-column: 1 / -1;
    margin-bottom: var(--space-xs);
    color: var(--muted);
  }

  .view-switch button {
    padding: var(--space-md);
    border: 1px solid color-mix(in srgb, var(--signal) 26%, transparent);
    background: transparent;
    color: var(--muted);
    font: inherit;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
  }

  .view-switch button[aria-pressed="true"] {
    border-color: var(--accent);
    color: var(--text);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .view-switch button:hover,
  .view-switch button:focus-visible {
    border-color: var(--accent);
    color: var(--text);
    outline: none;
  }

  .record-reading {
    padding: var(--space-lg) 0;
    border-top: 1px solid color-mix(in srgb, var(--text) 36%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--text) 16%, transparent);
  }

  .reading-index {
    color: var(--signal);
  }

  .record-reading p {
    max-width: 23rem;
    margin: var(--space-sm) 0 0;
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: 1.28;
  }

  .record-label {
    color: var(--muted);
  }

  .observation-list {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-sm);
  }

  .observation-list button {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
    gap: var(--space-xs);
    padding: var(--space-md) 0;
    border: 0;
    border-left: 2px solid transparent;
    border-bottom: 1px solid color-mix(in srgb, var(--signal) 16%, transparent);
    background: transparent;
    color: var(--muted);
    font: inherit;
    text-align: left;
    text-transform: uppercase;
    cursor: pointer;
  }

  .observation-list button span:first-child {
    color: var(--accent);
  }

  .observation-list button span:last-child {
    color: color-mix(in srgb, var(--muted) 68%, transparent);
    text-align: right;
  }

  .observation-list button[aria-pressed="true"],
  .observation-list button:hover,
  .observation-list button:focus-visible {
    color: var(--text);
    outline: none;
  }

  .observation-list button[aria-pressed="true"] {
    padding-left: var(--space-xs);
    border-left-color: var(--accent);
  }

  .observation-list button[aria-pressed="true"] span:last-child {
    color: var(--accent);
  }

  .attention-record p {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin: var(--space-sm) 0 0;
    color: var(--text);
    line-height: 1.55;
  }

  .attention-record i {
    color: var(--accent);
    font-style: normal;
  }

  .record-instruction {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin: auto 0 0;
    color: var(--muted);
    line-height: 1.5;
  }

  .record-instruction span:last-child {
    color: var(--signal);
  }

  .witness-footer {
    position: absolute;
    z-index: 12;
    right: auto;
    bottom: var(--space-md);
    left: 3%;
    display: flex;
    max-width: min(47vw, 44rem);
    justify-content: space-between;
    gap: var(--space-md);
    color: color-mix(in srgb, var(--muted) 82%, transparent);
  }

  .witness-inspector {
    display: none;
  }

  @media (max-width: 900px) {
    .witness-title-block {
      width: 43vw;
    }

    .witness-title-block h1 {
      font-size: clamp(3rem, 8vw, 5rem);
    }

    :global(.witness-record) {
      width: 28%;
      min-width: 15rem;
      padding-left: var(--space-md);
    }

    .witness-topline {
      left: 28%;
    }

    .witness-footer span:last-child {
      display: none;
    }
  }

  @media (max-width: 680px) {
    .witness-page {
      min-height: auto;
      padding-bottom: var(--space-lg);
    }

    .witness-back {
      top: var(--space-md);
      left: var(--space-md);
    }

    .witness-topline {
      top: 3.8rem;
      right: var(--space-md);
      left: var(--space-md);
      font-size: 0.58rem;
    }

    .witness-topline span:nth-child(2) {
      display: none;
    }

    .witness-title-block {
      position: relative;
      bottom: auto;
      left: auto;
      width: auto;
      padding: 7rem var(--space-md) var(--space-lg);
    }

    .witness-title-block h1 {
      max-width: 8ch;
      font-size: clamp(3rem, 16vw, 5.2rem);
    }

    :global(.witness-composition) {
      min-height: auto;
      overflow: visible;
      background: var(--bg);
    }

    :global(.witness-field-node) {
      position: relative;
      inset: auto;
      min-height: 58svh;
    }

    .witness-field {
      inset: var(--space-md) var(--space-md) var(--space-lg);
    }

    .witness-aperture {
      width: clamp(8rem, 48vw, 14rem);
    }

    .witness-marker {
      min-width: 5.5rem;
      padding: 0.3rem 0.4rem;
      background: color-mix(in srgb, var(--bg) 64%, var(--surface));
      color: var(--text);
      font-size: 0.64rem;
    }

    .witness-marker[data-witness-marker-state="quiet"] {
      color: var(--muted);
      opacity: 0.62;
    }

    .landscape-ridge-back {
      stroke: color-mix(in srgb, var(--signal) 42%, transparent);
    }

    .landscape-ridge-mid {
      stroke: color-mix(in srgb, var(--signal) 54%, transparent);
    }

    .landscape-ridge-front {
      stroke: color-mix(in srgb, var(--accent) 48%, transparent);
    }

    .landscape-thread {
      stroke: color-mix(in srgb, var(--text) 34%, transparent);
    }

    .horizon-line {
      stroke: color-mix(in srgb, var(--text) 54%, transparent);
    }

    .focus-connection {
      stroke: color-mix(in srgb, var(--accent) 92%, transparent);
    }

    .observation-list button span:last-child {
      color: var(--muted);
    }

    .observation-list {
      font-size: var(--witness-label-size);
    }

    .record-instruction {
      font-size: var(--witness-label-size);
    }

    .field-coordinates {
      display: block;
      line-height: 1.55;
    }

    .field-coordinates span {
      display: block;
    }

    :global(.witness-trace-node) {
      display: none;
    }

    :global(.witness-record) {
      position: relative;
      inset: auto;
      width: auto;
      min-width: 0;
      margin: 0 var(--space-md);
      gap: var(--space-lg);
      padding: var(--space-md) 0 0;
      border-top: 1px solid color-mix(in srgb, var(--signal) 30%, transparent);
      border-left: 0;
      background: none;
    }

    .witness-footer {
      position: relative;
      right: auto;
      bottom: auto;
      left: auto;
      flex-direction: column;
      gap: var(--space-xs);
      margin: var(--space-xl) var(--space-md) 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .witness-aperture,
    .witness-marker {
      transition: none;
    }
  }
</style>

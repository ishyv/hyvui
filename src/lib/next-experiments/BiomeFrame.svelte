<script lang="ts">
  import type {
    BiomeProof,
    SharedBiomeContent,
  } from "$lib/next-experiments/biomeGallery.js";

  type Props = {
    proof: BiomeProof;
    content: SharedBiomeContent;
    index: number;
    focused?: boolean;
    nextHref: string;
  };

  let { proof, content, index, focused = false, nextHref }: Props = $props();

  const titleId = $derived(`${proof.id}-title`);
  const bodyId = $derived(`${proof.id}-body`);
  const serial = $derived(String(index + 1).padStart(2, "0"));
</script>

<article
  class={`biome-frame biome-${proof.id}`}
  id={proof.id}
  data-biome-frame
  data-biome={proof.id}
  data-host={proof.host}
  data-spatial-law={proof.spatialLaw}
  data-density={proof.density}
  data-time-model={proof.timeModel}
  data-viewer-role={proof.viewerRole}
  data-frame-mode={proof.frameMode}
  data-palette={proof.palette}
  data-focused={focused ? "true" : undefined}
  aria-labelledby={titleId}
  aria-describedby={bodyId}
>
  {#if proof.id === "ceremonial-reliquary"}
    <header class="reliquary-intro" data-role="altar">
      <span class="eyebrow">{content.eyebrow}</span>
      <span class="frame-serial">{serial} / {proof.stageLabel}</span>
      <h1 id={titleId} data-content="title">{content.title}</h1>
    </header>

    <figure class="reliquary-shrine" data-role="relic">
      <div class="reliquary-aureole" aria-hidden="true"></div>
      <div class="reliquary-orbit orbit-one" aria-hidden="true"></div>
      <div class="reliquary-orbit orbit-two" aria-hidden="true"></div>
      <div class="reliquary-cage cage-one" aria-hidden="true"></div>
      <div class="reliquary-cage cage-two" aria-hidden="true"></div>
      <div class="reliquary-mount" aria-hidden="true"></div>
      <div class="reliquary-gem" aria-hidden="true">
        <i class="gem-face face-one"></i>
        <i class="gem-face face-two"></i>
        <i class="gem-face face-three"></i>
        <span>✦</span>
      </div>
      <figcaption>{proof.signal}</figcaption>
    </figure>

    <aside class="reliquary-litany" data-role="litany">
      <p id={bodyId} data-content="body">{content.body}</p>
      <dl>
        <div>
          <dt>{content.datum}</dt>
          <dd>held</dd>
        </div>
        <div>
          <dt>{content.status}</dt>
          <dd>near</dd>
        </div>
      </dl>
    </aside>

    <footer class="reliquary-ritual" data-role="ritual">
      <a href={nextHref} data-frame-action="approach">
        <span>↘</span>
        {content.action}
      </a>
    </footer>
  {:else if proof.id === "ecological-elegy"}
    <header class="elegy-intro" data-role="shore">
      <span class="eyebrow">{content.eyebrow}</span>
      <span class="frame-serial">{serial} / {proof.stageLabel}</span>
      <h1 id={titleId} data-content="title">{content.title}</h1>
    </header>

    <figure class="elegy-waterline" data-role="waterline">
      <div class="elegy-moon" aria-hidden="true"></div>
      <div class="elegy-reeds" aria-hidden="true">
        <i></i><i></i><i></i><i></i><i></i><i></i>
      </div>
      <div class="elegy-body-shape" aria-hidden="true"></div>
      <figcaption>{proof.signal}</figcaption>
    </figure>

    <aside class="elegy-witness" data-role="witness">
      <p id={bodyId} data-content="body">{content.body}</p>
      <span class="elegy-caption">habitat / no legend</span>
    </aside>

    <footer class="elegy-tide" data-role="tide">
      <span>{content.datum}</span>
      <a href={nextHref} data-frame-action="drift"
        >{content.action} <span>↗</span></a
      >
    </footer>
  {:else if proof.id === "oneiric-object-poetry"}
    <header class="object-inscription" data-role="inscription">
      <span class="eyebrow">{content.eyebrow}</span>
      <span class="frame-serial">{serial} / {proof.stageLabel}</span>
      <h1 id={titleId} data-content="title">{content.title}</h1>
    </header>

    <figure class="object-vessel" data-role="object">
      <div class="object-shadow" aria-hidden="true"></div>
      <div class="object-bag" aria-hidden="true">
        <div class="object-water"></div>
        <div class="object-moon"></div>
        <div class="object-specks"><i></i><i></i><i></i><i></i><i></i></div>
      </div>
      <figcaption>{proof.signal}</figcaption>
    </figure>

    <aside class="object-caption" data-role="caption">
      <p id={bodyId} data-content="body">{content.body}</p>
      <span class="object-note">gravity / household scale / small sky</span>
    </aside>

    <footer class="object-gesture" data-role="gesture">
      <a href={nextHref} data-frame-action="tilt">
        <span class="gesture-mark">○</span>
        {content.action}
      </a>
    </footer>
  {:else if proof.id === "machine-ecology"}
    <header class="machine-locator" data-role="locator">
      <span class="eyebrow">{content.eyebrow}</span>
      <span class="frame-serial">{serial} / {proof.stageLabel}</span>
      <h1 id={titleId} data-content="title">{content.title}</h1>
    </header>

    <div class="machine-habitat" data-role="habitat" aria-hidden="true">
      <span class="machine-trunk trunk-one"></span>
      <span class="machine-trunk trunk-two"></span>
      <span class="machine-trunk trunk-three"></span>
      <span class="machine-cross cross-one"></span>
      <span class="machine-cross cross-two"></span>
      <span class="machine-cross cross-three"></span>
      <span class="machine-node node-one"></span>
      <span class="machine-node node-two"></span>
      <span class="machine-node node-three"></span>
      <span class="machine-node node-four"></span>
      <span class="machine-label label-one">relay / 04</span>
      <span class="machine-label label-two">pressure / low</span>
      <span class="machine-label label-three">route / open</span>
    </div>

    <aside class="machine-maintenance" data-role="maintenance">
      <p id={bodyId} data-content="body">{content.body}</p>
      <span>{content.status}</span>
    </aside>

    <nav class="machine-route" data-role="route" aria-label="habitat route">
      <span>local mechanism / legible</span>
      <a href={nextHref} data-frame-action="traverse"
        >{content.action} <b>→</b></a
      >
    </nav>
  {:else if proof.id === "manifesto-print"}
    <header class="manifesto-voice" data-role="voice">
      <span class="eyebrow">{content.eyebrow}</span>
      <span class="frame-serial">{serial} / {proof.stageLabel}</span>
      <span class="manifesto-kicker">statement / margin / mark</span>
    </header>

    <section
      class="manifesto-sentence"
      data-role="sentence"
      aria-labelledby={titleId}
    >
      <span class="manifesto-rule" aria-hidden="true"></span>
      <h1 id={titleId} data-content="title">{content.title}</h1>
      <span class="manifesto-stamp" aria-hidden="true"
        >read / mark / repeat</span
      >
    </section>

    <aside class="manifesto-margin" data-role="marginalia">
      <p id={bodyId} data-content="body">{content.body}</p>
      <span>field copy / {content.datum}</span>
    </aside>

    <footer class="manifesto-interrupt" data-role="interrupt">
      <a href={nextHref} data-frame-action="repeat">
        <span>↳</span>
        {content.action}
      </a>
    </footer>
  {:else}
    <header class="kinetic-origin" data-role="origin">
      <span class="eyebrow">{content.eyebrow}</span>
      <span class="frame-serial">{serial} / {proof.stageLabel}</span>
      <h1 id={titleId} data-content="title">{content.title}</h1>
    </header>

    <div
      class="kinetic-trajectory"
      data-role="trajectory"
      data-motion
      aria-hidden="true"
    >
      <span class="kinetic-core"></span>
      <span class="kinetic-streak streak-one"></span>
      <span class="kinetic-streak streak-two"></span>
      <span class="kinetic-streak streak-three"></span>
      <span class="kinetic-fragment fragment-one"></span>
      <span class="kinetic-fragment fragment-two"></span>
      <span class="kinetic-fragment fragment-three"></span>
      <span class="kinetic-fragment fragment-four"></span>
      <span class="kinetic-arrow">↗</span>
    </div>

    <aside class="kinetic-residue" data-role="residue">
      <p id={bodyId} data-content="body">{content.body}</p>
      <span>{proof.signal}</span>
    </aside>

    <footer class="kinetic-release" data-role="release">
      <span>{content.datum}</span>
      <a href={nextHref} data-frame-action="release"
        >{content.action} <b>↗</b></a
      >
    </footer>
  {/if}
</article>

<style>
  .biome-frame {
    --frame-pad: clamp(var(--space-lg), 5vw, var(--space-3xl));
    position: relative;
    display: block;
    min-height: 100svh;
    overflow: clip;
    isolation: isolate;
    padding: var(--frame-pad);
    scroll-snap-align: start;
    scroll-snap-stop: normal;
    color: var(--text);
    background: var(--bg);
  }

  .biome-frame::selection {
    background: var(--accent);
    color: var(--bg);
  }

  .eyebrow,
  .frame-serial,
  .frame-serial + *,
  .biome-frame a,
  .biome-frame dt,
  .biome-frame dd,
  .biome-frame figcaption,
  .biome-frame aside span,
  .machine-label,
  .manifesto-stamp {
    font-family: var(--font-mono);
  }

  .eyebrow,
  .frame-serial {
    display: block;
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-meta);
    text-transform: uppercase;
  }

  .frame-serial {
    color: var(--muted);
  }

  .biome-frame h1,
  .biome-frame p,
  .biome-frame figure,
  .biome-frame dl {
    margin: 0;
  }

  .biome-frame h1 {
    font-family: var(--font-body);
    font-size: clamp(2.5rem, 5.4vw, 6.5rem);
    font-weight: 400;
    letter-spacing: -0.055em;
    line-height: 0.92;
  }

  .biome-frame p {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: var(--leading-body);
  }

  .biome-frame a {
    color: inherit;
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  .biome-frame a:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: var(--space-xs);
  }

  /* ceremonial reliquary */
  .biome-ceremonial-reliquary {
    --relic-ink: color-mix(in srgb, var(--bg) 94%, var(--accent));
    --relic-gold: color-mix(in srgb, var(--accent) 72%, var(--text));
    background:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--accent) 12%, transparent),
        transparent 30%
      ),
      radial-gradient(
        circle at 22% 17%,
        color-mix(in srgb, var(--signal) 8%, transparent),
        transparent 22%
      ),
      var(--bg);
  }

  .biome-ceremonial-reliquary::before {
    position: absolute;
    inset: 6%;
    z-index: -1;
    border: 1px solid color-mix(in srgb, var(--relic-gold) 38%, transparent);
    content: "";
    pointer-events: none;
  }

  .reliquary-intro {
    position: absolute;
    top: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    display: grid;
    width: min(30rem, 36vw);
    gap: var(--space-sm);
  }

  .reliquary-intro .eyebrow {
    color: var(--relic-gold);
  }

  .reliquary-intro h1 {
    max-width: 8ch;
    color: var(--text);
    font-size: clamp(3.4rem, 7.5vw, 9rem);
    line-height: 0.82;
  }

  .reliquary-shrine {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(48vw, 45rem);
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
  }

  .reliquary-aureole,
  .reliquary-orbit,
  .reliquary-gem {
    position: absolute;
    inset: 50% auto auto 50%;
    transform: translate(-50%, -50%);
  }

  .reliquary-aureole {
    width: 74%;
    height: 74%;
    border: 1px solid color-mix(in srgb, var(--relic-gold) 70%, transparent);
    border-radius: 50%;
    box-shadow:
      0 0 0 1.8rem color-mix(in srgb, var(--relic-gold) 4%, transparent),
      0 0 4rem color-mix(in srgb, var(--relic-gold) 16%, transparent);
  }

  .reliquary-orbit {
    width: 73%;
    height: 73%;
    border: 1px solid color-mix(in srgb, var(--signal) 28%, transparent);
    border-left-color: color-mix(in srgb, var(--signal) 13%, transparent);
    border-bottom-color: color-mix(in srgb, var(--signal) 39%, transparent);
    border-radius: 0;
    clip-path: polygon(50% 0, 100% 19%, 87% 84%, 50% 100%, 13% 84%, 0 19%);
  }

  .orbit-one {
    transform: translate(-50%, -50%) rotate(29deg) scaleX(1.08);
  }

  .orbit-two {
    width: 66%;
    height: 84%;
    border-top-color: color-mix(in srgb, var(--relic-gold) 30%, transparent);
    transform: translate(-50%, -50%) rotate(-24deg) scaleX(0.92);
  }

  .reliquary-cage {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 3;
    border: 2px solid color-mix(in srgb, var(--relic-gold) 72%, transparent);
    pointer-events: none;
    transform: translate(-50%, -50%);
  }

  .cage-one {
    width: 46%;
    height: 46%;
    border-right-color: transparent;
    border-bottom-color: transparent;
    transform: translate(-50%, -50%) rotate(45deg);
  }

  .cage-two {
    width: 56%;
    height: 29%;
    border-color: color-mix(in srgb, var(--signal) 58%, transparent);
    border-left-color: transparent;
    transform: translate(-50%, -50%) rotate(-24deg);
  }

  .reliquary-mount {
    position: absolute;
    top: 64%;
    left: 50%;
    z-index: 1;
    width: 34%;
    height: 24%;
    border: 1px solid color-mix(in srgb, var(--relic-gold) 74%, transparent);
    background: color-mix(in srgb, var(--relic-gold) 10%, var(--relic-ink));
    clip-path: polygon(15% 0, 85% 0, 100% 100%, 0 100%);
    pointer-events: none;
    transform: translateX(-50%);
  }

  .reliquary-mount::before {
    position: absolute;
    top: 11%;
    right: 12%;
    left: 12%;
    height: 2px;
    background: color-mix(in srgb, var(--relic-gold) 82%, transparent);
    content: "";
  }

  .reliquary-mount::after {
    position: absolute;
    top: 12%;
    right: 27%;
    bottom: 0;
    left: 27%;
    border-right: 1px solid color-mix(in srgb, var(--signal) 48%, transparent);
    border-left: 1px solid color-mix(in srgb, var(--signal) 48%, transparent);
    content: "";
  }

  .reliquary-gem {
    display: grid;
    width: 37%;
    aspect-ratio: 1;
    place-items: center;
    z-index: 2;
    border: 1px solid var(--relic-gold);
    background: linear-gradient(
      142deg,
      color-mix(in srgb, var(--relic-gold) 34%, var(--relic-ink)) 0 24%,
      color-mix(in srgb, var(--relic-gold) 15%, var(--relic-ink)) 25% 57%,
      color-mix(in srgb, var(--signal) 16%, var(--relic-ink)) 58% 100%
    );
    box-shadow:
      0 0 0 0.8rem color-mix(in srgb, var(--relic-gold) 8%, transparent),
      0 0 3rem color-mix(in srgb, var(--relic-gold) 24%, transparent),
      inset 0 0 1.5rem color-mix(in srgb, var(--signal) 13%, transparent);
    clip-path: polygon(50% 0, 100% 28%, 82% 86%, 50% 100%, 18% 86%, 0 28%);
    color: var(--relic-gold);
    font-size: var(--text-2xl);
  }

  .gem-face {
    position: absolute;
    inset: 0;
    display: block;
    pointer-events: none;
  }

  .face-one {
    background: color-mix(in srgb, var(--relic-gold) 33%, var(--relic-ink));
    clip-path: polygon(0 28%, 50% 0, 50% 100%, 18% 86%);
  }

  .face-two {
    background: color-mix(in srgb, var(--signal) 22%, var(--relic-ink));
    clip-path: polygon(50% 0, 100% 28%, 82% 86%, 50% 100%);
  }

  .face-three {
    background: color-mix(in srgb, var(--bg) 42%, var(--relic-ink));
    clip-path: polygon(18% 86%, 50% 100%, 82% 86%, 50% 65%);
  }

  .reliquary-gem::before {
    position: absolute;
    inset: 8%;
    border: 1px solid color-mix(in srgb, var(--relic-gold) 28%, transparent);
    content: "";
    clip-path: polygon(50% 0, 100% 28%, 82% 86%, 50% 100%, 18% 86%, 0 28%);
  }

  .reliquary-gem::after {
    position: absolute;
    inset: 21% 25% 32% 23%;
    border-top: 1px solid color-mix(in srgb, var(--text) 45%, transparent);
    border-left: 1px solid color-mix(in srgb, var(--text) 22%, transparent);
    content: "";
    transform: rotate(14deg);
  }

  .reliquary-shrine figcaption {
    position: absolute;
    right: 5%;
    bottom: 7%;
    color: var(--relic-gold);
  }

  .reliquary-litany {
    position: absolute;
    right: max(var(--frame-pad), 6%);
    bottom: max(var(--frame-pad), 6%);
    z-index: 3;
    width: min(18rem, 24vw);
    padding-top: var(--space-md);
    border-top: 1px solid color-mix(in srgb, var(--relic-gold) 42%, transparent);
  }

  .reliquary-litany p {
    color: var(--text-soft);
  }

  .reliquary-litany dl {
    display: grid;
    gap: var(--space-xs);
    margin-top: var(--space-lg);
  }

  .reliquary-litany dl div {
    display: flex;
    justify-content: space-between;
    gap: var(--space-sm);
    padding-right: var(--space-sm);
    border-bottom: 1px solid
      color-mix(in srgb, var(--relic-gold) 15%, transparent);
    padding-bottom: var(--space-xs);
  }

  .reliquary-litany dt,
  .reliquary-litany dd {
    font-size: var(--text-2xs);
    font-weight: 400;
  }

  .reliquary-litany dd {
    color: var(--relic-gold);
  }

  .reliquary-ritual {
    position: absolute;
    right: max(var(--frame-pad), 6%);
    top: max(var(--frame-pad), 6%);
    z-index: 3;
  }

  .reliquary-ritual a {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--relic-gold);
  }

  /* ecological elegy */
  .biome-ecological-elegy {
    --elegy-deep: color-mix(in srgb, var(--bg) 94%, var(--signal));
    --elegy-water: color-mix(in srgb, var(--signal) 56%, var(--bg));
    background:
      linear-gradient(
        102deg,
        var(--bg) 0 34%,
        color-mix(in srgb, var(--elegy-deep) 80%, var(--bg)) 58%,
        var(--bg) 100%
      ),
      var(--bg);
  }

  .biome-ecological-elegy::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: radial-gradient(
      ellipse at 72% 55%,
      color-mix(in srgb, var(--signal) 13%, transparent),
      transparent 32%
    );
    content: "";
    pointer-events: none;
  }

  .elegy-intro {
    position: absolute;
    top: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    display: grid;
    width: min(26rem, 34vw);
    gap: var(--space-sm);
  }

  .elegy-intro h1 {
    max-width: 9ch;
    color: color-mix(in srgb, var(--text) 84%, var(--signal));
    font-size: clamp(3.2rem, 6.8vw, 8rem);
    line-height: 0.8;
  }

  .elegy-intro .eyebrow,
  .elegy-waterline figcaption {
    color: var(--signal);
  }

  .elegy-waterline {
    position: absolute;
    right: 4%;
    bottom: 7%;
    width: 72%;
    height: 58%;
    overflow: hidden;
    border-bottom: 1px solid color-mix(in srgb, var(--signal) 42%, transparent);
    border-radius: 50%;
    background:
      radial-gradient(
        ellipse at 57% 41%,
        color-mix(in srgb, var(--signal) 18%, transparent),
        transparent 26%
      ),
      linear-gradient(
        170deg,
        transparent 45%,
        color-mix(in srgb, var(--signal) 11%, transparent) 46% 48%,
        transparent 49%
      );
    transform: rotate(-4deg);
  }

  .elegy-waterline::after {
    position: absolute;
    inset: 48% -4% auto;
    height: 1px;
    background: color-mix(in srgb, var(--signal) 26%, transparent);
    box-shadow:
      0 1.4rem 0 color-mix(in srgb, var(--signal) 12%, transparent),
      0 3.2rem 0 color-mix(in srgb, var(--signal) 8%, transparent);
    content: "";
  }

  .elegy-moon {
    position: absolute;
    top: 7%;
    right: 16%;
    width: 9%;
    aspect-ratio: 1;
    border: 1px solid color-mix(in srgb, var(--text) 64%, var(--signal));
    border-radius: 50%;
    box-shadow: 0 0 3rem color-mix(in srgb, var(--text) 10%, transparent);
  }

  .elegy-body-shape {
    position: absolute;
    top: 45%;
    left: 15%;
    width: 66%;
    height: 18%;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--bg) 35%, var(--signal)),
      transparent 80%
    );
    filter: blur(0.8px);
    transform: rotate(-4deg);
  }

  .elegy-reeds {
    position: absolute;
    right: 8%;
    bottom: 0;
    display: flex;
    width: 22%;
    height: 56%;
    align-items: end;
    justify-content: space-around;
  }

  .elegy-reeds i {
    display: block;
    width: 1px;
    height: 100%;
    background: color-mix(in srgb, var(--signal) 38%, transparent);
    transform-origin: bottom;
  }

  .elegy-reeds i:nth-child(2) {
    height: 74%;
    transform: rotate(9deg);
  }
  .elegy-reeds i:nth-child(3) {
    height: 87%;
    transform: rotate(-5deg);
  }
  .elegy-reeds i:nth-child(4) {
    height: 63%;
    transform: rotate(13deg);
  }
  .elegy-reeds i:nth-child(5) {
    height: 92%;
    transform: rotate(-11deg);
  }
  .elegy-reeds i:nth-child(6) {
    height: 69%;
    transform: rotate(5deg);
  }

  .elegy-waterline figcaption {
    position: absolute;
    right: 8%;
    bottom: 6%;
  }

  .elegy-witness {
    position: absolute;
    bottom: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    width: min(19rem, 26vw);
    color: var(--text-soft);
  }

  .elegy-caption {
    display: block;
    margin-top: var(--space-md);
    color: var(--muted);
    font-size: var(--text-2xs);
    line-height: 1.5;
  }

  .elegy-tide {
    position: absolute;
    top: var(--frame-pad);
    right: var(--frame-pad);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    color: var(--muted);
  }

  .elegy-tide a {
    color: var(--signal);
  }

  /* oneiric object-poetry */
  .biome-oneiric-object-poetry {
    --object-paper: color-mix(in srgb, var(--text) 96%, var(--bg));
    --object-night: color-mix(in srgb, var(--bg) 90%, var(--signal));
    color: var(--bg);
    background: var(--object-paper);
  }

  .biome-oneiric-object-poetry::before {
    position: absolute;
    top: 14%;
    right: 14%;
    bottom: 12%;
    left: 14%;
    z-index: -1;
    border: 1px solid color-mix(in srgb, var(--bg) 15%, transparent);
    content: "";
    pointer-events: none;
  }

  .object-inscription {
    position: absolute;
    top: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    display: grid;
    width: min(22rem, 28vw);
    gap: var(--space-sm);
  }

  .object-inscription .eyebrow,
  .object-inscription .frame-serial {
    color: color-mix(in srgb, var(--bg) 57%, var(--signal));
  }

  .object-inscription h1 {
    max-width: 8ch;
    font-size: clamp(3rem, 6vw, 7rem);
    line-height: 0.82;
  }

  .object-vessel {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(27vw, 24rem);
    aspect-ratio: 0.74;
    transform: translate(-50%, -50%) rotate(4deg);
  }

  .object-shadow {
    position: absolute;
    right: -16%;
    bottom: 3%;
    left: -16%;
    height: 7%;
    border-radius: 50%;
    background: color-mix(in srgb, var(--bg) 16%, transparent);
    filter: blur(8px);
  }

  .object-bag {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--bg) 45%, transparent);
    border-radius: 47% 53% 48% 52% / 14% 16% 84% 86%;
    background: color-mix(in srgb, var(--signal) 6%, transparent);
    box-shadow:
      inset 1.5rem 0 3rem color-mix(in srgb, var(--text) 60%, transparent),
      inset -1rem -2rem 3rem color-mix(in srgb, var(--signal) 15%, transparent);
    transform: rotate(-2deg);
  }

  .object-bag::before {
    position: absolute;
    top: -3%;
    left: 13%;
    width: 72%;
    height: 11%;
    border: 1px solid color-mix(in srgb, var(--bg) 50%, transparent);
    border-radius: 50%;
    content: "";
  }

  .object-water {
    position: absolute;
    right: -15%;
    bottom: -9%;
    left: -15%;
    height: 57%;
    border-top: 1px solid color-mix(in srgb, var(--signal) 42%, var(--bg));
    border-radius: 50% 50% 0 0;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--signal) 20%, transparent),
      color-mix(in srgb, var(--object-night) 88%, transparent)
    );
    transform: rotate(-4deg);
  }

  .object-moon {
    position: absolute;
    bottom: 9%;
    left: 42%;
    width: 19%;
    aspect-ratio: 1;
    border: 1px solid var(--accent);
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent) 66%, var(--text));
    box-shadow:
      0 0 0 0.25rem color-mix(in srgb, var(--bg) 34%, transparent),
      0 0 1.5rem color-mix(in srgb, var(--accent) 35%, transparent);
  }

  .object-specks i {
    position: absolute;
    display: block;
    width: 2px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--signal);
  }

  .object-specks i:nth-child(1) {
    top: 44%;
    left: 26%;
  }
  .object-specks i:nth-child(2) {
    top: 61%;
    left: 67%;
  }
  .object-specks i:nth-child(3) {
    top: 72%;
    left: 33%;
  }
  .object-specks i:nth-child(4) {
    top: 52%;
    left: 79%;
  }
  .object-specks i:nth-child(5) {
    top: 78%;
    left: 59%;
  }

  .object-vessel figcaption {
    position: absolute;
    right: -42%;
    bottom: 7%;
    color: color-mix(in srgb, var(--bg) 52%, var(--signal));
  }

  .object-caption {
    position: absolute;
    right: var(--frame-pad);
    bottom: var(--frame-pad);
    z-index: 3;
    width: min(18rem, 25vw);
  }

  .object-note {
    display: block;
    margin-top: var(--space-md);
    color: color-mix(in srgb, var(--bg) 54%, var(--signal));
    font-size: var(--text-2xs);
    line-height: 1.5;
  }

  .object-gesture {
    position: absolute;
    top: var(--frame-pad);
    right: var(--frame-pad);
  }

  .object-gesture a {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: color-mix(in srgb, var(--bg) 65%, var(--signal));
  }

  .gesture-mark {
    display: inline-grid;
    width: 1.2rem;
    aspect-ratio: 1;
    place-items: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-size: 0.7rem;
  }

  /* machine ecology */
  .biome-machine-ecology {
    --machine-line: color-mix(in srgb, var(--signal) 44%, transparent);
    --machine-hot: color-mix(in srgb, var(--accent) 72%, var(--text));
    background:
      linear-gradient(
        90deg,
        transparent 0 8%,
        color-mix(in srgb, var(--signal) 4%, transparent) 8.1% 8.3%,
        transparent 8.4% 91.6%,
        color-mix(in srgb, var(--signal) 4%, transparent) 91.7% 91.9%,
        transparent 92%
      ),
      var(--bg);
  }

  .machine-locator {
    position: absolute;
    top: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    width: min(27rem, 32vw);
  }

  .machine-locator .eyebrow {
    color: var(--signal);
  }

  .machine-locator h1 {
    max-width: 9ch;
    margin-top: var(--space-lg);
    font-family: var(--font-mono);
    font-size: clamp(2.6rem, 5.5vw, 6.2rem);
    letter-spacing: -0.09em;
    line-height: 0.86;
    text-transform: lowercase;
  }

  .machine-habitat {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .machine-habitat::before,
  .machine-habitat::after {
    position: absolute;
    background: color-mix(in srgb, var(--signal) 11%, transparent);
    content: "";
  }

  .machine-habitat::before {
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
  }

  .machine-habitat::after {
    top: 50%;
    right: 0;
    left: 0;
    height: 1px;
  }

  .machine-trunk,
  .machine-cross {
    position: absolute;
    display: block;
    border: 1px solid var(--machine-line);
    border-radius: 999px;
  }

  .machine-trunk {
    width: 7%;
    height: 90%;
  }
  .trunk-one {
    top: 3%;
    left: 48%;
    transform: rotate(22deg);
  }
  .trunk-two {
    top: -9%;
    left: 70%;
    height: 118%;
    transform: rotate(-29deg);
  }
  .trunk-three {
    top: 6%;
    left: 27%;
    height: 92%;
    transform: rotate(65deg);
  }

  .machine-cross {
    width: 58%;
    height: 15%;
  }
  .cross-one {
    top: 27%;
    left: 24%;
    transform: rotate(12deg);
  }
  .cross-two {
    top: 56%;
    left: 29%;
    transform: rotate(-25deg);
  }
  .cross-three {
    top: 69%;
    left: 4%;
    width: 48%;
    transform: rotate(41deg);
  }

  .cross-two {
    border-color: color-mix(in srgb, var(--signal) 66%, transparent);
    border-right-color: transparent;
  }

  .machine-node {
    position: absolute;
    display: block;
    width: 0.6rem;
    aspect-ratio: 1;
    border: 1px solid var(--machine-hot);
    border-radius: 50%;
    background: var(--bg);
    box-shadow: 0 0 1rem color-mix(in srgb, var(--machine-hot) 23%, transparent);
  }

  .node-one {
    top: 28%;
    left: 50%;
  }
  .node-two {
    top: 56%;
    left: 72%;
  }
  .node-three {
    top: 72%;
    left: 29%;
  }
  .node-four {
    top: 41%;
    left: 25%;
  }

  .machine-label {
    position: absolute;
    color: var(--muted);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
  }

  .label-one {
    top: 29%;
    left: 52%;
  }
  .label-two {
    top: 57%;
    left: 74%;
  }
  .label-three {
    top: 74%;
    left: 31%;
  }

  .machine-maintenance {
    position: absolute;
    right: var(--frame-pad);
    bottom: var(--frame-pad);
    z-index: 3;
    width: min(20rem, 28vw);
    padding-top: var(--space-md);
    border-top: 1px solid var(--machine-line);
  }

  .machine-maintenance p {
    color: var(--text-soft);
  }

  .machine-maintenance > span {
    display: block;
    margin-top: var(--space-md);
    color: var(--machine-hot);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .machine-route {
    position: absolute;
    top: var(--frame-pad);
    right: var(--frame-pad);
    z-index: 3;
    display: grid;
    gap: var(--space-md);
    color: var(--muted);
    text-align: right;
  }

  .machine-route a {
    color: var(--signal);
  }

  .machine-route b {
    color: var(--machine-hot);
    font-size: var(--text-sm);
    font-weight: 400;
  }

  /* manifesto print */
  .biome-manifesto-print {
    --print-paper: color-mix(in srgb, var(--text) 96%, var(--bg));
    --print-ink: color-mix(in srgb, var(--bg) 93%, var(--accent));
    --print-mark: color-mix(in srgb, var(--accent) 72%, var(--bg));
    color: var(--print-ink);
    background: var(--print-paper);
  }

  .biome-manifesto-print::before {
    position: absolute;
    inset: 8% 5%;
    z-index: -1;
    border-top: 1px solid color-mix(in srgb, var(--print-ink) 17%, transparent);
    border-bottom: 1px solid
      color-mix(in srgb, var(--print-ink) 17%, transparent);
    content: "";
    pointer-events: none;
  }

  .manifesto-voice {
    position: absolute;
    top: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    display: grid;
    gap: var(--space-xs);
  }

  .manifesto-voice .eyebrow {
    color: var(--print-mark);
  }

  .manifesto-kicker {
    margin-top: var(--space-md);
    font-family: var(--font-body);
    font-size: var(--text-lg);
    font-style: italic;
  }

  .manifesto-sentence {
    position: absolute;
    top: 48%;
    right: 7%;
    left: 8%;
    transform: translateY(-50%);
  }

  .manifesto-sentence h1 {
    max-width: 11ch;
    font-size: clamp(4rem, 10vw, 12rem);
    letter-spacing: -0.075em;
    line-height: 0.76;
    text-wrap: balance;
  }

  .manifesto-rule {
    display: block;
    width: min(24rem, 32vw);
    height: 0.7rem;
    margin-bottom: var(--space-xl);
    background: var(--print-mark);
    transform: translateX(18%) rotate(-3deg);
  }

  .manifesto-stamp {
    position: absolute;
    top: 0;
    right: 0;
    color: var(--print-mark);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-meta);
    transform: rotate(-90deg);
    transform-origin: right top;
  }

  .manifesto-margin {
    position: absolute;
    right: var(--frame-pad);
    bottom: var(--frame-pad);
    z-index: 3;
    width: min(19rem, 26vw);
    padding-top: var(--space-md);
    border-top: 1px solid color-mix(in srgb, var(--print-ink) 33%, transparent);
  }

  .manifesto-margin span {
    display: block;
    margin-top: var(--space-md);
    color: color-mix(in srgb, var(--print-ink) 56%, transparent);
    font-size: var(--text-2xs);
  }

  .manifesto-interrupt {
    position: absolute;
    right: var(--frame-pad);
    top: var(--frame-pad);
    z-index: 3;
  }

  .manifesto-interrupt a {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--print-mark);
  }

  .manifesto-interrupt a span {
    font-family: var(--font-body);
    font-size: var(--text-lg);
  }

  /* kinetic rupture */
  .biome-kinetic-rupture {
    --kinetic-hot: color-mix(in srgb, var(--accent) 78%, var(--text));
    background:
      radial-gradient(
        ellipse at 20% 70%,
        color-mix(in srgb, var(--accent) 9%, transparent),
        transparent 27%
      ),
      var(--bg);
  }

  .biome-kinetic-rupture::before {
    position: absolute;
    top: 12%;
    right: 9%;
    bottom: 13%;
    left: 6%;
    z-index: -1;
    border-top: 1px solid color-mix(in srgb, var(--text) 11%, transparent);
    border-bottom: 1px solid color-mix(in srgb, var(--text) 11%, transparent);
    content: "";
    pointer-events: none;
  }

  .kinetic-origin {
    position: absolute;
    top: var(--frame-pad);
    left: var(--frame-pad);
    z-index: 3;
    width: min(25rem, 31vw);
  }

  .kinetic-origin .eyebrow {
    color: var(--kinetic-hot);
  }

  .kinetic-origin h1 {
    max-width: 8ch;
    margin-top: var(--space-lg);
    font-size: clamp(3.5rem, 7vw, 8.5rem);
    line-height: 0.78;
  }

  .kinetic-trajectory {
    position: absolute;
    top: 51%;
    right: 4%;
    left: 26%;
    height: 16%;
    transform: rotate(-17deg);
    transform-origin: center;
  }

  .kinetic-core,
  .kinetic-streak,
  .kinetic-fragment {
    position: absolute;
    display: block;
  }

  .kinetic-core {
    top: 30%;
    left: 42%;
    width: 6%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: var(--kinetic-hot);
    box-shadow: 0 0 3rem color-mix(in srgb, var(--kinetic-hot) 42%, transparent);
  }

  .kinetic-streak {
    top: 48%;
    height: 1px;
    transform-origin: right;
  }

  .streak-one {
    right: 55%;
    left: 2%;
    background: color-mix(in srgb, var(--text) 58%, transparent);
  }
  .streak-two {
    right: 28%;
    left: 50%;
    background: color-mix(in srgb, var(--kinetic-hot) 72%, transparent);
  }
  .streak-three {
    right: 2%;
    left: 72%;
    background: color-mix(in srgb, var(--signal) 45%, transparent);
  }

  .kinetic-fragment {
    width: 3%;
    aspect-ratio: 1;
    border: 1px solid color-mix(in srgb, var(--kinetic-hot) 72%, transparent);
    transform: rotate(45deg);
  }

  .fragment-one {
    top: -16%;
    left: 19%;
  }
  .fragment-two {
    top: 57%;
    left: 66%;
    width: 2%;
  }
  .fragment-three {
    top: 8%;
    left: 78%;
    width: 4%;
  }
  .fragment-four {
    top: 77%;
    left: 43%;
    width: 1.5%;
  }

  .kinetic-arrow {
    position: absolute;
    top: -35%;
    right: 3%;
    color: var(--kinetic-hot);
    font-family: var(--font-body);
    font-size: clamp(2rem, 4vw, 4rem);
  }

  .kinetic-residue {
    position: absolute;
    right: var(--frame-pad);
    bottom: var(--frame-pad);
    z-index: 3;
    width: min(18rem, 25vw);
    padding-top: var(--space-md);
    border-top: 1px solid
      color-mix(in srgb, var(--kinetic-hot) 45%, transparent);
  }

  .kinetic-residue p {
    color: var(--text-soft);
  }

  .kinetic-residue span {
    display: block;
    margin-top: var(--space-md);
    color: var(--kinetic-hot);
    font-size: var(--text-2xs);
  }

  .kinetic-release {
    position: absolute;
    top: var(--frame-pad);
    right: var(--frame-pad);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: var(--space-lg);
    color: var(--muted);
  }

  .kinetic-release a {
    color: var(--kinetic-hot);
  }

  .kinetic-release b {
    font-size: var(--text-sm);
    font-weight: 400;
  }

  @media (prefers-reduced-motion: no-preference) {
    .biome-kinetic-rupture [data-motion] {
      animation: kinetic-release 4.5s var(--ease-smooth) infinite alternate;
    }
  }

  @keyframes kinetic-release {
    from {
      transform: rotate(-17deg) translate3d(-1.5%, 1%, 0);
    }
    to {
      transform: rotate(-17deg) translate3d(3%, -1%, 0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .biome-frame *,
    .biome-frame *::before,
    .biome-frame *::after {
      animation-duration: 0s !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0s !important;
    }
  }

  @media (max-width: 760px) {
    .biome-frame {
      min-height: 100svh;
      padding: var(--space-lg) var(--space-md);
    }

    .biome-frame h1 {
      font-size: clamp(2.6rem, 13vw, 5.1rem);
    }

    .reliquary-intro,
    .elegy-intro,
    .object-inscription,
    .machine-locator,
    .kinetic-origin {
      position: relative;
      inset: auto;
      width: min(19rem, 78vw);
    }

    .reliquary-intro h1,
    .elegy-intro h1,
    .object-inscription h1,
    .machine-locator h1,
    .kinetic-origin h1 {
      max-width: 8ch;
      margin-top: var(--space-md);
    }

    .reliquary-ritual,
    .elegy-tide,
    .object-gesture,
    .machine-route,
    .manifesto-interrupt,
    .kinetic-release {
      top: auto;
      right: var(--space-md);
      bottom: var(--space-md);
    }

    .reliquary-shrine,
    .elegy-waterline,
    .object-vessel,
    .machine-habitat,
    .manifesto-sentence,
    .kinetic-trajectory {
      position: relative;
      inset: auto;
      transform: none;
    }

    .reliquary-shrine {
      width: min(92vw, 25rem);
      margin: 9vh auto 0;
    }

    .reliquary-litany,
    .elegy-witness,
    .object-caption,
    .machine-maintenance,
    .manifesto-margin,
    .kinetic-residue {
      position: relative;
      inset: auto;
      width: min(19rem, 78vw);
      margin-top: auto;
    }

    .reliquary-litany,
    .elegy-witness,
    .object-caption,
    .machine-maintenance,
    .manifesto-margin,
    .kinetic-residue {
      margin-right: 0;
      margin-left: auto;
    }

    .elegy-waterline {
      width: 120%;
      height: 37vh;
      margin: 15vh -20% 0 0;
    }

    .elegy-witness {
      margin-top: var(--space-xl);
    }

    .elegy-tide {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: var(--space-2xl);
      justify-content: space-between;
    }

    .object-vessel {
      width: min(61vw, 18rem);
      margin: 14vh auto 0;
    }

    .object-vessel figcaption {
      right: -52%;
    }

    .object-caption {
      margin-top: var(--space-2xl);
    }

    .object-gesture {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: var(--space-2xl);
    }

    .machine-habitat {
      height: 52vh;
      margin: 12vh calc(var(--space-md) * -1) 0;
    }

    .machine-maintenance {
      margin-top: var(--space-xl);
    }

    .machine-route {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: var(--space-2xl);
      text-align: left;
    }

    .manifesto-sentence {
      margin-top: 20vh;
      transform: none;
    }

    .manifesto-sentence h1 {
      max-width: 8ch;
      font-size: clamp(3.4rem, 15vw, 6rem);
    }

    .manifesto-rule {
      width: 46vw;
      margin-bottom: var(--space-lg);
    }

    .manifesto-stamp {
      right: 0;
      top: auto;
      bottom: -12%;
    }

    .manifesto-margin {
      margin-top: 15vh;
    }

    .manifesto-interrupt {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: var(--space-xl);
    }

    .kinetic-trajectory {
      height: 25vh;
      margin: 17vh -var(--space-md) 0;
      transform: rotate(-17deg);
    }

    .kinetic-residue {
      margin-top: var(--space-2xl);
    }

    .kinetic-release {
      position: relative;
      right: auto;
      bottom: auto;
      margin-top: var(--space-2xl);
      justify-content: space-between;
    }
  }
</style>

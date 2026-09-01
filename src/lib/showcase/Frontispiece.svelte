<script lang="ts">
  import Button from "../components/inputs/Button.svelte";
  import Label from "../components/primitives/Label.svelte";
  import Divider from "../components/primitives/Divider.svelte";
  import ShowcaseShell from "./ShowcaseShell.svelte";
  import { listShowcaseFamily } from "./showcaseNavigation.js";
  import { getShowcaseManifest } from "./showcaseManifest.js";

  const home = getShowcaseManifest("home");
  const scenes = listShowcaseFamily("scene");
  const docs = getShowcaseManifest("docs");
  const research = getShowcaseManifest("next-biomes");
</script>

{#if home && docs && research}
  <ShowcaseShell manifest={home}>
    <main class="frontispiece" data-frontispiece>
      <section class="frontispiece-thesis" aria-labelledby="frontispiece-title">
        <div class="thesis-copy">
          <Label color="signal">hyvui / a visual library</Label>
          <h1 id="frontispiece-title">hyvui</h1>
          <p class="thesis-statement">same parts. change the ties, and the page changes.</p>
          <p class="thesis-note">
            four scenes. same vocabulary. each keeps a different law of space, light,
            and time.
          </p>
          <div class="thesis-actions">
            <Button variant="secondary" href="/examples/bridge">enter a scene</Button>
            <Button variant="ghost" href={docs.href}>open the field guide</Button>
          </div>
        </div>

        <div
          class="threshold"
          role="group"
          aria-label="one system, four scene departures"
        >
          <div class="threshold-header">
            <span>frontispiece / 01</span>
            <span>four departures</span>
          </div>
          <div class="threshold-field">
            <span class="threshold-axis" aria-hidden="true"></span>
            <span class="threshold-core" aria-hidden="true"></span>
            {#each scenes as scene, index}
              <a
                class={`threshold-departure threshold-departure-${index}`}
                data-threshold-departure
                href={scene.href}
                style={`--station-index: ${index};`}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{scene.title}</span>
              </a>
            {/each}
          </div>
          <div class="threshold-footer">
            <span>same parts</span>
            <span>different rules</span>
          </div>
        </div>
      </section>

      <section class="frontispiece-procession" aria-labelledby="procession-title">
        <header class="procession-header">
          <div>
            <Label color="accent">the four scenes</Label>
            <h2 id="procession-title">same parts. four different laws.</h2>
          </div>
          <p>
            open a scene. each keeps the same component vocabulary, then changes the
            spacing, material, type, and motion.
          </p>
        </header>

        <ol class="scene-procession" data-scene-procession>
          {#each scenes as scene, index}
            <li>
              <a
                class="scene-entry"
                data-scene-entry={scene.id}
                href={scene.href}
              >
                <span class="scene-number">{String(index + 1).padStart(2, "0")}</span>
                <span class={`scene-mark scene-mark-${scene.id}`} aria-hidden="true">
                  <span></span>
                  <span></span>
                </span>
                <span class="scene-entry-copy">
                  <span class="scene-entry-family">{scene.hostBiome ?? scene.family}</span>
                  <strong>{scene.title}</strong>
                  <span class="scene-entry-premise">{scene.premise}</span>
                  <span class="scene-entry-cue">open / {scene.viewerRole}</span>
                </span>
              </a>
            </li>
          {/each}
        </ol>
      </section>

      <section class="frontispiece-proof" aria-labelledby="proof-title">
        <div class="proof-thesis">
          <Label color="signal">what to inspect</Label>
          <h2 id="proof-title">same parts. different pages.</h2>
          <blockquote>
            “a component is a part. the relation gives it work.”
          </blockquote>
        </div>
        <div class="proof-register">
          <Divider pattern="dotted" />
          <dl>
            <div>
              <dt>public work</dt>
              <dd>four authored scenes</dd>
            </div>
            <div>
              <dt>material studies</dt>
              <dd>hextech / arcane</dd>
            </div>
            <div>
              <dt>research archive</dt>
              <dd><a href={research.href}>twelve visual ecologies</a></dd>
            </div>
            <div>
              <dt>author's path</dt>
              <dd><a href={docs.href}>read the field guide</a></dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  </ShowcaseShell>
{/if}

<style>
  .frontispiece {
    --front-line: color-mix(in srgb, var(--text) 17%, transparent);
    min-width: 0;
    background:
      radial-gradient(
        ellipse at 78% 8%,
        color-mix(in srgb, var(--signal) 8%, transparent),
        transparent 34%
      ),
      var(--bg);
    color: var(--text);
  }

  .frontispiece-thesis,
  .frontispiece-procession,
  .frontispiece-proof {
    width: min(100%, var(--shell-max));
    margin-inline: auto;
    padding-inline: var(--shell-pad);
  }

  .frontispiece-thesis {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.72fr);
    gap: clamp(var(--space-xl), 8vw, var(--space-3xl));
    align-items: center;
    min-height: min(72svh, 46rem);
    padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
    border-bottom: 1px solid var(--front-line);
  }

  .thesis-copy {
    display: flex;
    max-width: 42rem;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .thesis-copy h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: clamp(5rem, 15vw, 13rem);
    font-weight: 400;
    letter-spacing: -0.09em;
    line-height: 0.72;
  }

  .thesis-statement {
    max-width: 17ch;
    margin: 0;
    color: var(--text);
    font-family: var(--font-body);
    font-size: clamp(var(--text-xl), 3.2vw, var(--text-3xl));
    line-height: 1.02;
  }

  .thesis-note {
    max-width: 33rem;
    margin: 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: 1.52;
  }

  .thesis-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
    padding-top: var(--space-xs);
  }

  .threshold {
    position: relative;
    min-height: 23rem;
    padding: var(--space-md);
    border: 1px solid var(--front-line);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--signal) 8%, transparent),
        transparent 48%
      ),
      color-mix(in srgb, var(--text) 3%, transparent);
  }

  .threshold::before,
  .threshold::after {
    position: absolute;
    width: var(--space-sm);
    height: var(--space-sm);
    border-color: var(--accent);
    content: "";
  }

  .threshold::before {
    top: -1px;
    left: -1px;
    border-top: 1px solid;
    border-left: 1px solid;
  }

  .threshold::after {
    right: -1px;
    bottom: -1px;
    border-right: 1px solid;
    border-bottom: 1px solid;
  }

  .threshold-header,
  .threshold-footer {
    display: flex;
    justify-content: space-between;
    gap: var(--space-sm);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .threshold-header span:first-child,
  .threshold-footer span:last-child {
    color: var(--accent);
  }

  .threshold-field {
    position: relative;
    min-height: 18rem;
    margin-block: var(--space-md);
    overflow: hidden;
    border-block: 1px solid var(--front-line);
  }

  .threshold-axis {
    position: absolute;
    top: 8%;
    bottom: 8%;
    left: 50%;
    border-left: 1px solid color-mix(in srgb, var(--signal) 52%, transparent);
  }

  .threshold-core {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5rem;
    aspect-ratio: 1;
    transform: translate(-50%, -50%) rotate(45deg);
    border: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .threshold-departure {
    position: absolute;
    top: calc(17% + var(--station-index) * 21%);
    right: 14%;
    left: 14%;
    display: flex;
    align-items: baseline;
    gap: var(--space-sm);
    padding-block: var(--space-xs);
    border-top: 1px solid color-mix(in srgb, var(--text) 28%, transparent);
    color: var(--text-soft);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-decoration: none;
    text-transform: uppercase;
  }

  .threshold-departure::after {
    position: absolute;
    top: -0.2rem;
    left: calc(18% + var(--station-index) * 19%);
    width: 0.35rem;
    height: 0.35rem;
    border: 1px solid var(--signal);
    background: var(--bg);
    content: "";
  }

  .threshold-departure span:first-child {
    color: var(--accent);
  }

  .threshold-departure span:last-child {
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    letter-spacing: -0.02em;
    text-transform: lowercase;
  }

  .threshold-departure:hover,
  .threshold-departure:focus-visible {
    color: var(--accent);
    outline: none;
  }

  .threshold-departure:hover span:last-child,
  .threshold-departure:focus-visible span:last-child {
    color: var(--accent);
  }

  .frontispiece-procession {
    padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
  }

  .procession-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.7fr);
    gap: var(--space-xl);
    align-items: end;
    padding-bottom: var(--space-xl);
    border-bottom: 1px solid var(--front-line);
  }

  .procession-header h2,
  .proof-thesis h2 {
    max-width: 14ch;
    margin: var(--space-sm) 0 0;
    font-family: var(--font-body);
    font-size: clamp(var(--text-2xl), 4vw, var(--text-3xl));
    font-weight: 400;
    letter-spacing: -0.055em;
    line-height: 0.95;
  }

  .procession-header p {
    max-width: 25rem;
    margin: 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-md);
    line-height: 1.5;
  }

  .scene-procession {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .scene-procession li {
    border-bottom: 1px solid var(--front-line);
  }

  .scene-procession li:nth-child(odd) {
    border-right: 1px solid var(--front-line);
  }

  .scene-entry {
    display: grid;
    grid-template-columns: 2rem 5.5rem minmax(0, 1fr);
    gap: var(--space-md);
    min-height: 15rem;
    align-items: start;
    padding: var(--space-lg) var(--space-md);
    color: inherit;
    text-decoration: none;
    transition:
      background-color var(--transition-fast),
      color var(--transition-fast);
  }

  .scene-entry:hover,
  .scene-entry:focus-visible {
    background: color-mix(in srgb, var(--signal) 7%, transparent);
    outline: none;
  }

  .scene-number {
    color: var(--muted-strong);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
  }

  .scene-mark {
    position: relative;
    display: grid;
    place-items: center;
    width: 5rem;
    aspect-ratio: 1;
    border: 1px solid var(--front-line);
    background: color-mix(in srgb, var(--text) 3%, transparent);
  }

  .scene-mark::before,
  .scene-mark::after,
  .scene-mark span {
    position: absolute;
    display: block;
    content: "";
  }

  .scene-mark::before {
    inset: 18%;
    border: 1px solid color-mix(in srgb, var(--signal) 45%, transparent);
  }

  .scene-mark::after {
    inset: 35%;
    border: 1px solid var(--accent);
  }

  .scene-mark span:first-child {
    width: 72%;
    border-top: 1px solid var(--signal);
    transform: rotate(-28deg);
  }

  .scene-mark span:last-child {
    width: 48%;
    border-top: 1px solid var(--accent);
    transform: rotate(47deg);
  }

  .scene-mark-keeper {
    transform: translateY(var(--space-sm));
  }

  .scene-mark-correspondence {
    clip-path: polygon(8% 0, 100% 0, 88% 100%, 0 100%);
  }

  .scene-mark-watchhouse {
    transform: rotate(-6deg);
  }

  .scene-entry-copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: var(--space-sm);
    overflow-wrap: anywhere;
  }

  .scene-entry-family,
  .scene-entry-cue {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .scene-entry-copy strong {
    min-width: 0;
    color: var(--text);
    font-family: var(--font-body);
    font-size: var(--text-xl);
    font-weight: 400;
    letter-spacing: -0.035em;
    line-height: 1;
  }

  .scene-entry-premise {
    max-width: 23rem;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.42;
  }

  .scene-entry-cue {
    margin-top: auto;
    color: var(--signal);
  }

  .frontispiece-proof {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 0.8fr);
    gap: var(--space-3xl);
    padding-block: clamp(var(--space-2xl), 8vw, var(--space-3xl));
    border-top: 1px solid var(--front-line);
  }

  .proof-thesis blockquote {
    max-width: 28rem;
    margin: var(--space-xl) 0 0;
    padding-left: var(--space-md);
    border-left: 1px solid var(--accent);
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-lg);
    font-style: italic;
    line-height: 1.45;
  }

  .proof-register {
    padding-top: var(--space-sm);
  }

  .proof-register dl {
    display: grid;
    gap: var(--space-md);
    margin: var(--space-lg) 0 0;
  }

  .proof-register dl div {
    display: grid;
    grid-template-columns: minmax(8rem, 0.8fr) 1fr;
    gap: var(--space-md);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--front-line);
  }

  .proof-register dt {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }

  .proof-register dd {
    margin: 0;
    color: var(--text-soft);
    font-family: var(--font-body);
    font-size: var(--text-sm);
    line-height: 1.35;
  }

  .proof-register a {
    color: var(--signal);
    text-decoration-color: color-mix(in srgb, var(--signal) 50%, transparent);
    text-underline-offset: 0.2em;
  }

  @media (max-width: 820px) {
    .frontispiece-thesis,
    .frontispiece-proof,
    .procession-header {
      grid-template-columns: 1fr;
    }

    .threshold {
      max-width: 34rem;
    }
  }

  @media (max-width: 620px) {
    .frontispiece-thesis,
    .frontispiece-procession,
    .frontispiece-proof {
      padding-inline: var(--space-md);
    }

    .frontispiece-thesis {
      min-height: 0;
      padding-block: var(--space-2xl);
    }

    .scene-procession {
      grid-template-columns: 1fr;
    }

    .scene-procession li:nth-child(odd) {
      border-right: 0;
    }

    .scene-entry {
      grid-template-columns: 1.5rem 4.5rem minmax(0, 1fr);
      gap: var(--space-sm);
      min-height: 13rem;
      padding-inline: 0;
    }

    .scene-mark {
      width: 4rem;
    }

    .proof-register dl div {
      grid-template-columns: 1fr;
      gap: var(--space-xs);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scene-entry {
      transition: none;
    }
  }
</style>

<script lang="ts">
  import {
    Badge,
    Button,
    CornerBrackets,
    DataStream,
    DepthScene,
    FloatCard,
    GridOverlay,
    HorizonGrid,
    Label,
    ScanBand,
    SignalRing,
    StatusDot,
    Surface,
    Text,
    Vignette,
    surface,
  } from "$lib/index.js";
  import { showcaseScenes } from "$lib/examples/sceneCatalog.js";
</script>

<svelte:head>
  <title>hyvui</title>
</svelte:head>

<main class="home">
  <section class="hero">
    <DepthScene perspective="far" class="hero-depth">
      {#snippet ambient()}
        <GridOverlay class="hero-grid" />
        <Vignette class="hero-vignette" />
        <ScanBand active class="hero-scan" />
      {/snippet}

      {#snippet ground()}
        <HorizonGrid rows={24} cols={18} vanishY={0.44} animated />
      {/snippet}

      {#snippet stage()}
        <div class="hero-stage" use:surface>
          <div class="hero-copy">
            <div class="hero-kicker">
              <StatusDot status="ok" size={7} pulse />
              <Label color="signal">scene anthology</Label>
            </div>
            <h1>hyvui</h1>
            <Text expression="manifesto">
              a component library for finished creative interfaces. not a box of
              parts. a visual system with enough spine to carry the whole page.
            </Text>
            <div class="hero-actions">
              <Button variant="secondary" href="/examples/studio-console"
                >enter anthology</Button
              >
              <Button variant="ghost" href="/docs">open reference</Button>
            </div>
          </div>

          <FloatCard tiltMax={5} class="hero-console">
            <div class="hero-console-inner">
              <CornerBrackets size={28} color="var(--signal)" />
              <div class="hero-console-top">
                <Label color="muted">creative signal</Label>
                <Badge variant="default">live</Badge>
              </div>
              <div class="hero-console-frame">
                <div class="hero-console-bars">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <SignalRing active size={132} color="var(--accent)" />
                <DataStream active speed="slow" />
              </div>
              <div class="hero-console-bottom">
                <Label color="signal">six scenes</Label>
                <Label color="muted">weight plus theme split</Label>
              </div>
            </div>
          </FloatCard>
        </div>
      {/snippet}
    </DepthScene>
    <div class="hero-next" aria-hidden="true">
      <span>studio console</span>
      <span>field report</span>
      <span>archive gallery</span>
    </div>
  </section>

  <section class="anthology">
    <div class="shell">
      <div class="section-head" use:surface>
        <Label color="accent">built with this</Label>
        <h2>six scenes. one system.</h2>
        <p>
          the homepage now points at finished surfaces instead of explaining the
          library from the outside. each scene shows a different posture for the
          same component language.
        </p>
      </div>

      <div class="scene-grid">
        {#each showcaseScenes as scene, index}
          <a
            href={`/examples/${scene.slug}`}
            class="scene-card"
            data-weight={scene.weight}
            data-theme={scene.theme}
            use:surface={{ delay: index * 60 }}
          >
            <Surface variant="card" class="scene-surface">
              <div class="scene-preview" aria-hidden="true">
                {#if scene.theme === "hextech"}
                  <div class="scene-hex"></div>
                {:else if scene.theme === "arcane"}
                  <div class="scene-shard"></div>
                {:else}
                  <div class="scene-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                {/if}
              </div>
              <div class="scene-copy">
                <div class="scene-meta">
                  <Label color="muted">{scene.kicker}</Label>
                  <Badge variant="default">{scene.registerNote}</Badge>
                </div>
                <h3>{scene.title}</h3>
                <p>{scene.description}</p>
              </div>
              <div class="scene-foot">
                {#each scene.components.slice(0, 3) as component}
                  <code>{component}</code>
                {/each}
              </div>
            </Surface>
          </a>
        {/each}
      </div>
    </div>
  </section>

  <section class="split-proof">
    <div class="shell split-proof-inner">
      <div class="proof-copy" use:surface>
        <Label color="signal">new contract</Label>
        <h2>weight and theme are separate now.</h2>
        <p>
          `field-notebook`, `mission-control`, and `archive` decide density and
          voice. `hextech` and `arcane` decide motif and palette. no silent
          structural drift.
        </p>
        <div class="proof-actions">
          <Button variant="secondary" href="/examples/hextech-forge"
            >see hextech</Button
          >
          <Button variant="ghost" href="/examples/arcane-shard"
            >see arcane</Button
          >
        </div>
      </div>

      <div class="proof-stack" use:surface={{ delay: 120 }}>
        {#each [{ weight: "field-notebook", label: "field notebook", theme: null }, { weight: "mission-control", label: "mission control", theme: null }, { weight: "archive", label: "archive plus arcane", theme: "arcane" }] as card}
          <div
            class="proof-card-wrap"
            data-weight={card.weight}
            data-theme={card.theme}
          >
            <Surface variant="panel" class="proof-card">
              <Label color="muted">{card.label}</Label>
              <Text expression="readout"
                >same structure. different atmosphere.</Text
              >
            </Surface>
          </div>
        {/each}
      </div>
    </div>
  </section>
</main>

<style>
  .home {
    background: var(--bg);
    color: var(--text);
  }

  .shell {
    width: min(100%, var(--shell-max));
    margin: 0 auto;
    padding-inline: var(--shell-pad);
  }

  .hero {
    position: relative;
    min-height: 92dvh;
  }

  .hero-next {
    position: absolute;
    left: var(--shell-pad);
    right: var(--shell-pad);
    bottom: var(--space-md);
    z-index: 2;
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--line);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--muted);
    opacity: 0.72;
  }

  :global(.hero-depth),
  :global(.hero-depth .hyvui-depth-scene-stage),
  :global(.hero-depth .hyvui-depth-scene-content) {
    min-height: 92dvh;
  }

  :global(.hero-grid) {
    opacity: 0.28;
  }

  :global(.hero-vignette) {
    background:
      radial-gradient(
        ellipse at 50% 0%,
        color-mix(in srgb, var(--signal) 12%, transparent),
        transparent 46%
      ),
      radial-gradient(
        ellipse at 50% 100%,
        transparent 36%,
        color-mix(in srgb, var(--bg) 82%, transparent)
      );
  }

  :global(.hero-scan) {
    opacity: 0.24;
  }

  .hero-stage {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 28rem);
    gap: clamp(var(--space-lg), 6vw, var(--space-3xl));
    align-items: center;
    width: min(100%, 72rem);
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .hero-kicker,
  .hero-actions,
  .hero-console-top,
  .hero-console-bottom,
  .proof-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .hero h1 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-display);
    font-weight: 400;
    line-height: 0.84;
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }

  :global(.hero-console) {
    width: 100%;
  }

  .hero-console-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
  }

  .hero-console-top,
  .hero-console-bottom {
    justify-content: space-between;
  }

  .hero-console-frame {
    position: relative;
    min-height: 22rem;
    display: grid;
    place-items: center;
    border: 1px solid var(--line);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--signal) 10%, transparent),
        transparent 54%
      ),
      color-mix(in srgb, var(--text) 4%, transparent);
    overflow: hidden;
  }

  .hero-console-bars {
    position: absolute;
    left: var(--space-lg);
    right: var(--space-lg);
    bottom: var(--space-lg);
    display: grid;
    gap: var(--space-xs);
  }

  .hero-console-bars span {
    height: 1px;
    background: linear-gradient(90deg, var(--line), transparent);
  }

  .anthology,
  .split-proof {
    padding-block: clamp(var(--space-3xl), 9vw, 8rem);
    border-top: 1px solid var(--line);
  }

  .section-head {
    max-width: 48rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
  }

  .section-head h2,
  .proof-copy h2 {
    margin: 0;
    font-family: var(--font-body);
    font-size: var(--text-3xl);
    font-weight: 400;
    line-height: 1;
    letter-spacing: var(--reg-heading-tracking);
    color: var(--text);
  }

  .section-head p,
  .proof-copy p {
    margin: 0;
    max-width: 42rem;
    color: var(--text-soft);
    font-size: var(--text-md);
    line-height: 1.55;
  }

  .scene-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-md);
  }

  .scene-card {
    color: inherit;
    text-decoration: none;
    min-width: 0;
  }

  :global(.scene-surface) {
    min-height: 27rem;
    display: flex;
    flex-direction: column;
  }

  .scene-preview {
    min-height: 12rem;
    display: grid;
    place-items: center;
    border-bottom: 1px solid var(--line);
    background:
      linear-gradient(
        145deg,
        color-mix(in srgb, var(--accent) 10%, transparent),
        transparent 54%
      ),
      color-mix(in srgb, var(--signal) 5%, transparent);
  }

  .scene-lines {
    width: 68%;
    display: grid;
    gap: var(--space-sm);
  }

  .scene-lines span {
    height: 1px;
    background: linear-gradient(90deg, var(--line-strong), transparent);
  }

  .scene-hex,
  .scene-shard {
    width: 7rem;
    aspect-ratio: 1;
    border: 1px solid var(--line-strong);
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--signal) 18%, transparent),
        transparent
      ),
      color-mix(in srgb, var(--accent) 10%, transparent);
  }

  .scene-hex {
    clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%);
  }

  .scene-shard {
    clip-path: polygon(52% 0, 88% 36%, 66% 100%, 18% 72%, 12% 22%);
  }

  .scene-copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    padding: var(--space-lg);
    flex: 1;
  }

  .scene-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .scene-copy h3 {
    margin: 0;
    font-size: var(--text-xl);
    font-weight: 400;
    line-height: 1;
    color: var(--text);
  }

  .scene-copy p {
    margin: 0;
    color: var(--text-soft);
    line-height: 1.5;
  }

  .scene-foot {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    padding: 0 var(--space-lg) var(--space-lg);
  }

  .scene-foot code {
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    color: var(--muted);
    border: 1px solid var(--line);
    padding: var(--space-3xs) var(--space-2xs);
  }

  .split-proof-inner {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 26rem);
    gap: var(--space-xl);
    align-items: center;
  }

  :global(.proof-copy) {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .proof-stack {
    display: grid;
    gap: var(--space-sm);
  }

  :global(.proof-card) {
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  @media (max-width: 980px) {
    .hero-stage,
    .scene-grid,
    .split-proof-inner {
      grid-template-columns: 1fr;
    }

    :global(.scene-surface) {
      min-height: 0;
    }
  }

  @media (max-width: 620px) {
    .hero-stage {
      padding-bottom: var(--space-xl);
    }

    .hero-console-inner {
      padding: var(--space-md);
    }

    .hero-console-frame {
      min-height: 15rem;
    }

    .hero-next {
      display: none;
    }
  }
</style>

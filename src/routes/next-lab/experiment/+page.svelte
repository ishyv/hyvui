<script lang="ts">
  import {
    applyTheme,
    clearTheme,
    Badge,
    Card,
    DataStream,
    DepthLayer,
    DepthStage,
    Divider,
    Frame,
    Grid,
    GridOverlay,
    HorizonGrid,
    Label,
    ScanBand,
    SignalRing,
    Stack,
    StatusDot,
    Surface,
    Text,
    Vignette,
  } from "$lib/index.js";
  import Composition from "$lib/next-experiments/Composition.svelte";
  import CompositionNode from "$lib/next-experiments/Node.svelte";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";
  import type { PageData } from "./$types.js";

  let { data }: { data: PageData } = $props();
  const showcaseManifest = getShowcaseManifest("next-experiment");
  const current = $derived(data.experiment);
  const caseLabel = $derived(current.id.replaceAll("-", " "));

  $effect(() => {
    const theme =
      current.artDirection.material === "arcane"
        ? "arcane"
        : current.artDirection.material === "hextech"
          ? "hextech"
          : null;

    if (!theme) {
      clearTheme();
      return;
    }

    applyTheme(theme);
    return () => clearTheme();
  });
</script>

<svelte:head>
  <title>next lab / {caseLabel}</title>
  <meta
    name="description"
    content="A composition test for named relations, authored placement, and bounded adaptation."
  />
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!}>
<main class="experiment-page" data-experiment-case={current.id}>
  <header class="experiment-header">
    <div>
      <Label color="accent">next lab / composition experiment</Label>
      <Text as="h1" variant="heading">relationships before runtime</Text>
    </div>
    <Text variant="body" color="muted">
      same model. explicit nodes. choose disabled, suggest, or apply. authored
      placement stays in charge.
    </Text>
  </header>

  <nav class="experiment-nav" aria-label="composition cases">
    <div class="experiment-cases">
      {#each ["sparse", "dense", "image-dominant", "type-dominant", "atmospheric-motion"] as caseId, index}
        <a
          href={`/next-lab/experiment?case=${caseId}&mode=${data.mode}`}
          class:active={caseId === current.id}
          aria-current={caseId === current.id ? "page" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          {caseId.replaceAll("-", " ")}
        </a>
      {/each}
    </div>
    <div class="experiment-modes">
      <Label color="muted">policy</Label>
      {#each ["disabled", "suggest", "apply"] as mode}
        <a
          href={`/next-lab/experiment?case=${current.id}&mode=${mode}`}
          class:active={mode === data.mode}>{mode}</a
        >
      {/each}
    </div>
  </nav>

  <section class="experiment-intro">
    <div>
      <Label color="signal">{current.id.replaceAll("-", " ")}</Label>
      <Text as="h2" variant="heading">{current.title}</Text>
    </div>
    <Text variant="body" color="soft">{current.description}</Text>
  </section>

  <Composition
    id={current.id}
    artDirection={current.artDirection}
    nodes={current.nodes}
    relations={current.relations}
    class={`experiment experiment-${current.id}`}
    inspect
  >
    {#if current.id === "sparse"}
      <CompositionNode
        id="signal"
        class="exp-node exp-signal"
        style="left: 48%; top: 38%;"
      >
        <Text as="h3" variant="heading" expression="title-card">–42 dbm</Text>
        <Label color="signal">focal signal</Label>
      </CompositionNode>
      <CompositionNode
        id="note"
        class="exp-node exp-note"
        style="left: 54%; top: 54%;"
      >
        <Surface variant="panel">
          <Label color="accent">contact / 01</Label>
          <Text variant="body" color="soft"
            >bearing held at 240.</Text
          >
        </Surface>
      </CompositionNode>
      <div class="exp-sparse-field" aria-hidden="true">
        <GridOverlay />
        <SignalRing active size={300} color="var(--signal)" />
      </div>
    {:else if current.id === "dense"}
      <CompositionNode id="readings" class="exp-node exp-readings">
        <Grid cols={3} gap="var(--space-xs)">
          {#each ["north", "east", "south", "west", "upper", "lower"] as sector, index}
            <Card>
              <Stack gap="var(--space-xs)">
                <Label color="muted">{sector}</Label>
                <Text expression="readout"
                  >{String(18 + index * 7).padStart(2, "0")}</Text
                >
                <Badge variant={index % 3 === 0 ? "accent" : "signal"}>
                  {index % 3 === 0 ? "drift" : "clear"}
                </Badge>
              </Stack>
            </Card>
          {/each}
        </Grid>
      </CompositionNode>
      <CompositionNode id="focal-readout" class="exp-node exp-focal-readout">
        <Label color="signal">active register</Label>
        <Text as="h3" variant="heading">12 channels</Text>
        <Text variant="body" color="muted"
          >one field. twelve channels.</Text
        >
      </CompositionNode>
      <CompositionNode id="trace" class="exp-node exp-trace">
        <div class="exp-trace-line" aria-hidden="true"></div>
        <Label color="muted">trace / connected</Label>
      </CompositionNode>
    {:else if current.id === "image-dominant"}
      <CompositionNode id="artifact" class="exp-node exp-artifact">
        <Surface variant="card">
          <Frame ratio="4/5" class="exp-artifact-frame">
            <img src="/favicon.png" alt="abstract HyvUI mark" />
          </Frame>
        </Surface>
      </CompositionNode>
      <CompositionNode id="caption" class="exp-node exp-caption">
        <Label color="accent">plate / recovered surface</Label>
        <Text as="h3" variant="heading">the edges did not survive.</Text>
        <Text variant="body" color="soft"
          >the caption stays outside the frame.</Text
        >
      </CompositionNode>
      <CompositionNode id="edge-mark" class="exp-node exp-edge-mark">
        <div class="exp-edge-mark-glyph" aria-hidden="true">+</div>
        <Label color="muted">anchor / image edge</Label>
      </CompositionNode>
    {:else if current.id === "type-dominant"}
      <CompositionNode id="statement" class="exp-node exp-statement">
        <Text as="h3" variant="heading" expression="title-card">
          statement stays. divider nears.
        </Text>
      </CompositionNode>
      <CompositionNode id="interruption" class="exp-node exp-interruption">
        <Divider strength="strong" />
        <Label color="accent">interruption / held</Label>
      </CompositionNode>
      <CompositionNode id="citation" class="exp-node exp-citation">
        <Label color="muted">field note / 07</Label>
        <Text variant="italic" color="soft">the margin carries one fragment.</Text>
      </CompositionNode>
    {:else}
      <CompositionNode id="weather" class="exp-node exp-weather" ariaHidden>
        <GridOverlay />
        <ScanBand active axis="y" />
        <SignalRing active size={360} color="var(--arc-magenta)" />
      </CompositionNode>
      <CompositionNode id="beacon" class="exp-node exp-beacon">
        <DepthStage perspective="far" class="exp-beacon-stage">
          <DepthLayer level="raised">
            <Surface variant="card" class="reliquary-beacon-body">
              <Stack gap="var(--space-md)">
                <Stack direction="horizontal" justify="between" align="center">
                  <Label color="signal">presence / near</Label>
                  <StatusDot status="pend" />
                </Stack>
                <Text as="h3" variant="heading">weather in the channel</Text>
                <Text variant="body" color="soft"
                  >air moves. signal follows.</Text
                >
                <div class="reliquary-readout" aria-hidden="true">
                  <span>/ 04:17</span>
                  <span>air / moving</span>
                </div>
              </Stack>
            </Surface>
          </DepthLayer>
        </DepthStage>
      </CompositionNode>
      <CompositionNode id="trace" class="exp-node exp-atmospheric-trace">
        <div class="exp-atmospheric-trace-line" aria-hidden="true"></div>
        <Label color="muted">trace / next scene</Label>
      </CompositionNode>
      <div
        class="reliquary-ghost-type"
        data-art-layer="background"
        aria-hidden="true"
      >
        weather / weather / weather
      </div>
      <div
        class="reliquary-foreground-veil"
        data-art-layer="foreground"
        data-art-actor="foreground-veil"
        aria-hidden="true"
      >
        <div class="reliquary-veil-ribbon"></div>
        <div class="reliquary-veil-caption">trace remains after release</div>
      </div>
      <div class="exp-atmospheric-ground" aria-hidden="true">
        <HorizonGrid rows={14} cols={10} vanishY={0.42} animated />
        <DataStream active speed="slow" />
      </div>
    {/if}
  </Composition>

  <aside class="experiment-note">
    <div>
      <Label color="accent">inspection</Label>
      <Text variant="body" color="soft">
        the inspector records the seed, nodes, relation decisions, and rejected
        suggestions. `suggest` changes nothing. `apply` still yields to manual
        placement.
      </Text>
    </div>
    <Badge variant="default">{data.mode}</Badge>
  </aside>
</main>
</ShowcaseShell>

<style>
  .experiment-page {
    min-height: 100dvh;
    padding: var(--space-scene);
    background: var(--bg);
    color: var(--text);
  }

  .experiment-header,
  .experiment-intro,
  .experiment-note,
  .experiment-nav {
    width: min(100%, var(--shell-max));
    margin-inline: auto;
  }

  .experiment-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(16rem, 28rem);
    gap: var(--space-xl);
    align-items: end;
    margin-bottom: var(--space-xl);
  }

  .experiment-header > div,
  .experiment-intro > div {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  :global(.experiment-header h1) {
    max-width: 12ch;
  }

  .experiment-nav {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    flex-wrap: wrap;
    padding-block: var(--space-sm);
    border-block: 1px solid var(--line);
  }

  .experiment-cases,
  .experiment-modes {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .experiment-cases a,
  .experiment-modes a {
    display: inline-flex;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.08em;
    text-decoration: none;
    text-transform: uppercase;
  }

  .experiment-cases a span {
    color: var(--accent);
  }

  .experiment-cases a.active,
  .experiment-cases a:hover,
  .experiment-modes a.active,
  .experiment-modes a:hover {
    color: var(--text);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
  }

  .experiment-intro {
    display: flex;
    justify-content: space-between;
    align-items: end;
    gap: var(--space-xl);
    padding-block: var(--space-xl);
  }

  :global(.experiment-intro h2) {
    max-width: 12ch;
  }

  .experiment-intro > :global(.hyvui-text-body) {
    max-width: 28rem;
  }

  :global(.experiment) {
    position: relative;
    isolation: isolate;
    width: min(100%, var(--shell-max));
    min-height: clamp(44rem, 90dvh, 60rem);
    margin-inline: auto;
    overflow: hidden;
    border: 1px solid var(--line);
    background: color-mix(in srgb, var(--text) 2%, transparent);
  }

  :global(.experiment-sparse) {
    background: color-mix(in srgb, var(--signal) 2%, transparent);
  }

  :global(.hyvui-next-node) {
    position: absolute;
    z-index: 2;
    transform: translate3d(
        var(--hyv-auto-nudge-x, 0px),
        var(--hyv-auto-nudge-y, 0px),
        0
      )
      translate(
        calc(var(--hyv-node-variation, 0) * 1rem),
        calc(var(--hyv-node-variation, 0) * -1rem)
      )
      translateX(var(--hyv-hover-shift-x, 0px))
      translateY(var(--hyv-hover-lift, 0px))
      rotate(var(--hyv-node-rotate, 0deg)) scale(var(--hyv-node-scale, 1))
      scale(var(--hyv-auto-scale, 1));
  }

  :global(.hyvui-next-node[data-art-pose="resolved"]) {
    left: var(--hyv-art-x, auto);
    top: var(--hyv-art-y, auto);
    z-index: var(--hyv-art-z, 2);
    transform: translate3d(
        var(--hyv-auto-nudge-x, 0px),
        var(--hyv-auto-nudge-y, 0px),
        0
      )
      translate(
        calc(var(--hyv-node-variation, 0) * 1rem),
        calc(var(--hyv-node-variation, 0) * -1rem)
      )
      translateX(var(--hyv-hover-shift-x, 0px))
      translateY(var(--hyv-hover-lift, 0px)) rotate(var(--hyv-art-rotate, 0deg))
      rotate(var(--hyv-node-rotate, 0deg)) scale(var(--hyv-art-scale, 1))
      scale(var(--hyv-node-scale, 1)) scale(var(--hyv-auto-scale, 1));
  }

  :global(.exp-signal) {
    z-index: 4;
    width: min(18rem, 40%);
    color: var(--text);
  }

  :global(.exp-signal .hyvui-text-heading) {
    display: block;
    font-size: clamp(3rem, 8vw, 7rem);
    line-height: 0.85;
  }

  :global(.exp-note) {
    z-index: 3;
    width: min(18rem, 42%);
  }

  :global(.exp-note .hyvui-surface-panel) {
    padding: var(--space-md);
  }

  :global(.exp-sparse-field) {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: grid;
    place-items: center;
    pointer-events: none;
  }

  :global(.exp-sparse-field .hyvui-grid-overlay) {
    opacity: 0.26;
  }

  :global(.exp-readings) {
    left: 6%;
    top: 13%;
    width: min(70%, 42rem);
  }

  :global(.exp-readings .hyvui-card-inner) {
    min-height: 7.5rem;
    padding: var(--space-sm);
    gap: var(--space-sm);
  }

  :global(.exp-readings .hyvui-text-readout) {
    display: block;
    font-size: var(--text-lg);
  }

  :global(.exp-focal-readout) {
    right: 8%;
    bottom: 14%;
    width: min(18rem, 40%);
    padding: var(--space-md);
    border-inline-start: 1px solid var(--accent);
    background: color-mix(in srgb, var(--accent) 8%, var(--bg));
  }

  :global(.exp-focal-readout .hyvui-text-heading) {
    display: block;
    margin-block: var(--space-xs);
  }

  :global(.exp-trace) {
    left: 8%;
    bottom: 8%;
    display: flex;
    gap: var(--space-sm);
    align-items: center;
  }

  :global(.exp-trace-line),
  :global(.exp-atmospheric-trace-line) {
    width: min(20rem, 30vw);
    height: 1px;
    background: linear-gradient(90deg, var(--signal), transparent);
  }

  :global(.exp-artifact) {
    left: 13%;
    top: 8%;
    width: min(48%, 30rem);
    transform: translate(
        calc(var(--hyv-node-variation, 0) * 1rem),
        calc(var(--hyv-node-variation, 0) * -1rem)
      )
      rotate(-3deg);
  }

  :global(.exp-artifact .hyvui-surface-card) {
    padding: var(--space-sm);
  }

  :global(.exp-artifact-frame img) {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: saturate(0.6) contrast(1.15);
  }

  :global(.exp-caption) {
    right: 7%;
    bottom: 14%;
    width: min(19rem, 40%);
  }

  :global(.exp-caption .hyvui-text-heading) {
    display: block;
    margin-block: var(--space-sm);
  }

  :global(.exp-edge-mark) {
    right: 31%;
    top: 16%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-xs);
  }

  :global(.exp-edge-mark-glyph) {
    display: grid;
    width: 3rem;
    height: 3rem;
    place-items: center;
    border: 1px solid var(--line-strong);
    color: var(--accent);
    font-size: var(--text-2xl);
  }

  :global(.exp-statement) {
    left: 8%;
    top: 22%;
    width: min(72%, 48rem);
  }

  :global(.exp-statement .hyvui-text-heading) {
    display: block;
    max-width: 8ch;
    font-size: clamp(3.2rem, 9vw, 8rem);
    line-height: 0.84;
  }

  :global(.exp-interruption) {
    left: 9%;
    bottom: 18%;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    width: min(28rem, 62%);
  }

  :global(.exp-interruption .hyvui-divider) {
    flex: 1;
  }

  :global(.exp-citation) {
    right: 8%;
    bottom: 22%;
    width: min(15rem, 32%);
    padding-inline-start: var(--space-md);
    border-inline-start: 1px solid var(--line-strong);
  }

  :global(.exp-citation .hyvui-text-italic) {
    display: block;
    margin-top: var(--space-sm);
  }

  :global(.experiment-atmospheric-motion) {
    min-height: clamp(50rem, 94dvh, 66rem);
    overflow: clip;
    border-color: color-mix(in srgb, var(--arc-magenta) 24%, var(--line));
    background:
      radial-gradient(
        circle at 62% 42%,
        color-mix(in srgb, var(--arc-magenta) 15%, transparent),
        transparent 32%
      ),
      linear-gradient(
        108deg,
        var(--arc-void) 0%,
        color-mix(in srgb, var(--arc-void) 80%, var(--signal)) 48%,
        color-mix(in srgb, var(--arc-void) 76%, var(--arc-magenta)) 100%
      );
  }

  :global(.exp-weather),
  :global(.exp-atmospheric-ground) {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  :global(.exp-weather) {
    z-index: 1;
    display: grid;
    place-items: center;
    opacity: 0.34;
    transform: rotate(-8deg) scale(1.14);
    mix-blend-mode: screen;
  }

  :global(.exp-beacon) {
    left: 41%;
    top: 19%;
    width: min(31rem, 42%);
  }

  :global(.exp-beacon-stage) {
    min-height: 24rem;
    transform: rotate(3deg)
      translate3d(var(--hyv-pointer-x), var(--hyv-pointer-y), 0);
  }

  :global(.reliquary-beacon-body) {
    min-height: 21rem;
    padding: clamp(var(--space-md), 4vw, var(--space-xl));
    border: 1px solid
      color-mix(in srgb, var(--arc-magenta) 48%, var(--line-strong));
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--arc-white-hot) 8%, transparent),
        transparent 30%
      ),
      var(--surface-crystal-bg);
    clip-path: var(--clip-shard);
    box-shadow: var(--crystal-lift-peak);
    transform: translateZ(2rem);
    transition:
      transform var(--transition-smooth),
      filter var(--transition-smooth);
  }

  :global(.reliquary-beacon-body:hover) {
    filter: drop-shadow(0 0 2rem var(--arc-hover-aura));
    transform: translate3d(0, -4px, 2.5rem) rotate(-1deg);
  }

  :global(.reliquary-beacon-body .hyvui-text-heading) {
    display: block;
    max-width: 5ch;
    margin-block: var(--space-sm) var(--space-md);
    color: var(--arc-white-hot);
    font-size: clamp(4rem, 8vw, 7rem);
    letter-spacing: -0.08em;
    line-height: 0.72;
    text-wrap: balance;
    transform: translateX(-0.08em) rotate(-7deg);
    transform-origin: left bottom;
  }

  :global(.reliquary-beacon-body .hyvui-text-body) {
    max-width: 19ch;
    color: color-mix(in srgb, var(--arc-white-hot) 72%, var(--signal));
    font-size: var(--text-sm);
  }

  :global(.reliquary-readout) {
    display: flex;
    justify-content: space-between;
    gap: var(--space-md);
    margin-top: var(--space-lg);
    padding-top: var(--space-sm);
    border-top: 1px solid
      color-mix(in srgb, var(--arc-magenta) 34%, transparent);
    color: var(--arc-shimmer);
    font-family: var(--font-mono);
    font-size: var(--text-2xs);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  :global(.exp-atmospheric-trace) {
    left: 8%;
    right: auto;
    bottom: 18%;
    display: flex;
    gap: var(--space-sm);
    align-items: center;
    transform: rotate(-13deg);
  }

  :global(.exp-atmospheric-trace .hyvui-label) {
    color: var(--arc-shimmer);
  }

  :global(.exp-atmospheric-trace-line) {
    width: min(32rem, 38vw);
    background: linear-gradient(
      90deg,
      var(--arc-magenta),
      var(--signal),
      transparent
    );
  }

  :global(.reliquary-ghost-type) {
    position: absolute;
    top: 12%;
    left: -3%;
    z-index: 1;
    width: 8ch;
    color: color-mix(in srgb, var(--arc-magenta) 14%, transparent);
    font-family: var(--font-serif);
    font-size: clamp(8rem, 22vw, 24rem);
    letter-spacing: -0.1em;
    line-height: 0.66;
    text-transform: lowercase;
    transform: rotate(-90deg) translateX(-36%);
    transform-origin: top left;
    white-space: nowrap;
    mix-blend-mode: screen;
  }

  :global(.reliquary-foreground-veil) {
    position: absolute;
    inset: 0;
    z-index: 7;
    overflow: hidden;
    pointer-events: none;
  }

  :global(.reliquary-veil-ribbon) {
    position: absolute;
    top: 48%;
    left: -8%;
    width: 120%;
    height: 8rem;
    background: linear-gradient(
      90deg,
      transparent 0%,
      color-mix(in srgb, var(--arc-violet-deep) 66%, transparent) 22%,
      color-mix(in srgb, var(--arc-magenta) 24%, transparent) 55%,
      transparent 100%
    );
    clip-path: polygon(0 38%, 100% 0, 100% 58%, 0 100%);
    transform: rotate(-8deg)
      translate3d(calc(var(--hyv-pointer-x) * -0.45), 0, 0);
    mix-blend-mode: multiply;
  }

  :global(.reliquary-veil-caption) {
    position: absolute;
    right: 7%;
    bottom: 9%;
    max-width: 12ch;
    color: color-mix(in srgb, var(--arc-white-hot) 58%, transparent);
    font-family: var(--font-serif);
    font-size: clamp(1.2rem, 2.4vw, 2.2rem);
    letter-spacing: -0.04em;
    line-height: 0.9;
    transform: rotate(-4deg);
  }

  :global(.exp-atmospheric-ground) {
    z-index: 0;
    display: flex;
    align-items: end;
    justify-content: space-between;
    padding: var(--space-md);
    opacity: 0.18;
    transform: translate3d(
      calc(var(--hyv-pointer-x) * -0.28),
      calc(var(--hyv-pointer-y) * -0.28),
      0
    );
  }

  @media (max-width: 760px) {
    .experiment-page {
      padding: var(--space-lg);
    }

    .experiment-header,
    .experiment-intro {
      grid-template-columns: 1fr;
      display: grid;
      gap: var(--space-md);
    }

    .experiment-header > div,
    .experiment-intro > div {
      min-width: 0;
    }

    .experiment-header :global(.hyvui-label) {
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .experiment-intro {
      align-items: start;
    }

    :global(.experiment) {
      min-height: 44rem;
    }

    :global(.exp-signal) {
      left: 10% !important;
      top: 25% !important;
      width: 80%;
    }

    :global(.exp-note) {
      left: 12% !important;
      top: 62% !important;
      width: 70%;
    }

    :global(.exp-readings) {
      left: 5%;
      top: 8%;
      width: 90%;
    }

    :global(.exp-focal-readout) {
      right: 8%;
      bottom: 12%;
      width: 70%;
    }

    :global(.exp-artifact) {
      left: 10%;
      top: 8%;
      width: 68%;
    }

    :global(.exp-caption) {
      left: 16%;
      right: auto;
      bottom: 8%;
      width: 68%;
    }

    :global(.exp-edge-mark) {
      right: 8%;
      top: 26%;
    }

    :global(.exp-statement) {
      left: 8%;
      top: 18%;
      width: 84%;
    }

    :global(.exp-citation) {
      left: 12%;
      right: auto;
      bottom: 10%;
      width: 72%;
    }

    :global(.exp-interruption) {
      left: 10%;
      bottom: 28%;
      width: 80%;
    }

    :global(.exp-beacon) {
      left: 18%;
      top: 27%;
      width: 70%;
    }

    :global(
      .experiment-atmospheric-motion
        .hyvui-next-node[data-art-pose="resolved"].exp-beacon
    ) {
      left: 8%;
      top: 27%;
      width: 78%;
    }

    :global(.experiment-atmospheric-motion) {
      min-height: 54rem;
    }

    :global(.experiment-atmospheric-motion .exp-beacon-stage) {
      min-height: 24rem;
    }

    :global(.experiment-atmospheric-motion .reliquary-ghost-type) {
      top: 8%;
      left: -18%;
      font-size: 10rem;
    }

    :global(.experiment-atmospheric-motion .exp-atmospheric-trace) {
      left: 7%;
      bottom: 20%;
    }

    :global(.experiment-atmospheric-motion .reliquary-veil-caption) {
      right: 8%;
      bottom: 7%;
    }

    :global(.exp-atmospheric-trace) {
      right: 8%;
      bottom: 12%;
    }
  }
</style>

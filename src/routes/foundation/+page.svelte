<script lang="ts">
  import { onMount } from "svelte";
  import {
    AppShell,
    Button,
    Card,
    DataStream,
    Drawer,
    Grid,
    HorizonGrid,
    Input,
    Label,
    Modal,
    Popover,
    ShimmerCloud,
    Stack,
    Text,
    Textarea,
    Toast,
    toastStore,
  } from "$lib/index.js";
  import { onAppearanceChange } from "$lib/system/context.js";

  let modalOpen = $state(false);
  let drawerOpen = $state(false);
  let popoverOpen = $state(false);
  let popoverAnchor = $state<HTMLElement>();
  let contextProbe = $state<HTMLElement>();
  let contextNotifications = 0;
  let name = $state("");
  let notes = $state("");

  onMount(() => {
    if (!contextProbe) return;
    return onAppearanceChange(contextProbe, (context) => {
      contextNotifications += 1;
      if (contextProbe) {
        contextProbe.dataset.contextWeight = context.weight;
        contextProbe.dataset.contextTheme = context.theme;
        contextProbe.dataset.contextGrade = context.grade;
        contextProbe.dataset.contextNotifications =
          String(contextNotifications);
      }
    });
  });
</script>

<svelte:head>
  <title>foundation fixture | hyvui</title>
  <meta
    name="description"
    content="A browser foundation fixture for semantic layout, scoped appearance, native overlays, and ambient lifecycle behavior."
  />
</svelte:head>

<AppShell weight="field-notebook" theme="hextech" grade="dailies">
  <main class="foundation-page" data-foundation-fixture>
    <section class="foundation-hero" aria-labelledby="foundation-title">
      <div class="foundation-hero-atmosphere" aria-hidden="true">
        <HorizonGrid rows={14} cols={10} animated />
        <ShimmerCloud count={20} />
      </div>
      <Stack class="foundation-hero-copy" gap="var(--space-lg)">
        <Stack gap="var(--space-xs)">
          <Label color="signal">foundation / fixture 01</Label>
          <Text
            id="foundation-title"
            as="h1"
            variant="heading"
            expression="title-card"
          >
            art needs a floor
          </Text>
          <Text variant="italic" color="soft">
            ordinary browser rules. unusual atmosphere. no invisible machinery
            between them.
          </Text>
        </Stack>
        <Stack
          direction="horizontal"
          gap="var(--space-sm)"
          class="foundation-actions"
        >
          <Button
            id="foundation-open-modal"
            variant="primary"
            onclick={() => (modalOpen = true)}
          >
            open modal
          </Button>
          <Button
            id="foundation-open-drawer"
            variant="secondary"
            onclick={() => (drawerOpen = true)}
          >
            open drawer
          </Button>
        </Stack>
      </Stack>
      <div class="foundation-hero-mark" aria-hidden="true">
        <DataStream width="1.4rem" speed="slow" />
        <span class="foundation-rupture"></span>
      </div>
    </section>

    <section class="foundation-reading" aria-labelledby="reading-title">
      <Stack gap="var(--space-md)">
        <Label>normal flow / readable measure</Label>
        <Text id="reading-title" as="h2" variant="heading"
          >the page stays a page</Text
        >
        <Text>
          The atmosphere can recede. The reading order cannot. This paragraph
          remains in normal flow, keeps its measure, and gives the artwork
          somewhere to breathe around it.
        </Text>
        <Text>
          A component may make a decision about material or rhythm, but it does
          not quietly move the meaning of the document. The browser still gets
          to do the boring, miraculous work.
        </Text>
      </Stack>
    </section>

    <section class="foundation-grid-region" aria-labelledby="grid-title">
      <Stack gap="var(--space-md)">
        <Stack
          direction="horizontal"
          justify="between"
          align="end"
          gap="var(--space-sm)"
        >
          <div>
            <Label>intrinsic tracks</Label>
            <Text id="grid-title" as="h2" variant="heading"
              >four small instruments</Text
            >
          </div>
          <Text variant="caption" color="muted"
            >auto-fit / minmax / no probe</Text
          >
        </Stack>
        <Grid data-foundation-grid minColWidth="15rem" gap="var(--space-md)">
          <Card data-foundation-card>
            <Label color="signal">01 / spacing</Label>
            <Text as="h3" variant="heading">gaps do the work</Text>
            <Text
              >Sibling relationships stay in the grid. Margins keep their prose
              job.</Text
            >
          </Card>
          <Card data-foundation-card>
            <Label color="accent">02 / type</Label>
            <Text as="h3" variant="heading">roles shift, fonts do not</Text>
            <Text
              >Register variables change the voice without making every
              component invent a font.</Text
            >
          </Card>
          <Card data-foundation-card>
            <Label color="signal">03 / color</Label>
            <Text as="h3" variant="heading">sRGB first</Text>
            <Text
              >Enhancement may widen the gamut. Readability is already present
              underneath.</Text
            >
          </Card>
          <Card data-foundation-card>
            <Label color="accent">04 / motion</Label>
            <Text as="h3" variant="heading">silence is a state</Text>
            <Text
              >Hidden, still, and reduced-motion states are designed outcomes,
              not failures.</Text
            >
          </Card>
        </Grid>
      </Stack>
    </section>

    <section
      class="foundation-scoped"
      data-weight="archive"
      data-theme="arcane"
      data-grade="twilight"
      aria-labelledby="scoped-title"
    >
      <div class="foundation-scoped-glow" aria-hidden="true"></div>
      <Stack gap="var(--space-md)">
        <Label color="accent">nearest context / arcane twilight</Label>
        <Text id="scoped-title" as="h2" variant="heading"
          >a room can change its weather</Text
        >
        <Text>
          This section inherits its own weight, theme, and grade. The rest of
          the document remains hextech. The scope is visible in the material,
          not smuggled in through a global filter.
        </Text>
        <div
          bind:this={contextProbe}
          data-foundation-context-probe
          aria-hidden="true"
        ></div>
        <div bind:this={popoverAnchor} class="foundation-popover-anchor">
          <Button
            id="foundation-open-popover"
            variant="ghost"
            onclick={() => (popoverOpen = !popoverOpen)}
            aria-expanded={popoverOpen}
          >
            {popoverOpen ? "close witness" : "show witness"}
          </Button>
          <Button
            id="foundation-show-toast"
            variant="ghost"
            onclick={() =>
              toastStore.push("witness retained", "ok", 5000, contextProbe)}
          >
            leave a trace
          </Button>
        </div>
        <Popover
          open={popoverOpen}
          anchor={popoverAnchor}
          role="note"
          portal
          aria-label="scoped appearance witness"
          onclose={() => (popoverOpen = false)}
        >
          <Text variant="caption" color="accent">portal snapshot</Text>
          <Text
            >the floating surface keeps the archive, arcane, twilight context.</Text
          >
        </Popover>
      </Stack>
    </section>

    <section class="foundation-form" aria-labelledby="form-title">
      <Stack gap="var(--space-lg)">
        <div>
          <Label>native contract / two label paths</Label>
          <Text id="form-title" as="h2" variant="heading"
            >stable when the font is late</Text
          >
        </div>
        <Grid minColWidth="18rem" gap="var(--space-lg)">
          <Input
            id="foundation-name"
            label="operator name"
            name="operator"
            autocomplete="name"
            bind:value={name}
            placeholder="enter a name"
          />
          <Textarea
            label="field note"
            name="note"
            bind:value={notes}
            rows={5}
            placeholder="nested label path"
          />
        </Grid>
      </Stack>
    </section>
  </main>

  <Modal
    id="foundation-modal"
    open={modalOpen}
    title="the modal is native"
    describedBy="foundation-modal-description"
    onclose={() => (modalOpen = false)}
  >
    <Text id="foundation-modal-description"
      >Escape closes this surface and returns focus to its opener.</Text
    >
    {#snippet footer()}
      <Button variant="ghost" onclick={() => (modalOpen = false)}>close</Button>
    {/snippet}
  </Modal>

  <Drawer
    id="foundation-drawer"
    open={drawerOpen}
    side="right"
    ariaLabel="foundation drawer"
    onclose={() => (drawerOpen = false)}
  >
    <Stack gap="var(--space-md)">
      <Label color="signal">side placement</Label>
      <Text as="h2" variant="heading">the drawer is a dialog</Text>
      <Text
        >Safe-area padding, native cancel, shared scroll locking, and focus
        restoration belong together.</Text
      >
      <Button variant="ghost" onclick={() => (drawerOpen = false)}
        >close drawer</Button
      >
    </Stack>
  </Drawer>

  <Toast data-foundation-toast />
</AppShell>

<style>
  .foundation-page {
    width: min(100%, var(--shell-max));
    box-sizing: border-box;
    margin-inline: auto;
    padding-inline: var(--shell-pad);
    padding-block: var(--space-scene) var(--space-3xl);
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-3xl);
  }

  .foundation-hero {
    position: relative;
    container-type: inline-size;
    min-height: min(68svh, 42rem);
    display: grid;
    align-items: center;
    grid-template-columns: minmax(0, 1fr) minmax(5rem, 12rem);
    isolation: isolate;
    overflow: clip;
    border-block: 1px solid var(--line);
  }

  .foundation-hero-atmosphere {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  :global(.foundation-hero-copy) {
    max-width: 42rem;
    padding-block: var(--space-2xl);
  }

  .foundation-hero-mark {
    position: relative;
    align-self: stretch;
    display: grid;
    place-items: center;
    border-inline-start: 1px solid var(--line);
  }

  .foundation-rupture {
    position: absolute;
    inset-inline-start: -1px;
    inset-block-start: 24%;
    width: 2.5rem;
    height: 1px;
    background: var(--accent-strong);
    box-shadow: 0 0 1.5rem color-mix(in srgb, var(--accent) 60%, transparent);
  }

  .foundation-reading {
    max-width: 42rem;
    padding-inline: clamp(0rem, 8vw, 8rem);
  }

  .foundation-grid-region,
  .foundation-form {
    container-type: inline-size;
  }

  .foundation-scoped {
    position: relative;
    isolation: isolate;
    overflow: clip;
    padding: var(--space-2xl) clamp(var(--space-card), 8vw, 8rem);
    border: 1px solid var(--line-strong);
    background: var(--surface-card);
  }

  .foundation-scoped-glow {
    position: absolute;
    inset: 12% 15% auto auto;
    width: 18rem;
    height: 18rem;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      color-mix(in srgb, var(--accent) 18%, transparent),
      transparent 68%
    );
    filter: blur(1px);
    pointer-events: none;
    z-index: -1;
  }

  .foundation-popover-anchor {
    align-self: flex-start;
  }

  @container (max-width: 38rem) {
    .foundation-hero {
      grid-template-columns: 1fr;
      min-height: auto;
    }

    .foundation-hero-mark {
      min-height: 5rem;
      border-inline-start: 0;
      border-block-start: 1px solid var(--line);
    }
  }

  @media (max-width: 38rem) {
    :global(.foundation-actions) {
      flex-wrap: wrap;
    }
  }
</style>

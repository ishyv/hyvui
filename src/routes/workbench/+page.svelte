<script lang="ts">
  import {
    AppShell,
    Badge,
    Button,
    Card,
    Divider,
    Grid,
    Label,
    Stack,
    Surface,
    Text,
  } from "$lib/index.js";

  const bridgeContacts = [
    { id: "PAULSEN-9", bearing: 240, range: "11.4nmi", status: "hold" },
    { id: "KIRA-3", bearing: 187, range: "8.2nmi", status: "inbound" },
    { id: "OBS-RUN-7", bearing: 64, range: "22.1nmi", status: "drift" },
  ] as const;

  const keeperItems = [
    {
      ref: "mbr-i-04",
      title: "letter book iv",
      subtitle: "marbry to henridge · 1843–1851",
      condition: "damaged",
    },
    {
      ref: "mbr-i-05",
      title: "letter book v",
      subtitle: "marbry to henridge · 1852–1856",
      condition: "fragile",
    },
    {
      ref: "mbr-ii-12",
      title: "estate ledger xii",
      subtitle: "household accounts · 1849",
      condition: "stable",
    },
  ] as const;

  const correspondenceDrafts = [
    {
      label: "first",
      date: "10 march",
      preview: "i should have written sooner. there is no good reason i didn't.",
    },
    {
      label: "second",
      date: "12 march",
      preview:
        "lior. the days are getting longer. i can see the sycamore from the desk now.",
    },
    {
      label: "third",
      date: "14 march",
      preview:
        "i kept reading your last letter at the bakery, and the woman behind the counter asked...",
    },
  ] as const;

  const watchhouseSightings = [
    {
      id: "sighting-1",
      time: "tue · 23:14",
      place: "cistern below the third bridge",
      klass: "iii",
      note: "sustained luminance. magenta tone. witness / gellan. credible.",
    },
    {
      id: "sighting-2",
      time: "wed · 04:02",
      place: "roof of the dry stair, lowmarsh",
      klass: "i",
      note: "transient. likely lantern glare. closed.",
    },
    {
      id: "sighting-3",
      time: "wed · 19:48",
      place: "inner court, hessen exchange",
      klass: "ii",
      note: "hum reported. no visual. recommend re-survey at dusk.",
    },
  ] as const;

  type BridgeContact = (typeof bridgeContacts)[number];
  type KeeperItem = (typeof keeperItems)[number];
  type CorrespondenceDraft = (typeof correspondenceDrafts)[number];
  type WatchhouseSighting = (typeof watchhouseSightings)[number];

  let selectedBridge = $state<BridgeContact>(bridgeContacts[0]);
  let selectedKeeper = $state<KeeperItem>(keeperItems[0]);
  let selectedDraft = $state<CorrespondenceDraft>(correspondenceDrafts[0]);
  let selectedSighting = $state<WatchhouseSighting>(watchhouseSightings[0]);
</script>

<svelte:head>
  <title>relation workbench | hyvui</title>
  <meta
    name="description"
    content="Small executable relation examples for the HyvUI component library."
  />
</svelte:head>

<AppShell weight="field-notebook" vignette={false}>
  <main class="workbench">
    <header class="workbench-header">
      <Stack gap="var(--space-sm)">
        <Label color="signal">workbench / relation specimens</Label>
        <Text as="h1" variant="heading">same parts. change the tie.</Text>
        <Text color="soft">
          These four small cases show a source changing its paired target. The
          authored volumes remain read-only compositions. This is where the
          interaction contract is visible.
        </Text>
      </Stack>
    </header>

    <Divider pattern="scribed" />

    <div class="workbench-grid">
      <section class="workbench-case" data-workbench-case="bridge" aria-labelledby="bridge-case-title">
        <Stack gap="var(--space-md)">
          <div class="case-heading">
            <Stack gap="var(--space-2xs)">
              <Label color="accent">01 / bridge</Label>
              <Text id="bridge-case-title" as="h2" variant="heading">contact → bearing</Text>
            </Stack>
            <Badge variant="signal">selectable</Badge>
          </div>
          <div class="relation">
            <Card class="source-card">
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">contacts</Text>
                {#each bridgeContacts as contact}
                  <Button
                    class="workbench-source"
                    data-workbench-source={contact.id}
                    variant={selectedBridge.id === contact.id ? "secondary" : "ghost"}
                    size="sm"
                    aria-pressed={selectedBridge.id === contact.id}
                    onclick={() => (selectedBridge = contact)}
                  >
                    <span>{contact.id}</span>
                    <span class="source-meta">{contact.status}</span>
                  </Button>
                {/each}
              </Stack>
            </Card>
            <Surface
              variant="panel"
              class="target-card"
              data-workbench-target="bridge-radar"
              aria-live="polite"
            >
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">radar readout</Text>
                <Text class="target-value">{selectedBridge.id}</Text>
                <Text color="soft">
                  bearing {selectedBridge.bearing}° · range {selectedBridge.range}
                </Text>
                <Text variant="caption" color="accent">
                  selected contact carries the readout
                </Text>
              </Stack>
            </Surface>
          </div>
        </Stack>
      </section>

      <section class="workbench-case" data-workbench-case="keeper" aria-labelledby="keeper-case-title">
        <Stack gap="var(--space-md)">
          <div class="case-heading">
            <Stack gap="var(--space-2xs)">
              <Label color="accent">02 / keeper</Label>
              <Text id="keeper-case-title" as="h2" variant="heading">index → detail</Text>
            </Stack>
            <Badge variant="signal">selectable</Badge>
          </div>
          <div class="relation">
            <Card class="source-card">
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">catalogue</Text>
                {#each keeperItems as item}
                  <Button
                    class="workbench-source source-block"
                    data-workbench-source={item.ref}
                    variant={selectedKeeper.ref === item.ref ? "secondary" : "ghost"}
                    size="sm"
                    aria-pressed={selectedKeeper.ref === item.ref}
                    onclick={() => (selectedKeeper = item)}
                  >
                    <span>{item.ref}</span>
                    <span class="source-meta">{item.title}</span>
                  </Button>
                {/each}
              </Stack>
            </Card>
            <Surface
              variant="panel"
              class="target-card"
              data-workbench-target="keeper-detail"
              aria-live="polite"
            >
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">selected record</Text>
                <Text class="target-value">{selectedKeeper.title}</Text>
                <Text color="soft">{selectedKeeper.subtitle}</Text>
                <Badge variant={selectedKeeper.condition === "damaged" ? "warn" : "signal"}>
                  {selectedKeeper.condition}
                </Badge>
              </Stack>
            </Surface>
          </div>
        </Stack>
      </section>

      <section
        class="workbench-case"
        data-workbench-case="correspondence"
        aria-labelledby="correspondence-case-title"
      >
        <Stack gap="var(--space-md)">
          <div class="case-heading">
            <Stack gap="var(--space-2xs)">
              <Label color="accent">03 / correspondence</Label>
              <Text id="correspondence-case-title" as="h2" variant="heading">draft → letter</Text>
            </Stack>
            <Badge variant="signal">selectable</Badge>
          </div>
          <div class="relation">
            <Card class="source-card">
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">previous drafts</Text>
                {#each correspondenceDrafts as draft}
                  <Button
                    class="workbench-source source-block"
                    data-workbench-source={draft.label}
                    variant={selectedDraft.label === draft.label ? "secondary" : "ghost"}
                    size="sm"
                    aria-pressed={selectedDraft.label === draft.label}
                    onclick={() => (selectedDraft = draft)}
                  >
                    <span>{draft.label}</span>
                    <span class="source-meta">{draft.date}</span>
                  </Button>
                {/each}
              </Stack>
            </Card>
            <Surface
              variant="panel"
              class="target-card"
              data-workbench-target="correspondence-letter"
              aria-live="polite"
            >
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">letter state</Text>
                <Text class="target-value">draft {selectedDraft.label}</Text>
                <Text color="soft">{selectedDraft.date}</Text>
                <Text color="soft" class="target-copy">{selectedDraft.preview}</Text>
              </Stack>
            </Surface>
          </div>
        </Stack>
      </section>

      <section
        class="workbench-case"
        data-workbench-case="watchhouse"
        aria-labelledby="watchhouse-case-title"
      >
        <Stack gap="var(--space-md)">
          <div class="case-heading">
            <Stack gap="var(--space-2xs)">
              <Label color="accent">04 / watchhouse</Label>
              <Text id="watchhouse-case-title" as="h2" variant="heading">sighting → entry</Text>
            </Stack>
            <Badge variant="signal">selectable</Badge>
          </div>
          <div class="relation">
            <Card class="source-card">
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">recent sightings</Text>
                {#each watchhouseSightings as sighting}
                  <Button
                    class="workbench-source source-block"
                    data-workbench-source={sighting.id}
                    variant={selectedSighting.id === sighting.id ? "secondary" : "ghost"}
                    size="sm"
                    aria-pressed={selectedSighting.id === sighting.id}
                    onclick={() => (selectedSighting = sighting)}
                  >
                    <span>{sighting.time}</span>
                    <span class="source-meta">class {sighting.klass}</span>
                  </Button>
                {/each}
              </Stack>
            </Card>
            <Surface
              variant="panel"
              class="target-card"
              data-workbench-target="watchhouse-entry"
              aria-live="polite"
            >
              <Stack gap="var(--space-xs)">
                <Text variant="caption" color="muted">logbook entry</Text>
                <Text class="target-value">{selectedSighting.place}</Text>
                <Badge variant="accent">class {selectedSighting.klass}</Badge>
                <Text color="soft" class="target-copy">{selectedSighting.note}</Text>
              </Stack>
            </Surface>
          </div>
        </Stack>
      </section>
    </div>
  </main>
</AppShell>

<style>
  .workbench {
    width: min(100%, 76rem);
    box-sizing: border-box;
    margin-inline: auto;
    padding: var(--space-2xl) var(--shell-pad) var(--space-3xl);
  }

  .workbench-header {
    max-inline-size: 42rem;
    padding-block-end: var(--space-xl);
  }

  .workbench-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-xl);
    padding-block-start: var(--space-xl);
  }

  .workbench-case {
    min-width: 0;
    padding-block-start: var(--space-md);
    border-block-start: 1px solid var(--line);
  }

  .case-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-sm);
  }

  .relation {
    display: grid;
    grid-template-columns: minmax(8rem, 0.8fr) minmax(0, 1.2fr);
    gap: var(--space-sm);
    align-items: start;
  }

  :global(.source-card),
  :global(.target-card) {
    min-width: 0;
    padding: var(--space-md);
  }

  :global(.workbench-source) {
    width: 100%;
    justify-content: space-between;
    gap: var(--space-xs);
    text-align: left;
  }

  :global(.source-block) {
    align-items: flex-start;
    flex-direction: column;
  }

  .source-meta {
    color: var(--muted);
    font-family: var(--reg-font-ui);
    font-size: var(--text-2xs);
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  :global(.target-card) {
    min-height: 8rem;
  }

  :global(.target-value) {
    color: var(--text);
    font-family: var(--reg-font-ui);
    font-size: var(--text-md);
    letter-spacing: 0.08em;
    overflow-wrap: anywhere;
  }

  :global(.target-copy) {
    line-height: 1.5;
  }

  @media (max-width: 48rem) {
    .workbench-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 32rem) {
    .workbench {
      padding-block-start: var(--space-xl);
    }

    .relation {
      grid-template-columns: 1fr;
    }
  }
</style>

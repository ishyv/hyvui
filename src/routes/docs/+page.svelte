<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import {
    ActionBar,
    Alert,
    ArchiveScene,
    Avatar,
    Badge,
    Blockquote,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    CodeBlock,
    ConfirmDialog,
    CornerBrackets,
    DataStream,
    DepthLayer,
    DepthStage,
    Divider,
    Drawer,
    DropdownMenu,
    EmptyState,
    ErrorState,
    FileUpload,
    FloatCard,
    GlyphMark,
    Grid,
    GridOverlay,
    HorizonGrid,
    Icon,
    Input,
    Label,
    LogScene,
    MetricCard,
    Modal,
    NarrativeScene,
    PageHeader,
    Panel,
    ParallaxLayer,
    Plinth,
    Popover,
    ReadoutScene,
    ScanBand,
    SearchBar,
    Select,
    SidebarNav,
    SignalRing,
    Skeleton,
    Stack,
    StageScene,
    StatusDot,
    StatusLine,
    Surface,
    Table,
    Tabs,
    TerminalBoot,
    Text,
    Textarea,
    ThreadLine,
    Toast,
    Toggle,
    Topbar,
    Vignette,
    toastStore,
    ArcaneVein,
    BrassFiligree,
    CrystalShard,
    EnergyArc,
    HexGrid,
    RegisterSwitcher,
    ShimmerCloud,
  } from "$lib/index.js";
  import ShowcaseShell from "$lib/showcase/ShowcaseShell.svelte";
  import { getShowcaseManifest } from "$lib/showcase/showcaseManifest.js";

  const showcaseManifest = getShowcaseManifest("docs");

  const sections = [
    { id: "start-here", label: "start here" },
    { id: "overview", label: "overview" },
    { id: "registers", label: "registers" },
    { id: "primitives", label: "primitives" },
    { id: "layout", label: "layout" },
    { id: "display", label: "display" },
    { id: "inputs", label: "inputs" },
    { id: "feedback", label: "feedback" },
    { id: "navigation", label: "navigation" },
    { id: "overlays", label: "overlays" },
    { id: "ambient", label: "ambient" },
    { id: "depth", label: "depth" },
    { id: "scenes", label: "scenes" },
  ];

  let activeSection = $state("overview");
  const navItems = $derived(
    sections.map((section) => ({
      label: section.label,
      href: `#${section.id}`,
      active: section.id === activeSection,
    })),
  );

  let searchValue = $state("");
  const searchLoading = $derived(searchValue.trim().length > 0);

  const tabs = [
    { id: "usage", label: "usage" },
    { id: "tokens", label: "tokens" },
    { id: "states", label: "states" },
  ];
  let activeTab = $state("usage");

  const selectOptions = [
    { value: "observer", label: "observer" },
    { value: "navigator", label: "navigator" },
    { value: "engineer", label: "engineer" },
  ];

  const tableColumns = [
    { key: "component", label: "component" },
    { key: "purpose", label: "role" },
    { key: "status", label: "status", align: "right" as const },
  ];

  const tableRows = [
    { component: "Button", purpose: "primary action", status: "stable" },
    { component: "Panel", purpose: "section container", status: "stable" },
    { component: "StatusLine", purpose: "system voice", status: "calibrated" },
    { component: "DepthStage", purpose: "spatial stack", status: "active" },
  ];

  const bootLines = (
    [
      { status: "pend", message: "loading register" },
      { status: "ok", message: "tokens aligned" },
      { status: "ok", message: "surface stabilized" },
      { status: "warn", message: "signal drift within tolerance" },
      { status: "ok", message: "ready for operators" },
    ] as const
  ).map((line) => ({ ...line }));

  const usageCode =
    String.raw`<s` +
    `cript lang="ts">
  import { Button, Card, Text } from '$lib';
</s` +
    `cript>

<Card>
  <Text variant="heading" as="h2">operator panel</Text>
  <Button variant="primary">activate</Button>
</Card>`;

  const guideInstallCode = `npm install @hyvnt/hyvui
import "@hyvnt/hyvui/styles.css";`;
  const guideCompositionCode = String.raw`<Card>
  <Text variant="heading" as="h2">operator panel</Text>
  <Button variant="primary">activate</Button>
</Card>`;

  const tokenCode = String.raw`<Surface variant="panel" withInset>
  <Label color="muted">surface panel</Label>
  <Text variant="body">panel with inset border.</Text>
</Surface>`;

  let formName = $state("");
  let formRole = $state("observer");
  let formNote = $state("");
  let allowTelemetry = $state(true);
  let allowOrbit = $state(false);

  let selectAlpha = $state(true);
  let selectBeta = $state(false);
  let selectGamma = $state(true);
  const selectedCount = $derived(
    [selectAlpha, selectBeta, selectGamma].filter(Boolean).length,
  );

  let popoverOpen = $state(false);
  let popoverAnchor: HTMLElement | null = $state(null);
  let modalOpen = $state(false);
  let drawerOpen = $state(false);
  let confirmOpen = $state(false);

  function clearSelection() {
    selectAlpha = false;
    selectBeta = false;
    selectGamma = false;
  }

  function handleNavigate(item: { href: string }) {
    const id = item.href.replace("#", "");
    activeSection = id;
    if (!browser) return;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    history.replaceState(null, "", item.href);
  }

  function handleDropdownSelect(value: string) {
    toastStore.push(`menu action: ${value}`, "ok");
  }

  function handleToast() {
    toastStore.push("signal received", "ok");
  }

  onMount(() => {
    if (!browser) return;
    const updateFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (id) activeSection = id;
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);
    return () => window.removeEventListener("hashchange", updateFromHash);
  });
</script>

<svelte:head>
  <title>hyvui docs</title>
</svelte:head>

<ShowcaseShell manifest={showcaseManifest!} compactShell>
  <div class="docs">
  <Topbar class="docs-topbar">
    {#snippet left()}
      <div class="docs-topbar-left">
        <GlyphMark variant="coord" size={16} color="var(--accent)" />
        <Label color="accent"
          >hyv<span style="color:var(--accent)">u</span><span
            style="color:var(--signal)">i</span
          > docs</Label
        >
      </div>
    {/snippet}
    {#snippet center()}
      <Breadcrumb items={[{ label: "hyvui", href: "/" }, { label: "docs" }]} />
    {/snippet}
    {#snippet right()}
      <div class="docs-topbar-right">
        <SearchBar
          bind:value={searchValue}
          placeholder="find a component"
          loading={searchLoading}
          class="docs-search"
        />
        <Button variant="ghost" href="/">[ index ]</Button>
      </div>
    {/snippet}
  </Topbar>

  <div class="docs-shell">
    <aside class="docs-sidebar">
      <Label color="muted">contents</Label>
      <SidebarNav items={navItems} onnavigate={handleNavigate} />
      <Divider />
      <div class="docs-sidebar-meta">
        <StatusDot status="ok" size={7} />
        <Label>version 0.1.0</Label>
      </div>
    </aside>

    <main class="docs-content">
      <PageHeader
        title="documentation"
        subtitle="components, props, and live specimens. choose a section."
      >
        {#snippet breadcrumb()}
          <Label color="muted">component index</Label>
        {/snippet}

        {#snippet actions()}
          <Button variant="secondary" href="/workbench"
            >open relation workbench</Button
          >
          <Button variant="secondary" href="/system">[ system pages ]</Button>
          <Button variant="ghost" href="/">[ home ]</Button>
        {/snippet}
      </PageHeader>

      <section
        id="start-here"
        class="docs-section docs-field-guide"
        data-docs-field-guide
        aria-labelledby="start-here-title"
      >
        <div class="docs-section-head">
          <Label color="accent">field guide / first pass</Label>
          <Text id="start-here-title" variant="heading" as="h2">start here</Text>
          <Text variant="body" color="soft">
            install the floor, place the smallest composition, then add state
            and a real relation. the catalog below keeps the full component
            surface available when you need it.
          </Text>
        </div>
        <Grid
          mode="template"
          cols="repeat(2, minmax(0, 1fr))"
          gap="var(--space-md)"
          class="docs-guide-grid"
        >
          <Card>
            <Stack gap="var(--space-sm)">
              <Label color="signal">01 / install + import</Label>
              <Text variant="body" color="soft">one stylesheet. one public barrel.</Text>
              <CodeBlock code={guideInstallCode} language="shell" />
            </Stack>
          </Card>
          <Card>
            <Stack gap="var(--space-sm)">
              <Label color="signal">02 / smallest composition</Label>
              <Text variant="body" color="soft">a surface gives the parts somewhere to work.</Text>
              <CodeBlock code={guideCompositionCode} language="svelte" />
            </Stack>
          </Card>
          <Card>
            <Stack gap="var(--space-sm)">
              <Label color="signal">03 / props + states</Label>
              <Text variant="body" color="soft">
                use the component props for variants. use native attributes for
                identity, form behavior, and accessibility.
              </Text>
              <Button variant="ghost" href="#inputs">read input states</Button>
            </Stack>
          </Card>
          <Card>
            <Stack gap="var(--space-sm)">
              <Label color="signal">04 / one relation</Label>
              <Text variant="body" color="soft">
                a component is a part. the relation gives it work.
              </Text>
              <Button variant="secondary" href="/workbench"
                >open relation workbench</Button
              >
            </Stack>
          </Card>
        </Grid>
        <Stack direction="horizontal" gap="var(--space-sm)" wrap={true} class="docs-guide-next">
          <Button variant="ghost" href="#advanced-families">advanced families</Button>
          <Button variant="ghost" href="#scenes">authored scenes</Button>
        </Stack>
      </section>

      <Divider />

      <section id="overview" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">overview</Label>
          <Text variant="heading" as="h2">the index</Text>
          <Text variant="body" color="soft">
            choose a section. examples and props sit beside the specimen.
          </Text>
        </div>
        <Stack gap="var(--space-md)" class="docs-block">
          <div class="docs-row">
            <Badge variant="accent">v0.1</Badge>
            <Badge variant="signal">svelte 5</Badge>
            <StatusDot status="ok" size={7} />
            <Label>stable</Label>
          </div>
          <Alert variant="info" title="use the parts">
            spacing sets hierarchy. labels mark the fields. contrast marks a change.
          </Alert>
        </Stack>
      </section>

      <Divider />

      <section id="registers" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">weights and themes</Label>
          <Text variant="heading" as="h2">change the weight. keep the theme.</Text>
          <Text variant="body" color="soft">
            weight changes density and voice. theme changes palette, motion, and
            ornament. try both.
          </Text>
        </div>
        <div class="docs-registers-demo">
          <RegisterSwitcher />
          <p class="docs-registers-note">
            set weight and theme separately. components stay the same. import the
            theme tokens before using hextech or arcane.
          </p>
          <div class="docs-registers-tokens">
            <code class="docs-reg-code"
              >import '@hyvnt/hyvui/tokens/hextech.css'</code
            >
            <code class="docs-reg-code"
              >import '@hyvnt/hyvui/tokens/arcane.css'</code
            >
          </div>
        </div>
      </section>

      <Divider />

      <section id="primitives" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">primitives</Label>
          <Text variant="heading" as="h2">text and surfaces</Text>
        </div>
        <Grid
          mode="template"
          cols="minmax(0, 1.2fr) minmax(0, 1fr)"
          gap="var(--space-xl)"
        >
          <Stack gap="var(--space-sm)" class="docs-primitives-copy">
            <Text variant="heading" as="h3">heading tier</Text>
            <Text variant="body" color="soft">
              body text. short lines. leave room between them.
            </Text>
            <Text variant="italic" color="muted"
              >use italics for a side note.</Text
            >
            <Text variant="caption" color="muted-strong">caption register</Text>
            <div class="docs-row">
              <Icon size={18} color="var(--accent)">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12h16M12 4v16" stroke-width="1.5" />
                </svg>
              </Icon>
              <Label>icon primitive</Label>
            </div>
            <Divider />
            <Label color="muted">label + divider primitives</Label>
          </Stack>
          <Grid cols={3} gap="var(--space-sm)" class="docs-surface-grid">
            <Surface variant="base" class="docs-surface-card">
              <Label color="muted">base</Label>
              <Text variant="caption" color="muted">surface</Text>
            </Surface>
            <Surface variant="card" class="docs-surface-card">
              <Label color="muted">card</Label>
              <Text variant="caption" color="muted">surface</Text>
            </Surface>
            <Surface variant="panel" withInset class="docs-surface-card">
              <Label color="muted">panel</Label>
              <Text variant="caption" color="muted">surface</Text>
            </Surface>
          </Grid>
        </Grid>
      </section>

      <Divider />

      <section id="layout" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">layout</Label>
          <Text variant="heading" as="h2">stack, grid, card, panel</Text>
        </div>
        <Grid cols={3} gap="var(--space-md)" class="docs-card-grid">
          <Card>
            {#snippet header()}
              <Label color="muted">card</Label>
            {/snippet}
            <Text variant="body" color="soft"
              >use card for a repeated item or a small group.</Text
            >
          </Card>
          <Card>
            {#snippet header()}
              <Label color="muted">grid</Label>
            {/snippet}
            <Text variant="body" color="soft"
              >use grid for columns. pass equal column count or a template.</Text
            >
          </Card>
          <Card>
            {#snippet header()}
              <Label color="muted">stack</Label>
            {/snippet}
            <Text variant="body" color="soft"
              >stack places children in a row or column and applies the gap.</Text
            >
          </Card>
        </Grid>
        <Panel withInset>
          {#snippet header()}
            <Label color="accent">panel layout</Label>
          {/snippet}
          <Stack gap="var(--space-sm)">
            <Text variant="body" color="soft"
              >use panel for a large section, form, or table.</Text
            >
            <Stack direction="horizontal" gap="var(--space-sm)" wrap={true}>
              <Badge variant="accent">surface</Badge>
              <Badge variant="signal">spacing</Badge>
              <Badge variant="ok">rhythm</Badge>
            </Stack>
          </Stack>
        </Panel>
      </section>

      <Divider />

      <section id="display" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">display</Label>
          <Text variant="heading" as="h2">data, status, narrative</Text>
        </div>
        <div class="docs-row">
          <Avatar name="Avery Rowe" size={36} />
          <Badge variant="signal">operator</Badge>
          <Badge variant="ok">active</Badge>
        </div>
        <Grid cols={3} gap="var(--space-md)">
          <MetricCard
            label="sessions"
            value="248"
            trend="up"
            trendValue="+12%"
          />
          <MetricCard
            label="latency"
            value="82ms"
            trend="down"
            trendValue="-6%"
          />
          <MetricCard label="drift" value="0.32" trend="neutral" />
        </Grid>
        <Blockquote>
          show the state the user needs. hide the rest.
        </Blockquote>
        <Table columns={tableColumns} rows={tableRows} />
        <CodeBlock code={usageCode} language="svelte" />
      </section>

      <Divider />

      <section id="inputs" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">inputs</Label>
          <Text variant="heading" as="h2">controlled fields and actions</Text>
        </div>
        <Panel>
          {#snippet header()}
            <Label color="muted">form module</Label>
          {/snippet}
          <Grid
            mode="template"
            cols="minmax(0, 1fr) minmax(0, 1fr)"
            gap="var(--space-lg)"
          >
            <Stack gap="var(--space-sm)">
              <Input
                label="operator name"
                placeholder="Avery"
                bind:value={formName}
              />
              <Select
                label="role"
                options={selectOptions}
                bind:value={formRole}
              />
              <Textarea
                label="notes"
                placeholder="field notes"
                bind:value={formNote}
                autoresize={true}
              />
            </Stack>
            <Stack gap="var(--space-sm)">
              <Checkbox label="allow telemetry" bind:checked={allowTelemetry} />
              <Toggle label="orbit assists" bind:checked={allowOrbit} />
              <FileUpload label="drop briefings here" multiple={true} />
              <Stack direction="horizontal" gap="var(--space-sm)" wrap={true}>
                <Button variant="primary" echo={true}>submit</Button>
                <Button variant="secondary">secondary</Button>
                <Button variant="ghost">ghost</Button>
                <Button variant="destructive">destructive</Button>
              </Stack>
            </Stack>
          </Grid>
        </Panel>
      </section>

      <Divider />

      <section id="feedback" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">feedback</Label>
          <Text variant="heading" as="h2">status, alerts, and system voice</Text
          >
        </div>
        <Grid
          mode="template"
          cols="minmax(0, 1fr) minmax(0, 1fr)"
          gap="var(--space-lg)"
        >
          <Stack gap="var(--space-sm)">
            <Alert variant="ok" title="signal stable"
              >upstream route steady. latency normal.</Alert
            >
            <Alert variant="warn" title="drift noted">
              the stream is noisy but within tolerance.
            </Alert>
            <StatusLine
              status="warn"
              message="contrast delta near threshold"
              visible={true}
              cursor={true}
            />
            <TerminalBoot lines={bootLines} instant={true} />
          </Stack>
          <Stack gap="var(--space-sm)">
            <div class="docs-row">
              <StatusDot status="ok" size={8} />
              <StatusDot status="pend" size={8} />
              <StatusDot status="warn" size={8} />
              <StatusDot status="fail" size={8} />
            </div>
            <Stack direction="horizontal" gap="var(--space-sm)">
              <Skeleton width="60px" height="60px" variant="circle" />
              <Stack gap="0.4rem" class="docs-skeleton-stack">
                <Skeleton width="100%" height="0.8rem" />
                <Skeleton width="70%" height="0.8rem" />
                <Skeleton width="90%" height="0.8rem" />
              </Stack>
            </Stack>
            <Button variant="ghost" onclick={handleToast}>show toast</Button>
          </Stack>
        </Grid>
        <Grid cols={2} gap="var(--space-md)" class="docs-state-grid">
          <EmptyState title="no entries" description="no records yet." />
          <ErrorState
            title="signal deferred"
            description="try again when the channel is steady."
            retry={true}
          />
        </Grid>
      </section>

      <Divider />

      <section id="navigation" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">navigation</Label>
          <Text variant="heading" as="h2">tabs, breadcrumb, menu</Text>
        </div>
        <Tabs {tabs} active={activeTab} onchange={(id) => (activeTab = id)} />
        <Grid
          mode="template"
          cols="minmax(0, 1fr) minmax(0, 1fr)"
          gap="var(--space-lg)"
        >
          <Stack gap="var(--space-sm)">
            <Breadcrumb
              items={[
                { label: "register", href: "/docs" },
                { label: "navigation" },
              ]}
            />
            <SearchBar
              bind:value={searchValue}
              placeholder="find a section"
              loading={searchLoading}
            />
          </Stack>
          <div class="docs-menu-wrap">
            <DropdownMenu
              items={[
                { label: "export", value: "export" },
                { label: "duplicate", value: "duplicate" },
                { label: "archive", value: "archive", destructive: true },
              ]}
              onselect={handleDropdownSelect}
              class="docs-dropdown"
            >
              {#snippet trigger()}
                <span>[ menu ]</span>
              {/snippet}
            </DropdownMenu>
          </div>
        </Grid>
      </section>

      <Divider />

      <section id="overlays" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">overlays</Label>
          <Text variant="heading" as="h2"
            >modal, drawer, popover, action bar</Text
          >
        </div>
        <Stack direction="horizontal" gap="var(--space-sm)" wrap={true}>
          <Button variant="secondary" onclick={() => (modalOpen = true)}
            >[ open modal ]</Button
          >
          <Button variant="secondary" onclick={() => (drawerOpen = true)}
            >[ open drawer ]</Button
          >
          <Button variant="ghost" onclick={() => (confirmOpen = true)}
            >[ confirm ]</Button
          >
          <div class="docs-popover-wrap">
            <span bind:this={popoverAnchor} class="docs-popover-anchor">
              <Button
                variant="ghost"
                onclick={() => (popoverOpen = !popoverOpen)}>[ info ]</Button
              >
            </span>
            <Popover
              open={popoverOpen}
              anchor={popoverAnchor}
              placement="bottom"
              onclose={() => (popoverOpen = false)}
            >
              <Text variant="caption" color="muted-strong">secondary note</Text>
            </Popover>
          </div>
        </Stack>
        <Panel>
          {#snippet header()}
            <Label color="muted">selection test</Label>
          {/snippet}
          <Stack gap="var(--space-sm)">
            <Checkbox label="alpha register" bind:checked={selectAlpha} />
            <Checkbox label="beta register" bind:checked={selectBeta} />
            <Checkbox label="gamma register" bind:checked={selectGamma} />
          </Stack>
        </Panel>
      </section>

      <Divider />

      <div id="advanced-families" class="docs-advanced-anchor" aria-hidden="true"></div>
      <section id="ambient" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">ambient</Label>
          <Text variant="heading" as="h2">ornament and atmosphere</Text>
        </div>
        <div class="docs-ambient-preview">
          <GridOverlay />
          <Vignette />
          <ScanBand axis="x" size="16%" duration="6s" />
          <CornerBrackets size={18} color="rgba(199, 156, 87, 0.24)" />
          <div style="--px: 0.15; --py: -0.12;" aria-hidden="true">
            <ParallaxLayer>
              <SignalRing size={120} color="var(--accent)" />
            </ParallaxLayer>
          </div>
          <ThreadLine x1="10%" y1="20%" x2="90%" y2="80%" />
          <div class="docs-ambient-glyph">
            <GlyphMark variant="reticle" size={22} color="var(--signal)" />
          </div>
          <div class="docs-ambient-streams">
            <DataStream />
            <DataStream />
          </div>
        </div>

        <div class="docs-section-subhead">
          <Label color="muted">hextech + arcane ambient</Label>
        </div>
        <div class="docs-new-ambient-grid">
          <div class="docs-new-ambient-item" data-theme="hextech">
            <div class="docs-new-ambient-canvas"><HexGrid /></div>
            <Label color="muted">HexGrid</Label>
          </div>
          <div class="docs-new-ambient-item" data-theme="hextech">
            <div class="docs-new-ambient-canvas">
              <BrassFiligree size={32} />
            </div>
            <Label color="muted">BrassFiligree</Label>
          </div>
          <div class="docs-new-ambient-item" data-theme="arcane">
            <div
              class="docs-new-ambient-canvas docs-new-ambient-canvas--center"
            >
              <CrystalShard size={60} />
            </div>
            <Label color="muted">CrystalShard</Label>
          </div>
          <div class="docs-new-ambient-item" data-theme="arcane">
            <div class="docs-new-ambient-canvas">
              <ArcaneVein x1="10%" y1="50%" x2="90%" y2="50%" />
            </div>
            <Label color="muted">ArcaneVein</Label>
          </div>
          <div class="docs-new-ambient-item" data-theme="hextech">
            <div class="docs-new-ambient-canvas">
              <EnergyArc x1="15%" y1="75%" x2="85%" y2="25%" />
            </div>
            <Label color="muted">EnergyArc</Label>
          </div>
          <div class="docs-new-ambient-item" data-theme="arcane">
            <div class="docs-new-ambient-canvas">
              <ShimmerCloud />
            </div>
            <Label color="muted">ShimmerCloud</Label>
          </div>
        </div>
      </section>

      <Divider />

      <section id="depth" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">depth</Label>
          <Text variant="heading" as="h2">layers in depth</Text>
        </div>
        <DepthStage class="docs-depth-stage">
          <DepthLayer level="ground" class="docs-depth-layer">
            <HorizonGrid animated={true} />
          </DepthLayer>
          <DepthLayer level="raised" class="docs-depth-layer">
            <FloatCard>
              <Label color="accent">float card</Label>
              <Text variant="body" color="soft">move the pointer over the card.</Text>
            </FloatCard>
          </DepthLayer>
          <DepthLayer level="foreground" class="docs-depth-layer">
            <Plinth width="70%" depth="46px" color="rgba(199, 156, 87, 0.06)" />
          </DepthLayer>
        </DepthStage>
      </section>

      <Divider />

      <section id="scenes" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">scenes</Label>
          <Text variant="heading" as="h2">scene patterns</Text>
        </div>
        <div class="docs-scene">
          <StageScene>
            {#snippet label()}
              <Label color="signal">stage scene</Label>
            {/snippet}
            {#snippet heading()}
              <Text variant="heading" as="h3">centered register</Text>
            {/snippet}
            {#snippet subheading()}
              <Text variant="body" color="soft"
                >one message. centered. no side rail.</Text
              >
            {/snippet}
            {#snippet actions()}
              <Button variant="ghost">[ acknowledge ]</Button>
            {/snippet}
          </StageScene>
        </div>
        <div class="docs-scene">
          <NarrativeScene chapter="chapter 01">
            {#snippet heading()}
              <Text variant="heading" as="h3">narrative scene</Text>
            {/snippet}
            {#snippet copy()}
              <Text variant="body" color="soft">
                copy stays narrow. the open side holds an image or specimen.
              </Text>
            {/snippet}
            {#snippet canvas()}
              <Surface variant="panel" class="docs-scene-canvas">
                <Label color="muted">canvas</Label>
              </Surface>
            {/snippet}
          </NarrativeScene>
        </div>
        <div class="docs-scene">
          <ReadoutScene title="readout">
            {#snippet header()}
              <StatusDot status="ok" size={6} />
              <Label>signal clean</Label>
            {/snippet}
            {#snippet children()}
              <Text variant="body" color="soft"
                >dense layout for data-heavy screens.</Text
              >
            {/snippet}
            {#snippet sidebar()}
              <Stack gap="var(--space-sm)">
                <Label color="muted">side panel</Label>
                <Text variant="caption" color="muted">aux modules</Text>
              </Stack>
            {/snippet}
          </ReadoutScene>
        </div>
        <div class="docs-scene">
          <ArchiveScene
            title="archive"
            template="repeat(2, minmax(0, 1fr))"
          >
            {#snippet filter()}
              <Button variant="ghost">[ filter ]</Button>
            {/snippet}
            <Card>
              <Text variant="body" color="soft">archive item one</Text>
            </Card>
            <Card>
              <Text variant="body" color="soft">archive item two</Text>
            </Card>
          </ArchiveScene>
        </div>
        <div class="docs-scene">
          <LogScene>
            {#snippet header()}
              <Label color="muted">log scene</Label>
              <StatusDot status="pend" size={6} />
            {/snippet}
            {#snippet children()}
              <StatusLine
                status="pend"
                message="syncing modules"
                visible={true}
              />
              <StatusLine status="ok" message="cache locked" visible={true} />
              <StatusLine status="ok" message="session stable" visible={true} />
            {/snippet}
            {#snippet footer()}
              <Button variant="ghost">[ close log ]</Button>
            {/snippet}
          </LogScene>
        </div>
      </section>
    </main>
  </div>

  <Modal
    open={modalOpen}
    title="one decision"
    onclose={() => (modalOpen = false)}
  >
    <Text variant="body" color="soft">one decision at a time.</Text
    >
    {#snippet footer()}
      <Button variant="ghost" onclick={() => (modalOpen = false)}
        >dismiss</Button
      >
      <Button variant="primary" onclick={() => (modalOpen = false)}
        >confirm</Button
      >
    {/snippet}
  </Modal>

  <Drawer open={drawerOpen} onclose={() => (drawerOpen = false)}>
    <Stack gap="var(--space-sm)">
      <Label color="accent">secondary panel</Label>
      <Text variant="body" color="soft"
        >secondary content enters from the side.</Text
      >
      <Button variant="ghost" onclick={() => (drawerOpen = false)}
        >[ close ]</Button
      >
    </Stack>
  </Drawer>

  <ConfirmDialog
    open={confirmOpen}
    title="apply update"
    description="write these changes to the register."
    confirmLabel="apply"
    cancelLabel="cancel"
    onconfirm={() => {
      confirmOpen = false;
      toastStore.push("update applied", "ok");
    }}
    oncancel={() => (confirmOpen = false)}
  />

  <ActionBar count={selectedCount} onclear={clearSelection}>
    {#snippet actions()}
      <Button variant="ghost" size="sm">export</Button>
      <Button variant="ghost" size="sm">archive</Button>
    {/snippet}
  </ActionBar>

  <Toast />
</div>
</ShowcaseShell>

<style>
  .docs {
    position: relative;
    min-height: 100dvh;
  }

  :global(.docs-topbar) {
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .docs-topbar-left,
  .docs-topbar-right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  :global(.docs-search) {
    width: min(18rem, 42vw);
  }

  .docs-shell {
    max-width: var(--shell-max);
    margin: 0 auto;
    padding: var(--space-2xl) var(--shell-pad) var(--space-4xl);
    display: grid;
    grid-template-columns: minmax(12rem, 14rem) minmax(0, 1fr);
    gap: var(--space-2xl);
  }

  .docs-sidebar {
    position: sticky;
    top: calc(var(--space-xl) + 4.5rem);
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .docs-sidebar-meta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
  }

  .docs-content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2xl);
    padding-bottom: 6rem;
  }

  .docs-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
    scroll-margin-top: 7rem;
  }

  .docs-section-head {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .docs-row {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  :global(.docs-primitives-copy) {
    min-width: 0;
  }

  :global(.docs-primitives-copy .hyvui-label) {
    white-space: normal;
    overflow-wrap: anywhere;
  }

  :global(.docs-block) {
    padding: var(--space-lg);
    border: 1px solid var(--line);
    background: var(--surface-card);
  }

  :global(.docs-surface-grid) {
    align-items: stretch;
  }

  :global(.docs-surface-card) {
    padding: var(--space-md);
    display: grid;
    gap: var(--space-xs);
    text-align: left;
  }

  :global(.docs-card-grid) {
    align-items: stretch;
  }

  :global(.docs-skeleton-stack) {
    flex: 1;
  }

  :global(.docs-state-grid) {
    align-items: stretch;
  }

  .docs-menu-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
  }

  :global(.docs-dropdown) {
    top: calc(100% + 0.5rem);
    right: 0;
  }

  .docs-popover-wrap {
    position: relative;
    display: inline-flex;
  }

  .docs-ambient-preview {
    position: relative;
    min-height: 220px;
    border: 1px solid var(--line);
    background: var(--surface-panel);
    overflow: hidden;
    isolation: isolate;
  }

  .docs-ambient-preview :global(.hyvui-vignette) {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .docs-ambient-preview :global(.hyvui-scan-band) {
    z-index: 2;
  }

  .docs-ambient-glyph {
    position: absolute;
    top: 20%;
    right: 18%;
    z-index: 3;
  }

  .docs-ambient-streams {
    position: absolute;
    bottom: 12%;
    left: 10%;
    display: flex;
    gap: 0.6rem;
    z-index: 3;
  }

  .docs-section-subhead {
    margin-top: var(--space-lg);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--line);
  }

  .docs-new-ambient-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }

  .docs-new-ambient-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    border: 1px solid var(--line);
    background: var(--surface-panel);
    padding: var(--space-sm);
  }

  .docs-new-ambient-canvas {
    position: relative;
    height: 80px;
    overflow: hidden;
  }

  .docs-new-ambient-canvas--center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .docs-registers-demo {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
    border: 1px solid var(--line);
    background: var(--surface-panel);
  }

  .docs-registers-note {
    margin: 0;
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
  }

  .docs-registers-tokens {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .docs-reg-code {
    font-family: var(--font-mono);
    font-size: 0.76rem;
    color: var(--signal);
    background: rgba(121, 166, 163, 0.08);
    padding: 0.25em 0.5em;
    border: 1px solid rgba(121, 166, 163, 0.18);
  }

  :global(.docs-depth-stage) {
    position: relative;
    min-height: 240px;
    border: 1px solid var(--line);
    background: var(--surface-panel);
    overflow: hidden;
    contain: paint;
    clip-path: inset(0);
  }

  :global(.docs-depth-layer) {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .docs-scene {
    border: 1px solid var(--line);
    background: var(--surface-panel);
  }

  .docs-scene :global(.hyvui-stage),
  .docs-scene :global(.hyvui-narrative),
  .docs-scene :global(.hyvui-readout),
  .docs-scene :global(.hyvui-archive),
  .docs-scene :global(.hyvui-log) {
    min-height: auto;
    padding: var(--space-xl);
  }

  .docs-scene :global(.hyvui-readout),
  .docs-scene :global(.hyvui-log) {
    background-color: transparent;
  }

  :global(.docs-scene-canvas) {
    min-height: 160px;
  }

  @media (max-width: 960px) {
    .docs-shell {
      grid-template-columns: 1fr;
      padding: var(--space-lg) var(--shell-pad) var(--space-2xl);
      gap: var(--space-lg);
    }

    .docs-sidebar {
      position: static;
      order: 2;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-sm);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--line);
    }

    .docs-content {
      order: 1;
      gap: var(--space-xl);
    }
  }

  @media (max-width: 720px) {
    .docs-topbar-left,
    .docs-topbar-right {
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    :global(.docs-search) {
      width: 100%;
    }

    :global(.docs-guide-grid) {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    :global(.docs-surface-grid) {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    :global(.docs .hyvui-codeblock-code) {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .docs-shell {
      padding: var(--space-md) var(--space-sm) var(--space-xl);
    }

    .docs-section {
      gap: var(--space-md);
    }


    .docs-new-ambient-grid {
      grid-template-columns: 1fr;
    }

    .docs-new-ambient-item {
      min-width: 0;
    }

    .docs-ambient-preview {
      min-height: 160px;
    }

    :global(.docs-depth-stage) {
      min-height: 180px;
    }

    .docs-scene :global(.hyvui-stage),
    .docs-scene :global(.hyvui-narrative),
    .docs-scene :global(.hyvui-readout),
    .docs-scene :global(.hyvui-archive),
    .docs-scene :global(.hyvui-log) {
      padding: var(--space-md);
    }

    :global(.docs-scene-canvas) {
      min-height: 100px;
    }

    :global(.docs-block) {
      padding: var(--space-md);
    }
  }
</style>

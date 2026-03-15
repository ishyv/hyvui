<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
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
  } from '$lib/index.js';

  const sections = [
    { id: 'overview', label: 'overview' },
    { id: 'primitives', label: 'primitives' },
    { id: 'layout', label: 'layout' },
    { id: 'display', label: 'display' },
    { id: 'inputs', label: 'inputs' },
    { id: 'feedback', label: 'feedback' },
    { id: 'navigation', label: 'navigation' },
    { id: 'overlays', label: 'overlays' },
    { id: 'ambient', label: 'ambient' },
    { id: 'depth', label: 'depth' },
    { id: 'scenes', label: 'scenes' },
  ];

  let activeSection = $state('overview');
  const navItems = $derived(
    sections.map((section) => ({
      label: section.label,
      href: `#${section.id}`,
      active: section.id === activeSection,
    }))
  );

  let searchValue = $state('');
  const searchLoading = $derived(searchValue.trim().length > 0);

  const tabs = [
    { id: 'usage', label: 'usage' },
    { id: 'tokens', label: 'tokens' },
    { id: 'states', label: 'states' },
  ];
  let activeTab = $state('usage');

  const selectOptions = [
    { value: 'observer', label: 'observer' },
    { value: 'navigator', label: 'navigator' },
    { value: 'engineer', label: 'engineer' },
  ];

  const tableColumns = [
    { key: 'component', label: 'component' },
    { key: 'purpose', label: 'role' },
    { key: 'status', label: 'status', align: 'right' },
  ];

  const tableRows = [
    { component: 'Button', purpose: 'primary action', status: 'stable' },
    { component: 'Panel', purpose: 'section container', status: 'stable' },
    { component: 'StatusLine', purpose: 'system voice', status: 'calibrated' },
    { component: 'DepthStage', purpose: 'spatial stack', status: 'active' },
  ];

  const bootLines = [
    { status: 'pend', message: 'loading register' },
    { status: 'ok', message: 'tokens aligned' },
    { status: 'ok', message: 'surface stabilized' },
    { status: 'warn', message: 'signal drift within tolerance' },
    { status: 'ok', message: 'ready for operators' },
  ] as const;

  const usageCode = String.raw`<s` + `cript lang="ts">
  import { Button, Card, Text } from '$lib';
</s` + `cript>

<Card>
  <Text variant="heading" as="h2">calm surface</Text>
  <Button variant="primary">activate</Button>
</Card>`;

  const tokenCode = String.raw`<Surface variant="panel" withInset>
  <Label color="muted">surface panel</Label>
  <Text variant="body">stacked layers, quiet contrast.</Text>
</Surface>`;

  let formName = $state('');
  let formRole = $state('observer');
  let formNote = $state('');
  let allowTelemetry = $state(true);
  let allowOrbit = $state(false);

  let selectAlpha = $state(true);
  let selectBeta = $state(false);
  let selectGamma = $state(true);
  const selectedCount = $derived(
    [selectAlpha, selectBeta, selectGamma].filter(Boolean).length
  );

  let dropdownOpen = $state(false);
  let popoverOpen = $state(false);
  let modalOpen = $state(false);
  let drawerOpen = $state(false);
  let confirmOpen = $state(false);

  function clearSelection() {
    selectAlpha = false;
    selectBeta = false;
    selectGamma = false;
  }

  function handleNavigate(item: { href: string }) {
    const id = item.href.replace('#', '');
    activeSection = id;
    if (!browser) return;
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    history.replaceState(null, '', item.href);
  }

  function handleDropdownSelect(value: string) {
    dropdownOpen = false;
    toastStore.push(`menu action: ${value}`, 'ok');
  }

  function handleToast() {
    toastStore.push('signal received', 'ok');
  }

  onMount(() => {
    if (!browser) return;
    const updateFromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (id) activeSection = id;
    };
    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);
    return () => window.removeEventListener('hashchange', updateFromHash);
  });
</script>

<svelte:head>
  <title>hyvui docs</title>
</svelte:head>

<div class="docs">
  <Topbar class="docs-topbar">
    {#snippet left()}
      <div class="docs-topbar-left">
        <GlyphMark variant="coord" size={16} color="var(--accent)" />
        <Label color="accent">hyvui docs</Label>
      </div>
    {/snippet}
    {#snippet center()}
      <Breadcrumb items={[{ label: 'hyvui', href: '/' }, { label: 'docs' }]} />
    {/snippet}
    {#snippet right()}
      <div class="docs-topbar-right">
        <SearchBar
          bind:value={searchValue}
          placeholder="search docs"
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
        subtitle="every component, live. pick a section on the left."
      >
        {#snippet breadcrumb()}
          <Label color="muted">component register</Label>
        {/snippet}

        {#snippet actions()}
          <Button variant="secondary" href="/system">[ system pages ]</Button>
          <Button variant="ghost" href="/">[ home ]</Button>
        {/snippet}
      </PageHeader>

      <section id="overview" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">overview</Label>
          <Text variant="heading" as="h2">everything in one place</Text>
          <Text variant="body" color="soft">
            all components live, with props and examples. scroll or jump via the sidebar.
          </Text>
        </div>
        <Stack gap="var(--space-md)" class="docs-block">
          <div class="docs-row">
            <Badge variant="accent">v0.1</Badge>
            <Badge variant="signal">svelte 5</Badge>
            <StatusDot status="ok" size={7} />
            <Label>stable</Label>
          </div>
          <Alert variant="info" title="design posture">
            spacing carries the hierarchy. labels stay uppercase. contrast is intentional, not decorative.
          </Alert>
        </Stack>
      </section>

      <Divider />

      <section id="primitives" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">primitives</Label>
          <Text variant="heading" as="h2">type, tone, and base surfaces</Text>
        </div>
        <Grid cols="minmax(0, 1.2fr) minmax(0, 1fr)" gap="var(--space-xl)">
          <Stack gap="var(--space-sm)">
            <Text variant="heading" as="h3">heading tier</Text>
            <Text variant="body" color="soft">
              body text. short lines, deliberate spacing. nothing squeezed together.
            </Text>
            <Text variant="italic" color="muted">
              italics are for the quieter line.
            </Text>
            <Text variant="caption" color="muted-strong">
              caption register
            </Text>
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
            <Text variant="body" color="soft">contained surfaces. good for repeatable rows and grid items.</Text>
          </Card>
          <Card>
            {#snippet header()}
              <Label color="muted">grid</Label>
            {/snippet}
            <Text variant="body" color="soft">column-based layouts. pass a number for equal columns or a full template string.</Text>
          </Card>
          <Card>
            {#snippet header()}
              <Label color="muted">stack</Label>
            {/snippet}
            <Text variant="body" color="soft">flexbox with a gap. vertical or horizontal, no visual treatment.</Text>
          </Card>
        </Grid>
        <Panel withInset>
          {#snippet header()}
            <Label color="accent">panel layout</Label>
          {/snippet}
          <Stack gap="var(--space-sm)">
            <Text variant="body" color="soft">full-section container for forms, data tables, and anything that needs room.</Text>
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
          <MetricCard label="sessions" value="248" trend="up" trendValue="+12%" />
          <MetricCard label="latency" value="82ms" trend="down" trendValue="-6%" />
          <MetricCard label="drift" value="0.32" trend="neutral" />
        </Grid>
        <Blockquote>
          the interface is a quiet contract between what's there and what's needed.
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
          <Grid cols="minmax(0, 1fr) minmax(0, 1fr)" gap="var(--space-lg)">
            <Stack gap="var(--space-sm)">
              <Input label="operator name" placeholder="Avery" bind:value={formName} />
              <Select label="role" options={selectOptions} bind:value={formRole} />
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
          <Text variant="heading" as="h2">status, alerts, and system voice</Text>
        </div>
        <Grid cols="minmax(0, 1fr) minmax(0, 1fr)" gap="var(--space-lg)">
          <Stack gap="var(--space-sm)">
            <Alert variant="ok" title="signal stable">
              upstream route steady. latency normal.
            </Alert>
            <Alert variant="warn" title="drift noted">
              the stream is noisy but within tolerance.
            </Alert>
            <StatusLine status="warn" message="contrast delta near threshold" visible={true} cursor={true} />
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
            <Button variant="ghost" onclick={handleToast}>trigger toast</Button>
          </Stack>
        </Grid>
        <Grid cols={2} gap="var(--space-md)" class="docs-state-grid">
          <EmptyState title="no entries" description="awaiting first signal." />
          <ErrorState title="signal deferred" description="retry from stable ground." retry={true} />
        </Grid>
      </section>

      <Divider />

      <section id="navigation" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">navigation</Label>
          <Text variant="heading" as="h2">tabs, breadcrumb, menu</Text>
        </div>
        <Tabs tabs={tabs} active={activeTab} onchange={(id) => (activeTab = id)} />
        <Grid cols="minmax(0, 1fr) minmax(0, 1fr)" gap="var(--space-lg)">
          <Stack gap="var(--space-sm)">
            <Breadcrumb items={[{ label: 'register', href: '/docs' }, { label: 'navigation' }]} />
            <SearchBar bind:value={searchValue} placeholder="search section" loading={searchLoading} />
          </Stack>
          <div class="docs-menu-wrap">
            <Button variant="secondary" onclick={() => (dropdownOpen = !dropdownOpen)}>[ menu ]</Button>
            <DropdownMenu
              open={dropdownOpen}
              items={[
                { label: 'export', value: 'export' },
                { label: 'duplicate', value: 'duplicate' },
                { label: 'archive', value: 'archive', destructive: true },
              ]}
              onselect={handleDropdownSelect}
              class="docs-dropdown"
            />
          </div>
        </Grid>
      </section>

      <Divider />

      <section id="overlays" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">overlays</Label>
          <Text variant="heading" as="h2">modal, drawer, popover, action bar</Text>
        </div>
        <Stack direction="horizontal" gap="var(--space-sm)" wrap={true}>
          <Button variant="secondary" onclick={() => (modalOpen = true)}>[ open modal ]</Button>
          <Button variant="secondary" onclick={() => (drawerOpen = true)}>[ open drawer ]</Button>
          <Button variant="ghost" onclick={() => (confirmOpen = true)}>[ confirm ]</Button>
          <div class="docs-popover-wrap">
            <Button variant="ghost" onclick={() => (popoverOpen = !popoverOpen)}>[ info ]</Button>
            <Popover open={popoverOpen} placement="bottom">
              <Text variant="caption" color="muted-strong">popover note</Text>
            </Popover>
          </div>
        </Stack>
        <Panel>
          {#snippet header()}
            <Label color="muted">selection demo</Label>
          {/snippet}
          <Stack gap="var(--space-sm)">
            <Checkbox label="alpha register" bind:checked={selectAlpha} />
            <Checkbox label="beta register" bind:checked={selectBeta} />
            <Checkbox label="gamma register" bind:checked={selectGamma} />
          </Stack>
        </Panel>
      </section>

      <Divider />

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
          <ParallaxLayer style="--px: 0.15; --py: -0.12;">
            <SignalRing size={120} color="var(--accent)" />
          </ParallaxLayer>
          <ThreadLine x1="10%" y1="20%" x2="90%" y2="80%" />
          <div class="docs-ambient-glyph">
            <GlyphMark variant="reticle" size={22} color="var(--signal)" />
          </div>
          <div class="docs-ambient-streams">
            <DataStream />
            <DataStream />
          </div>
        </div>
      </section>

      <Divider />

      <section id="depth" class="docs-section">
        <div class="docs-section-head">
          <Label color="accent">depth</Label>
          <Text variant="heading" as="h2">layered spatial system</Text>
        </div>
        <DepthStage class="docs-depth-stage">
          <DepthLayer level="back" class="docs-depth-layer">
            <HorizonGrid animated={true} />
          </DepthLayer>
          <DepthLayer level="raised" class="docs-depth-layer">
            <FloatCard>
              <Label color="accent">float card</Label>
              <Text variant="body" color="soft">move the pointer over it.</Text>
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
          <Text variant="heading" as="h2">full-page compositions</Text>
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
              <Text variant="body" color="soft">one thing to say. centered. no distractions.</Text>
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
                narrow copy on the left, open canvas on the right. good for about pages and story sections.
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
              <Text variant="body" color="soft">dense layout for dashboards and data-heavy pages.</Text>
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
          <ArchiveScene title="archive" cols={2}>
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
              <StatusLine status="pend" message="syncing modules" visible={true} />
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

  <Modal open={modalOpen} title="modal interface" onclose={() => (modalOpen = false)}>
    <Text variant="body" color="soft">short. focused. one thing to decide.</Text>
    {#snippet footer()}
      <Button variant="ghost" onclick={() => (modalOpen = false)}>dismiss</Button>
      <Button variant="primary" onclick={() => (modalOpen = false)}>confirm</Button>
    {/snippet}
  </Modal>

  <Drawer open={drawerOpen} onclose={() => (drawerOpen = false)}>
    <Stack gap="var(--space-sm)">
      <Label color="accent">drawer panel</Label>
      <Text variant="body" color="soft">secondary content that slides in from the side.</Text>
      <Button variant="ghost" onclick={() => (drawerOpen = false)}>[ close ]</Button>
    </Stack>
  </Drawer>

  <ConfirmDialog
    open={confirmOpen}
    title="confirm update"
    description="apply changes to the register."
    confirmLabel="apply"
    cancelLabel="cancel"
    onconfirm={() => {
      confirmOpen = false;
      toastStore.push('update applied', 'ok');
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

  :global(.docs-depth-stage) {
    position: relative;
    min-height: 240px;
    border: 1px solid var(--line);
    background: var(--surface-panel);
    overflow: hidden;
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
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-sm);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--line);
    }

    .docs-content {
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

    .docs-shell {
      padding: var(--space-md) var(--space-sm) var(--space-xl);
    }

    .docs-section {
      gap: var(--space-md);
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

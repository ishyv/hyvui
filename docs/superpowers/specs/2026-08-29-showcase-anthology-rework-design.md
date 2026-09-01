# HyvUI Showcase Anthology Rework Design

> **For Hermes:** Use the writing-plans workflow to implement this design task-by-task after the specification has been reviewed and approved.

**Goal:** Rework all user-facing HyvUI routes into one coherent showcase anthology whose outer presentation is consistent while each route retains a distinct artistic ecology and functional purpose.

**Architecture:** Add a private curatorial shell and a small route manifest layer. The shell owns orientation, spacing rhythm, route metadata, register lifecycle, accessibility contracts, and responsive outer structure. Each route continues to own its inner composition and chooses one host biome with bounded grafts where appropriate. Existing public components remain the material vocabulary; no new public API is promoted by this rework.

**Tech Stack:** Svelte 5, SvelteKit, TypeScript, existing HyvUI tokens and components, the experimental biome resolver, Playwright, Node test runner, Prettier, and the existing build/package gates.

---

## 1. Context and problem statement

HyvUI currently contains several visual eras:

- `src/routes/+page.svelte` is a hero, console, and card-grid introduction.
- `src/lib/examples/Bridge.svelte`, `Keeper.svelte`, `Correspondence.svelte`, and `Watchhouse.svelte` are individually authored scenes with strong identities but separate outer conventions.
- `src/routes/showcase/hextech/+page.svelte` and `src/routes/showcase/arcane/+page.svelte` are deep material/theme demonstrations with their own page structures.
- `src/routes/docs/+page.svelte` is a monolithic component inventory containing many useful specimens and interactions.
- `src/routes/system/+page.svelte` presents status pages as a card index, while the individual status routes are separate condition compositions.
- `src/routes/lab/+page.svelte` is a stress harness whose test purpose is valid but whose presentation belongs to an older lab era.
- `src/routes/next-lab/` contains the newer biome, frame, passage, inspector, and witness proofs.

The problem is not that these pages lack visual effort. The problem is that they do not yet feel like one authored library. Navigation, spacing, route identity, metadata, responsive behavior, and accessibility conventions change from family to family. The page surfaces also do not consistently explain what a component is doing in a composition.

The desired result is not a universal visual template. HyvUI must remain a federation of art biomes. Consistency should come from a shared curatorial grammar, while the worlds inside that grammar remain materially and spatially different.

## 2. Approved scope

The rework includes all user-facing routes:

- homepage;
- four public example scenes;
- Hextech and Arcane showcase routes;
- documentation route;
- system index and individual system-state routes;
- stress lab;
- existing Next research/proof routes.

The `/lab` and `/next-lab` surfaces remain clearly labeled as research, stress, or proof environments. They receive the shared outer orientation but are not presented as stable public component recipes.

Route slugs remain stable. Existing links, native browser history, hash navigation, and ordinary document flow remain supported.

## 3. Non-goals

This rework does not:

- promote the new showcase shell or biome modules to the public barrel;
- replace existing public components with page-specific variants;
- make every page share a hero, grid, card, or full-viewport frame;
- introduce a global browser observer or opaque runtime recomposition;
- rename routes;
- flatten Hextech and Arcane into interchangeable color themes;
- remove the stress behavior from `/lab`;
- turn `/docs` into an art piece that sacrifices practical documentation;
- claim that a visually coherent anthology proves agent discoverability without a new controlled evaluation.

## 4. Design principles

### 4.1 Consistent outside, plural inside

The outer shell provides stable orientation:

- where the visitor is;
- what family the route belongs to;
- what the route is asserting;
- how to move to adjacent work;
- what host biome or material system is active;
- how to recover when motion or spatial interaction is unavailable.

The inner composition remains authored by the route. A field notebook, operational apparatus, reliquary, editorial letter, or documentation specimen must not be forced into one silhouette.

### 4.2 A premise precedes a component selection

Every showcase route must state a governing premise, focal subject, viewer role, primary relation, and mobile reinterpretation. Component selection follows that decision instead of preceding it.

A page such as `the witness that cannot be calibrated` is a valid premise. `dark dashboard` is not.

### 4.3 Biomes are causal ecologies

A route may identify:

- one host biome;
- zero to two named grafts;
- the channels carrying those grafts;
- a bridge reason for any tensional graft;
- a temporal law;
- a viewer role;
- a mobile mode.

The shared shell may display this information, but it must not impose the host biome's inner layout. The existing resolver remains the source of truth for biome compatibility.

### 4.4 Spacing is part of authorship

The shared shell establishes the outer rhythm with existing tokens:

- `--shell-pad` for inline page margins;
- `--section-gap` and the `--space-*` scale for vertical relationships;
- the existing fluid type scale for body, heading, label, and metadata roles;
- explicit local breathing-room decisions for dense rails and specimens.

Essential interactive labels must not be forced into the smallest metadata role merely because they are short. Field coordinates and peripheral annotations may remain quiet when they are genuinely secondary.

### 4.5 Information must remain reachable

Art direction may withhold context, stage a reveal, or create uncertainty. It may not hide required content, make controls hover-only, destroy semantic order, trap touch or wheel input, or remove the ordinary reading path.

### 4.6 Every visual effect has a cause

Rules, glows, traces, overlap, movement, texture, and interruption must express a relationship, a material response, or a state change. Decorative telemetry, arbitrary particles, random offsets, and generic HUD ornament remain prohibited.

## 5. Route manifest model

Create a private route manifest module, proposed at:

- `src/lib/showcase/showcaseManifest.ts`

The module must not be exported from `src/lib/index.ts` during this phase.

The manifest describes route identity rather than rendering details:

```ts
export type ShowcaseFamily =
  | "frontispiece"
  | "scene"
  | "material-study"
  | "field-guide"
  | "condition-atlas"
  | "stress-observatory"
  | "research-archive";

export type ShowcaseManifest = {
  id: string;
  href: string;
  family: ShowcaseFamily;
  title: string;
  premise: string;
  focal: string;
  viewerRole: string;
  primaryRelation: string;
  temporalLaw: string;
  mobileMode: string;
  status: "published" | "utility" | "experimental";
  hostBiome?: string;
  grafts?: string[];
  previousHref?: string;
  nextHref?: string;
};
```

The concrete model may reuse existing biome types rather than duplicating them. The important boundary is that route identity is declarative and inspectable, while route markup remains free to author its inner visual grammar.

The manifest must support:

- homepage procession order;
- example navigation;
- theme-study navigation;
- system-state navigation;
- research/proof labeling;
- shell metadata;
- automated route coverage;
- agent-facing inspection in a later phase.

A manifest must never become a page template. It records why the page exists, not how every child is placed.

## 6. Private curatorial shell

Create an internal shell, proposed at:

- `src/lib/showcase/ShowcaseShell.svelte`

The shell should compose existing primitives rather than replace them:

- `AppShell` for weight/theme lifecycle where appropriate;
- `Shell` for max width and inline padding;
- `PageHeader` only where its structure suits the route;
- `Text`, `Label`, `Divider`, `Surface`, and navigation primitives for stable outer vocabulary;
- existing register helpers for weight, theme, and grade cleanup.

The shell owns:

1. **Orientation**
   - skip link;
   - current route/family label;
   - breadcrumb or route trail;
   - adjacent-route links;
   - `aria-current` on current navigation.

2. **Curatorial metadata**
   - premise;
   - host biome and graft summary when present;
   - viewer role;
   - temporal law;
   - experimental or utility status.

3. **Outer spacing**
   - shared shell padding;
   - masthead and footer rhythm;
   - responsive transitions between horizontal and vertical orientation;
   - consistent focus offsets and minimum control spacing.

4. **Runtime lifecycle**
   - apply route weight/theme/grade through existing helpers;
   - clean up all body-level register state on route teardown;
   - avoid every scene independently mutating global state when the shell can own it safely.

5. **Accessibility contract**
   - one page-level `main` landmark;
   - skip navigation;
   - stable heading order;
   - keyboard-reachable route controls;
   - reduced-motion behavior passed to the route or its proof primitive;
   - ordinary document-flow fallback for spatial compositions.

6. **Inspection hooks**
   - `data-showcase-id`;
   - `data-showcase-family`;
   - `data-showcase-status`;
   - `data-showcase-host` when available;
   - `data-showcase-viewer`;
   - `data-showcase-relation`.

The shell should provide slots/snippets for route-specific masthead additions, metadata extensions, content, and footer additions. It must not require all pages to fill every slot.

## 7. Route-family compositions

### 7.1 Homepage: frontispiece and procession

Modify `src/routes/+page.svelte`.

The homepage should become the anthology's frontispiece. Its primary act is invitation, not component inventory.

Proposed composition:

- one dominant proposition about HyvUI;
- one visual threshold or material gesture;
- a procession of four scene entrances derived from `showcaseManifest` rather than a uniform card grid;
- a concise explanation of how the same component vocabulary becomes different worlds;
- a restrained route to the field guide and research archive.

Host biome: `manifesto-print`. Any secondary material gesture must be a bounded graft with an explicit reason.

The homepage must not repeat the old console, ambient telemetry, and four-card pattern as its primary silhouette.

### 7.2 Example scenes: four authored worlds

Migrate these route wrappers and scene components:

- `src/routes/examples/bridge/+page.svelte`
- `src/routes/examples/keeper/+page.svelte`
- `src/routes/examples/correspondence/+page.svelte`
- `src/routes/examples/watchhouse/+page.svelte`
- `src/lib/examples/Bridge.svelte`
- `src/lib/examples/Keeper.svelte`
- `src/lib/examples/Correspondence.svelte`
- `src/lib/examples/Watchhouse.svelte`
- `src/lib/examples/sceneCatalog.ts`

Preserve the distinct inner compositions:

- Bridge remains operational and polycentric, with real bearing, contact, and watch-log relationships.
- Keeper remains quiet and archival, with provenance, condition, conservation, and handling as its information ecology.
- Correspondence remains intimate and editorial, with drafts, marginalia, quoted reply, and reading pace.
- Watchhouse remains an ecological/oneiric witness record, with recurrence, classification, and unresolved sightings.

Add each route's manifest identity and wrap it in the shared shell. Replace independent outer mastheads only where the shell can preserve the scene's existing thesis. Do not make the four scenes visually identical.

The existing `mountSceneAppearance` flow should be audited and, where safe, moved behind shell lifecycle ownership. Body register cleanup must be tested between route navigations.

### 7.3 Theme showcases: material studies

Modify:

- `src/routes/showcase/hextech/+page.svelte`
- `src/routes/showcase/arcane/+page.svelte`

Hextech should read as a material workshop where brass housing, crystal light, mechanical precision, and operator history cause the interface behavior.

Arcane should read as a living manifestation where iridescent structure, breathing change, mutation, and witness language cause the interface behavior.

Both pages should share:

- shell orientation;
- material-study labeling;
- route navigation;
- evidence that the theme affects material recipes and motion personality.

They must not share one page template or become simple palette toggles.

### 7.4 Documentation: field guide

Modify:

- `src/routes/docs/+page.svelte`
- associated documentation styles and tests as required.

The documentation route should become a field guide with:

- persistent section index;
- route-level premise stating that the page is practical documentation;
- grouped specimens by role rather than one undifferentiated component dump;
- live examples that identify the component, its semantic role, its material behavior, and its escape hatch;
- native hash navigation;
- readable long-form content on mobile;
- controls that remain functional and keyboard reachable.

The route may be visually authored, but documentation clarity takes precedence over spectacle. The field guide is the place where authors learn how to use the library.

### 7.5 System pages: condition atlas

Modify:

- `src/routes/system/+page.svelte`
- the individual state routes under `src/routes/drifting/`, `cooling/`, `forbidden/`, `gateway/`, `interrupted/`, `lost/`, `maintenance/`, `offline/`, `pending/`, `redirecting/`, and `unauthorized/`.

The system index should become a sequence or atlas of conditions rather than a generic card catalogue.

Each state page must preserve its functional meaning and HTTP/status identity while gaining:

- a shared condition-atlas shell;
- a clear state title that describes the condition rather than using generic `error` or `warning` labels;
- a state-specific material, temporal behavior, or interruption;
- one obvious recovery or navigation path;
- reduced-motion and mobile-safe fallbacks.

The visual treatment must not obscure status semantics or make failure states look interchangeable.

### 7.6 Stress lab: stress observatory

Modify `src/routes/lab/+page.svelte` only where presentation supports the testing purpose.

Keep:

- fixed-width cases;
- pathological strings;
- layout-integrity checks;
- the component stress coverage.

Rework:

- outer navigation and route identity;
- spacing and type hierarchy;
- the explanatory framing of the lab;
- mobile containment and readable failure evidence.

The lab is a utility surface, not a marketing showcase. It must remain inspectable and easy to diagnose.

### 7.7 Next lab: research archive

Modify the outer wrappers under `src/routes/next-lab/` only as needed.

The Next lab should visibly belong to the same anthology while remaining experimental:

- label new biome/frame/passage work as proof or research;
- link to the public examples and field guide;
- preserve native frame, passage, inspector, and witness behavior;
- avoid presenting experimental modules as stable public recipes;
- retain direct route access for research and browser tests.

The witness page remains the first full proof of the new shell's spacing and relationship grammar.

## 8. Navigation model

Create a shared navigation data source from the route manifest. Proposed supporting module:

- `src/lib/showcase/showcaseNavigation.ts`

Navigation must support:

- current route state;
- previous/next route when a family has procession order;
- family-level return links;
- public versus experimental labeling;
- native links and history;
- mobile collapse without hiding the route identity.

Avoid a universal mega-menu. A route should expose only the navigation relationships that help the visitor understand the anthology.

## 9. Styling boundaries

The rework must obey the existing HyvUI style rules:

- use token variables rather than raw color values;
- use ET Book for body/display roles and IBM Plex Mono for labels/metadata;
- do not target component implementation class names for global overrides;
- use route wrapper selectors and approved override surfaces when an existing component truly needs adaptation;
- preserve the no-default-radius rule;
- keep accent hues within the base token system unless a theme material explicitly owns them;
- use intentional whitespace as part of composition;
- avoid using atmospheric effects to compensate for missing subject or hierarchy.

A shared shell may define shell-level variables, but route-specific pages must be able to opt into different density, material, rhythm, and temporal behavior within the allowed biome contract.

## 10. Data and lifecycle flow

The intended flow is:

1. route load selects a `ShowcaseManifest`;
2. if the manifest includes a biome brief, the existing resolver creates an inspectable plan;
3. `ShowcaseShell` receives the manifest and optional resolved plan;
4. shell applies route-level register/theme/grade state through existing helpers;
5. shell renders orientation, metadata, navigation, and route slot;
6. route renders its own semantic content and inner composition;
7. route-specific interaction updates local state only;
8. shell and route teardown clear body state and listeners;
9. tests inspect both manifest metadata and rendered DOM attributes.

The shell must not measure or reorder arbitrary descendants. Existing local composition contexts remain responsible for their own fields.

## 11. Accessibility and responsive requirements

Every migrated route must preserve:

- one clear `main` landmark;
- a skip link;
- one meaningful page heading;
- semantic reading order independent of visual order;
- native anchors for route navigation;
- keyboard access for every interactive control;
- visible focus styles;
- non-color selected and status states;
- touch-sized controls;
- no horizontal overflow at 320px and 375px;
- reduced-motion alternatives that preserve content and state meaning;
- no focus traps or wheel/touch hijacking;
- meaningful labels for spatial instruments and diagrams;
- a linear or static fallback for spatial and temporal proofs.

Responsive behavior should be a reinterpretation of the host biome, not a mechanically stacked desktop screenshot.

## 12. Implementation sequence

The implementation should proceed in vertical slices:

### Slice 1: shell and manifest

Create the private shell, manifest types, initial route records, and shell contract tests. Do not migrate every page yet.

### Slice 2: homepage plus one example

Migrate the homepage and Bridge first. This proves that the frontispiece and an operational scene can share orientation without sharing an inner template.

### Slice 3: remaining examples

Migrate Keeper, Correspondence, and Watchhouse. Compare all four inner silhouettes and verify distinct host/graft identities.

### Slice 4: material studies

Migrate Hextech and Arcane. Verify theme lifecycle, material differences, and route navigation.

### Slice 5: field guide and condition atlas

Rework docs and system pages while preserving their utility and status semantics.

### Slice 6: stress and research surfaces

Reframe `/lab` and `/next-lab`, preserving their experimental/utility boundaries.

### Slice 7: anthology review

Run the complete route matrix, visual review, responsive review, reduced-motion review, and documentation consistency review. Only after this review should public API promotion be reconsidered.

## 13. Test and verification plan

### Pure tests

Add or extend tests for:

- manifest completeness and stable IDs;
- family navigation order;
- valid route status and labels;
- biome host/graft metadata agreement;
- deterministic adjacent-route resolution;
- register/theme/grade cleanup decisions where pure helpers are introduced.

Proposed targets:

- `tests/showcase-manifest.test.ts`
- `tests/showcase-navigation.test.ts`

### Browser tests

Add shell contracts covering:

- skip navigation;
- `data-showcase-*` identity;
- `aria-current` route state;
- one page heading;
- semantic order;
- keyboard navigation;
- mobile containment;
- reduced motion;
- register cleanup after navigation;
- public/experimental labeling.

Proposed target:

- `tests/showcase-shell.spec.ts`

Extend existing route suites rather than replacing them:

- `tests/showcase.spec.ts`
- `tests/lab.spec.ts`
- the existing `tests/next-*.spec.ts` suite.

### Route matrix

The final review must cover all user-facing routes at:

- 1600 × 900;
- 1440 × 900;
- 1024 × 900;
- 768 × 900;
- 480 × 900;
- 375 × 900;
- 320 × 900;
- reduced-motion at representative desktop and mobile widths.

Machine checks should record:

- HTTP status;
- horizontal overflow;
- main/heading count;
- focus reachability;
- manifest-to-DOM identity;
- body register cleanup;
- deterministic rerender where the route uses seeded behavior;
- presence of static fallbacks for spatial or animated proofs.

Human review should score each family for:

- clear premise;
- focal hierarchy;
- silhouette;
- material identity;
- meaningful relationship;
- rhythm and breathing room;
- responsive survival;
- functional integrity;
- inspectability;
- distinction from other families.

## 14. Acceptance criteria

The rework is ready for user review when:

- all user-facing routes use the shared curatorial orientation or an explicitly justified utility variant;
- public examples remain materially distinct rather than becoming one template;
- every migrated route has a manifest identity;
- the homepage no longer leads with a generic hero-plus-card-grid silhouette;
- docs remain practical and navigable;
- system states remain semantically truthful;
- `/lab` remains a real stress harness;
- `/next-lab` remains clearly experimental;
- no route has accidental horizontal overflow in the required matrix;
- keyboard, touch, focus, history, and reduced-motion contracts pass;
- body-level register state is cleaned up between navigations;
- targeted formatting, `npm run check`, build, package, and relevant browser suites pass;
- visual review confirms increased breathing room and family-specific art direction;
- no new public exports are added without a separate evidence-backed decision.

## 15. Risks and mitigations

### Risk: the shell becomes another universal template

**Mitigation:** keep shell responsibilities limited to orientation, metadata, lifecycle, and outer rhythm. Require route-specific inner compositions and biome manifests.

### Risk: migration scope becomes too large to review

**Mitigation:** migrate in vertical slices, preserve route slugs, and run a full route matrix after each family rather than editing every page before testing.

### Risk: body register mutations conflict between routes

**Mitigation:** centralize shell lifecycle where possible, test route transitions, and ensure cleanup always runs on teardown.

### Risk: documentation becomes too theatrical

**Mitigation:** give `/docs` a field-guide family with utility-first acceptance criteria. Treat readability and discoverability as higher priority than atmosphere.

### Risk: larger spacing creates new overflow

**Mitigation:** use route-level spacing contracts, measure real boxes, assert rail/content containment, and keep mobile and desktop rhythm decisions explicit.

### Risk: experimental APIs appear stable by association

**Mitigation:** retain status labels, private modules, and the existing API-boundary decision. No public barrel changes in this rework.

## 16. Decision

Proceed with a private shared curatorial shell plus manifest-driven route identity and manually authored biome-specific inner compositions.

The governing sentence is:

> **The anthology shares a frame of attention, not a single world.**

Public API promotion, broader runtime authority, and any claim of improved agent composition remain separate future decisions requiring fresh evidence.

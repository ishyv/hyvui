# Current composition audit

**Status:** observed evidence plus hypotheses. No architecture is selected here.

## Observed structural pressure

### Finished page scenes

- `src/lib/components/scenes/StageScene.svelte:20-69` fixes five named zones: label, heading, subheading, actions, and ambient. Its root is a centered flex composition (`:72-110`). This is useful for a theatrical moment, but the API teaches an agent that a dramatic page is assembled from those zones.
- `src/lib/components/scenes/DepthScene.svelte:25-78` fixes ambient, ground, stage, and foreground layers around `DepthStage`. It provides spatial depth, but the composition grammar is still a fixed four-zone scene.
- `docs/api/scenes.md:1-4` calls scenes “full-page layout templates” and says “one scene per page is the expected pattern.” That is a direct structural instruction, not merely documentation of an implementation detail.
- `docs/api/scenes.md:139-206` describes `StageScene` as centered/theatrical and `ArchiveScene` as a uniform grid. Both are good named postures, but they are easy for an agent to treat as the complete solution space.

### Conventional layout primitives

- `src/lib/components/layout/Stack.svelte:17-58` turns vertical/horizontal flow and gap into the shortest path for grouping content.
- `src/lib/components/layout/Grid.svelte:15-120` makes regular columns the shortest path for repeated content. It does have a useful `ResizeObserver`-based container-width adaptation (`:70-108`).
- `src/lib/components/layout/Card.svelte:17-52` wraps a fixed `Surface` card treatment. Its only explicit compositional axis is `staggerOffset` (`:18-20`, `:30-35`).
- `src/lib/components/layout/Shell.svelte:18-59` and `Frame.svelte:19-61` are more promising material/constraint seams because they express width and aspect without prescribing a page silhouette.

### Repeated scaffolds outside the scene API

- Before the Next routes were added, 11 of 24 route SFCs shared the `statusLines`/`TerminalBoot`/timer/reveal architecture and the `.system-page`, `.content-shell`, `.main-message`, `.cta-block`, and `.status-footer` selectors. Those files account for 4,007 of 8,172 route lines. Representative copies are `src/routes/offline/+page.svelte:14-65,73-107,109-235` and `src/routes/gateway/+page.svelte:16-174,182-223,225-365`.
- Six of seven input components repeat the same label, description, error, disabled, and class props plus helper/error rendering: `Input.svelte:11-71`, `Textarea.svelte:10-80`, `Select.svelte:17-84`, `Checkbox.svelte:9-80`, `Toggle.svelte:9-73`, and `FileUpload.svelte:9-116`. This is evidence of shared semantics, but not evidence that every input should become a configurable mega-component.
- `EmptyState` and `ErrorState` repeat near-identical centered title/description/action structures (`src/lib/components/feedback/EmptyState.svelte:31-75`, `ErrorState.svelte:33-78`). `ShowcaseFrame` and `DepthPortal` similarly precompose grid, corner brackets, depth stage, and depth layers (`src/lib/components/patterns/ShowcaseFrame.svelte:44-62`, `DepthPortal.svelte:40-60`).

### Current examples and routes

- `src/lib/examples/Bridge.svelte`, `Keeper.svelte`, `Correspondence.svelte`, and `Watchhouse.svelte` demonstrate real variation in copy voice, ornaments, depth, and density. They are not identical templates.
- Their top-level structure still commonly begins with `Shell` → `Sequence` → `header`, followed by one or two named content regions and a `Surface`/panel. Search evidence shows repeated use of `Stack`, `Cluster`, `Divider`, and `Surface`.
- The current homepage (`src/routes/+page.svelte:27-181`) already has a more varied silhouette than the docs recipes: depth hero, split hero stage, anthology cards, and a stacked proof region. It is useful evidence that the current library can make more than a conventional dashboard, but the homepage is handcrafted and does not prove agent discovery.
- The actual example routes are `bridge`, `keeper`, `correspondence`, and `watchhouse` (`src/routes/examples/`). The existing `tests/showcase.spec.ts:3-40` expects unrelated slugs (`studio-console`, `field-report`, `archive-gallery`, `signal-lost`, `hextech-forge`, `arcane-shard`), so the showcase test contract is stale before HyvUI Next work begins.

## Agent-facing pressure

- `SKILL.md:92-100` says to check pre-wired patterns before building similar layouts; this reduces accidental duplication but also encourages agents to select a finished pattern instead of inventing a composition.
- `SKILL.md:168-185` presents scene templates and a direct selection table. It is efficient for conventional pages and is likely a template attractor for an agent.
- `COMPONENTS.md` provides useful “use this / not that” guidance, but most entries define one intended task and one canonical example. They rarely describe alternate visual roles, compatible relationships, scale limits, or how a component participates in a larger composition.
- `docs/recipes.md` contains copy-paste-ready recipes for boot pages, dashboard card grids, confirmation flows, forms, parallax heroes, and staggered cards. These are operationally helpful but create a strong imitation corpus.
- `SKILL.md` and `INSTALL.md` contain stale `data-register`/`applyRegister` references while the implementation uses `data-weight`/`applyWeight` (`src/lib/system/register.ts:1-85`). This is a concrete discoverability failure because the agent-facing source of truth disagrees with the public implementation.

## Existing expressive capabilities worth preserving

- `Text.expression` is a semantic intent channel rather than another visual variant (`src/lib/components/primitives/Text.svelte:20-23`, `src/lib/components/primitives/text.ts`). It is a precedent for capability/intent metadata.
- Snippets let callers provide arbitrary content to scene zones and components. They are a better escape hatch than adding more named layout variants.
- `DepthStage`, `DepthLayer`, `FloatCard`, `HorizonGrid`, and `ParallaxLayer` provide spatial material and motion without requiring a global composition engine.
- `Sequence`, `KineticText`, and the actions in `src/lib/system/actions/` provide choreography and interaction as opt-in behaviors.
- Weight/theme/grade are orthogonal context channels (`src/lib/system/register.ts:1-85`). Their separation should inform a future art-direction context rather than be replaced by a single “style” prop.
- Theme CSS and `AESTHETICS.md` establish a recognizable identity through material recipes, typography, color behavior, and motion personality. These are the family resemblance kernel.

## Baseline inventory

The deterministic inventory in `docs/research/component-capability-inventory.md` reports 96 Svelte components under `src/lib/components/` across 13 groups. The pre-Next public barrel also exported `TravelingParticle` from `src/lib/system/motion/TravelingParticle.svelte`, making 97 existing public Svelte component exports. The current barrel has 99 after adding `Composition` and `CompositionNode`.

- 10 components visibly use Svelte actions;
- 4 use browser observers;
- 44 contain transform-related signals.

These counts show that expressive implementation material exists. They do not show that agents discover or compose it.

## API and runtime constraints

- All 97 pre-Next SFCs used explicit `$props()` surfaces; 96 exposed a `class` prop, and no SFC used a markup attribute spread. Most consumers therefore cannot pass arbitrary `data-*`, ARIA, native attributes, or unlisted events through a component without an explicit prop or wrapper.
- Only six SFCs used `tailwind-variants`: `Text`, `Surface`, `Divider`, `Button`, `StatusDot`, and `Badge`. The shared variant axes are in `src/lib/system/variants/axes.ts:10-35`. Variant infrastructure is not the main composition model.
- `applyTheme` mutates a DOM attribute, while the static token object and some canvas paths use base RGB values. `src/lib/components/depth/HorizonGrid.svelte:62-100` and `src/lib/components/ambient/ShimmerCloud.svelte:45-59` show why theme-aware canvas/ambient adaptation currently requires manual branching.
- `AppShell` exposes weight/theme but not grade, so applying all three appearance channels still requires the custom helper in `src/lib/examples/appearance.ts:19-34`.
- The documented `ResolveAction` import is not exported from the public barrel, and `Modal`/`Drawer` depend on private `lockScroll`. These are API-boundary inconsistencies to repair separately from the composition model.

## Hypotheses to test

1. Fixed scenes and recipe language are a stronger cause of agent repetition than missing CSS effects.
2. A compact capability/relationship vocabulary can change agent output more effectively than adding props to `Card` or `Surface`.
3. The existing public primitives are sufficient for the first comparison if the agent is given inspectable composition metadata.
4. Static or author-declared relationships will provide most of the value; live runtime geometry will be needed only for anchoring, overflow fallback, and interaction continuity.
5. Existing visual identity can survive radically different silhouettes if typography, token discipline, materials, and motion rules remain shared.

## Required follow-up evidence

- Run the fixed agent prompt corpus against the current library.
- Record machine-readable layout signatures, not just screenshots.
- Repair or isolate stale showcase tests before using them as a regression gate.
- Compare agents with and without the capability/relationship vocabulary to test whether documentation is sufficient.

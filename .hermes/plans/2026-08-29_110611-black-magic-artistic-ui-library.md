# Black-Magic Artistic UI Library Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn HyvUI into an agent-native artistic UI library that can compose surprising, materially specific, accessible interfaces from multiple visual biomes without collapsing them into themes, templates, or random effects.

**Architecture:** Add a declarative artistic composition layer above the existing HyvUI token, component, relationship, and local-geometry systems. A composition chooses one host biome, may receive bounded channel-specific grafts, and resolves into an inspectable spatial, material, typographic, informational, temporal, and interaction plan. Native semantic HTML remains the substrate. Runtime behavior is local, opt-in, deterministic, and subordinate to explicit author intent.

**Tech Stack:** Svelte 5, TypeScript, SvelteKit, CSS custom properties, existing HyvUI token/theme/register systems, Node test runner through `tsx`, Playwright, JSON Schema, existing `Composition` and `CompositionNode` experiments.

---

## 1. Mission and meaning of “black magic”

“Black magic” is a working metaphor for a system that produces results an ordinary component library could not predict, while remaining explainable after the fact. It does **not** mean randomness, hidden mutation, a canvas-only renderer, or an inaccessible visual trick.

The system should feel magical because:

- an agent can state a conceptual premise instead of assembling a familiar page silhouette;
- the same content can become a shrine, habitat, manifesto, object-poem, machine ecology, or kinetic field;
- materials, type, spacing, light, time, and interaction follow a shared cause;
- compatible concepts can hybridize without becoming style soup;
- the result is reproducible from a seed;
- the inspector can explain every meaningful decision;
- the author can reject, constrain, or replace any decision;
- the DOM remains semantic, keyboard reachable, inspectable, and usable without motion.

The system must never describe itself as a universal art generator. It is a constrained artistic composition system with multiple authored ecologies.

## 2. Current context

Existing evidence and implementation:

- HyvUI has a stable token and material kernel in `src/lib/tokens/`, existing themes, weight registers, grades, depth primitives, ornaments, scenes, and patterns.
- HyvUI Next already provides an experimental relationship model in `src/lib/next-experiments/`:
  - `Composition`;
  - `CompositionNode`;
  - deterministic relation resolution;
  - `disabled`, `suggest`, and `apply` adaptation modes;
  - local geometry measurement;
  - manual-placement precedence;
  - inspectable decisions;
  - an earlier strong art-direction layer.
- The first art-direction flagship, the reliquary-in-weather prototype, was judged artistically weak because it copied effects without one sufficient cause.
- The measured-sublime prototype was materially better, but it is now one ecotone rather than the universal HyvUI philosophy.
- `docs/research/art-biomes/biome-architecture.md` defines 12 proposed host biomes, four ecotones, an orthogonal art genome, and host-and-graft rules derived from 33 references.
- The private gallery at `/next-lab/biomes` proves six authored host biomes using one shared content corpus:
  - ceremonial reliquary;
  - ecological elegy;
  - oneiric object-poetry;
  - machine ecology;
  - manifesto print;
  - kinetic rupture.
- `src/lib/next-experiments/BiomeFrame.svelte` is intentionally authored proof code. It should inform the future model, not become the universal runtime implementation.
- Agent discoverability has not yet been demonstrated. The controlled bakeoff remains pending.

## 3. Non-negotiable requirements

The implementation must preserve:

- semantic DOM and reading order;
- normal HTML, Svelte, and CSS authoring;
- keyboard, touch, focus, and history behavior;
- reduced-motion alternatives;
- deterministic identity-bearing decisions;
- explicit author placement and escape hatches;
- inspectable applied, suggested, and rejected decisions;
- token-driven color and material behavior;
- lowercase UI copy conventions;
- existing library exports and scenes until a public migration is approved.

The implementation must not default to:

- a centered hero followed by cards;
- one global art philosophy;
- one universal frame transition;
- wheel-event hijacking or mandatory scroll trapping;
- random offsets, colors, or animation timing;
- generic HUD, cyberpunk, game, or surveillance language;
- faux telemetry or invented factual instrumentation;
- a global post-render browser layout engine;
- opaque canvas rendering that removes semantic content;
- a style-tag soup of incompatible biome names;
- public API expansion before comparative evidence.

## 4. Architectural decision

### Recommended approach: declarative composition IR plus bounded local projection

Introduce a small, pure intermediate representation for artistic composition. It should be resolved before render whenever possible, then projected into ordinary Svelte and CSS. Use a narrow local runtime only when a decision genuinely depends on live geometry, interaction continuity, or viewport state.

The pipeline is:

```text
agent brief
  -> premise + host biome + optional grafts
  -> biome compatibility validation
  -> deterministic composition plan
  -> spatial/material/temporal projections
  -> semantic Svelte/HTML/CSS
  -> optional local geometry correction
  -> inspector and evaluation artifact
```

The plan must keep these concerns separate:

- **worldview:** what the composition is about;
- **biome:** the host ecology and its laws;
- **genome:** independent dimensions available for controlled variation;
- **relations:** semantic connections among content participants;
- **spatial plan:** frames, fields, focal distribution, edges, layers, and passages;
- **material plan:** substrate, light, palette behavior, texture, and depth;
- **information plan:** what is operational, archival, poetic, symbolic, or communal;
- **temporal plan:** stillness, drift, orbit, cut, procession, impact, or overwrite;
- **interaction plan:** viewer role and allowed verbs;
- **decision log:** why each choice was accepted, grafted, rejected, or constrained.

### Rejected approach A: add more component variants

This would produce more syntax without exposing artistic relationships. It would preserve the current attractor toward standard layouts and make the system harder for agents to reason about.

### Rejected approach B: universal browser art runtime

A page-wide runtime would create hidden mutation, hydration and resize complexity, unpredictable debugging, accessibility risks, and one implicit visual taste. Local runtime behavior remains opt-in and bounded.

### Rejected approach C: one named art template per biome

Twelve fixed templates would only rename the existing problem. Biomes must be declarative law bundles that can produce multiple compositions and accept limited grafts.

## 5. Domain model

Add the smallest useful model. Prefer records and discriminated unions over dozens of component props.

### 5.1 Biome definition

Proposed location: `src/lib/next-experiments/biomes.ts`

A `BiomeDefinition` should declare:

- stable biome ID and human label;
- worldview or conceptual pressure;
- spatial laws;
- attention economy;
- density strategy;
- material families;
- light behavior;
- typography roles;
- information modes;
- time model;
- viewer role;
- interaction verbs;
- native frame modes;
- native passage modes;
- compatible graft channels;
- compatible and destructive host relationships;
- anti-patterns and failure conditions;
- responsive reinterpretation rules.

The 12 definitions from `docs/research/art-biomes/biome-architecture.md` should be represented as data, not as 12 components or 12 branches in a renderer.

### 5.2 Art genome

Proposed location: `src/lib/next-experiments/artGenome.ts`

Represent orthogonal dimensions such as:

- spatial habitat;
- density strategy;
- substrate/material;
- light model;
- typographic ecology;
- information mode;
- time model;
- viewer relationship;
- interaction verbs.

A biome supplies defaults and bounds. A composition may override a gene only when the host permits it or when the override is declared as a tension.

### 5.3 Host and graft

Proposed types:

```ts
export type BiomeGraftChannel =
  | "material"
  | "light"
  | "typography"
  | "information"
  | "motion"
  | "interaction"
  | "framing";

export type BiomeGraft = {
  biome: BiomeId;
  channel: BiomeGraftChannel;
  reason: string;
  mode: "symbiotic" | "tensional";
};
```

A composition has:

- exactly one host biome;
- zero to two default grafts;
- at most one high-friction contradiction;
- an explicit bridge or conflict statement for each graft.

Grafts alter only their declared channels unless the host explicitly permits a broader change.

### 5.4 Composition brief

Extend the existing `ArtDirection` model or create a separate `ArtCompositionBrief` without breaking current consumers. It should be able to state:

- `seed`;
- `premise`;
- `hostBiome`;
- `grafts`;
- `contentOrder`;
- `requiredContent`;
- `withholding`;
- `focalPolicy` such as singular, distributed, or polycentric;
- `framePolicy`;
- `passagePolicy`;
- `adaptation`;
- `debug`.

Do not require every existing `Composition` to adopt the biome layer.

### 5.5 Plan and decision records

Extend the existing inspection approach with:

- resolved host and grafts;
- active genome genes;
- semantic and visual roles;
- spatial frame plan;
- transition intent;
- passage intent;
- material decisions;
- rejected grafts and reasons;
- responsive substitutions;
- reduced-motion substitutions;
- author overrides.

## 6. Implementation phases

Each phase is independently verifiable. New behavior follows strict RED, GREEN, REFACTOR cycles. Do not implement a phase merely because its types exist.

### Phase 0: Preserve the current library and establish the baseline

**Objective:** freeze the existing control group and clearly separate authored proof code from future infrastructure.

**Files:**

- Read and update: `docs/hyvui-next-design.md`
- Read and update: `docs/next.md`
- Read and update: `docs/research/prototype-gallery.md`
- Create: `docs/decisions/black-magic-artistic-ui.md`
- Create: `tests/next-black-magic-baseline.test.ts`

**Tasks:**

1. Record the current public export surface, existing Next routes, test commands, and known repository-wide formatting debt.
2. Label `/next-lab/biomes` and `/next-lab/measured-sublime` as private authored experiments.
3. Document that the 12-biome architecture is a proposal and that no agent-discoverability claim exists yet.
4. Add a baseline test that existing relation and adaptation behavior remains unchanged while new biome work is opt-in.

**Verification:**

- `npm run test:next`
- `npm run check`
- existing experiment browser contracts remain green.

**Gate:** no public export or existing component behavior changes in this phase.

### Phase 1: Define biome data and compatibility resolution

**Objective:** make the plural biome model executable as pure deterministic data before rendering it.

**Files:**

- Create: `src/lib/next-experiments/biomes.ts`
- Create: `src/lib/next-experiments/artGenome.ts`
- Create: `src/lib/next-experiments/biomeResolution.ts`
- Modify: `src/lib/next-experiments/types.ts`
- Modify: `schemas/composition-experiment.schema.json`
- Create: `tests/next-biomes.test.ts`

**RED to GREEN slices:**

1. Resolve each of the 12 biome IDs into a definition with a worldview, spatial law, time model, viewer role, and anti-patterns.
2. Reject unknown hosts without guessing a fallback biome.
3. Accept a valid host with zero grafts.
4. Accept a symbiotic graft only through a compatible channel.
5. Accept a tensional graft only when an explicit bridge/conflict reason exists.
6. Reject destructive combinations with a deterministic reason and fallback.
7. Enforce the host-plus-graft count limit.
8. Preserve the seed and produce stable output for repeated resolution.
9. Keep measured sublime represented as an ecotone or hybrid profile rather than a primary universal biome.

**Verification:**

- `npx --yes tsx --test tests/next-biomes.test.ts`
- `npm run test:next`
- JSON Schema validation through the existing schema tests.

**Acceptance:** pure resolution can describe at least six materially different compositions without adding a biome-specific renderer branch.

### Phase 2: Compile a biome-aware composition plan

**Objective:** translate a brief into inspectable spatial, material, information, temporal, and interaction decisions.

**Files:**

- Create: `src/lib/next-experiments/biomeComposition.ts`
- Modify: `src/lib/next-experiments/Composition.svelte`
- Modify: `src/lib/next-experiments/context.ts`
- Modify: `src/lib/next-experiments/Node.svelte`
- Create: `tests/next-biome-composition.test.ts`
- Create: `tests/next-biome-composition.spec.ts`

**RED to GREEN slices:**

1. Expose `data-biome-host`, `data-biome-grafts`, and `data-biome-time` only when the biome layer is provided.
2. Preserve the original node DOM order while allowing a visual order or plane plan.
3. Resolve singular, distributed, and polycentric focal policies without forcing one focal point.
4. Resolve typography roles such as monumental, editorial witness, technical instrument, heraldic, graffiti, or absent.
5. Resolve material and light behavior as semantic plan records, not arbitrary CSS effect names.
6. Emit applied, suggested, and rejected biome decisions with reasons.
7. Keep `suggest` passive and `disabled` inert.
8. Preserve manual placement and required content above all automatic preferences.
9. Add a compact hidden inspector payload that can be serialized deterministically.

**Verification:**

- `npx --yes tsx --test tests/next-biome-composition.test.ts`
- `CI=1 npx playwright test tests/next-biome-composition.spec.ts --workers=1`
- `npm run check`
- `npm run build`

**Gate:** no global mutation and no automatic behavior for legacy compositions.

### Phase 3: Replace the six gallery branches with data-driven biome proofs

**Objective:** use the new model to drive the existing six-frame gallery without turning the gallery into the runtime itself.

**Files:**

- Modify: `src/lib/next-experiments/biomeGallery.ts`
- Modify: `src/lib/next-experiments/BiomeFrame.svelte`
- Modify: `src/routes/next-lab/biomes/+page.ts`
- Modify: `src/routes/next-lab/biomes/+page.svelte`
- Modify: `tests/next-biome-gallery.test.ts`
- Modify: `tests/next-biome-gallery.spec.ts`
- Modify: `docs/research/prototype-gallery.md`

**Tasks:**

1. Replace ad hoc proof metadata with `BiomeDefinition` and resolved plan data.
2. Keep the same shared content corpus across all six hosts.
3. Preserve six genuinely different direct-child composition signatures.
4. Make every visual mark attributable to a declared biome law or content relation.
5. Keep the authored frame branches as proof renderers, but prevent them from defining the public runtime contract.
6. Add at least three explicit host-and-graft proof cases:
   - ecological elegy plus archival information;
   - celestial cartography plus reliquary material;
   - manifesto print plus noise commons.
7. Add at least one destructive combination test that is rejected rather than rendered as style soup.

**Verification:**

- `npm run test:next`
- `npx playwright test tests/next-biome-gallery.spec.ts --workers=1`
- desktop and mobile screenshot review;
- reduced-motion screenshot or computed-style review;
- visual review against hierarchy, causal fit, distinctness, and material specificity.

**Gate:** do not proceed if the six frames converge into one shared silhouette or if grafts are represented only as palette changes.

### Phase 4: Build biome-native viewport frames

**Objective:** make full-viewport frames a first-class optional capability whose spatial and temporal behavior comes from the host biome.

**Files:**

- Create: `src/lib/next-experiments/FrameSequence.svelte`
- Create: `src/lib/next-experiments/Frame.svelte`
- Create: `src/lib/next-experiments/frameResolution.ts`
- Create: `src/lib/next-experiments/transitionResolution.ts`
- Modify: `src/lib/next-experiments/types.ts`
- Create: `tests/next-frames.test.ts`
- Create: `tests/next-frames.spec.ts`

**Design rules:**

- The default substrate is ordinary document flow with sections that can occupy the viewport.
- `FrameSequence` must not hijack the wheel or touch stream.
- Each frame has a stable ID, semantic label, reading order, entry/exit intent, and optional continuity actors.
- Navigation can use native anchors and history.
- A focused frame can be deep-linked and refreshed.
- Frame transitions describe meaning, not CSS implementation:
  - `approach`;
  - `occlude`;
  - `expose`;
  - `transpose`;
  - `release`;
  - `inherit`;
  - `cut`;
  - biome-specific extensions only when justified.
- Reduced motion replaces movement with state change, ordering, opacity, or an immediate cut.
- Mobile preserves the host force, not desktop coordinates.

**Biome mappings to prove:**

- reliquary: approach, illuminate, hold;
- manifesto: cut, interrupt, repeat;
- ecological elegy: drift, absorb, continue;
- machine ecology: traverse, inherit, persist;
- kinetic rupture: release, split, scatter;
- oneiric object-poetry: tilt, settle, preserve.

**RED to GREEN slices:**

1. Render two semantic frames with native anchor navigation.
2. Deep-link a frame and preserve `aria-current` and focus behavior.
3. Resolve a semantic transition intent into an opt-in visual transition.
4. Preserve a continuity actor across a transition without duplicating required content.
5. Disable all nonessential movement under reduced motion.
6. Preserve keyboard and touch access without event trapping.
7. Resolve an incompatible transition request with a documented cut fallback.

**Verification:**

- `npx --yes tsx --test tests/next-frames.test.ts`
- `CI=1 npx playwright test tests/next-frames.spec.ts --workers=1`
- browser checks for history, keyboard focus, touch-compatible native navigation, and reduced motion.

### Phase 5: Add selected scroll-native passages

**Objective:** support scroll where scrolling is the artwork or necessary reading, without making scroll the universal presentation mode.

**Files:**

- Create: `src/lib/next-experiments/Passage.svelte`
- Create: `src/lib/next-experiments/passageResolution.ts`
- Create: `tests/next-passages.test.ts`
- Create: `tests/next-passages.spec.ts`
- Modify: `docs/hyvui-next-design.md`

**Initial passage types:**

- ecological absorption;
- machine traversal;
- kinetic scrubbing;
- archival excavation;
- long-form manifesto reading.

**Constraints:**

- native scroll remains active;
- no default wheel interception;
- progress is observable and keyboard equivalent;
- content remains present in DOM reading order;
- passage can fall back to a static sequence or standard document flow;
- reduced motion exposes all important states without requiring scroll animation;
- touch interaction remains normal;
- the passage declares why scrolling is conceptually necessary.

**RED to GREEN slices:**

1. Render a scroll-native passage with a stable progress state.
2. Provide a non-motion equivalent for the same content.
3. Expose progress to assistive technology without pretending it is a page-load metric.
4. Ensure passage boundaries can be entered and exited naturally.
5. Verify a frame can contain a passage without changing the global document behavior.

**Verification:**

- `npx --yes tsx --test tests/next-passages.test.ts`
- `CI=1 npx playwright test tests/next-passages.spec.ts --workers=1`
- mobile and reduced-motion browser checks.

### Phase 6: Material, typography, ornament, and light behavior

**Objective:** give biome plans a real projection into the existing HyvUI material system without adding raw color or effect soup.

**Files:**

- Create: `src/lib/next-experiments/biomeMaterials.ts`
- Create: `src/lib/next-experiments/biomeTypography.ts`
- Create: `src/lib/next-experiments/biomeAtmosphere.ts`
- Modify only where required: `src/lib/tokens/`
- Modify: `src/lib/next-experiments/capabilities.ts`
- Create: `tests/next-biome-materials.test.ts`
- Create: `tests/next-biome-materials.spec.ts`

**Rules:**

- Reuse existing semantic tokens first.
- New tokens require a documented material need and a reference-backed role.
- Theme, weight, grade, and biome remain separate channels.
- A biome may choose an absence of ornament or typography.
- Effects must name their cause: reflection, residue, absorption, pressure, registration, orbit, illumination, or another declared phenomenon.
- Do not turn the six proof branches into six global themes.
- Preserve authored content contrast and control affordances.

**RED to GREEN slices:**

1. Project a biome typography plan into distinct display and supporting roles.
2. Project a material plan into existing token variables without raw hex values.
3. Add one causal atmosphere actor that is absent when no plan requests it.
4. Add one biome-specific ornament capability with a caution and fallback.
5. Verify interactive controls remain legible against every proof material.

**Verification:**

- `npx --yes tsx --test tests/next-biome-materials.test.ts`
- `CI=1 npx playwright test tests/next-biome-materials.spec.ts --workers=1`
- `npm run check`
- `npm run build`
- visual review across all six host proofs.

### Phase 7: Agent-facing manifest and composition tools

**Objective:** make the expanded possibility space discoverable to agents without encouraging fixed templates.

**Files:**

- Modify: `src/lib/next-experiments/capabilities.ts`
- Create: `src/lib/next-experiments/biomeManifest.ts`
- Modify: `scripts/inspect-composition.ts`
- Modify: `schemas/composition-experiment.schema.json`
- Create: `schemas/examples/biome-composition.json`
- Create: `tests/next-biome-manifest.test.ts`
- Modify: `docs/next.md`
- Modify: `SKILL.md`
- Modify: `llms.txt`

**Manifest must expose:**

- host biome IDs and laws;
- genome channels and bounds;
- compatible grafts and bridge concepts;
- destructive combinations and reasons;
- frame modes and native transitions;
- passage modes and scroll justification;
- semantic roles and relation kinds;
- material capabilities and cautions;
- anti-patterns;
- inspectable fallbacks;
- example briefs that describe premise and constraints without prescribing a page template.

**Tooling:**

- Extend `npm run inspect:next -- --manifest` to include biome capability data.
- Add a composition inspection mode that prints host, grafts, active genes, spatial plan, temporal plan, rejected suggestions, and fallbacks.
- Keep the inspector read-only.
- Do not add an MCP bridge until an agent-discovery experiment proves the local manifest is insufficient.

**Verification:**

- `npm run test:next`
- `npm run inspect:next -- --manifest`
- `npm run inspect:next -- --file schemas/examples/biome-composition.json`
- schema validation;
- documentation consistency review.

### Phase 8: Controlled agent bakeoff

**Objective:** test whether agents can actually discover and use the black-magic composition language.

**Files:**

- Read and use: `docs/research/agent-evaluation-protocol.md`
- Read and use: `docs/research/agent-rubric.md`
- Create: `docs/research/biome-agent-bakeoff.md`
- Create or extend: `scripts/run-biome-bakeoff.*`
- Create: `tests/next-agent-bakeoff.test.*` as appropriate for the harness.

**Experimental conditions:**

1. current public HyvUI control;
2. relationship-layer condition;
3. biome-manifest condition;
4. biome-manifest plus inspector condition.

Use identical:

- prompt corpus;
- model and temperature settings;
- viewport sizes;
- asset budget;
- time budget;
- content requirements;
- evaluation rubric.

Prompts must state subject, audience, mood, content, and accessibility requirements without prescribing hero sections, cards, or a specific biome.

**Measure:**

- host-biome selection;
- valid versus rejected grafts;
- number of meaningful relations;
- repeated layout signatures;
- manual CSS escape-hatch usage;
- steering turns required;
- semantic and accessibility violations;
- determinism across repeated seeds;
- hierarchy, coherence, causal fit, surprise, and recognizable identity scored by blind human review;
- whether visual diversity increases without increasing incoherence.

**Acceptance:** do not claim agent improvement unless the paired artifacts, prompt conditions, scores, and failures are stored and reviewed. A handcrafted gallery remains authored evidence only.

### Phase 9: Public API decision and migration

**Objective:** promote only the smallest proven layer.

**Possible public exports, only after approval:**

- biome types and definitions;
- composition brief and resolver;
- `FrameSequence`, `Frame`, and `Passage`;
- inspector utilities;
- manifest accessors.

**Do not promote:**

- proof-only frame markup;
- arbitrary strong runtime authority;
- a global observer;
- opaque visual mutation;
- a biome-specific page template.

**Gate:** user review of the decision document, green targeted suite, production build, package dry-run, accessibility review, and successful or honestly inconclusive bakeoff.

## 7. Testing and verification strategy

### Pure tests

Pure tests must cover:

- biome definition completeness;
- compatibility and destructive graft rejection;
- deterministic resolution;
- genome bounds;
- host attention-policy preservation;
- focal policy resolution;
- semantic order preservation;
- transition and passage fallback resolution;
- reduced-motion plan resolution;
- inspector completeness.

### Browser tests

Browser tests must cover:

- six different host frame signatures;
- host-and-graft proof cases;
- full-viewport geometry;
- native navigation and deep links;
- history and focus behavior;
- touch-compatible navigation;
- no wheel trapping;
- selected scroll-native passages;
- mobile reinterpretation;
- reduced-motion alternatives;
- readable controls and non-overflowing required content;
- visual plan metadata and rejected-decision inspection.

### Visual review

Every new biome or graft requires a screenshot review against:

- hierarchy;
- visual thesis;
- material causality;
- edge use;
- typographic roles;
- temporal behavior;
- interaction meaning;
- accessibility and legibility;
- distinctness from the other biomes;
- absence of generic costume effects.

Do not use one diversity score as proof of artistic quality.

### Required commands per implementation slice

```bash
npx --yes tsx --test <focused-test-file>
npm run test:next
npm run check
npm run build
npx prettier --plugin=prettier-plugin-svelte --check <changed-files>
git diff --check
```

For browser work, serialize the lifecycle:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
curl --fail --silent --show-error --output "$LOCALAPPDATA/Temp/hyvui-route.html" --write-out 'route_http=%{http_code}\n' http://127.0.0.1:4173/<route>
CI=1 npx playwright test <focused-browser-suite> --workers=1
```

The repository-wide `npm run lint` currently contains legacy formatting debt. Keep reporting its exact scope separately until that debt is intentionally addressed. The new slice must pass targeted formatting checks.

## 8. Documentation deliverables

Maintain these documents as the architecture evolves:

- `docs/research/art-biomes/biome-architecture.md` for reference-derived visual laws;
- `docs/research/art-taste-reference-analysis.md` for individual evidence;
- `docs/research/prototype-gallery.md` for authored proof results;
- `docs/decisions/black-magic-artistic-ui.md` for architecture decisions and rejected alternatives;
- `docs/hyvui-next-design.md` for implementation boundaries;
- `docs/next.md` for experimental usage;
- `SKILL.md` and `llms.txt` for agent-facing composition guidance;
- `docs/research/biome-agent-bakeoff.md` for comparative evidence.

Every document should distinguish:

- requirement;
- observation;
- hypothesis;
- experiment;
- decision;
- implementation result;
- unresolved question.

## 9. Risks and mitigations

| risk                                               | mitigation                                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| biomes become renamed templates                    | require multiple signatures per biome and shared-content proofs                          |
| grafts become style soup                           | host ownership, channel limits, bridge/conflict reasons, rejection rules                 |
| runtime becomes a hidden layout engine             | pure resolution first, local opt-in geometry only, inspector and fallbacks               |
| “black magic” becomes random                       | seed every identity-bearing decision and record its reason                               |
| artistic density harms comprehension               | keep semantic content stable, provide progressive disclosure, review controls separately |
| transitions become a gimmick                       | map them to semantic intents and provide cut/static fallbacks                            |
| scrolling becomes a trap                           | native scroll, no wheel interception, keyboard equivalents                               |
| themes flatten material differences                | keep biome, theme, weight, and grade channels separate                                   |
| agents cannot discover the system                  | manifest, examples, inspector, then controlled bakeoff                                   |
| authored proof code is mistaken for infrastructure | keep gallery private and label it as evidence, not API                                   |
| bundle/runtime cost grows invisibly                | add no dependency without a measured need and track build output                         |
| legacy formatting obscures new quality             | targeted formatting checks and separate baseline reporting                               |

## 10. Out of scope for the first implementation cycle

- replacing all existing HyvUI scenes;
- rewriting the entire public component library;
- automatic biome selection based on opaque visual heuristics;
- a global page observer;
- an always-on canvas renderer;
- generative image or asset production;
- uncontrolled procedural noise;
- public API promotion before the bakeoff;
- solving all legacy Prettier debt;
- claiming that any single biome defines HyvUI art.

## 11. Completion criteria for the first real release candidate

The black-magic layer is not ready for public promotion until all of the following are true:

- 12 biome definitions exist as inspectable data records;
- at least six biomes have materially different authored proofs;
- at least three host-and-graft hybrids render coherently;
- at least one destructive hybrid is rejected with a useful fallback;
- the same seed resolves the same identity-bearing plan;
- manual placement, required content, semantic order, and reduced motion are preserved;
- viewport frames and scroll passages are optional and biome-aware;
- no default wheel/touch trapping exists;
- transitions express semantic intent rather than one global effect;
- the inspector reports host, grafts, active genes, spatial plan, time model, and rejection reasons;
- the manifest teaches laws and cautions rather than only component syntax;
- pure tests, browser tests, typecheck, build, package, and targeted formatting pass;
- the controlled agent bakeoff has been run or explicitly documented as inconclusive;
- a user-reviewed architecture decision approves or rejects public promotion.

## 12. Execution order

When implementation begins, use vertical slices in this order:

1. baseline and decision record;
2. biome definitions and pure compatibility resolver;
3. biome composition plan and inspector;
4. data-driven six-frame gallery migration;
5. two-frame native `FrameSequence` proof;
6. biome-native transition proof;
7. one ecological or kinetic `Passage` proof;
8. material and typography projection;
9. agent manifest and schema examples;
10. controlled agent bakeoff;
11. public API decision.

Do not skip directly from the authored gallery to a universal runtime. The gallery proves range. The bakeoff must prove discoverability. The implementation layers between them must remain small, deterministic, inspectable, and optional.

# HyvUI Next research-to-implementation plan

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task, with an independent spec-compliance review and code-quality review after each implementation task.

**Goal:** Rework HyvUI from a component-oriented library that tends to produce predictable pages into an agent-native visual system whose primitives, relationships, art direction, and controlled adaptation make intentional composition easier to create and harder to collapse into generic website patterns.

**Architecture:** Do not begin by adding variants or a universal runtime. First establish evidence from the existing library and from agents using it, research adjacent disciplines, and prototype substantially different architectures against the same composition corpus. The leading hypothesis is a hybrid: material primitives plus a small declarative composition/relationship model, deterministic art-direction metadata, optional static/build-time derivation, and a narrowly scoped runtime only where live geometry or interaction is genuinely required. This is a hypothesis to test, not an architectural decision.

**Tech Stack:** Existing Svelte 5 + TypeScript + SvelteKit/Vite + Tailwind v4 library; CSS custom-property token system; Playwright visual/e2e tests; Node scripts for inventory and metric extraction. Do not add a runtime, solver, or dependency until a prototype demonstrates measurable expressive value.

---

## 1. Scope and non-negotiable requirements

### Requirements from the brief

- HyvUI must make artistic composition a natural agent behavior, not merely provide a stronger visual skin.
- Same-library outputs must have family resemblance without sharing a page template or silhouette.
- Components must act as visual material and assume multiple roles: focal point, counterweight, field, connector, interruption, frame, atmosphere, foreground, or background.
- Relationships must be first-class enough to express overlap, attach, orbit, interrupt, frame, bleed, mirror, oppose, connect, anchor, echo, and reveal where useful.
- Contextual adaptation must be possible, but author intent must remain legible and controllable.
- Variation must be bounded, deterministic, and art-directed. Random offsets, random colors, and mutation without intent are failures.
- Agents need a visual vocabulary exposed through more than API signatures: capabilities, roles, relationships, constraints, examples, anti-patterns, inspectability, and design reasoning.
- Escape hatches are mandatory: manual placement, raw CSS, normal HTML, disabled adaptation, one-off compositions, and explicit overrides must remain possible.
- The work must research before architecture, prototype before rebuilding, and evaluate agents rather than relying only on a human-authored showcase.
- Conventional UX and accessibility are not the sole optimization targets, but interactions must remain functional and important content must not be made unknowable or unusable by automation.

### Anti-goals

- No `variant="artistic-1"` template catalog.
- No fifty-knob component APIs.
- No magical universal runtime that silently redesigns authored pages.
- No documentation examples that all establish one canonical layout.
- No treating a single beautiful handcrafted demo as evidence.
- No dependency or solver adoption before it earns its complexity through a prototype.
- No breaking the current public component surface merely to prove a new abstraction.

### Decision principles

1. **Explicit intent outranks adaptation.** Hard author constraints must win over suggestions and defaults.
2. **Determinism outranks surprise.** Any variation uses a seed and a bounded policy so SSR, hydration, debugging, and screenshots are stable.
3. **Suggestions before mutation.** Experimental systems should first expose proposed changes and their reasons. Automatic application must be opt-in and inspectable.
4. **Structure is not identity.** Preserve HyvUI's tokens, typography/material discipline, motion restraint, and operator-adjacent visual DNA while allowing radically different spatial organization.
5. **Measure expressive gain.** Every abstraction needs a before/after composition test and an agent-discovery test.
6. **Progressive adoption.** Existing `Text`, `Surface`, `Grid`, `Card`, scenes, registers, themes, depth, actions, and ordinary HTML/CSS continue to work while the next layer is experimental.

---

## 2. Current repository context

The repository is clean on `main` at the planning baseline. It is a Svelte 5 TypeScript package with the verification scripts in `package.json`: `npm run lint`, `npm run check`, `npm run build`, and `npm run test:e2e`.

Important existing surfaces to audit rather than assume:

- `src/lib/index.ts:1-202` is the public barrel and already exports primitives, layout, ambient, orchestration, actions, motion, depth, and scenes.
- `src/lib/components/primitives/Surface.svelte:13-39` exposes only `variant`, `as`, `withInset`, and `class`; it supplies a finished surface treatment and theme-specific CSS.
- `src/lib/components/primitives/Text.svelte:14-53` exposes a small typographic API plus `expression`; the current expression system is the closest existing attempt at semantic visual intent.
- `src/lib/components/layout/Card.svelte:17-52` has a single compositional escape hatch, `staggerOffset`, while still presenting a fairly finished card decision.
- `src/lib/components/layout/Stack.svelte:17-58`, `Cluster.svelte:17-60`, and `Grid.svelte:15-120` provide conventional flex/grid organization. `Grid.svelte` already uses `ResizeObserver` for container-aware column calculation.
- `src/lib/components/layout/Shell.svelte:18-59` and `Frame.svelte:19-61` demonstrate useful size/ratio constraints without imposing a page template.
- `src/lib/components/scenes/StageScene.svelte:20-69` is explicitly centered and theatrical; `DepthScene.svelte:25-78` is spatial but still has fixed ambient/ground/stage/foreground zones. Other scene components should be checked for the same structural pressure.
- `src/lib/components/depth/DepthStage.svelte:14-67` and `src/lib/system/depth/depth.ts` provide a reusable spatial substrate rather than a general composition system.
- `src/lib/system/register.ts:1-85` applies weight/theme/grade through DOM attributes. `src/lib/system/motion/registerObserver.ts:1-59` uses a shared `MutationObserver` for the body register/theme state.
- `src/lib/system/actions/` provides composable behavior (`surface`, `echo`, `reveal`, `resolve`, `track`) and is a possible precedent for opt-in composition behavior.
- `src/lib/examples/*.svelte`, `src/lib/examples/sceneCatalog.ts`, `docs/recipes.md`, and `docs/api/scenes.md` are the current example/template pressure points. The scene documentation currently says one scene per page is the expected pattern, and recipes repeatedly demonstrate scene-plus-grid/card composition. Treat this as a likely cause of structural repetition, to verify rather than merely assume.
- `README.md`, `AESTHETICS.md`, `COMPONENTS.md`, `INSTALL.md`, `llms.txt`, and `SKILL.md` are all published or agent-facing documentation surfaces. They must be audited as a system. In particular, the current agent material contains historical naming/API inconsistencies around `data-register`/`applyRegister` versus the implemented `data-weight`/`applyWeight`; the next phase must record and correct these rather than copying them forward.
- `tests/lab.spec.ts` currently covers responsive visual frames at eight widths. `tests/showcase.spec.ts` covers the anthology homepage and six showcase routes. There is no obvious unit-test script in `package.json`, so prototype contracts should initially use Playwright/browser assertions or add a unit runner only when justified.

The first implementation task must re-check `git status`, current branch, and line numbers before editing because this plan is not a substitute for a fresh repository read.

---

## 3. Research questions to answer

The research artifacts must explicitly separate **observed evidence**, **hypotheses**, **proposed experiments**, and **decisions**.

1. Which current APIs most strongly push agents toward a sequence of scene → heading → copy → cards → footer?
2. Which existing pieces already expand composition successfully: snippets, `Frame`, `DepthStage`, `ParallaxLayer`, `Sequence`, `KineticText`, ornaments, themes, or actions?
3. What do agents actually generate when given the same open-ended brief with the current library and no hand-authored layout recipe?
4. Does exposing capabilities and relationships increase agent compositional diversity, or does it simply add syntax that agents ignore?
5. Are relationships better represented as Svelte components, a typed manifest, a scene graph, attributes/CSS custom properties, generated CSS, or a combination?
6. Which decisions require live browser geometry, and which can be derived at generation/build time?
7. Can contextual adaptation improve a composition without causing layout shift, hydration differences, opaque mutations, or loss of author control?
8. Which ideas from editorial design, experimental typography, generative art, motion design, spatial design, scene graphs, constraint systems, and creative coding can be reduced to stable computational primitives?
9. What constitutes HyvUI identity when layout silhouettes and hierarchy are intentionally different?
10. Which metrics can detect structural diversity and coherent novelty without pretending that “awe” is fully objective?

---

## 4. Phase A — Audit HyvUI and establish a baseline

### Task A1: Capture a reproducible repository baseline

**Files:**

- Create: `docs/research/hyvui-next-baseline.md`
- Inspect only: `package.json`, `src/lib/index.ts`, `tests/lab.spec.ts`, `tests/showcase.spec.ts`

**Steps:**

1. Re-run `git status --short --branch` and `git log -5 --oneline`.
2. Run `npm run lint`, `npm run check`, and `npm run build`; record exact exit status and meaningful output in the baseline document.
3. Record the Node/npm/Svelte/Vite versions using read-only commands.
4. Record the current public export inventory from `src/lib/index.ts` and the current test coverage shape.

**Acceptance:** The baseline records commands, dates, outputs, known warnings, and a clear distinction between verified facts and open questions. Do not change production code in this task.

### Task A2: Build an API and capability inventory

**Files:**

- Create: `scripts/collect-component-surface.mjs`
- Create: `docs/research/component-capability-inventory.md`
- Test/verification: `scripts/collect-component-surface.mjs` against `src/lib/components/`

**Steps:**

1. Parse component source and existing docs to enumerate each component's group, props, snippets/children, DOM behavior, CSS variables, transforms, observers, motion, theme awareness, and current escape hatch.
2. Classify each component's current visual role and its current _implied_ role from the docs.
3. Mark “finished design decision,” “material-like,” “layout-only,” “ambient,” and “composition-level” as audit labels, not new runtime concepts.
4. Identify mismatches between source, `COMPONENTS.md`, `llms.txt`, `SKILL.md`, and API docs.
5. Keep the script deterministic so later runs show API drift.

**Acceptance:** A generated or hand-reviewed inventory can answer what an agent can currently do with each component without opening every source file.

### Task A3: Analyze current example/template pressure

**Files:**

- Create: `docs/research/current-composition-audit.md`
- Read/compare: `src/lib/examples/*.svelte`, `docs/recipes.md`, `docs/api/scenes.md`, `README.md`, `SKILL.md`

**Steps:**

1. Extract top-level DOM/layout signatures for the existing examples and recipes: scene wrappers, number of columns, card count, centered content, repeated spacing, and fixed slots.
2. List every instruction that says “always,” “expected,” “best,” or “use this before,” then classify whether it protects identity or constrains composition.
3. Document errors that may cause agents to choose stale APIs or stale naming.
4. Write a causal hypothesis for each repetition pattern. Do not prescribe a fix yet.

**Acceptance:** The audit names the exact examples and documentation instructions that may be acting as templates and identifies what should be preserved.

### Task A4: Produce a current-library baseline anthology

**Files:**

- Create: `src/routes/next-lab/baseline/+page.svelte`
- Create: `src/lib/next-lab/baselineCases.ts`
- Modify only if needed: `src/routes/+layout.svelte` or route navigation
- Test: `tests/next-baseline.spec.ts`

**Steps:**

1. Create five intentionally different briefs using only the current public library: sparse, dense, image-dominated, typography-dominated, and motion/depth-heavy.
2. Do not add next-generation APIs. This is a control group.
3. Use the same content model and viewport set later used by prototypes.
4. Add stable `data-composition-case` and `data-layout-signature` hooks for measurement, not styling.
5. Add Playwright checks that every case renders at desktop and narrow widths without unhandled exceptions.

**Acceptance:** The repository contains a reproducible current-library control group, including at least one case that deliberately avoids cards and one that deliberately stresses overlap/occlusion through existing escape hatches.

---

## 5. Phase B — Observe agents using the current library

### Task B1: Define the agent baseline protocol

**Files:**

- Create: `docs/research/agent-baseline-protocol.md`
- Create: `docs/research/agent-prompts.md`

Define a fixed prompt corpus of at least eight open-ended briefs spanning a poster, editorial spread, album artwork, installation, gallery index, data landscape, typographic statement, and motion-led experience. Each prompt must specify content and functional requirements but must not prescribe a layout.

For each run, record:

- agent/model/provider and date
- repository revision and dependency state
- prompt text and any system/skill context
- files changed and commands run
- top-level DOM/layout signature
- use of scenes, grids, cards, overlap, depth, transforms, and raw CSS
- amount of additional steering required
- runtime/build failures and accessibility/interaction failures
- author self-report of the visual idea

Do not treat agent self-report as visual evidence. Store screenshots and machine-extracted signatures alongside it.

### Task B2: Run and score the current-library agent baseline

**Files:**

- Create: `research/agent-runs/` or an explicitly gitignored equivalent
- Create: `docs/research/agent-baseline-results.md`
- Create: `scripts/analyze-composition-signatures.mjs`

Run at least three independent agent attempts per prompt when resources allow. Use the same project instructions and avoid giving one attempt privileged design hints. If multiple agents are used, dispatch independent runs in parallel and aggregate results programmatically rather than counting by hand.

Measure:

- top-level layout-signature diversity
- number of distinct composition roles used
- ratio of scene/card-grid patterns
- overlap and occlusion rate
- repeated spacing and alignment patterns
- deterministic build/render success
- interaction success
- human-rated coherence, originality, intentionality, and visual tension
- prompt/steering cost

**Acceptance:** The results show what agents actually do with the current API and distinguish “agent did not discover capability” from “capability was unavailable.”

---

## 6. Phase C — External prior-art research

### Task C1: Research adjacent disciplines and technical primitives

**Files:**

- Create: `docs/research/external-prior-art.md`
- Optional research notes: `docs/research/sources/`

Use multiple searches per topic and cite primary documentation, papers, books, or original project documentation where possible. At minimum investigate:

- editorial and Swiss/post-Swiss composition, modular grids, asymmetry, rhythm, and intentional interruption
- experimental typography and variable typography as composition rather than decoration
- generative art, seeded procedural variation, weighted choices, and bounded mutation
- motion design, staging, choreography, occlusion, reveal, and visual continuity
- scene graphs, retained-mode graphics, spatial relationships, and graph inspection
- constraint-based layout and the trade-off between solvability and authorial control
- creative coding and shader/canvas systems for fields, textures, and atmosphere
- CSS container queries, anchor positioning, subgrid, custom properties, and View Transitions
- responsive art direction and what must remain stable between viewport sizes
- agent-native interfaces: structured manifests, discoverability, introspection, schemas, and tool-mediated workflows

Initial query families:

```text
"computational design grammar" generative layout graphic design
"constraint based layout" visual composition scene graph web
"scene graph" relationships 2D interface layout
site:developer.mozilla.org CSS container queries anchor positioning subgrid
"seeded randomness" generative art deterministic variation design
"agent generated UI" structured design metadata composition
"computational typography" responsive experimental type layout
"motion design" choreography staging occlusion interactive web
```

The report must include, per source: the principle, the computationally useful abstraction, the risk of cargo-culting it, and whether it belongs in HyvUI primitives, relationships, composition, art direction, adaptation, or nowhere.

### Task C2: Research existing agent-facing design-system representations

**Files:**

- Modify: `docs/research/external-prior-art.md`
- Create: `docs/research/agent-vocabulary-options.md`

Compare API docs, component manifests, JSON Schema, typed TypeScript declarations, design tokens, Storybook-style metadata, MCP/tool interfaces, searchable examples, and executable inspectors. Evaluate them for:

- discoverability by an LLM
- ability to describe visual capability rather than only props
- versioning and compatibility
- inspectability of generated composition
- token/context propagation
- prompt footprint
- human readability

**Acceptance:** The report makes a recommendation about the minimum useful agent-facing representation while leaving the public syntax open until prototype evidence exists.

---

## 7. Phase D — Develop and compare competing architectures

### Task D1: Define a common domain model for comparison

**Files:**

- Create: `docs/research/composition-domain-model.md`
- Create: `schemas/composition-experiment.schema.json`

Use a syntax-neutral model for experiments. It should be able to represent:

```text
ArtDirection
  seed
  mood / material / density / contrast / rhythm / motion / aggression

Node
  id
  visual role
  primitive or content reference
  capabilities
  explicit constraints
  authored placement or priority

Relation
  kind
  source / target
  strength or range
  preferred behavior
  hard-vs-soft constraint

AdaptationPolicy
  disabled | suggest | apply (candidate modes)
  deterministic seed
  author override precedence
  viewport/context scope
```

These names are a test vocabulary, not a committed API. The schema must support ordinary HTML/content nodes and explicit escape hatches so the graph never becomes a closed rendering world.

### Task D2: Write the architecture matrix

**Files:**

- Create: `docs/research/architecture-matrix.md`

Compare at least these substantially different models:

1. **Expressive material primitives.** A small set of capability-oriented primitives and semantic axes; no global graph.
2. **Scene graph and first-class relationships.** Nodes plus typed edges such as overlap, echo, attach, oppose, and connect.
3. **Compile/build-time composition derivation.** Agent-authored metadata is analyzed into stable CSS/Svelte output; runtime stays minimal.
4. **Opt-in contextual runtime.** A browser observer measures bounds/context and proposes or applies bounded adaptations.
5. **Hybrid candidate.** Material primitives + relationship metadata + deterministic art direction + static derivation + opt-in runtime measurement.

For every architecture, document:

- artistic power and the specific new possibilities it enables
- agent usability and how capabilities are discovered
- implementation complexity and likely files/dependencies
- runtime cost, SSR/hydration behavior, and layout-shift risk
- predictability, debuggability, and inspectability
- composability with ordinary HTML/CSS and existing HyvUI
- progressive adoption and compatibility strategy
- failure modes and escape hatches
- how it could create five different-looking websites with the same primitives
- what evidence would falsify the architecture

Do not select an architecture on elegance alone.

### Task D3: Select prototypes, not the final framework

**Files:**

- Create: `docs/research/prototype-selection.md`

Choose at least two competing implementations for Phase E, ideally one static/graph-derived model and one runtime/context model, plus the current-library control. Define the smallest experiment that can distinguish them. Explicitly state which features are excluded until proven necessary: full constraint solver, automatic color invention, global DOM mutation, arbitrary component introspection, and non-deterministic generation.

**Decision gate:** Proceed only when the proposed prototypes have a shared input model, shared visual cases, shared screenshots/metrics, and a clear falsification criterion.

---

## 8. Phase E — Prototype the expressive system before rebuilding the package

### Task E1: Build the prototype harness and shared cases

**Files:**

- Create: `src/routes/next-lab/+page.svelte`
- Create: `src/lib/next-lab/cases.ts`
- Create: `src/lib/next-lab/metrics.ts`
- Modify: `vite.config.ts` only if the harness needs a documented test-only hook
- Test: `tests/next-lab.spec.ts`

The harness must render the same content through:

- the current-library control
- each candidate composition implementation
- a manual/escape-hatch reference where useful

It must expose a visible or machine-readable inspection mode showing nodes, roles, relations, seeds, applied suggestions, and overridden decisions. Keep inspection separate from production visuals.

### Task E2: Prototype a material/capability model

**Files, conditional on the architecture matrix:**

- Create: `src/lib/next-experiments/material.ts`
- Create: `src/lib/next-experiments/capabilities.ts`
- Create: `src/lib/next-experiments/ArtDirection.svelte`
- Create: `src/lib/next-experiments/Material.svelte` or the smallest equivalent
- Test: `tests/next-material.spec.ts`

Test whether a small set of semantic capabilities and art-direction context enables an agent to use the same `Text`, `Surface`, `Frame`, image, line, and ambient primitives in different visual roles without a large prop surface. Keep public exports private to the experiment until the contract survives evaluation.

### Task E3: Prototype first-class relationships

**Files, conditional on selection:**

- Create: `src/lib/next-experiments/relationships.ts`
- Create: `src/lib/next-experiments/Composition.svelte`
- Create: `src/lib/next-experiments/Relation.svelte` only if component syntax proves more legible than data syntax
- Test: `tests/next-relationships.spec.ts`

Implement only a small relationship vocabulary needed by the test cases, such as `overlap`, `anchor`, `echo`, `connect`, and `interrupt`. Each relation must declare whether it is a hard constraint, a bounded preference, or a visual-only hint. Verify that relations can span components without targeting component-private class names.

### Task E4: Prototype deterministic context and variation

**Files, conditional on selection:**

- Create: `src/lib/next-experiments/variation.ts`
- Create: `src/lib/next-experiments/context.ts`
- Test: `tests/next-determinism.spec.ts`

Compare three modes:

1. no adaptation
2. suggest-only adaptation with an inspection trace
3. opt-in bounded application

Use seeded variation and ranges rather than unbounded random offsets. Test resize, SSR/hydration, repeated renders, reduced motion, and author overrides. A runtime may measure bounds using `ResizeObserver`/`IntersectionObserver`, but it must not silently reorder or redesign authored content.

### Task E5: Create the deliberately diverse composition set

**Files:**

- Create: `src/routes/next-lab/cases/sparse/+page.svelte`
- Create: `src/routes/next-lab/cases/dense/+page.svelte`
- Create: `src/routes/next-lab/cases/image-dominant/+page.svelte`
- Create: `src/routes/next-lab/cases/type-dominant/+page.svelte`
- Create: `src/routes/next-lab/cases/atmospheric-motion/+page.svelte`
- Create: `docs/research/prototype-gallery.md`
- Test: `tests/next-gallery.spec.ts`

Use the same primitive vocabulary as far as possible. The cases must deliberately challenge:

- sparse composition with large negative space
- dense composition with multiple simultaneous relationships
- image-dominated composition with unusual aspect ratios and bleed
- typography-dominated composition with scale and interruption
- dark atmospheric composition with depth and motion
- bright/graphic contrast if the token/theme model supports it
- highly asymmetric and restrained variants

The page silhouettes must be materially different. Do not force every case through `StageScene`, a card grid, or a centered hero.

**Acceptance:** The prototype gallery contains evidence that the architecture can produce family resemblance without structural sameness. If it cannot, stop and revise the model before adding more implementation.

---

## 9. Phase F — Evaluate agents with the prototypes

### Task F1: Define the agent evaluation rubric

**Files:**

- Create: `docs/research/agent-evaluation-protocol.md`
- Create: `docs/research/agent-rubric.md`

Use the same prompt corpus as Phase B. Score separately:

- discovery: did the agent find and use the visual vocabulary without bespoke steering?
- structural diversity: are top-level silhouettes and spatial organizations different?
- compositional originality: does the output escape known generic patterns?
- coherence: do scale, rhythm, material, and relationships feel intentional?
- relational use: are overlaps, echoes, connectors, and interruptions meaningful?
- adaptation quality: does context improve rather than obscure author intent?
- determinism and debuggability
- functional interaction and responsive survival
- prompt/steering cost

Use a blind human review for originality/coherence/intentionality and machine checks for structure, determinism, build/render stability, and interaction. Never use a single screenshot score as the decision.

### Task F2: Run the comparative agent evaluation

**Files:**

- Create: `research/agent-evaluation-runs/` or an explicitly gitignored equivalent
- Create: `scripts/aggregate-agent-evaluation.mjs`
- Create: `docs/research/agent-evaluation-results.md`

Run the same agents/prompts against the current library and each prototype. Batch independent runs, append each result to a structured JSONL/CSV file, and aggregate with the script. Verify the requested run count programmatically before drawing conclusions.

Provisional decision gates to confirm before the run:

- at least four of five prototype cases have distinct dominant silhouettes;
- no candidate's outputs collapse into one scene/card-grid signature across the prompt corpus;
- prototype originality and intentionality scores improve over the current-library control without a material loss of coherence;
- deterministic re-rendering produces the same layout signature and screenshot under the same seed/viewport;
- no severe overflow, hydration, interaction, or reduced-motion regression is accepted as the price of novelty;
- agents discover at least some expressive capabilities from the agent-facing surface without a long bespoke prompt.

If a candidate fails, document why and discard or narrow it. Do not add features merely to rescue a failed hypothesis.

### Task F3: Make the architecture decision

**Files:**

- Create: `docs/decisions/0001-hyvui-next-composition-architecture.md`
- Modify: `docs/research/architecture-matrix.md` with final evidence links

The decision record must state:

- chosen architecture and why it earned its complexity
- rejected alternatives and evidence against them
- what is explicitly out of scope
- public API and compatibility boundaries
- runtime/build-time split
- author precedence and escape-hatch rules
- deterministic variation contract
- minimum agent-readable vocabulary
- risks that remain unresolved

No production package implementation begins before this decision record exists and is internally consistent.

---

## 10. Phase G — Write the validated HyvUI Next design specification

### Task G1: Author the design spec from evidence

**Files:**

- Create: `docs/hyvui-next-design.md`
- Modify as needed: `docs/research/*.md` only to fix contradictions or missing citations

Cover these sections:

1. problem statement and observed current failure modes
2. HyvUI identity and family resemblance
3. material primitives and capability descriptors
4. relationship vocabulary and relation precedence
5. art-direction context and deterministic seed/range semantics
6. context/adaptation modes and runtime boundary
7. agent-facing manifest/inspection/discoverability surface
8. Svelte/TypeScript/CSS data flow
9. SSR, hydration, responsive, reduced-motion, and normal HTML/CSS behavior
10. error handling and graceful degradation
11. migration path for current components/scenes
12. prototype evidence and success/failure metrics
13. public API stability policy
14. known limitations and future experiments

Do not use the design spec to smuggle in untested features. Anything not backed by an experiment must be labeled a hypothesis or future work.

### Task G2: Self-review the specification

**Files:** `docs/hyvui-next-design.md`

Perform the required review:

- scan for `TBD`, `TODO`, placeholders, and vague verbs;
- check that every architecture claim matches a research result;
- check that the API does not reintroduce variant/prop explosion;
- check that automatic behavior has an explicit opt-in and inspection story;
- check that ordinary HTML/CSS and existing components remain usable;
- check that every named acceptance criterion maps to a validation step;
- check licensing and attribution for external research and copied assets.

Then pause for user review of the spec before writing the implementation plan for the selected architecture.

---

## 11. Phase H — Implement the selected architecture incrementally

Implementation begins only after the design spec and decision record are approved.

### Task H1: Add the smallest typed core contract

**Likely files, to confirm against the approved spec:**

- Create: `src/lib/next/types.ts`
- Create: `src/lib/next/artDirection.ts`
- Create: `src/lib/next/seed.ts`
- Create: `tests/next-core.spec.ts` or a unit-test target justified by the spec

Implement types and pure functions first. Include validation for node IDs, relation endpoints, allowed ranges, seed normalization, and precedence. Keep the core SSR-safe and independent of DOM APIs.

Use TDD: write failing contract tests, verify failure, implement the minimum, then verify pass. Do not expose experimental types through `src/lib/index.ts` until the contract is stable.

### Task H2: Add relationship/context plumbing with no visual mutation by default

**Likely files:**

- Create: `src/lib/next/context.ts`
- Create: `src/lib/next/relationships.ts`
- Create: `src/lib/next/Composition.svelte`
- Create: `src/lib/next/Node.svelte` or the approved equivalent
- Modify: `src/lib/index.ts` only for approved public exports
- Test: `tests/next-composition.spec.ts`

Implement the smallest provider/consumer or graph mechanism that lets nodes declare capabilities and relations, inspect the composition, and opt into a policy. Default policy must preserve authored layout. Do not target private component classes for adaptation.

### Task H3: Add a narrowly scoped browser adapter only if earned

**Likely files:**

- Create: `src/lib/next/measure.ts`
- Create: `src/lib/next/adapter.ts`
- Create: `src/lib/next/inspect.ts`
- Test: `tests/next-runtime.spec.ts`, `tests/next-runtime.spec.ts` browser cases

Use observers only for information that cannot be known before render. Batch measurements, avoid feedback loops, keep mutations bounded, and expose applied/rejected suggestions. Verify SSR produces a stable initial result and runtime enhancement does not cause destructive layout shift. If the static prototype is sufficient, do not add this task.

### Task H4: Make existing materials composition-aware through stable public seams

**Likely files, only where required by the approved design:**

- Modify: `src/lib/components/primitives/Text.svelte`
- Modify: `src/lib/components/primitives/Surface.svelte`
- Modify: `src/lib/components/layout/Card.svelte`
- Modify: `src/lib/components/layout/Frame.svelte`
- Modify: `src/lib/components/layout/Stack.svelte`, `Grid.svelte`, or `Cluster.svelte` only if the contract requires it
- Modify: `src/lib/system/depth/*`, `src/lib/system/actions/*`, or token CSS only with evidence
- Test: focused component tests plus `tests/next-gallery.spec.ts`

Prefer data attributes, CSS custom properties, snippets, and documented wrapper seams over component-private class overrides. Preserve token and theme rules from `AGENTS.md`/`AESTHETICS.md`: no raw hex colors, no unapproved hues, no arbitrary radius, no theme flattening, and no heavy-weight hierarchy shortcuts.

### Task H5: Add the agent-readable vocabulary and inspector

**Likely files:**

- Create or update: `COMPONENTS.md`
- Create or update: `SKILL.md`
- Create or update: `llms.txt`
- Create or update: `docs/agent-vocabulary.md`
- Create or update: `docs/compositions.md`
- Create or update: `docs/relationships.md`
- Create: `scripts/inspect-composition.mjs` and/or a documented CLI entry if the approved design proves it useful
- Modify: `package.json` only if a stable `hyvui inspect` command is actually implemented

The agent surface must describe capability, visual role, compatible relations, hard/soft constraints, scale range, edge behavior, motion/material behavior, examples of radically different uses, and anti-patterns. It must not prescribe one layout. Correct stale `data-register`/`applyRegister` references to the implemented `data-weight`/`applyWeight` terminology or provide a deliberate compatibility alias with tests.

### Task H6: Rewrite examples to demonstrate possibility rather than template selection

**Likely files:**

- Modify: `README.md`
- Modify: `docs/recipes.md`
- Modify: `docs/api/scenes.md`
- Modify: `src/lib/examples/sceneCatalog.ts`
- Add/modify: `src/routes/next-lab/*` and final showcase routes
- Modify: `tests/showcase.spec.ts` and add visual snapshots only after the new compositions stabilize

Replace “always check this scene first” and “one scene per page” guidance with a composition-first decision flow. Retain conventional scenes as useful legacy/application structures, but clearly position them as optional materials rather than the default answer to every page.

### Task H7: Preserve migration and escape hatches

**Likely files:**

- Create: `docs/migration/hyvui-next.md`
- Create: `docs/migration/escape-hatches.md`
- Add: explicit tests under `tests/next-escape-hatches.spec.ts`

Verify that users can:

- render ordinary HTML inside/outside a composition;
- manually place or overlap a node;
- mark a relation as ignored or a composition as static;
- supply raw CSS through the sanctioned override surface;
- disable adaptation globally or locally;
- preserve explicit authored dimensions/positions;
- use existing components without adopting the new layer.

---

## 12. Verification and acceptance gates

Run verification after each implementation task and again at the end:

```bash
npm run lint
npm run check
npm run build
npm run format -- --check
npm run test:e2e
```

If `npm run format -- --check` is not supported by the existing Prettier script, use the repository's exact equivalent and record it instead of silently changing scripts.

Add or verify the following test categories:

- pure type/validation tests for nodes, relations, ranges, seeds, and precedence;
- SSR-safe import and render tests with no `window`/`document` assumptions;
- hydration and deterministic re-render tests;
- responsive tests at the existing lab widths: 280, 320, 375, 480, 640, 768, 1024, and 1440;
- reduced-motion tests for all new transitions, depth, and variation;
- browser interaction tests for any functional controls in compositions;
- context adaptation tests proving suggestions are bounded and explicit;
- no-private-class-override checks for the new layer;
- visual tests for the five radically different gallery cases;
- current showcase regression tests, including weight/theme attributes;
- build/package tests ensuring approved new exports and docs are actually publishable.

Final success review must answer every brief criterion explicitly:

1. same library, radically different results;
2. components behave like material;
3. relationships matter;
4. context matters where useful;
5. variation is coherent and deterministic;
6. agents become more adventurous with less steering;
7. HyvUI identity remains recognizable;
8. humans retain control;
9. complexity has measurable artistic value;
10. at least some compositions make reviewers stop and inspect the arrangement itself.

The last item is subjective and must be reported as a blind human-review result, not claimed from a screenshot or benchmark alone.

---

## 13. Risks, trade-offs, and open questions

- **Runtime temptation:** Geometry-aware adaptation is attractive but can create feedback loops, layout shift, hydration differences, and opaque behavior. Prefer static derivation or suggestions until live measurement proves necessary.
- **Graph complexity:** First-class relationships can become a second layout language that is harder than CSS. Limit the vocabulary, expose inspectable traces, and allow ordinary CSS to win.
- **Agent overload:** A richer manifest can increase prompt/context cost. Measure discovery and steering cost; do not publish every internal token or implementation detail.
- **Template inversion:** Replacing scene templates with a “composition component” that has fixed zones would reproduce the current problem under a new name.
- **Theme identity vs range:** Theme/material constraints should preserve HyvUI DNA, but themes must not force every page into the same ornaments or palette recipe.
- **Evaluation bias:** Human reviewers may reward novelty or polish independently of coherence. Blind review, paired comparisons, machine signatures, and fixed prompts are required.
- **Accessibility trade-off:** Experimental silhouettes may reduce conventional scanability. Keep controls and content functional, expose semantics, and record deliberate trade-offs instead of silently flattening them.
- **Responsive contradiction:** Desktop composition ideas may fail at narrow widths. Prototype mobile behavior as a compositional reinterpretation, not only a stacked fallback.
- **Documentation drift:** The current published agent surfaces contain stale naming and selection guidance. Treat docs as versioned product code and verify them against exports/source.
- **Package scope:** New dependencies, CLI tooling, or a runtime observer increase bundle and maintenance cost. Any addition requires a before/after artifact demonstrating expressive gain.

Open questions to resolve through the phases, not by assumption:

- Should the public representation be component syntax, data manifest, attributes, or a hybrid?
- Is `suggest` mode useful enough to justify an inspector, or should the first release be static-only?
- Which relationships are universal enough for the core, and which belong in recipes/examples?
- Can capability metadata be generated from source plus authored annotations, or does it need a hand-maintained manifest?
- Should art direction be inherited through Svelte context, CSS custom properties, explicit composition data, or all three?
- How should the system represent intentional imbalance without turning it into a numeric “art score”?
- What is the smallest identity kernel that remains recognizable across radically different silhouettes?

---

## 14. Execution order and stopping rules

1. Complete Phase A audit and baseline.
2. Run Phase B agent observations before modifying component APIs.
3. Complete Phase C external research with citations.
4. Compare architectures in Phase D and select only prototypes.
5. Build the control and competing prototypes in Phase E.
6. Evaluate agents and reviewers in Phase F.
7. Write and review the evidence-backed design spec in Phase G.
8. Wait for approval of the written spec.
9. Implement the selected architecture incrementally in Phase H.
10. Run the complete verification matrix and acceptance review in Phase I.

Stop and revise the hypothesis if:

- the prototype only creates prettier versions of the same layout;
- agents cannot discover the new vocabulary without extensive handholding;
- the runtime's artistic gain is not observable in paired comparisons;
- output is non-deterministic or author overrides are unreliable;
- the new API is harder to inspect than the current composition;
- a simpler architecture matches the best candidate's results;
- the system's family resemblance disappears entirely.

This plan intentionally does not authorize implementation during the planning turn. The next decision is review of this research-to-architecture plan, followed by the Phase A audit. Once the architecture design spec exists, it must receive user review before an implementation plan for the selected system is written.

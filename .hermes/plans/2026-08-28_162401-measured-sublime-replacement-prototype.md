# Measured Sublime Replacement Prototype Implementation Plan

> **For Hermes:** Execute this plan in the current workspace with strict TDD. Do not commit or push unless the user explicitly asks.

**Goal:** Build one isolated HyvUI Next prototype that proves the premise-first “measured sublime” philosophy with a real data-derived phenomenon, a quiet editorial field, truthful instrumentation, one trace, and one justified rupture.

**Architecture:** Keep the existing `atmospheric-motion` reliquary as a failed control. Add a private `/next-lab/measured-sublime` route backed by a pure deterministic specimen model. The model turns real composition nodes, relations, and resolver decisions into inspectable SVG geometry; the route stages that specimen inside an austere apparatus with progressive disclosure. Do not extend the public barrel or replace the current runtime until visual review and agent evaluation justify it.

**Tech Stack:** Svelte 5, TypeScript, deterministic HyvUI Next resolver data, semantic SVG, CSS custom properties/tokens, Node test runner through `tsx`, Playwright.

---

## Approved art direction

- **Premise:** a system can measure every relation except the moment intention becomes form.
- **Registers:** austere apparatus + speculative anatomy.
- **Field:** pale, near-monochrome, perceptually quiet editorial field occupying at least half the composition.
- **Phenomenon:** one dark decision specimen generated from actual node/relation/decision data.
- **Instrument:** real node identities, relation kinds, decision statuses, and reasons from `resolveComposition()`.
- **Trace:** one readable ordered seam through the specimen, derived from relation order.
- **Rupture:** one warm internal seam marking the transition from resolved relation to unresolved intention.
- **Withholding:** specimen internals remain partially concealed until the corresponding instrument item receives focus or activation.
- **Interaction:** focus/click reveals evidence and a matching specimen facet; no generic hover lift, glow bloom, or parallax.
- **Material evidence:** paper/institutional field, opaque artifact body, registration marks tied only to real nodes, seam tied only to real relations.

## Explicit non-goals

- Do not refactor or delete the existing strong art director.
- Do not add a public API or schema fields during this proof.
- Do not use the user’s reference images as assets.
- Do not introduce a new dependency.
- Do not add scan lines, HUD reticles, generic grids, orbit rings, random fragments, or ambient particles.
- Do not alter unrelated routes, snapshot baselines, or legacy formatting.
- Do not claim agent discoverability from the authored prototype.

## Task 1: Define the premise-first specimen contract

**Objective:** Establish a small pure API that makes decorative fabrication impossible when premise data is missing.

**Files:**

- Create: `src/lib/next-experiments/measuredSublime.ts`
- Create: `tests/next-measured-sublime.test.ts`
- Modify: `package.json`

**Step 1: Write one failing unit test**

Test a wished-for API resembling:

```ts
const plan = resolveMeasuredSublime({
  seed: "measured-sublime-01",
  premise:
    "a system can measure every relation except the moment intention becomes form",
  field: { quietRatio: 0.58, register: "austere-apparatus" },
  phenomenon: { id: "decision-specimen", source: "composition-decisions" },
  trajectory: "exposure",
  rupture: { kind: "internal-seam", relationId: "trace-leaves-beacon" },
  withholding: "conceal-facets-until-inspected",
  materialEvidence: ["node-boundary", "relation-seam", "decision-registration"],
  composition,
});
```

Assert:

- one premise and one phenomenon are preserved verbatim;
- `quietRatio` is clamped to `0.5..0.8`;
- every facet maps to a real composition node ID;
- every trace segment maps to a real relation decision;
- exactly one rupture is emitted;
- no atmosphere collection exists in the output;
- equal input produces deeply equal output.

**Step 2: Run RED**

Run:

```bash
npx --yes tsx --test tests/next-measured-sublime.test.ts
```

Expected: fail because `measuredSublime.ts` does not exist.

**Step 3: Implement the minimum pure model**

Define compact types:

```ts
type MeasuredSublimeInput = {
  seed: string;
  premise: string;
  field: {
    quietRatio: number;
    register: "austere-apparatus" | "speculative-anatomy";
  };
  phenomenon: { id: string; source: "composition-decisions" };
  trajectory: "exposure" | "assembly" | "release";
  rupture: { kind: "internal-seam"; relationId: string };
  withholding: "conceal-facets-until-inspected";
  materialEvidence: Array<
    "node-boundary" | "relation-seam" | "decision-registration"
  >;
  composition: ResolvedComposition;
};

type DecisionSpecimen = {
  premise: string;
  quietRatio: number;
  phenomenonId: string;
  facets: SpecimenFacet[];
  trace: SpecimenTraceSegment[];
  rupture: SpecimenRupture;
};
```

Derive SVG-normalized coordinates in a fixed `0..1000` view box using stable node IDs and namespaced deterministic variation. A new node must not shift existing facets. Reject an unknown rupture relation rather than inventing one.

**Step 4: Run GREEN**

Run the focused unit test and confirm pass.

**Step 5: Add one edge-case test**

Verify that an unknown rupture relation produces a clear issue/fallback and no arbitrary rupture geometry. Run RED, implement minimum behavior, rerun GREEN.

## Task 2: Render the data-derived phenomenon

**Objective:** Render one inspectable SVG artifact whose geometry is entirely traceable to the pure specimen model.

**Files:**

- Create: `src/lib/next-experiments/DecisionSpecimen.svelte`
- Create: `tests/next-measured-sublime.spec.ts`

**Step 1: Write a failing browser contract**

Target `/next-lab/measured-sublime` even though the route does not exist yet. Assert eventual DOM requirements:

- one `[data-phenomenon="decision-specimen"]`;
- no `[data-art-layer="atmosphere"]`;
- each `[data-specimen-facet]` ID belongs to the hidden inspection JSON node list;
- each `[data-specimen-trace]` relation ID belongs to the decision list;
- exactly one `[data-specimen-rupture]`;
- the SVG has an accessible title/description while decorative subpaths remain hidden from the accessibility tree.

**Step 2: Run RED**

```bash
npx playwright test tests/next-measured-sublime.spec.ts --workers=1 --grep "data-derived phenomenon"
```

Expected: route/selector failure.

**Step 3: Implement only `DecisionSpecimen.svelte`**

Props:

```ts
{
  specimen: DecisionSpecimen;
  activeId?: string;
  reducedMotion?: boolean;
}
```

Render:

- one opaque outer body;
- one facet per node;
- one trace segment per decision;
- one accent seam for the declared rupture;
- registration marks only where a real node/decision exists;
- `data-*` identity attributes for inspection.

Use token-derived colors only. Avoid filters and general glow; use directional luminance along the rupture seam.

**Step 4: Defer GREEN until the route exists**

The component is not considered verified in isolation; Task 3 completes the end-to-end tracer bullet.

## Task 3: Build the isolated measured-sublime route

**Objective:** Stage the phenomenon in a quiet field with truthful instrumentation and one typographic monument.

**Files:**

- Create: `src/routes/next-lab/measured-sublime/+page.ts`
- Create: `src/routes/next-lab/measured-sublime/+page.svelte`
- Modify: `tests/next-measured-sublime.spec.ts`

**Step 1: Create route data from real resolver output**

Use an authored, small composition model with real nodes and relations. Call `resolveComposition()` and then `resolveMeasuredSublime()` in `+page.ts`. Do not fabricate telemetry strings in the Svelte page.

Recommended semantic node set:

- `intention`: focal conceptual source;
- `constraint`: counterweight;
- `decision`: focal material/form transition;
- `witness`: readable explanatory content.

Recommended relation sequence:

- constraint anchors intention;
- decision reveals intention;
- witness follows decision.

The rupture relation is the `decision reveals intention` decision.

**Step 2: Implement the field**

The Svelte composition contains five explicit regions:

1. `data-role="field"`: pale local inversion with at least 50% quiet visual area;
2. `data-role="instrument"`: real premise, nodes, decisions, reasons, and policy;
3. `DecisionSpecimen`: dominant dark artifact;
4. `data-role="trace"`: relation order rendered as restrained text/rules;
5. `data-role="rupture"`: represented only by the specimen’s one seam.

Use a single monumental word or phrase such as `UNMEASURED` as a low-contrast architectural layer. Required prose remains complete and readable elsewhere.

**Step 3: Complete the GREEN browser assertions**

Assert:

- route responds and the pure-plan JSON is present;
- one phenomenon, one rupture, no generic atmosphere;
- premise text appears verbatim;
- instrument rows correspond to actual decisions and reasons;
- semantic order is field → instrument → phenomenon → trace;
- active theme is cleared or base-only, avoiding Arcane game-lighting carryover.

**Step 4: Run focused browser test**

Build first, start one clean preview, health-check the route, and run the focused spec. Confirm pass.

## Task 4: Add truthful progressive disclosure

**Objective:** Make interaction expose real specimen evidence without decorative hover behavior.

**Files:**

- Modify: `src/lib/next-experiments/DecisionSpecimen.svelte`
- Modify: `src/routes/next-lab/measured-sublime/+page.svelte`
- Modify: `tests/next-measured-sublime.spec.ts`

**Step 1: Write RED interaction test**

Focus or activate one instrument row. Assert:

- `aria-pressed` or current-state semantics update;
- exactly one matching facet or trace becomes `data-active="true"`;
- the revealed annotation contains the real node/relation ID and decision reason;
- unrelated facets remain quiet;
- there is no global transform on the entire composition.

**Step 2: Run RED**

Expected: no active state/reveal exists.

**Step 3: Implement minimum interaction**

Use Svelte state at route level. Instrument items are buttons with clear focus styles. Pass `activeId` into `DecisionSpecimen`. Reveal opacity, edge definition, and annotation; do not move the artifact or bloom the field.

**Step 4: Run GREEN**

Run the focused test and keyboard-tab through the interaction.

## Task 5: Add one purposeful state transition and reduced-motion behavior

**Objective:** Use motion only to describe exposure of an internal relation.

**Files:**

- Modify: `DecisionSpecimen.svelte`
- Modify: `tests/next-measured-sublime.spec.ts`

**Step 1: Write RED motion tests**

Normal motion:

- activation changes seam/facet reveal state;
- only the active evidence layer has a transition.

Reduced motion:

- transition duration resolves to `0s` or animation is absent;
- all evidence remains available instantly;
- no information depends on motion.

**Step 2: Implement minimum CSS**

Use a short opacity/clip reveal tied to the active evidence. No looping animation. Respect `prefers-reduced-motion`.

**Step 3: Run GREEN**

Run normal and reduced-motion browser assertions.

## Task 6: Preserve the five forces on mobile

**Objective:** Recompose the field without clipping or compressing desktop coordinates.

**Files:**

- Modify: `src/routes/next-lab/measured-sublime/+page.svelte`
- Modify: `tests/next-measured-sublime.spec.ts`

**Step 1: Write RED mobile geometry test at 375×900**

Assert:

- all required text ranges remain inside the field;
- specimen remains the largest single visual object;
- instrument follows or precedes it in semantic reading order without overlay;
- the rupture remains exactly one seam;
- quiet-space measurement remains at least 45% on mobile;
- no horizontal document overflow.

**Step 2: Implement a vertical reinterpretation**

Use a tall field with:

- premise/instrument at top;
- specimen entering from one side but contained;
- trace continuing below;
- monument reduced or moved behind the artifact;
- no absolute-position compression from desktop.

**Step 3: Run GREEN**

Run the focused mobile test.

## Task 7: Conduct the visual acceptance review

**Objective:** Determine whether the authored proof actually embodies the 27-image synthesis before changing architecture.

**Files:**

- Potentially modify only the new route/component/test files.
- Update after acceptance: `docs/research/prototype-gallery.md`
- Update after acceptance: `docs/research/measured-sublime-art-philosophy.md`

**Step 1: Build and capture**

Capture desktop and mobile screenshots from a clean production preview.

**Step 2: Review against all 12 acceptance criteria**

Record evidence for:

- one premise;
- one dominant phenomenon;
- at least half perceptually quiet;
- calmer utility layer;
- one justified rupture;
- material/annotation provenance;
- one eye route;
- controlled withholding;
- meaningful motion;
- mobile force preservation;
- composition survives ornamental-CSS removal;
- every exceptional placement has a reason.

**Step 3: Ask the user to judge the visual result**

Do not generalize or export the grammar until the user accepts the proof. If rejected, preserve screenshots and findings as experiment evidence; revise the premise or specimen, not by stacking effects.

## Task 8: Verification and evidence

**Objective:** Verify the isolated proof without disturbing existing work.

**Files:**

- Modify: `package.json` to include the new pure unit test in `test:next`.
- Update docs only after visual acceptance.

**Verification sequence:**

```bash
npx prettier --check <all changed measured-sublime files>
npm run test:next
npm run check
npm run build
CI=1 npx playwright test --workers=1
git diff --check
```

Then start one fresh preview and confirm:

```bash
curl --fail --silent --show-error --output NUL --write-out '%{http_code}\n' \
  'http://127.0.0.1:4173/next-lab/measured-sublime'
```

Expected: `200`.

Report `npm run lint` separately because the repository already has verified legacy Prettier debt. Do not format unrelated files.

## Files likely to change

- Create: `src/lib/next-experiments/measuredSublime.ts`
- Create: `src/lib/next-experiments/DecisionSpecimen.svelte`
- Create: `src/routes/next-lab/measured-sublime/+page.ts`
- Create: `src/routes/next-lab/measured-sublime/+page.svelte`
- Create: `tests/next-measured-sublime.test.ts`
- Create: `tests/next-measured-sublime.spec.ts`
- Modify: `package.json`
- After visual acceptance only: `docs/research/prototype-gallery.md`
- After visual acceptance only: `docs/research/measured-sublime-art-philosophy.md`

## Risks and controls

- **Risk: abstract SVG becomes another decorative object.** Control: every facet and seam must map to real resolver data and expose that mapping.
- **Risk: pale inversion stops feeling like HyvUI.** Control: retain ET Book/IBM Plex Mono, token-based gold/teal semantics, short lowercase copy, and operator-grade instrumentation.
- **Risk: annotations become HUD costume.** Control: render only actual node IDs, relation kinds, statuses, and reasons.
- **Risk: the artifact looks procedurally random.** Control: stable namespaced derivation, one body, one seam, no ambient fragments.
- **Risk: automated quiet-area metric creates false confidence.** Control: use it only as a guardrail and require human screenshot review.
- **Risk: current uncommitted workspace is broad.** Control: touch only the listed new prototype files and `package.json`; do not rewrite existing work or snapshots.

## Stop condition

The task stops after presenting the verified desktop/mobile prototype for user judgment. Public API changes, replacing `ArtDirection`, deleting the reliquary, schema changes, and the controlled agent bakeoff are separate approval-gated tasks.

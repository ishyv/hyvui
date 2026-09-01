# HyvUI Showcase Anthology Rework Implementation Plan

> **For Hermes:** Execute this plan task-by-task using strict TDD. Keep the private showcase modules out of `src/lib/index.ts` unless a separate API decision explicitly approves promotion.

**Goal:** Rework all user-facing HyvUI routes into one coherent showcase anthology with a shared curatorial shell, inspectable route identity, consistent outer rhythm, and distinct biome-specific inner compositions.

**Architecture:** Add private `ShowcaseManifest`, `showcaseNavigation`, and `ShowcaseShell` modules under `src/lib/showcase/`. The shell owns orientation, route metadata, register lifecycle, outer spacing, accessibility hooks, and adjacent navigation. Existing pages retain authored inner markup, with the homepage, themes, docs, system atlas, lab, and research wrappers migrated in vertical slices.

**Constraints:**

- User approved `docs/superpowers/specs/2026-08-29-showcase-anthology-rework-design.md`.
- User approved all user-facing routes in scope, with `/lab` and `/next-lab` retained as labeled stress/research surfaces.
- Keep route slugs, native links, hash navigation, semantic order, and public component behavior stable.
- Do not read or modify secrets.
- Do not commit, push, merge, or promote new public API.
- No global browser observer, random layout mutation, or universal page template.
- Use existing HyvUI tokens. No hardcoded hex colors in new styling.
- Follow failing test → minimal implementation → refactor for each new behavior.

---

## Phase 0: Baseline and lifecycle audit

### Task 1: Reconfirm the route and API baseline

**Objective:** Capture the exact current route families and public barrel boundary before editing.

**Files:**

- Read: `src/routes/**/*.svelte`
- Read: `src/lib/index.ts`
- Read: `src/lib/examples/appearance.js`
- Read: `src/lib/system/register.ts`
- Read: `tests/showcase.spec.ts`
- Read: `tests/lab.spec.ts`
- Read: `tests/next-*.spec.ts`

**Step 1: Run inspection**

```bash
git status --short --branch
git branch --show-current
git log -1 --oneline
```

Record pre-existing changes. Do not reset or clean them.

**Step 2: Trace register lifecycle**

Confirm how weight, theme, and grade are applied and cleared. Identify whether `mountSceneAppearance` duplicates that behavior before changing any scene wrapper.

**Step 3: Verify baseline gates**

Run the smallest existing route checks needed to establish that failures after the first slice are attributable:

```bash
npm run test:next
npm run check
```

**Acceptance:** The route inventory, public export boundary, and register lifecycle are understood and recorded in the implementation transcript.

---

## Phase 1: Private manifest and navigation contracts

### Task 2: Write the failing manifest contract

**Objective:** Define the behavior required from a private route identity manifest before implementing it.

**Files:**

- Create: `tests/showcase-manifest.test.ts`
- Test: `src/lib/showcase/showcaseManifest.ts`

**Step 1: Write failing tests**

Cover:

- required fields exist for the homepage, four examples, two theme studies, docs, system atlas, lab, and Next research routes;
- IDs and hrefs are unique;
- example order is bridge → keeper → correspondence → watchhouse;
- the witness route is marked experimental;
- host biome values, when present, are recognized by the existing biome vocabulary;
- public and research families are distinguishable.

**Step 2: Run the focused test**

```bash
npx --yes tsx --test tests/showcase-manifest.test.ts
```

Expected: fail because the private manifest module does not exist.

### Task 3: Implement the private manifest

**Objective:** Add declarative route identity without adding public exports.

**Files:**

- Create: `src/lib/showcase/showcaseManifest.ts`
- Test: `tests/showcase-manifest.test.ts`

**Step 1: Implement the minimal model**

Define `ShowcaseFamily`, `ShowcaseManifest`, and the ordered `showcaseManifests` collection. Reuse existing biome/register types where possible. Include route metadata for every in-scope family.

Each record must include:

- stable `id` and `href`;
- family;
- title and premise;
- focal subject;
- viewer role;
- primary relation;
- temporal law;
- mobile mode;
- status;
- weight/theme/grade where existing route behavior requires them;
- host biome and graft summary where the composition has a resolved biome identity.

Do not export the module from `src/lib/index.ts`.

**Step 2: Run the focused test**

```bash
npx --yes tsx --test tests/showcase-manifest.test.ts
```

Expected: pass.

**Step 3: Refactor only after green**

Keep route records readable and ordered by user-facing anthology flow. Do not introduce a manifest loader or filesystem scan yet.

### Task 4: Write the failing navigation contract

**Objective:** Specify deterministic adjacent navigation and family grouping.

**Files:**

- Create: `tests/showcase-navigation.test.ts`
- Test: `src/lib/showcase/showcaseNavigation.ts`

**Step 1: Write failing tests**

Cover:

- family-filtered navigation;
- previous/next links for the four examples;
- no previous link for the first item and no next link for the last item;
- public routes do not accidentally point into experimental routes unless explicitly requested;
- the returned collection is stable and does not mutate the manifest.

**Step 2: Run the focused test**

```bash
npx --yes tsx --test tests/showcase-navigation.test.ts
```

Expected: fail because the navigation module does not exist.

### Task 5: Implement navigation helpers

**Objective:** Provide the shell with deterministic route relationships.

**Files:**

- Create: `src/lib/showcase/showcaseNavigation.ts`
- Test: `tests/showcase-navigation.test.ts`

**Step 1: Implement minimal pure helpers**

Add functions such as:

- `getShowcaseManifest(id)`;
- `listShowcaseFamily(family)`;
- `getAdjacentShowcaseRoutes(id)`;
- `getShowcasePrimaryLinks()`.

Use stable array order. Do not access the DOM or browser history.

**Step 2: Run focused tests**

```bash
npx --yes tsx --test tests/showcase-navigation.test.ts
```

Expected: pass.

---

## Phase 2: Private curatorial shell

### Task 6: Write the failing shell browser contract

**Objective:** Define the shared outer behavior before implementing the shell.

**Files:**

- Create: `tests/showcase-shell.spec.ts`
- First fixture: the existing `/next-lab/witness` route, which is already a meaningful proof surface.

**Step 1: Write browser assertions**

The contract must verify:

- a skip link points to the route content;
- exactly one shell-level anthology navigation exists;
- current route has `aria-current`;
- `data-showcase-id`, family, status, viewer, and relation are present;
- premise and route orientation are readable;
- previous/next links are native anchors;
- shell content is contained at 320px, 375px, 768px, and 1600px;
- focus targets are keyboard reachable;
- reduced motion removes shell transitions without removing content;
- body-level register state is restored after navigation to another route.

**Step 2: Run the focused browser test**

```bash
npx playwright test tests/showcase-shell.spec.ts --workers=1
```

Expected: fail because the shell and migrated fixture do not exist.

### Task 7: Implement `ShowcaseShell.svelte`

**Objective:** Add the private shared curatorial frame.

**Files:**

- Create: `src/lib/showcase/ShowcaseShell.svelte`
- Modify: `src/routes/next-lab/witness/+page.svelte` to use the shell as the first fixture
- Read/reuse: `src/lib/components/system/AppShell.svelte`
- Read/reuse: `src/lib/components/layout/Shell.svelte`
- Read/reuse: `src/lib/components/primitives/Text.svelte`
- Read/reuse: `src/lib/components/primitives/Label.svelte`
- Read/reuse: `src/lib/components/primitives/Divider.svelte`
- Read/reuse: `src/lib/system/register.ts`
- Test: `tests/showcase-shell.spec.ts`

**Step 1: Implement the smallest shell**

The shell should:

- render a root with `data-showcase-*` attributes;
- render a skip link;
- render a compact masthead with home, family, current title, and status;
- render premise and optional biome/viewer metadata;
- render family-aware previous/next links;
- provide snippets for route-specific header content, metadata, body, and footer additions;
- wrap route content without adding a nested `main` landmark;
- apply and clean up route weight/theme/grade state through existing helpers;
- use token-based spacing and typography;
- preserve a normal document-flow fallback.

Use `AppShell` only where its behavior does not duplicate scene-specific lifecycle. If direct register helpers are required for grade or cleanup, make the ownership explicit and test it.

**Step 2: Run diagnostics and focused tests**

```bash
npm run check
npx playwright test tests/showcase-shell.spec.ts --workers=1
```

Expected: pass for the first shell fixture.

**Step 3: Refactor after green**

Keep shell styling limited to orientation and outer rhythm. Do not add route-specific artwork to the shell.

---

## Phase 3: Frontispiece and public scenes

### Task 8: Write the failing homepage migration contract

**Objective:** Prevent the homepage from regressing to the old hero-plus-card-grid silhouette.

**Files:**

- Extend: `tests/showcase.spec.ts`
- Add browser assertions for `src/routes/+page.svelte`.

**Step 1: Add failing assertions**

Cover:

- homepage uses the shell manifest identity;
- homepage has one clear premise and one page heading;
- scene entrances are generated from the manifest order;
- the primary anthology entry sequence is not a uniform card grid;
- the old decorative console is no longer the dominant page structure;
- mobile layout remains contained.

**Step 2: Run the focused test**

```bash
npx playwright test tests/showcase.spec.ts --workers=1 --grep "homepage"
```

Expected: fail against the current homepage structure.

### Task 9: Rework the homepage as a frontispiece

**Objective:** Make the homepage invite the visitor into distinct worlds instead of listing components.

**Files:**

- Modify: `src/routes/+page.svelte`
- Use: `src/lib/showcase/showcaseManifest.ts`
- Use: `src/lib/showcase/ShowcaseShell.svelte`
- Extend: `tests/showcase.spec.ts`

**Step 1: Implement the authored frontispiece**

Use `manifesto-print` as the deterministic host identity. Compose:

- one dominant proposition;
- one visual threshold/material gesture;
- a procession-like set of four scene entrances;
- one concise “same parts, different worlds” explanation;
- links to the field guide and research archive.

Preserve semantic anchors and route slugs. Use existing primitives and token styles. Do not recreate a four-card grid with different copy.

**Step 2: Run focused tests**

```bash
npm run check
npx playwright test tests/showcase.spec.ts --workers=1 --grep "homepage"
```

### Task 10: Write the failing Bridge shell integration test

**Objective:** Prove that an operational scene can use the shared shell without losing its inner silhouette.

**Files:**

- Extend: `tests/showcase.spec.ts`

**Step 1: Add assertions**

Verify:

- Bridge has shell metadata and operational host identity;
- scene-specific bearing/contact/log content remains present;
- the route has one main landmark and a stable h1;
- desktop and mobile remain contained.

**Step 2: Run the focused test**

```bash
npx playwright test tests/showcase.spec.ts --workers=1 --grep "bridge"
```

Expected: fail until the route is wrapped.

### Task 11: Migrate Bridge, then remaining public scenes

**Objective:** Apply the shell to all four examples while preserving distinct inner compositions.

**Files:**

- Modify: `src/routes/examples/bridge/+page.svelte`
- Modify: `src/routes/examples/keeper/+page.svelte`
- Modify: `src/routes/examples/correspondence/+page.svelte`
- Modify: `src/routes/examples/watchhouse/+page.svelte`
- Modify only as needed: `src/lib/examples/Bridge.svelte`
- Modify only as needed: `src/lib/examples/Keeper.svelte`
- Modify only as needed: `src/lib/examples/Correspondence.svelte`
- Modify only as needed: `src/lib/examples/Watchhouse.svelte`
- Modify: `src/lib/examples/sceneCatalog.ts`
- Extend: `tests/showcase.spec.ts`

**Step 1: Migrate Bridge first**

Wrap the existing scene with `ShowcaseShell`. Preserve the operational interior. Audit `mountSceneAppearance` before removing or duplicating any register behavior.

**Step 2: Verify Bridge**

```bash
npm run check
npx playwright test tests/showcase.spec.ts --workers=1 --grep "bridge"
```

**Step 3: Migrate Keeper, Correspondence, and Watchhouse**

Add manifest identity and shell wrappers. Preserve:

- Keeper's quiet object/provenance ecology;
- Correspondence's letter/draft/marginalia reading structure;
- Watchhouse's recurrence/classification/witness structure.

**Step 4: Verify four distinct signatures**

Add or extend browser assertions for:

- different host or material identities;
- different inner composition signatures;
- shared shell attributes;
- no route-wide overflow.

Run:

```bash
npx playwright test tests/showcase.spec.ts --workers=1
```

---

## Phase 4: Material studies

### Task 12: Add failing theme-shell contracts

**Objective:** Ensure Hextech and Arcane share orientation but retain different material laws.

**Files:**

- Extend/create: `tests/theme-showcase.spec.ts`

**Step 1: Add assertions**

Verify:

- both routes use material-study family metadata;
- Hextech exposes brass/mechanical material evidence;
- Arcane exposes living/iridescent manifestation evidence;
- theme and grade state are applied and cleaned up;
- the two routes do not share the same inner composition signature;
- reduced motion preserves material meaning.

**Step 2: Run focused tests**

```bash
npx playwright test tests/theme-showcase.spec.ts --workers=1
```

Expected: fail until migration is complete.

### Task 13: Migrate Hextech and Arcane

**Objective:** Reframe the theme pages as material studies inside the anthology.

**Files:**

- Modify: `src/routes/showcase/hextech/+page.svelte`
- Modify: `src/routes/showcase/arcane/+page.svelte`
- Extend: `tests/theme-showcase.spec.ts`

**Step 1: Wrap with shell**

Use the appropriate route manifest. Do not replace the existing SVG/material work with generic cards or a shared theme template.

**Step 2: Centralize only outer lifecycle**

Where scene-specific `mountSceneAppearance` duplicates shell register application, remove duplication only after a failing regression test and confirm cleanup on navigation.

**Step 3: Verify**

```bash
npm run check
npx playwright test tests/theme-showcase.spec.ts --workers=1
```

---

## Phase 5: Field guide and condition atlas

### Task 14: Add failing docs shell/utility contracts

**Objective:** Preserve documentation usefulness while giving it anthology identity.

**Files:**

- Extend: `tests/docs.spec.ts` if present, otherwise create it.
- Modify: `src/routes/docs/+page.svelte`

**Step 1: Add assertions**

Cover:

- persistent section index and native hash links;
- one main landmark and one h1;
- live specimens remain functional;
- all controls remain keyboard reachable;
- component, role, behavior, and escape-hatch labels are present;
- mobile content is readable and contained.

**Step 2: Run focused tests**

```bash
npx playwright test tests/docs.spec.ts --workers=1
```

Expected: fail for new shell metadata until migrated.

### Task 15: Rework docs as a field guide

**Objective:** Turn the monolithic component inventory into a practical, navigable field guide.

**Files:**

- Modify: `src/routes/docs/+page.svelte`
- Create/modify: `tests/docs.spec.ts`

**Step 1: Add shell identity**

Wrap documentation with the field-guide manifest. Keep its existing interactive specimen coverage.

**Step 2: Improve information grouping**

Group specimens by semantic role: primitives, layout, inputs, feedback, navigation, ambient/depth, orchestration/scenes. Use the existing section index rather than inventing a new navigation system.

Each group should identify:

- what the component is;
- what role it can play;
- what material or motion behavior it demonstrates;
- how an author can escape to ordinary HTML/CSS.

**Step 3: Verify**

```bash
npm run check
npx playwright test tests/docs.spec.ts --workers=1
```

### Task 16: Add failing condition-atlas contracts

**Objective:** Preserve system-state semantics while changing the system index silhouette.

**Files:**

- Extend/create: `tests/system-atlas.spec.ts`

**Step 1: Add assertions**

Cover:

- system index uses condition-atlas identity;
- all state routes remain linked;
- state titles describe conditions without generic error/warning headings;
- each state has one recovery/navigation path;
- status code/label semantics remain present;
- mobile and reduced-motion behavior remain contained.

**Step 2: Run focused tests**

```bash
npx playwright test tests/system-atlas.spec.ts --workers=1
```

Expected: fail until migration is implemented.

### Task 17: Rework system index and state wrappers

**Objective:** Make system pages a sequence of conditions rather than a card catalogue.

**Files:**

- Modify: `src/routes/system/+page.svelte`
- Modify state routes under:
  - `src/routes/drifting/+page.svelte`
  - `src/routes/cooling/+page.svelte`
  - `src/routes/forbidden/+page.svelte`
  - `src/routes/gateway/+page.svelte`
  - `src/routes/interrupted/+page.svelte`
  - `src/routes/lost/+page.svelte`
  - `src/routes/maintenance/+page.svelte`
  - `src/routes/offline/+page.svelte`
  - `src/routes/pending/+page.svelte`
  - `src/routes/redirecting/+page.svelte`
  - `src/routes/unauthorized/+page.svelte`
- Extend: `tests/system-atlas.spec.ts`

**Step 1: Migrate the index**

Use manifest-driven ordered links and a condition-atlas silhouette. Preserve the state descriptions and status identities.

**Step 2: Migrate state route wrappers**

Use the shared shell or an explicitly justified utility variant. Preserve each state's recovery path and condition-specific behavior.

**Step 3: Verify**

```bash
npm run check
npx playwright test tests/system-atlas.spec.ts --workers=1
```

---

## Phase 6: Stress and research surfaces

### Task 18: Add stress-observatory shell contracts

**Objective:** Reframe `/lab` without weakening its stress-test purpose.

**Files:**

- Extend/create: `tests/lab-shell.spec.ts`
- Modify: `src/routes/lab/+page.svelte`

**Step 1: Add assertions**

Verify fixed widths, pathological strings, layout-integrity evidence, and new shell identity. Verify no horizontal overflow in the lab viewport itself.

**Step 2: Run focused tests**

```bash
npx playwright test tests/lab-shell.spec.ts --workers=1
```

Expected: fail until the shell identity is added.

### Task 19: Reframe the stress lab

**Objective:** Give the lab a stable observatory identity while keeping it a utility surface.

**Files:**

- Modify: `src/routes/lab/+page.svelte`
- Extend: `tests/lab-shell.spec.ts`

**Step 1: Wrap the lab**

Use the stress-observatory manifest. Keep all fixed-width cases and diagnostic content. Use a readable explanation of what the tests prove.

**Step 2: Verify**

```bash
npm run check
npx playwright test tests/lab-shell.spec.ts --workers=1
npm run test:e2e
```

### Task 20: Reframe Next Lab outer wrappers

**Objective:** Make research/proof surfaces visibly belong to the anthology without presenting them as stable public recipes.

**Files:**

- Modify only outer wrappers under `src/routes/next-lab/`.
- Extend: existing `tests/next-*.spec.ts` where shell identity is relevant.

**Step 1: Add research-archive metadata**

Use the private shell for biome gallery, biome plan, frames, passage, measured sublime, experiment, baseline, and witness routes. Preserve their existing semantic content, native hash/history behavior, static fallbacks, and experimental labels.

**Step 2: Verify**

```bash
npm run check
npx playwright test tests/next-*.spec.ts --workers=1
```

Do not promote private proof components to `src/lib/index.ts`.

---

## Phase 7: Anthology-wide verification and review

### Task 21: Add route-matrix inspection

**Objective:** Machine-check every user-facing route after migration.

**Files:**

- Create: `scripts/measure-showcase-routes.mjs`
- Create: `tests/showcase-route-matrix.test.mjs`
- Create/extend: `tests/showcase-route-matrix.spec.ts`
- Modify: `package.json` only to add a focused script if useful.

**Step 1: Define the route matrix**

Include every route in `showcaseManifest`. Test at:

- 1600 × 900;
- 1440 × 900;
- 1024 × 900;
- 768 × 900;
- 480 × 900;
- 375 × 900;
- 320 × 900;
- representative reduced-motion desktop and mobile widths.

**Step 2: Measure**

Record:

- HTTP status;
- route identity and family;
- h1/main counts;
- document scroll width versus viewport width;
- focusable controls;
- shell metadata;
- body register state before/after navigation;
- static fallback presence where required;
- deterministic signatures for seeded compositions.

**Step 3: Verify the inspector**

Where a route has a biome plan, compare manifest host/graft identity against rendered data attributes and inspector output.

### Task 22: Run human visual review

**Objective:** Confirm that the anthology is consistent without flattening its biomes.

**Files:**

- Evidence: `docs/research/showcase-anthology-review/`
- Review notes: `docs/research/showcase-anthology-review.md`

**Step 1: Capture screenshots**

Capture representative desktop, tablet, mobile, and reduced-motion views for each route family.

**Step 2: Review each family**

Score:

- premise clarity;
- focal hierarchy;
- silhouette;
- material identity;
- meaningful relation;
- rhythm and breathing room;
- responsive survival;
- functional integrity;
- inspectability;
- distinction from other families.

**Step 3: Correct only evidenced defects**

Use the visual review to fix clipping, cramped spacing, generic silhouettes, or incoherent transitions. Add a regression test before each behavior fix.

### Task 23: Final repository gates

**Objective:** Verify the exact final tree before completion.

Run sequentially:

```bash
npm run test:next
npm run check
npm run build
npm run prepack
npm run test:e2e
git diff --check
npx prettier --check --plugin=prettier-plugin-svelte <all touched files>
```

Run `npm run lint` only as a separate repository-wide baseline check. If it fails on pre-existing files, report the exact scope and confirm touched files pass targeted formatting.

**Acceptance:** All required targeted and full gates pass, route-matrix evidence is stored, visual review has no blocking defects, no preview server remains running, and no commit/push has been performed.

---

## Rollback and safety

- Preserve route slugs throughout.
- Keep existing scene internals until the shell integration is verified.
- Do not delete old behavior in the same change as shell creation unless a failing regression test proves duplication or conflict.
- Keep all new showcase modules private and absent from `src/lib/index.ts`.
- If a migrated family fails review, revert only that family to its prior wrapper while retaining the tested manifest and shell primitives.
- Do not force-reset the existing worktree because it contains pre-existing user changes.

# HyvUI Foundation Cleanup Design

**Date:** 2026-09-01
**Status:** approved for implementation in the current worktree

## Goal

Make HyvUI a trustworthy Svelte 5 component library again: predictable to compose, visually quiet by default, honest in its documentation, and capable of demonstrating one meaningful relationship in each authored volume without adding a general relationship runtime.

## Preserved constraints

- Preserve the existing staged and unstaged worktree. Do not reset, commit, push, stage, unstage, or rewrite history.
- Preserve the ET Book / IBM Plex Mono typography, gold/teal base palette, authored asymmetry, thin rules, and distinct scene voices.
- Treat `C:/Users/theyu/Downloads/art` as private research reference material. Do not copy or redistribute its images without provenance and rights metadata.
- Keep advanced depth, ambient, orchestration, ornament, biome, and composition experiments available, but do not let them define the stable core by default.
- Use literal container-query thresholds where Chromium requires them. Keep tokens for declarations.
- No generic relationship engine in this pass.

## Evidence driving the design

- Documented Svelte actions are applied directly to components in `docs/actions.md` and `docs/recipes.md`, which the Svelte compiler rejects with `component_invalid_directive`.
- `ResolveAction` is documented and imported but is not exported from `src/lib/index.ts`.
- `Grid.svelte` defaults `cols` to `1` while its auto mode is documented as responsive.
- The field controls repeat wrapper logic and do not expose a consistent native form contract.
- `Toggle` passes a synthetic event with no native target/currentTarget.
- `DropdownMenu`, `Modal`, `Drawer`, and `ConfirmDialog` do not meet their documented focus/semantic contracts.
- `Surface` clips documented overhanging ornaments, while global atmosphere and theme recipes stack multiple effects by default.
- `KineticText` can split words and clip titles at narrow widths.
- `DataStream` uses unseeded random visible content.
- Bridge, Keeper, Correspondence, and Watchhouse are distinct static compositions, but their claimed relations are not interactive or derived from shared records.
- `showcaseManifest` and `sceneCatalog` duplicate route identity data.

## Approach

### 1. Executable public contract

Repair the stable core first. Native HTML remains the escape hatch.

- Forward native attributes to actual controls.
- Use explicit/stable IDs and consistent field description/error wiring.
- Normalize control height, line-height, padding, focus, disabled, and loading behavior.
- Make meaningful content props required or provide explicit empty-state APIs.
- Fix default Grid behavior and documented Card/StatusLine/Skeleton contracts.
- Compile representative documentation examples in CI.
- Keep the public barrel stable during this pass; do not remove exports without a consumer/migration audit.

### 2. Quiet visual foundation

- Base Surface owns structure and spacing, not every material effect.
- Make clipping, radius, inset, texture, vignette, and heavy theme treatment explicit.
- Give theme effects a deliberate surface/scene owner.
- Fix KineticText intrinsic sizing and word-safe reveal behavior.
- Make ambient/SVG identity deterministic and instance-safe.
- Standardize one ambient positioning host rather than repeating hidden placement assumptions.

### 3. One focused relation per authored volume

Use local typed fixture data and ordinary Svelte state.

- Bridge: contact selection updates radar/readout/log context.
- Keeper: index selection updates detail.
- Correspondence: draft selection updates the displayed letter state.
- Watchhouse: sighting selection updates the entry/classification context.

Each relation must have a native keyboard path, visible non-color selection state, semantic source/target markers, a meaningful narrow layout, and a reduced-motion equivalent. Ambient effects remain only when they explain that relation.

### 4. Field-guide documentation

Use the public barrel and existing agent manifest as sources of truth. Reorder the docs around:

```text
smallest composition → props → states → relation → advanced effects → scenes
```

Correct or remove unsupported claims. Compile fenced Svelte examples so documentation cannot drift silently.

## Implementation order

1. Add failing component-contract tests for Grid, field attributes/control geometry, Toggle, KineticText, deterministic DataStream, and documented defaults.
2. Implement the smallest shared fixes and verify each focused slice.
3. Add failing interaction tests and implement one relation in each volume.
4. Simplify the shared visual defaults and revise docs/examples as needed.
5. Run route, accessibility, reduced-motion, responsive, package, and full project verification.

## Verification

Required final gates:

- `npm run check`
- `npm run lint`
- `npm run build`
- focused component and scene tests
- `npm run test:e2e`
- `npm run test:next`
- `git diff --check`
- package dry-run and public export inspection
- fresh visual review at 1600, 1024, 768, 375, and 320px
- normal/reduced-motion comparison
- no preview process or temporary probe left running

Any unrelated baseline failure must be reported separately from implementation failures.

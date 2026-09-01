# HyvUI Next design specification

**Status:** experimental implementation. The relationship layer, core composition API, biome compiler, native frame/passage proofs, material projections, and read-only agent manifest are implemented. The core composition exports are available; biome definitions, frame/passage proof modules, agent evaluation, and the remaining accessibility review stay provisional.

## 1. Problem

HyvUI has a recognizable material language but its current scene/template guidance often leads agents to assemble predictable structures. The next layer must make the composition itself expressible: participants can be focal points, fields, counterweights, connectors, interruptions, frames, or atmosphere, and their relationships can carry meaning.

## 2. Identity kernel

HyvUI identity comes from:

- dark-first token-driven surfaces;
- ET Book body/display type with IBM Plex Mono metadata;
- gold as human/warm action and teal as machine/cool signal;
- material recipes and restrained depth;
- motion that stages attention rather than animating everything;
- short, lower-case, oblique copy voice;
- explicit negative space and quiet technical detail.

The identity kernel does not require one page silhouette. Existing scenes remain optional postures.

## 3. Static composition model

### Art direction

`ArtDirection` carries a stable `seed`, optional mood/material, density, contrast, rhythm, motion, and an explicit adaptation mode. It is context, not a bag of raw CSS values.

### Nodes

`CompositionNodeSpec` identifies a visual participant with a stable ID, content reference, visual role, capabilities, constraints, optional authored placement, priority, and source location.

### Relations

`CompositionRelation` connects source and target node IDs with a kind (`overlap`, `anchor`, `echo`, `connect`, `interrupt`, `frame`, `reveal`), strength (`required`, `preferred`, `hint`), optional overlap intent (`edge`, `partial`, `deep`, `field`), behavior, and fallback.

### Art direction grammar

`ArtDirection` can opt into `authority: "strong"` and name a composition gesture: `altarpiece`, `fracture`, `procession`, `reliquary`, `installation`, or `weather-system`. A gesture resolves a thesis, focal node, recurring motif, palette behavior, typographic behavior, depth behavior, interaction behavior, layer order, and deterministic node poses. This is a small grammar of compositional decisions, not a random-effects switch.

Strong authority is active only in `adaptation: "apply"`. It may recompose visual planes and add non-semantic atmosphere, but it preserves required content, DOM semantic order, accessibility, and explicit manual placement. `suggest` exposes the plan without applying it.

### Precedence

1. semantic and interaction requirements;
2. explicit author constraints/manual placement;
3. required relations;
4. art-direction context;
5. preferred relations;
6. bounded seeded variation;
7. component defaults.

A relation decision may be applied, suggested, or rejected. Rejection is inspectable and includes a reason/fallback.

## 4. Svelte and DOM behavior

`Composition` resolves the input once per reactive change and provides a context to descendants. It renders as a configurable semantic element, defaults to `section`, and emits no inspector unless `inspect` is passed.

`CompositionNode` renders as a configurable semantic element, defaults to `div`, and adds:

- `data-composition-node`;
- `data-role`;
- `data-relations`;
- `data-relation-status` for the node’s outbound decision;
- `aria-hidden` through an explicit `ariaHidden` prop;
- deterministic CSS variables for variation and authored placement.
- runtime `data-composition-region` and `data-composition-overflow` when mounted in a browser;
- bounded `--hyv-auto-nudge-*` and `--hyv-auto-scale` values when local `apply` adaptation is allowed.
- resolved art-director plane and pose variables when strong art direction is active.

The node component does not impose absolute positioning or a page layout. Consumer CSS decides whether a piece is flowing, layered, overlapping, or manually placed. The prototype field supplies the transform stack that consumes the bounded variables.

## 5. Determinism

Only nodes with the `bounded-variation` capability receive a variation value. The value is derived from `seed + node ID` through a stable PRNG namespace. Adding a node cannot shift another node’s value. Do not use `Math.random`, time, load order, network order, or viewport-dependent call counts for identity-bearing decisions.

The guarantee is structural/repeatable decision identity, not byte-identical raster pixels across all browsers.

## 6. Agent-facing vocabulary

The capability registry exposes visual possibilities separately from component props:

- visual role capabilities;
- compatible relation kinds;
- containment/scale behavior;
- material strengths and cautions;
- composition rules and anti-patterns.

The read-only inspector exposes current state. The CLI exposes:

```bash
npm run inspect:next -- --manifest
npm run inspect:next -- --file schemas/examples/sparse-composition.json
npm run inspect:next -- --file schemas/examples/biome-composition.json
```

The JSON Schema lives at `schemas/composition-experiment.schema.json`.

The manifest also exposes twelve host biomes. A composition chooses one host and can add at most two
channel-specific grafts. Symbiotic grafts share a law. Tensional grafts require a bridge. Destructive
combinations are rejected with a reason and fallback. The orthogonal genome covers spatial habitat,
material, light, typography, information, time, viewer role, and interaction.

## 7. Adaptation boundary

The implementation has two bounded stages. The resolver is SSR-safe and deterministic. A mounted `Composition` may then measure only its own field and descendants. In `apply` mode it can nudge an over-budget declared edge overlap, fit a non-manual node to the field, and annotate region/overflow state. It also supplies pointer variables for `motion: 'active'`. It never walks outside its field, reorders content, or changes explicit manual placement.

Future adaptation must prefer:

1. CSS container queries and anchor positioning when the browser can express the relation;
2. build-time/static derivation when the decision does not need live geometry;
3. a narrow opt-in local runtime only for measured, geometry-dependent behavior.

The local runtime batches through `ResizeObserver`, writes CSS variables instead of replacing authored styles, exposes state through data attributes, and becomes a no-op for reduced motion or disabled pointer adaptation. Strong art direction may add only semantic-free atmosphere inside its own field. A future global runtime must still meet the same constraints before being considered.

`FrameSequence` and `Frame` proofs use native hash navigation, stable semantic sections, and bounded
transition intents such as `approach`, `occlude`, `expose`, `transpose`, `release`, `inherit`, and
`cut`. `Passage` is reserved for a justified scroll concept and always has a static fallback. These
proof primitives remain private until the evaluation and public-API decision gates are reviewed.

## 8. Examples and evaluation

The prototype routes are:

- `/next-lab/baseline?case=<case>` for current-library control;
- `/next-lab/experiment?case=<case>&mode=<disabled|suggest|apply>` for the relationship layer.

Cases are sparse, dense, image-dominant, type-dominant, and atmospheric-motion. The atmospheric-motion case is the first strong art-direction flagship, `the reliquary in weather`. The five case signatures and overlap measurements are recorded in `docs/research/composition-metrics.json` and summarized in `docs/research/prototype-gallery.md`.

Agent evaluation is specified in `docs/research/agent-evaluation-protocol.md` and `docs/research/agent-rubric.md`. The deterministic aggregator is `scripts/run-biome-bakeoff.mjs`; no agent-improvement claim should be made until paired artifacts are run and reviewed.

## 9. Compatibility and escape hatches

- Existing exports and scenes remain available.
- `Composition` can wrap ordinary HTML/Svelte.
- `CompositionNode` accepts normal children, classes, semantic element selection, and manual style/placement.
- adaptation can be disabled at composition level;
- nodes without capabilities remain passive;
- explicit manual placement wins over positional adaptation;
- consumers can use the sanctioned CSS override surface.

## 10. Open work

- store and review independent agent attempts using the fixed prompt corpus;
- compare control/capability/biome-manifest/inspector conditions;
- complete keyboard, focus, history, touch, reduced-motion, and mobile review;
- determine whether one geometry-dependent case earns a runtime adapter;
- decide whether the local manifest needs an MCP bridge;
- expand capability annotations only when an agent-discovery failure demonstrates the need;
- review `docs/decisions/biome-api-boundary.md` before promoting any new public export.

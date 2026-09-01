# hyvui next

> agent-native composition layer. experimental in 0.6.0. additive to the existing component library.

HyvUI Next adds a small vocabulary for composing visual relationships. It does not replace HTML, Svelte, CSS, existing scenes, or ordinary layout primitives. It gives an agent a way to declare what participates in a composition and why.

## start with the visual idea

Before choosing a scene or a grid, name:

- the focal point;
- the counterweight or field around it;
- the rhythm;
- the interruption or repetition;
- the relationship that makes the piece recognizable;
- the mobile reinterpretation;
- the escape hatch if the system guesses wrong.

Do not use this layer to hide a generic page behind new names. If the result is still a centered hero followed by a card grid, the composition contract has not earned its existence.

## research primitives

```svelte
<script lang="ts">
  import {
    Text,
    Surface
  } from '@hyvnt/hyvui';

  import Composition from '$lib/next-experiments/Composition.svelte';
  import CompositionNode from '$lib/next-experiments/Node.svelte';

  import type {
    ArtDirection,
    CompositionNodeSpec,
    CompositionRelation
  } from '$lib/next-experiments/types.js';

  const artDirection: ArtDirection = {
    seed: 'field-piece-01',
    mood: 'quiet tension',
    material: 'field-notebook',
    density: 'sparse',
    contrast: 'quiet',
    rhythm: 'varied',
    motion: 'restrained',
    adaptation: 'suggest',
    debug: true
  };

  const nodes: CompositionNodeSpec[] = [
    {
      id: 'statement',
      content: 'Text',
      role: 'focal-point',
      capabilities: ['bounded-variation', 'overlap-target']
    },
    {
      id: 'note',
      content: 'Surface',
      role: 'counterweight',
      capabilities: ['bounded-variation']
    }
  ];

  const relations: CompositionRelation[] = [
    {
      id: 'statement-crosses-note',
      kind: 'overlap',
      source: 'statement',
      target: 'note',
      strength: 'preferred',
      behavior: 'let the statement cross the note edge',
      fallback: 'keep the authored flow'
    }
  ];
</script>

<Composition {artDirection} {nodes} {relations} inspect>
  <CompositionNode id="statement" class="statement">
    <Text as="h1" variant="heading" expression="title-card">the room changed anyway</Text>
  </CompositionNode>

  <CompositionNode id="note" class="note">
    <Surface variant="panel">a quiet counterweight.</Surface>
  </CompositionNode>
</Composition>
```

The example is for the private research routes. `Composition` resolves the model and supplies it to descendant `CompositionNode` elements. `CompositionNode` adds stable `data-composition-node`, `data-role`, `data-relations`, `data-relation-status`, `data-composition-region`, and seeded CSS custom properties. It does not impose a page layout. The consumer remains responsible for the spatial language that belongs to the individual piece, while `apply` may make bounded local corrections inside that field.

When `artDirection.authority` is `strong` and `adaptation` is `apply`, the local art director may also resolve a named composition gesture. It can assign visual planes, emit deterministic node poses, and add non-semantic atmospheric layers. It cannot remove required content, change semantic order, or override explicit manual placement. `suggest` exposes the same plan for inspection without applying those visual mutations.

## adaptation policies

- `disabled`: relation suggestions are rejected and authored layout is left alone.
- `suggest`: relation suggestions are recorded in the inspector. This is the default recommended mode.
- `apply`: bounded relation suggestions may be applied by the local composition postprocessor, but explicit manual placement still wins.

The implementation has two stages. The SSR-safe resolver creates deterministic relation decisions. A mounted composition can measure only its own field and, in `apply` mode, cap declared edge overlap, fit non-manual content, and annotate overflow/region state. Active motion also exposes local pointer parallax variables. There is no global browser observer and no content reordering.

## art direction

Art direction is a composition thesis, not a visual-effects bundle. The first gesture vocabulary is:

- `altarpiece`: one hierarchy of light and witnesses;
- `fracture`: a broken axis held together by contrast;
- `procession`: meaning repeated across changing scale;
- `reliquary`: one precious focal object held inside a surrounding field;
- `installation`: separated islands with active negative space;
- `weather-system`: atmosphere that changes the meaning of a still object.

Use `thesis`, `focal`, `motif`, `palette`, `typography`, `depth`, and `interaction` to give the gesture a point of view. Do not enable strong authority merely to randomize placement. The seed makes the decisions repeatable; the thesis makes them meaningful.

The flagship prototype is available at `/next-lab/experiment?case=atmospheric-motion&mode=apply` and is titled `the reliquary in weather`.

## relationships

The initial vocabulary is intentionally small:

- `overlap`: share spatial territory with explicit intent such as `edge`, `partial`, `deep`, or `field`, plus z-order and a fallback;
- `anchor`: keep a participant attached to another participant;
- `echo`: repeat a line, shape, phrase, or material cue without cloning a card;
- `connect`: carry a thread between participants;
- `interrupt`: break an expected rhythm once;
- `frame`: make an edge or threshold legible;
- `reveal`: disclose a related participant in response to a state or action.

A relation has a source and target, a strength, behavior, and fallback. `required` is not permission to ignore author constraints. It is a reason to report a conflict clearly.

## deterministic variation

A node must opt into bounded variation with the `bounded-variation` capability. Variation is derived from `artDirection.seed` and the node ID. The same seed and node ID produce the same decision. The implementation uses separate namespaces so adding a node does not shift every other node’s value.

Do not use `Math.random()`, current time, network order, or viewport-dependent random call counts for identity-bearing composition decisions.

## agent vocabulary

The manifest is available through:

```ts
import { getAgentManifest } from "@hyvnt/hyvui";
```

The manifest describes:

- HyvUI identity and material kernel;
- composition rules;
- anti-patterns that commonly produce generic pages;
- visual roles and compatible relationship kinds;
- component strengths and cautions.

This is intentionally separate from component props. Props describe how a component renders. Capabilities describe what role it can play.

## biome grammar

The manifest also exposes twelve authored host biomes:

`operational-apparatus`, `manifesto-print`, `deconstructed-editorial`,
`quiet-object-gallery`, `ceremonial-reliquary`, `ecological-elegy`,
`oneiric-object-poetry`, `machine-ecology`, `celestial-cartography`,
`post-digital-morphology`, `kinetic-rupture`, and `noise-commons`.

A biome is a causal ecology, not a palette or page template. Its manifest record describes spatial law, attention economy, density, materials, light, typography, information mode, time model, viewer role, interaction verbs, frame modes, passage modes, graft channels, compatibility, anti-patterns, and responsive behavior.

Choose exactly one host biome for a composition. Add zero to two named grafts through a specific channel such as `material`, `light`, `typography`, `information`, `motion`, `interaction`, or `framing`. Symbiotic grafts share a law. Tensional grafts require a written bridge. Destructive grafts are rejected instead of averaged.

The biome resolver and inspector keep these decisions explicit. A rejected graft includes its reason and fallback. The machine-readable example is `schemas/examples/biome-composition.json`.

## frames and passages

Viewport frames and scroll-native passages are different temporal hosts. A frame can use semantic transitions such as `approach`, `occlude`, `expose`, `transpose`, `release`, `inherit`, or `cut`. A passage is justified by a concept such as absorption, excavation, procession, accumulation, or traversal and must retain a static fallback.

The proof primitives currently remain private under `src/lib/next-experiments/`. They use native hash links, normal document flow, keyboard-reachable sections, and local progress observation. They do not trap wheel or touch input, reorder semantic content, or require a global browser runtime. Public promotion is deferred until the paired agent evaluation and accessibility gates are reviewed.

## inspection

Pass `inspect` to `Composition` while developing or evaluating an agent-generated composition. The component emits a hidden `data-composition-inspector` element containing JSON with:

- seed and art direction;
- resolved nodes and their roles;
- relation kinds;
- applied, suggested, or rejected decisions;
- reasons and fallbacks;
- authored placement.
- art-director gesture, thesis, visual planes, and deterministic poses through `data-art-director-inspector`.

Treat this as a read-only explanation surface. It is not a license for a runtime to mutate authored layout invisibly.

From a terminal, inspect a JSON composition without rendering it:

```bash
npm run inspect:next -- --file schemas/examples/sparse-composition.json
npm run inspect:next -- --file schemas/examples/biome-composition.json
npm run inspect:next -- --manifest
```

## existing library compatibility

The existing `StageScene`, `NarrativeScene`, `ReadoutScene`, `ArchiveScene`, and `LogScene` components remain available. Use them when their structure is the actual visual idea. Do not select one automatically just because it is the nearest page category.

The existing weight/theme/grade channels remain separate:

```svelte
<svelte:body data-weight="field-notebook" />
```

```ts
import { applyWeight, applyTheme, applyGrade } from "@hyvnt/hyvui";
```

`data-weight` and `applyWeight` are the canonical names. `data-register` and `applyRegister` are historical documentation drift, not the Next API.

## escape hatches

- use normal HTML/Svelte inside or outside `Composition`;
- set manual placement in a node constraint;
- use the normal `class` and CSS custom-property seams;
- set `adaptation="disabled"` for a static piece;
- let the node omit a capability it should not participate in;
- keep legacy scenes and layout primitives when they express the intended structure.

The framework exists to expand the possibility space. It must not become a closed rendering world.

## prototype route

The repository prototype is available at:

```text
/next-lab/baseline?case=sparse
/next-lab/experiment?case=sparse&mode=suggest
```

The baseline uses only the current public component API. The experiment uses the same five case families with explicit nodes and relationships. `scripts/measure-compositions.mjs` records rendered signatures and overlap measurements for comparison.

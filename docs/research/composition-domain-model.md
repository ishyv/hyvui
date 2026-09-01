# Composition experiment domain model

**Status:** syntax-neutral experiment contract. This is not yet the public HyvUI API.

## Intent

The experiment needs a common input format so a static compiler, a runtime adapter, and the current-library control can render the same composition brief. The model describes intent and relationships; it does not replace the DOM or prescribe a renderer.

## ArtDirection

A page-level context inherited by composition nodes:

- `seed`: stable string or integer used only for bounded deterministic variation;
- `mood`: free-form named intent, not a color value;
- `material`: base/theme material family;
- `density`: sparse, balanced, or dense intent;
- `contrast`: quiet, balanced, or aggressive intent;
- `rhythm`: slow, varied, or tight intent;
- `motion`: still, restrained, or active intent;
- `adaptation`: `disabled`, `suggest`, or `apply`;
- `debug`: whether inspection metadata is exposed.

These fields should map to token/context decisions rather than raw CSS values wherever possible.

## Node

A node identifies a visual participant:

- `id`: stable local identifier;
- `content`: primitive/component/HTML reference;
- `role`: focal point, counterweight, field, connector, interruption, frame, atmosphere, foreground, background, or a future role proven by experiments;
- `capabilities`: what the material can accept or emit;
- `constraints`: explicit dimensions, alignment, containment, overflow, semantic, and interaction requirements;
- `placement`: authored placement hints or a manual escape hatch;
- `priority`: focus/order information for adaptation and motion;
- `source`: optional source location for inspection.

## Relation

A relation connects two or more node IDs:

- `id`: stable relation identifier;
- `kind`: a small vocabulary such as `overlap`, `anchor`, `echo`, `connect`, `interrupt`, `frame`, or `reveal`;
- `source` and `target`: node IDs;
- `strength`: `required`, `preferred`, or `hint`;
- `range`: bounded numeric or token range where relevant;
- `overlap`: optional intent (`edge`, `partial`, `deep`, or `field`) that determines how much shared space is allowed;
- `behavior`: the intended visual outcome, not an algorithm name;
- `fallback`: what happens when the relation cannot be satisfied at a viewport or browser capability;
- `source`: optional source location.

## Precedence

Apply decisions in this order:

1. native semantic/interaction requirements;
2. explicit author constraints and manual placement;
3. required relations;
4. authored art-direction context;
5. preferred relations;
6. bounded deterministic variation;
7. default component behavior.

A rejected suggestion must remain inspectable. `apply` means apply bounded suggestions, never “redesign everything.”

## Adaptation contract

- `disabled`: render authored layout only;
- `suggest`: render authored layout and expose proposed changes/reasons;
- `apply`: apply only bounded, allowed changes after precedence checks.

The first prototype must support all three modes even if the final release supports fewer.

## Runtime boundary

The model may be resolved without a browser. Browser measurements are optional local context, not the source of identity. A local postprocessor may annotate region, overflow, and bounded nudge/scale values in `apply` mode. No node may depend on a random call whose count changes with viewport, load timing, or observer order.

## Escape hatches

Every renderer must support:

- ordinary HTML/Svelte content;
- explicit CSS custom-property and class seams;
- manual position/size/transform;
- relation suppression;
- composition-level adaptation disable;
- local node-level adaptation disable;
- no-op rendering when a capability is unknown.

## Evidence needed before public API

- at least two competing renderers use the same model;
- the same model produces five distinct silhouettes;
- repeated seeded renders preserve structural decisions;
- author overrides win in all modes;
- the model is easier for agents to use than current scene selection under the baseline protocol.

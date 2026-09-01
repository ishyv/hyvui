# ADR 0001: static relationship composition for HyvUI Next

**Status:** provisional, implemented in 0.6.0 with bounded local postprocessing
**Date:** 2026-08-28

## Context

The current library contains strong visual materials, but its scene templates, recipes, and agent guidance make conventional page structures easy to imitate. The audit found 96 components, fixed scene zones, repeated `Stack`/`Grid`/`Card` paths, and stale agent-facing register names. The existing code already supports snippets, depth, transforms, themes, expressions, and actions, so adding more finished variants would not address the core problem.

The first experiment needed to answer whether a relationship vocabulary and page-level art direction could make composition explicit without replacing the web document or introducing a magical runtime.

## Decision

Adopt a small, additive, static composition layer with four parts:

1. `ArtDirection` carries seed, material/mood context, density, contrast, rhythm, motion, and adaptation policy.
2. `CompositionNodeSpec` names a participant, visual role, capabilities, explicit constraints, and optional authored placement.
3. `CompositionRelation` names a typed relationship between node IDs, with strength, behavior, and fallback.
4. `Composition` plus `CompositionNode` provide a Svelte context, stable DOM identity, deterministic CSS variables, relation metadata, an opt-in read-only inspector, and a bounded local geometry postprocessor.

The public static exports are `Composition`, `CompositionNode`, `resolveComposition`, `validateComposition`, the seed helpers, the capability/agent manifest functions, and their types. Existing component/scenes exports remain unchanged.

The default adaptation policy is `suggest` in the model vocabulary, but the `Composition` inspector is opt-in. `disabled`, `suggest`, and `apply` are explicit modes. Manual placement takes precedence over positional relation application. The local postprocessor only measures its own field, applies a declared overlap budget, emits bounded CSS variables, and never reorders content or mutates unrelated DOM.

## Why this earns its complexity

The prototype uses the same five case families across 15 rendered records. The collector records overlap ratios, including a sparse edge overlap of `0.259` against its `0.26` budget. The five cases cover sparse, dense, image-led, type-led, and atmospheric/depth compositions without selecting an existing page scene as their root. Pure and browser contracts verify determinism, inspection, relation policy, manual-placement precedence, bounded overlap, containment, hover response, pointer motion, theme propagation, and reduced-motion shutdown.

This proves that the model can represent and inspect relationships. It does not yet prove that independent agents discover it or that automatic adaptation improves the visual result. Those remain evaluation work.

## Rejected or deferred alternatives

### More component variants

Rejected as the primary solution. Variants encode finished decisions and would hide templates behind prop names.

### Prop expansion on every component

Rejected. Capability and relationship metadata are separate from render props, which keeps existing components focused.

### Full scene graph renderer

Deferred. A parallel lightweight model is enough for the first experiment. HyvUI must remain ordinary Svelte/HTML/CSS rather than becoming a closed rendering world.

### Constraint solver

Deferred. Cassowary demonstrates hard versus preferred linear constraints, but a solver would add complexity and licensing review before any artistic value is established.

### Universal browser runtime

Deferred as a universal system. The prototype now includes a bounded local measurement pass because geometry-dependent overlap and containment cannot be expressed by the static resolver alone. CSS container/anchor features remain preferred where available. A global runtime may be added only after a paired experiment demonstrates value beyond static/CSS/local approaches without layout shift, hydration drift, or opaque mutations.

### MCP integration

Deferred. The local manifest, schema, and inspector must prove useful first. MCP may later expose read-only resources or validation tools, but it is not the composition language.

## Consequences

### Positive

- Relationships become inspectable and agent-readable.
- Existing materials can participate in different roles without variant explosion.
- Seeds and namespace-based variation are deterministic.
- Author overrides and normal HTML/CSS remain available.
- The local runtime surface stays small and SSR-safe.

### Negative

- The postprocessor only understands declared relation intent and does not invent a page layout.
- Consumers still author the actual spatial CSS and relation budgets for a piece.
- The vocabulary can still become a template if documentation stops showing alternatives.
- Agent improvement is unverified until the fixed prompt evaluation runs.

## Follow-up gates

Do not add a runtime adapter until:

- the agent evaluation compares control, capability, biome-manifest, and inspector conditions;
- a geometry-dependent case is identified that CSS/static derivation cannot express cleanly;
- the runtime candidate beats the static candidate in paired review;
- deterministic SSR/hydration, responsive, reduced-motion, and escape-hatch tests pass.

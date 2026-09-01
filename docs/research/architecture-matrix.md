# Architecture comparison matrix

**Status:** pre-prototype comparison. Ratings below are hypotheses informed by the audit and prior-art research, not measured results. The Phase F evaluation can overturn them.

## Evaluation scale

`1` = weak or costly. `3` = workable with meaningful limits. `5` = strong fit for the stated requirement.

| Model                          | Artistic power | Agent usability | Runtime safety | Inspectability | Progressive adoption | Complexity | Primary risk                                  |
| ------------------------------ | -------------: | --------------: | -------------: | -------------: | -------------------: | ---------: | --------------------------------------------- |
| expressive material primitives |              3 |               4 |              5 |              4 |                    5 |          2 | still leaves relationships implicit           |
| scene graph + relationships    |              5 |               4 |              3 |              5 |                    3 |          4 | becomes a second, proprietary layout language |
| compile/build-time derivation  |              4 |               4 |              5 |              5 |                    4 |          4 | derived output can be hard to author/debug    |
| opt-in contextual runtime      |              5 |               3 |              2 |              3 |                    3 |          5 | layout shift, feedback loops, hydration drift |
| hybrid candidate               |              5 |               4 |              4 |              5 |                    4 |          4 | scope creep across every layer                |

## Model 1: expressive material primitives

Expose a small set of capability-oriented axes on material/context primitives. Components remain ordinary Svelte/HTML and can participate in different roles through snippets, CSS custom properties, and explicit wrappers. No global graph.

**Solves:** components that are too semantically finished; scale, density, visual weight, material, edge behavior, and motion can be expressed without adding a themed variant for every composition.

**Does not solve:** implicit relationships between siblings or separate regions. Agents may still assemble a sequence of containers and fail to connect them.

**Prototype question:** does a compact capability vocabulary alone cause agents to create more diverse structures than the current API?

**Failure criterion:** if agents still produce the same scene/card/grid signature, capability labels are not enough.

## Model 2: scene graph plus first-class relationships

Represent a composition as named nodes and typed relations. Rendering remains DOM/Svelte, but a parallel graph makes relationships and inspection explicit.

**Solves:** relationship-first composition, stable identity, inspectable topology, shared focal/connector/echo concepts, and a place for hard vs soft constraints.

**Does not solve:** placement by itself. Relations need a renderer or CSS mapping, and the graph can become more difficult than CSS.

**Prototype question:** can a small relation vocabulary make overlap, echo, connection, and interruption legible to agents without a full solver?

**Failure criterion:** if the graph requires large per-node configuration or cannot degrade to normal flow, reject or narrow it.

## Model 3: compile/build-time composition derivation

An agent-authored manifest is validated and transformed into stable CSS custom properties, data attributes, or generated Svelte/CSS. Runtime only enhances interactions.

**Solves:** deterministic output, SSR/hydration stability, inspectability, reproducible screenshots, and static analysis.

**Does not solve:** viewport-dependent layout and live interaction relationships without a runtime or CSS-native fallback.

**Prototype question:** how much of the desired contextual adaptation can be derived before render using tokenized ranges, CSS container queries, anchor positioning, and explicit breakpoints?

**Failure criterion:** if generated output is less understandable than the source manifest or cannot preserve manual overrides, narrow the compiler to suggestions/CSS variables.

## Model 4: opt-in contextual runtime

A browser adapter observes registered nodes and bounds, detects local relationships, and emits or applies bounded suggestions.

**Solves:** relationships that truly depend on rendered geometry, live anchoring, overflow fallback, responsive context, and interaction-driven continuity.

**Does not solve:** art direction or semantic intent. It can only infer weakly from geometry unless given metadata.

**Prototype question:** does live geometry create visible artistic value beyond CSS-native or build-time approaches, and can it do so without layout instability?

**Failure criterion:** any candidate that needs silent reordering, uncontrolled feedback loops, or unstable SSR is rejected.

## Model 5: hybrid candidate

Use a small typed composition/relationship model as the source of intent. Derive stable context and CSS where possible. Use native CSS relations first. Add a runtime only for explicit, bounded, inspectable cases.

**Solves:** the full problem surface with a progressive path: materials first, relationships second, static derivation third, runtime last.

**Risk:** this is the easiest model in which to accidentally build a universal framework. Each layer must earn its existence in the comparison.

**Prototype question:** can the hybrid be implemented as a small composition contract rather than a platform-wide engine?

**Failure criterion:** if the hybrid needs every component to know about the graph, or if the runtime is required for basic compositions, prefer the simpler static model.

## Preliminary direction

Prototype Model 1 + Model 2 + Model 3 as the static/inspectable candidate, and Model 4 as a separately measured runtime candidate. Keep Model 5 as a possible synthesis only after results. Do not add a constraint solver in the first comparison.

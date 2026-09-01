# Agent vocabulary options

## Evaluation criteria

A useful agent-facing surface must answer more than “what props does this component accept?” It should help an agent decide what a material can become, what it can relate to, what must remain stable, and how to inspect the result.

Evaluate each representation for:

- discoverability by a coding agent;
- visual-role and capability richness;
- hard/soft constraint expression;
- versioning and compatibility;
- prompt/context footprint;
- human readability;
- machine validation;
- runtime/build-time inspection;
- ability to show alternatives without making one a template.

## Options

### Documentation only

**Strengths:** no new tooling; easy to publish.

**Weaknesses:** natural-language examples become templates; capability and relation data are hard to query; stale naming is easy to miss; agents cannot reliably distinguish hard constraints from suggestions.

**Assessment:** retain as the human-facing explanation, but insufficient as the only agent surface.

### Hand-maintained component manifest

A JSON/TypeScript manifest describes every component’s roles, capabilities, compatible relations, scale range, materials, motion, constraints, and anti-patterns.

**Strengths:** compact, queryable, explicit, independent of private CSS classes.

**Weaknesses:** can drift from source; needs ownership/versioning; hand authoring 96 components is expensive.

**Assessment:** useful if generated from source where possible and supplemented by small hand-authored capability annotations.

### JSON Schema plus typed TypeScript model

A schema defines composition nodes, relations, art direction, seeds, and adaptation policy. TypeScript provides ergonomic APIs for Svelte consumers.

**Strengths:** machine validation, editor/tool support, stable interchange format, clear hard/soft fields, testable pure core.

**Weaknesses:** schema syntax can overwhelm agents; does not by itself explain visual meaning; still needs examples and an inspector.

**Assessment:** likely minimum contract for a composition model, but not the whole discovery interface.

### Executable inspector

A local command or browser route reports available capabilities, current nodes, relations, inferred suggestions, rejected suggestions, seeds, and source locations.

**Strengths:** grounds the agent in actual project state; makes adaptation explainable; supports debugging and evaluation.

**Weaknesses:** tool maintenance; output must remain compact; inspection must not become a hidden mutation path.

**Assessment:** high leverage. Prototype before making it a package CLI.

### MCP resources/tools

Expose manifests, docs, and composition inspection through MCP resources and validation tools.

**Strengths:** discoverable across compatible agents; can return structured schema-backed results; separates read-only context from actions.

**Weaknesses:** transport/setup/security complexity; not every coding agent has the same MCP path; protocol is not the composition language.

**Assessment:** optional integration after local manifest + inspector demonstrate value.

## Proposed minimum surface

Prototype this layered representation:

1. **Typed core model:** syntax-neutral `ArtDirection`, `Node`, `Relation`, and `AdaptationPolicy`.
2. **Small capability registry:** material roles and relation affordances, with source links and anti-patterns.
3. **Agent-readable guide:** concise rules and diverse examples, explicitly not a canonical layout.
4. **Inspector:** read-only JSON/markdown output for current composition and available capabilities.
5. **Validation:** schema and pure validation functions run in CI and before an agent reports completion.

Do not add MCP, a full solver, or source-to-manifest code generation until this local surface is used in the agent comparison.

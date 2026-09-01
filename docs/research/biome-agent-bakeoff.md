# biome agent bakeoff

**Status:** complete as a proposal-discovery run. Inconclusive for rendered agent improvement.

**Evidence mode:** proposal-inspector. No rendered page or browser result is included.

**Captured:** 2026-08-30T19:44:55Z
**Repository revision:** `66fa8085613fc951392cb22d3ecf24c022fe8767`
**Prompt corpus:** 8 fixed prompts from `docs/research/agent-prompts.md`
**Paired input:** `docs/research/biome-agent-bakeoff-attempts.jsonl`
**Machine report:** `docs/research/biome-agent-bakeoff-report.json`

## Conditions

The captured run used all four conditions specified by the research plan.

1. `control`: current HyvUI guidance only;
2. `capability`: current guidance plus composition roles and relationships;
3. `biome-manifest`: current guidance plus the biome manifest, without the inspector workflow;
4. `inspector`: current guidance plus the biome manifest and read-only inspector workflow.

Each condition contains exactly one structured attempt for each prompt ID `01` through `08`. The
aggregator validated 32 records with no missing, duplicate, or unexpected cells.

The delegated agents were asked not to edit the repository and to return proposal records. Therefore
these are discovery observations, not rendered artifacts. The control, capability, and standalone
biome-manifest workers did not run builds, browser verification, or the inspector workflow. The
inspector worker ran the manifest, biome example, temporary proposal inspection, and deterministic
rerun checks, but did not render the proposed pages. Responsive, functional, and determinism booleans
in the raw records are projections or inspector observations, not browser evidence.

## Declared machine metrics

| condition      | attempts | unique hosts | grafts | meaningful relations | generic-layout proposals | steering turns | failure classes                       |
| -------------- | -------: | -----------: | -----: | -------------------: | -----------------------: | -------------: | ------------------------------------- |
| control        |        8 |            0 |      0 |                    0 |                        8 |             16 | none                                  |
| capability     |        8 |            0 |      0 |                   22 |                        2 |              0 | none, generic composition, responsive |
| biome-manifest |        8 |            6 |      6 |                   25 |                        0 |              0 | none                                  |
| inspector      |        8 |            6 |      8 |                   29 |                        0 |              0 | none                                  |

The proposal signal is directionally useful: the control selected no named host and used no meaningful
relations in all eight records; the capability condition introduced 22 relation proposals but no named
host; the standalone biome-manifest condition selected six unique hosts, six accepted graft proposals,
and 25 relation proposals; the inspector condition selected six unique hosts, eight accepted graft
proposals, and 29 relation proposals. This is evidence that the manifest is discoverable without the
inspector in this delegated run. It is not evidence that the resulting pages are coherent,
accessible, or visually superior.

## Human and browser review

Not run. There are no paired desktop or narrow screenshots, no blind rubric scores, and no rendered
functional or responsive artifacts in this report. The next valid experiment must ask agents to implement
or render the same eight prompts under the same revision, capture desktop/narrow artifacts, run the
browser and build gates, and then obtain blind review using `docs/research/agent-rubric.md`.

## Decision

The four-condition proposal-discovery protocol is complete, but rendered evaluation remains open. Do
not promote the biome modules to the public barrel and do not claim agent improvement from this run.
Keep the existing additive manifest and inspector. Treat this report as a successful harness and
first-pass discovery signal until a future rendered bakeoff supplies paired artifacts and blind review.

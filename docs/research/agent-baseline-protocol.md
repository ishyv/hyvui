# Agent baseline protocol

## Purpose

Measure what coding agents actually create with the current HyvUI surface before changing its public APIs. The baseline is a control group, not a quality ranking of individual models.

## Fixed conditions

Each run must use:

- the same repository revision;
- the same package/dependency state;
- the same prompt text;
- the same available files and project instructions;
- the same viewport and browser test commands;
- no hand-authored layout recipe beyond the project documentation that the agent would normally receive.

Record the agent/model/provider, date, prompt, steering messages, files changed, commands run, and final verification output. Store screenshots and generated layout signatures outside the public package when they are only experiment data.

## Prompt corpus

Use the prompts in `docs/research/agent-prompts.md`. Each prompt defines content and functional requirements but deliberately avoids prescribing a layout. Run at least three independent attempts per prompt when resources permit. Do not count retries after a build failure as independent attempts unless the failure reason is recorded.

## Observation protocol

For every attempt:

1. Start from a clean copy of the control project.
2. Give the agent one prompt and the current HyvUI agent guidance.
3. Do not suggest a scene, grid, card, or centered hero unless the agent asks a clarification question.
4. Let the agent finish or stop after a fixed budget of turns/tokens/time.
5. Run the project’s verification commands.
6. Render at 1600×900 and at least one narrow control width.
7. Extract a structural signature from the rendered DOM and source.
8. Record whether the agent used existing expressive capabilities, ignored them, or could not access them.
9. Preserve the final output and the exact steering cost.

## Machine signals

`layout-signature` extraction should report, at minimum:

- top-level element count and tag sequence;
- HyvUI scene components used;
- Stack/Grid/Card/Panel counts;
- explicit absolute/fixed/sticky positioning;
- transform/clip/mask usage;
- overlap candidates from bounding boxes;
- depth components and ambient layers;
- repeated gap/width values;
- number of explicit composition/role annotations, if any;
- build, hydration, interaction, and console failure counts.

Machine signals describe structure. They do not decide whether a piece is good.

## Human review

Use blind paired review where reviewers see screenshots without model, prompt, or architecture labels. Rate each output from 1–5 for:

- coherence;
- originality of spatial organization;
- intentionality of scale/negative space;
- meaningful use of repetition/interruption;
- relationship between type, image, surface, and atmosphere;
- HyvUI family resemblance;
- desire to inspect the composition further.

Allow a short free-text note identifying the dominant visual idea and the most generic or surprising decision.

## Analysis rules

- Aggregate with a script from JSONL/CSV, never by hand.
- Report the requested run count and verify it programmatically.
- Separate failures caused by missing browser/dependency/setup from failures caused by the generated page.
- Do not compare raw screenshot pixels across different fonts or environments without recording the environment.
- Treat agent self-reports as qualitative evidence only.
- Do not optimize prompts after seeing results without recording a new protocol version.

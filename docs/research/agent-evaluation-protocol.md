# Agent evaluation protocol

## Goal

Test whether HyvUI Next increases the probability that an agent creates an intentional, structurally diverse composition. The system fails if it only helps a human expert make a better demo.

## Conditions

Run the same eight prompts from `docs/research/agent-prompts.md` against:

1. current library guidance;
2. current library plus a compact capability and relationship vocabulary;
3. current library plus the biome manifest;
4. current library plus the biome manifest and an inspector workflow.

Keep the model/provider, repository revision, dependency state, viewport, time/turn budget, and available project instructions fixed within each comparison. Record every steering message. Do not give the Next variants a hand-authored page recipe unless recipe use is the variable being tested.

Use at least three independent attempts per prompt when resources permit. Batch independent attempts and aggregate from structured JSONL/CSV rather than counting by hand.

## Required artifacts per attempt

- prompt and condition ID;
- model/provider/date and repository revision;
- final source diff or artifact path;
- commands run and verification output;
- desktop and narrow screenshots;
- machine composition signature;
- steering messages and elapsed/turn budget;
- human reviewer score and free-text visual idea;
- failure classification: setup, build, hydration, interaction, responsive, generic composition, or other.

## Machine metrics

Collect:

- top-level layout signature diversity;
- unique dominant silhouettes;
- scene/template/card-grid usage;
- role count and relation-kind count;
- meaningful overlap/occlusion count;
- repeated spacing/alignment count;
- deterministic rerender result;
- responsive overflow/layout-shift result;
- interaction and console failures;
- prompt/steering cost.

## Human review

Blind reviewers see paired screenshots without condition labels. Rate 1–5 for:

- visual coherence;
- originality of spatial organization;
- intentionality of scale and negative space;
- meaningful repetition/interruption;
- relationship between type, image, surface, and atmosphere;
- HyvUI family resemblance;
- desire to stop and inspect the arrangement.

Require a one-sentence answer to “what is the visual idea?” If the reviewer cannot name one, the output should not receive a high intentionality score even if it is decorative.

## Decision rules

A candidate improves on the control only if it improves structural diversity and originality/intentionality without materially reducing coherence, functional interaction, deterministic rerendering, or responsive survival. A candidate that requires extensive bespoke steering fails the discovery criterion even if its final screenshot is strong.

Do not aggregate reviewer scores into a false objective “awe” score. Report distributions, paired wins/ties/losses, and reviewer notes.

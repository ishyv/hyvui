# Agent prompt corpus

These prompts are intentionally open-ended. They specify what the page must communicate and do, not how it must be arranged.

## 01 / poster for a quiet transmission

Create a single-page HyvUI experience for a transmission received once at 02:14. Show the title, timestamp, one short witness statement, signal state, and a way to open the full record. It should feel like a poster that happens to be interactive. The primary visual idea should be obvious from a blurred screenshot. The page must work on narrow screens.

## 02 / editorial spread about an absent place

Create a long-form page about a place that appears on no current map. Include a title, three short sections, one pull quote, two archival references, and a way to move between sections. Treat the page as an editorial spread rather than an article template. Let one relationship between text and empty space carry meaning. The page must remain readable and navigable.

## 03 / album artwork with a listening surface

Create an interactive page for an album called `weather systems for an empty room`. Include cover artwork or a generated visual field, track list, current track state, artist name, and play/pause behavior. Avoid a conventional music-app dashboard. The artwork should dominate, while controls remain discoverable and functional.

## 04 / exhibition index that refuses the grid

Create an index for six imaginary works in a small night exhibition. Include title, artist, year, one-line description, filtering or navigation, and a detail affordance. The six works should not look like six identical cards. Make the relationships between entries and the page field part of the composition while keeping keyboard navigation and links functional.

## 05 / dense operational landscape

Create a monitoring page for a remote observatory with 12 readings, three status states, a time window, a log excerpt, and a control to pause updates. Density is intentional, but the page must have a focal hierarchy and should not become a regular dashboard card matrix. Use the library’s system/material language without inventing a new color palette.

## 06 / typographic statement

Create a page whose dominant material is language. The statement is: `nothing arrived. the room changed anyway.` Include a short contextual note, a citation, and one interaction that reveals a second reading. Use extreme scale, line breaks, alignment, and interruption deliberately. Avoid a centered hero layout.

## 07 / installation with slow atmospheric motion

Create a full-viewport interactive installation about a signal moving through fog. Include a focal object, a connective trace, one short label, a progress/state indication, and a way to enter the next scene. Motion should support the composition and respect reduced motion. Do not make the page a stack of vertically revealed sections.

## 08 / archive letter with marginalia

Create a page presenting one letter, three marginal notes, provenance metadata, and a related document. The letter should feel like an object in a field of space, not a content card. Use asymmetry and an interruption or echo between the main text and the marginalia. Include a stable link to the related document.

## Prompt variants for discovery testing

For each prompt, run:

- **control:** current HyvUI documentation only;
- **capability:** current documentation plus a compact capability/role/relationship vocabulary;
- **biome-manifest:** current documentation plus the biome manifest, without the inspector workflow;
- **inspector:** capability vocabulary plus the biome manifest and executable composition inspector.

Do not add visual examples to the capability or inspector variants until a separate protocol explicitly tests the effect of examples. This isolates metadata/tooling discovery from imitation of a new gallery.

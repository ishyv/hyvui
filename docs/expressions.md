## Typographic Expressions

---

## Concept

expressions are compositional intent modifiers for text. where a `variant` defines the structural role of text (heading, body, caption), an `expression` defines how that text wants to feel in a specific context.

a heading with `variant="heading"` tells you it's a heading. a heading with `expression="title-card"` tells you it's a scene-opening, large-format, commanding heading — the kind that fills the first fold.

expressions are not interchangeable with variants. use both: the variant sets the semantic role, the expression sets the compositional character.

---

## Applying Expressions

### Via the `Text` Component Prop

```svelte
<Text as="h1" variant="heading" expression="title-card">
  signal acquired
</Text>
```

the `expression` prop accepts any expression name and applies the corresponding `.expr-*` class automatically.

### Directly as a CSS Class

for elements that are not `Text` components:

```svelte
<h1 class="expr-title-card">signal acquired</h1>
<p class="expr-readout">14:23 UTC — sector 7</p>
```

CSS classes are defined in `src/lib/system/expressions.css`.

---

## Expression Reference

### title-card

**CSS class:** `.expr-title-card`
**Intended for:** scene-opening headings, hero `h1` elements, above-the-fold titles.

**Properties:**
- font: ET Book, weight 400
- size: `clamp(3.4rem, 10vw, 8rem)` (responsive)
- line-height: `0.91`
- letter-spacing: `-0.05em`
- max-width: `10ch`

**Use when:** a heading should command the entire section. it should be the first thing the eye lands on. use once per page maximum.

**Do not use when:** the heading is inside a card, sidebar, or any dense context. do not use for section headings below the hero — use plain `variant="heading"` instead.

```svelte
<Text as="h1" variant="heading" expression="title-card">
  field station
</Text>
```

---

### manifesto

**CSS class:** `.expr-manifesto`
**Intended for:** philosophical statements, oblique declarations, pull quotes as section openers.

**Properties:**
- font: ET Book italic
- size: `clamp(1.4rem, 3vw, 2.2rem)`
- line-height: `1.25`
- letter-spacing: `0.005em`
- max-width: `32ch`
- color: `--text-soft`

**Use when:** you have a single declarative sentence that frames an entire section. works best when the statement is abstract or slightly oblique.

**Do not use when:** the text is a normal heading — use `variant="heading"`. do not use for more than 2–3 lines; the expression breaks down at longer lengths.

```svelte
<Text as="p" variant="italic" expression="manifesto">
  nothing is lost. only relocated.
</Text>
```

---

### readout

**CSS class:** `.expr-readout`
**Intended for:** data labels, system output, coordinate displays, log entries.

**Properties:**
- font: IBM Plex Mono, weight 400
- size: `0.85rem`
- line-height: `1.6`
- letter-spacing: `0.02em`
- color: `--muted`

**Use when:** the text is a machine-generated value, a coordinate, a timestamp, or a system identifier that should read as data rather than prose.

**Do not use when:** the text is a heading or title — use `expr-command`. do not use for body copy; the muted color and small size make it hard to read at length.

```svelte
<Text as="span" variant="caption" expression="readout">
  44.2°N 122.8°W — last contact 14:23 UTC
</Text>
```

---

### whisper

**CSS class:** `.expr-whisper`
**Intended for:** supporting notes, footnotes, metadata, quietly present context.

**Properties:**
- font: ET Book italic
- size: `0.8rem`
- line-height: `1.5`
- letter-spacing: `0.01em`
- color: `--muted`

**Use when:** the text should be present but not assertive — metadata the reader might want but shouldn't be drawn to. subtitles for figures, annotation text, disclaimers.

**Do not use when:** the text is primary or needs to be read. whisper text at low contrast may not meet WCAG AA — use with care in accessibility-critical contexts.

```svelte
<Text as="p" variant="caption" expression="whisper">
  readings are estimated. actual coordinates may vary by ±0.3°.
</Text>
```

---

### command

**CSS class:** `.expr-command`
**Intended for:** CTA labels, instruction headings, command prompts, action titles.

**Properties:**
- font: IBM Plex Mono, weight 600
- size: `0.75rem`
- line-height: `1.4`
- letter-spacing: `0.15em`
- text-transform: uppercase
- color: `--accent`

**Use when:** text should read as an instruction or a system-level command — action buttons labeled with this expression, activation phrases, feature names in a technical voice.

**Do not use when:** the text is running body copy. do not use for headings that don't carry a command meaning — use `variant="heading"`.

```svelte
<Text as="span" variant="caption" expression="command">
  [ initialize sequence ]
</Text>
```

---

### chapter

**CSS class:** `.expr-chapter`
**Intended for:** section openers, numbered chapter headings, major document divisions.

**Properties:**
- font: IBM Plex Mono, weight 500
- size: `0.7rem`
- letter-spacing: `0.18em`
- text-transform: uppercase
- color: `--muted`
- after-element: a horizontal line (decorative divider)

**Use when:** marking the start of a new major section of a long document or narrative page. works well paired with `NarrativeScene`'s chapter prop.

**Do not use when:** the section division is minor. the after-element divider adds visual weight — use sparingly.

```svelte
<Text as="p" variant="caption" expression="chapter">
  part two — the approach
</Text>
<Text as="h2" variant="heading">signal decay begins</Text>
```

---

## Expression + Register Matrix

how each expression shifts across registers:

| expression | `field-notebook` | `mission-control` | `archive` |
|---|---|---|---|
| `title-card` | amplified — larger effective size, warmer serif quality | partially suppressed — heading font shifts to mono if `--reg-font-heading` is mono | unchanged — same serif, more air |
| `manifesto` | natural fit — italic editorial voice matches register | awkward — register wants precision, expression wants obliqueness; use sparingly | effective — cool italic reads well in the spacious archive register |
| `readout` | slightly contrasts — mono on an editorial register reads as an intentional data intrusion | amplified — fits the mono-forward environment perfectly | effective — data labels in a cool, spacious context |
| `whisper` | warm and gentle — feels like a handwritten margin note | slightly too casual for the register's precision | natural fit — muted, spacious, archetypal footnote |
| `command` | contrasts — gold mono CTA reads strongly against a warm serif page | natural fit — mono + uppercase + gold on a mono-heavy register is dominant | slightly loud — consider reducing to `expr-readout` in archive contexts |
| `chapter` | amplified — monospace divider against serif body creates clear editorial rhythm | reduced — chapter marks compete with the register's own mono-density | natural fit — spacious layout benefits from strong section markers |

---

## Standalone Class Usage

expressions can be applied to any HTML element via class — they are not limited to the `Text` component:

```svelte
<!-- on a native heading -->
<h1 class="expr-title-card">signal acquired</h1>

<!-- on a blockquote -->
<blockquote class="expr-manifesto">
  the pattern holds through every rotation.
</blockquote>

<!-- on a span for inline data -->
sector <span class="expr-readout">7N — 44.2°</span> verified
```

---

→ next: [docs/actions.md](actions.md) — Svelte action API reference

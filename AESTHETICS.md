# Aesthetics Guide

A master reference for replicating the design language, color palette, and overall sensibility
of hyvnt.dev across other projects.

---

## Vibe

Dark. Precise. Operator-adjacent. The aesthetic sits somewhere between a classified terminal
readout and a well-worn field notebook — functional ornamentation, not decoration for its own
sake. Everything on screen should feel like it was placed with intent. Negative space is part
of the composition, not an absence.

The emotional register is: **quiet confidence, technical depth, slightly oblique**.

Things to avoid: gradients that feel "designed," neon, glassmorphism for its own sake,
rounded corners as a default, large icon sets, anything that reads as a UI kit.

---

## Color Palette

All values are exact tokens from `:root`. Use these everywhere; do not substitute.

### Backgrounds

```
--bg:        #08090b    /* near-black, main canvas */
--bg-elev:   #12151a    /* slightly lifted surface */
```

The base background is built from stacked radial and linear gradients — never a flat fill:

```css
background:
	radial-gradient(circle at top, rgba(198, 166, 112, 0.08), transparent 26%),
	radial-gradient(circle at 20% 20%, rgba(121, 166, 163, 0.06), transparent 24%),
	linear-gradient(180deg, #090b0d 0%, #08090b 35%, #050607 100%);
```

### Text

```
--text:         #f0e8da    /* warm off-white, primary */
--text-soft:    #d8cdb9    /* secondary / body copy */
--muted:        #a79d8b    /* tertiary / supporting */
--muted-strong: #7e7568    /* labels, captions, metadata */
```

Text is warm, not cold. Never pure white (#ffffff). The warmth comes from the slight yellow-brown
cast in the off-white palette.

### Accent

```
--accent:        #c79c57    /* warm gold — primary action color */
--accent-strong: #e2ba74    /* gold on hover/active */
--signal:        #79a6a3    /* cool teal — secondary accent, status "ok" */
```

Gold and teal are the only two colors with real presence. They appear rarely and purposefully.
Gold = human/warm. Teal = machine/cool. Do not introduce other hues.

### Borders and Lines

```
--line:        rgba(186, 157, 108, 0.16)    /* default border */
--line-strong: rgba(198, 166, 112, 0.28)    /* emphasized border */
```

Borders should almost disappear. They define structure without asserting it.

### Status Colors

Used exclusively for system/terminal status indicators:

```
--status-ok:   #79a6a3    /* operational */
--status-pend: #8b8476    /* pending / loading */
--status-warn: #c79c57    /* warning (same as accent) */
--status-fail: #b66a48    /* error / failure */
```

### Shadow

```
--shadow-veil: 0 40px 120px rgba(0, 0, 0, 0.45)
```

A single deep shadow token. Use on cards, panels, and framed elements.
Avoid drop shadows on text or interactive elements.

---

## Typography

### Type Scale Philosophy

- Body copy is serif. Labels and metadata are monospace. The two never mix roles.
- Font weight is almost always 400 (regular). The hierarchy comes from size, spacing,
  and color — not weight.
- Headings lean hard into tight tracking (negative letter-spacing) and compressed
  line-height. They should feel like a title card, not a web heading.

### Fonts

**Display / Body:** ET Book (self-hosted)

- A revival of the Monotype Bembo used in Edward Tufte's books
- Use for all headings, body copy, and manifesto/italic passages
- Fallbacks: `'Iowan Old Style', 'Palatino Linotype', serif`

**Monospace:** IBM Plex Mono

- Use for all labels, status lines, metadata, nav items, and code
- Loaded from Google Fonts at weights 400, 500, 600
- Fallbacks: `'Menlo', 'Consolas', monospace`

### Heading Styles

Large display headings:

```css
font-family: var(--font-body);
font-size: clamp(2.4rem, 5vw, 4.7rem); /* scene section headings */
font-size: clamp(3.4rem, 10vw, 8rem); /* hero h1 */
font-weight: 400;
line-height: 0.92–0.96;
letter-spacing: -0.04em to -0.05em;
```

Headings are compressed. Line-height below 1. Negative tracking. `max-width: 8–12ch` to
force natural line breaks that feel intentional, not accidental.

### Label / Metadata Style

The most distinctive typographic element. Used for scene numbers, card labels, status
readouts, and navigation:

```css
font-family: var(--font-mono);
font-size: 0.62rem–0.78rem;
letter-spacing: 0.12em–0.18em;
text-transform: uppercase;
color: var(--muted-strong); /* or --accent for highlighted labels */
```

This style says "this is a datum, not prose." Use it for anything that serves as metadata:
timestamps, categories, section numbers, field names.

### Body Copy

```css
font-family: var(--font-body); /* implicit from root */
font-size: 1rem–1.24rem;
line-height: 1.55–1.65;
color: var(--text-soft);
max-width: 28–34rem;
```

Keep prose passages narrow. Do not let lines stretch full-width. The text should feel
like a considered statement, not a fill.

### Italic / Manifesto Voice

Pull-quotes and philosophical statements use:

```css
font-style: italic;
font-family: var(--font-body);
```

Often placed in a left-bordered block:

```css
border-left: 1px solid var(--line-strong);
background: linear-gradient(90deg, rgba(199, 156, 87, 0.08), transparent 72%);
padding: 1rem 1.25rem;
```

---

## Surface Treatments

### Panels and Cards

Cards have near-invisible borders, a dark fill, and a soft warm gradient from the top-left:

```css
border: 1px solid rgba(255, 255, 255, 0.05);
background:
	linear-gradient(135deg, rgba(199, 156, 87, 0.08), transparent 44%), rgba(10, 12, 14, 0.8);
box-shadow: var(--shadow-veil);
backdrop-filter: blur(8px);
```

For more prominent containers (like the hero stage frame), layer in teal:

```css
background:
	linear-gradient(180deg, rgba(121, 166, 163, 0.08), transparent 18%),
	linear-gradient(135deg, rgba(199, 156, 87, 0.08), rgba(10, 12, 14, 0.82) 42%),
	rgba(9, 11, 13, 0.74);
```

### Inner Frames

Framed elements often carry a second, inset border as a decorative element:

```css
/* pseudoelement inner border */
position: absolute;
inset: 0.9rem;
border: 1px solid rgba(121, 166, 163, 0.16);
```

This creates a quiet depth — two layers of structure rather than one.

### Left-Accent Highlight

For interactive list items that gain focus or active state:

```css
border-left: 1px solid var(--line-strong);
background: linear-gradient(90deg, rgba(199, 156, 87, 0.14), transparent 70%);
transform: translateX(6px);
```

The translateX + gradient combination signals selection without a harsh highlight.

### Grid Overlays

Background grids use crossing 1px rules at very low opacity:

```css
background-image:
	linear-gradient(
		to right,
		transparent 0,
		transparent calc(100% - 1px),
		rgba(199, 156, 87, 0.07) calc(100% - 1px)
	),
	linear-gradient(
		to bottom,
		transparent 0,
		transparent calc(100% - 1px),
		rgba(121, 166, 163, 0.06) calc(100% - 1px)
	);
background-size: 72px 72px;
mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
```

Always fade the grid at top and bottom with a mask. Never hard-edge a grid.

---

## Structural Ornaments

These are ambient, non-functional decorations that establish the aesthetic register.
They appear globally in the page shell.

### Corner Brackets

```css
/* Four absolute spans at the four corners of a container */
width: 2rem;
height: 2rem;
border-color: rgba(199, 156, 87, 0.24);
border-style: solid;
/* top-left */
border-width: 1px 0 0 1px;
/* top-right */
border-width: 1px 1px 0 0;
/* bottom-right */
border-width: 0 1px 1px 0;
/* bottom-left */
border-width: 0 0 1px 1px;
```

### Scan Band

A horizontal sweep animation that reads as "active system":

```css
.scan-band {
	position: absolute;
	width: 24%;
	background: linear-gradient(90deg, transparent, rgba(199, 156, 87, 0.08), transparent);
	animation: scan 5s linear infinite;
}

@keyframes scan {
	from {
		transform: translateX(-120%);
	}
	to {
		transform: translateX(520%);
	}
}
```

### Scene Numbering

Every major section is prefaced with its index in monospace:

```
01 / section-name
```

This establishes the page as a sequence, not a stack of unrelated sections.

### Clip-Path Geometry

Asymmetric cuts on containers add edge without decoration:

```css
/* angled top-right / bottom-left crop */
clip-path: polygon(0 0, 84% 0, 100% 18%, 100% 100%, 16% 100%, 0 82%);
```

---

## Canvas Environments

For full-viewport immersive states — error pages, loading screens, intros — the background
is a live canvas render rather than CSS alone. It breathes. CSS gradients stay still;
canvas moves.

### Star Field

Stars have three properties that interact: position, depth (`z`), and size. Depth drives
color, parallax strength, and drift rate — simulating real perspective without 3D transforms.

```js
// Star tinting by depth
star.z > 0.7  →  rgba(199, 156, 87, opacity)     // gold: close, warm
star.z > 0.4  →  rgba(121, 166, 163, opacity)     // teal: mid-range
star.z ≤ 0.4  →  rgba(240, 232, 218, opacity)     // off-white: distant, cool
```

Trail effect instead of a hard clear — low-opacity fill each frame creates motion blur:

```js
ctx.fillStyle = 'rgba(8, 9, 11, 0.12)'; // partial clear
ctx.fillRect(0, 0, w, h);
```

Bright stars (size > 1.4, twinkle peak) get a soft radial halo:

```js
// 3× the star radius, gold, fades to transparent
const grad = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3);
grad.addColorStop(0, `rgba(199, 156, 87, ${opacity * 0.3})`);
grad.addColorStop(1, 'transparent');
```

Canvas parallax moves each star by its `z` depth relative to the mouse position:

```js
const px = (mouseX - 0.5) * 18; // normalized mouse -0.5..0.5, scaled
const py = (mouseY - 0.5) * 12;

drawX = star.x + px * star.z; // near stars move more
drawY = star.y + py * star.z;
```

This is different from the CSS parallax approach. Use CSS for DOM layers; use canvas
parallax when the moving content is drawn, not positioned.

### Nebula / Presence Glow

A large, pulsing radial gradient anchors the composition — neither a planet nor a star,
just a warm absence of darkness. It implies something without depicting it.

```js
const pulse = Math.sin(time * 0.008) * 0.15 + 0.85; // slow 0.7–1.0 oscillation
const radius = Math.min(w, h) * 0.28 * pulse;

const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
nebula.addColorStop(0, `rgba(199, 156, 87, ${0.04 * pulse})`); // gold core
nebula.addColorStop(0.4, `rgba(121, 166, 163, ${0.025 * pulse})`); // teal mid
nebula.addColorStop(1, 'transparent');
```

Opacity values are very low — 0.04 at the center. The nebula should be felt, not seen.

### Orbital Rings

Two overlapping ellipses around the nebula center. They counter-rotate, creating quiet
mechanical motion without any obvious mechanical source.

```js
ctx.save();
ctx.translate(cx, cy);
ctx.rotate(time * 0.003); // primary ring, slow clockwise
ctx.scale(1, 0.35); // flatten to ellipse

ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
ctx.strokeStyle = `rgba(199, 156, 87, ${0.08 * pulse})`;
ctx.lineWidth = 1;
ctx.stroke();

ctx.rotate(-time * 0.003 * 2.4); // counter-rotate relative to primary
ctx.scale(1.3, 1.1); // slightly larger, slightly rounder
ctx.arc(0, 0, ringRadius * 0.7, 0, Math.PI * 2);
ctx.strokeStyle = `rgba(121, 166, 163, ${0.06 * pulse})`;
ctx.lineWidth = 0.7;
ctx.stroke();
ctx.restore();
```

Scale on the y-axis before drawing a circle to produce an ellipse — simpler than
actual ellipse math and easier to read.

### Drift Particles

Ambient motes that spawn near center, drift outward, and fade. Not stars — they are
the texture of the air between things.

```js
// Lifecycle-based opacity: ease in over first 10%, ease out over last 20%
const lifeRatio = p.life / p.maxLife;
const fade = lifeRatio < 0.1 ? lifeRatio / 0.1 : lifeRatio > 0.8 ? (1 - lifeRatio) / 0.2 : 1;
const alpha = fade * 0.35; // max alpha is low — these are background texture
```

Particles are gold or teal only. No third color. They follow the same parallax offset
as stars, but at a weaker multiplier (0.3×) — they are closer to the camera plane.

---

## Motion and Interaction

### Transition Tokens

```
--transition-smooth: 0.35s cubic-bezier(0.22, 1, 0.36, 1)    /* ease-out-expo feel */
--transition-fast:   0.16s cubic-bezier(0.4, 0, 0.2, 1)       /* material-standard */
```

Use `--transition-smooth` for spatial movement (translate, scale).
Use `--transition-fast` for color/opacity changes.

### Hover Behaviors

- Lift: `transform: translateY(-2px)` — used on links, buttons
- Slide: `transform: translateX(6px)` — used on active list rows
- Scale: `transform: scale(1.03)` — used on active nodes/dots
- Never use large-scale hover transforms. Subtlety is the rule.

### Terminal Conventions

- Typewriter character-by-character reveal for boot/intro sequences
- Blinking cursor: `animation: blink 1s step-end infinite`
- Status glyphs: `[ OK ]`, `[ .. ]`, `[WARN]`, `[FAIL]` — always bracketed, always monospace
- Status colors map to `--status-ok/pend/warn/fail`

### Staggered Terminal Reveal

For multi-line status sequences, lines appear one at a time with a delay between each.
Each line slides up from 6px below and fades in — not a scroll, a surface:

```css
.status-line {
	opacity: 0;
	transform: translateY(6px);
	transition:
		opacity 0.5s ease-out,
		transform 0.5s ease-out;
}
.status-line.visible {
	opacity: 1;
	transform: translateY(0);
}
```

```js
// Stagger: 600ms initial delay, 700ms between each line
lines.forEach((_, i) => {
	setTimeout(
		() => {
			lines[i].visible = true;
		},
		600 + i * 700
	);
});
```

After the last line, main content fades in with an additional 400ms gap. CTAs follow
800ms after content. The terminal sequence always resolves before anything else appears.

### Status Dot

A 6px circle that pulses in opacity and scale. Used as a persistent system
presence indicator — not a loading spinner, just proof the page is alive:

```css
.status-dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
	background: var(--status-fail); /* or --status-ok depending on state */
	animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
	0%,
	100% {
		opacity: 0.4;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.3);
	}
}
```

### Parallax

Background layers respond to pointer position via CSS custom properties:

```css
/* set on pointer move */
--px: <normalized -0.5..0.5>;
--py: <normalized -0.5..0.5>;

/* applied per layer with different strengths */
transform: translate3d(calc(var(--px) * 18px), calc(var(--py) * 12px), 0);
```

Layer depth is suggested by opposing movement directions and varying strength multipliers.

### Scroll

Full-viewport panels snap into place. Each section occupies at least `100dvh`.
Navigation is never ambient scroll — it always resolves to a scene boundary.

### Reduced Motion

Always provide a `@media (prefers-reduced-motion: reduce)` block that:

- Removes all animations
- Removes all transitions
- Collapses translate offsets to `none`
- Plays typewriter sequences instantly

---

## Layout Conventions

### Two-Column Asymmetry

Most scenes use an asymmetric grid — copy on the narrower left, visual/content on the wider right:

```css
grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
/* or */
grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
```

The split is never 50/50. Asymmetry is compositional.

### Padding

All scene containers use fluid padding:

```css
padding: clamp(2rem, 7vw, 6rem);
```

Consistent inset logic. Never hard-coded pixel padding on full-bleed containers.

### Staggered Cards

Card grids use small per-card vertical offsets to break the rigid grid:

```css
.card-1 {
	transform: translateY(0.6rem);
}
.card-2 {
	transform: translateY(2.2rem);
}
.card-3 {
	transform: translateY(-0.2rem);
}
```

This creates a loose, hand-arranged feel within a structured layout.

### Vignette

A fixed-position vignette layer sits over the full page:

```css
background:
	radial-gradient(circle at center, transparent 42%, rgba(0, 0, 0, 0.48) 100%),
	radial-gradient(circle at top, rgba(199, 156, 87, 0.06), transparent 30%);
```

This darkens edges and adds warmth to the top of the viewport. Always present.

---

## Copy Voice

Typography is inseparable from tone. The writing follows these rules:

- **Short sentences.** No filler. No padding.
- **No em-dashes.** Use periods. Let silence breathe.
- **Lowercase for metadata.** Labels and UI strings are lower-case monospace, not title case.
- **First person, understated.** "I like that." not "I am passionate about..."
- **Oblique over direct.** The writing implies rather than states.
- **Self-aware but not ironic.** "yes it spins / and I like that" — aware of the quirk, unashamed.
- **Fragments are fine.** Prose is not always complete sentences.

### System States

When something has gone wrong, the copy never says what or why. It describes the
condition without naming the cause. The user should feel informed, not diagnosed.

- Describe the system's posture, not the error: "the signal needs rest" not "error 503"
- Imply recovery: "it will return once the channel clears" — passive, inevitable, calm
- Always close with a grounding fragment: "nothing is broken. just still."
- Section labels use the state as a verb or gerund, not a noun: `drifting`, not `error`
- Status line sequences should show nominal states resolving toward the failure —
  local systems passing before the upstream fails. The failure is real, but framed.

Avoid: "error", "failed", "unavailable", any financial or infrastructure vocabulary,
anything that implies the user did something wrong.

Avoid: buzzwords, verb-heavy tech speak, anything that sounds like a LinkedIn summary.

---

## Quick-Start Token Sheet

For porting to a new project, this is the minimum viable set:

```css
:root {
	/* backgrounds */
	--bg: #08090b;
	--bg-elev: #12151a;

	/* text */
	--text: #f0e8da;
	--text-soft: #d8cdb9;
	--muted: #a79d8b;
	--muted-strong: #7e7568;

	/* accent */
	--accent: #c79c57;
	--accent-strong: #e2ba74;
	--signal: #79a6a3;

	/* lines */
	--line: rgba(186, 157, 108, 0.16);
	--line-strong: rgba(198, 166, 112, 0.28);

	/* status */
	--status-ok: #79a6a3;
	--status-pend: #8b8476;
	--status-warn: #c79c57;
	--status-fail: #b66a48;

	/* shadows */
	--shadow-veil: 0 40px 120px rgba(0, 0, 0, 0.45);

	/* transitions */
	--transition-smooth: 0.35s cubic-bezier(0.22, 1, 0.36, 1);
	--transition-fast: 0.16s cubic-bezier(0.4, 0, 0.2, 1);

	/* fonts */
	--font-mono: 'IBM Plex Mono', 'Menlo', 'Consolas', monospace;
	--font-body: 'ET Book', 'Iowan Old Style', 'Palatino Linotype', serif;
}
```

---

## What This Aesthetic Is Not

- It is not brutalism. It is precise, not raw.
- It is not neomorphism. Depth is implied by gradient and shadow, not by emboss.
- It is not "hacker aesthetic." It borrows the terminal's language, not its visual clichés.
- It is not minimal for minimalism's sake. Every absent element was a deliberate removal.
- It is not dark mode of a light design. The darkness is the design.

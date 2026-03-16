## Copy Voice

A writing guide for content that appears in hyvnt-ui projects — interface labels, error messages, empty states, CTAs, and headings. this guide is for anyone writing the words on screen, not just developers.

---

## The Voice

hyvnt-ui interfaces speak in a voice that is:

- **precise** — uses the minimum number of words to communicate exactly what is needed
- **oblique** — slightly indirect; doesn't state the obvious, trusts the reader
- **calm** — never alarmed, never urgent for its own sake. even errors are matter-of-fact
- **lowercase** — sentence case or lowercase by default; uppercase only for system labels and commands
- **technical but not intimidating** — uses the language of instruments, coordinates, signals, archives. not the language of corporate SaaS

the reference frame is somewhere between a field notebook, a navigation instrument, and a terminal session. information is observed, recorded, and transmitted — not celebrated or apologized for.

---

## The Lowercase Rule

**always lowercase:**

- body copy and paragraphs
- error messages
- empty state titles and descriptions
- button labels (exception: the system-label pattern with brackets, see CTA patterns)
- placeholder text in inputs
- status messages in `StatusLine` and `TerminalBoot`
- navigation labels
- modal and dialog titles
- toast notification text

**title case is acceptable for:**

- page-level section headings where formal structure is needed
- document titles in reference contexts (archive register)
- proper nouns (product names, people, places)

**uppercase only for:**

- `Label` components — uppercase is applied by CSS automatically, not in the copy itself
- expressions like `expr-command` and `expr-chapter` — uppercase is CSS
- the bracket-convention CTA (see below)

---

## Error State Writing Guide

errors describe the **condition**, not the **cause**. they never blame the user and never reveal raw technical strings.

the pattern: _something happened_ → _what that means for the user_ → _what they can do._

write for someone who is calm and oriented, not panicked and lost.

| do not write                 | write instead                                         |
| ---------------------------- | ----------------------------------------------------- |
| `Error: server returned 500` | `the signal didn't complete`                          |
| `Not Found`                  | `nothing at these coordinates`                        |
| `You don't have permission`  | `this space requires clearance`                       |
| `Loading...`                 | `resolving`                                           |
| `Please wait`                | (nothing, or: `standing by`)                          |
| `Something went wrong`       | `the channel interrupted`                             |
| `Failed to fetch data`       | `the connection didn't hold`                          |
| `Invalid input`              | `this field needs a different format`                 |
| `You must be logged in`      | `a session is required to continue`                   |
| `Request timeout`            | `the signal timed out — try again when you're ready`  |
| `404 — Page Not Found`       | `nothing was found at these coordinates`              |
| `403 — Forbidden`            | `this route requires authorization`                   |
| `Unauthorized`               | `this area requires clearance`                        |
| `Session expired`            | `your session has closed — sign in again to continue` |

**retry language:**
do not write `Try again`. write `try again when you're ready`, or just surface a retry button with a plain label like `retry` or `try again`.

**the empty state is not an error:**
empty is a neutral condition. write it with quiet curiosity, not apology. `no records found` → `nothing in this sector yet`.

---

## Heading Patterns

hyvnt-ui headings are oblique noun phrases, not declarative sentences. they name a thing or a place — they don't describe it, celebrate it, or explain it.

**correct heading patterns:**

- `signal archive`
- `field notes — vol. 3`
- `approach`
- `coordinates`
- `the long hold`
- `transmission log`

**do not write headings that:**

- start with a verb: `View Your Records`, `Manage Settings`, `Get Started`
- make promises: `Everything You Need`, `The Complete Solution`
- use exclamation: `Welcome!`, `You're All Set!`
- explain themselves: `This is the Archive Section`
- are full sentences: `Your mission has been completed successfully.`

**compressed is correct:**
one or two words is often better than five. `signal log` over `your recent signal activity`.

---

## Label Patterns

`Label` components are IBM Plex Mono, uppercase, tracked, small. they are the system's way of identifying things — category tags, section markers, field identifiers, system state labels.

write labels as:

- single nouns or noun phrases: `archive`, `active`, `priority`, `field-notebook`
- status identifiers: `live`, `connected`, `pending`, `sealed`
- structural identifiers: `entry 003`, `vol. 3`, `part two`
- system labels: `mission control`, `field station`

do not write labels as:

- full sentences
- questions
- anything that requires punctuation (except the em dash for range labels: `entry 001 — 007`)

---

## CTA Patterns

### the bracket convention

`[ action ]` is the standard CTA format for primary calls-to-action in this system. the brackets are rendered as part of the button label text when you want the button to feel like a terminal command rather than a UI button.

use the bracket convention for:

- landing page primary actions
- gate-crossing moments: `[ enter ]`, `[ proceed ]`, `[ initialize ]`
- final confirmation actions: `[ seal record ]`, `[ transmit ]`

do not use brackets for:

- secondary or ghost buttons — `view archive`, `cancel`, `go back`
- destructive buttons — `delete`, `revoke` (the gravity should come from the variant, not typography)
- buttons inside forms — plain labels are clearer in dense contexts

### plain button labels

for most buttons, write plain lowercase action verbs:

- `deploy`, `archive`, `transmit`, `verify`, `cancel`, `confirm`, `delete`, `export`, `retry`

do not write:

- `Submit` (write `submit`, or the specific action: `archive entry`)
- `Click here` or `Learn more` (write what specifically will happen)
- `OK` (write `confirm` or the specific positive action)

---

## Fragment Tolerance

in this system, incomplete sentences are correct — not sloppy.

fragments are acceptable and often preferred for:

- empty state descriptions: `nothing in this sector yet.`
- status messages: `signal acquired.`, `coordinates locked.`, `standing by.`
- tooltip content: `last updated 14 minutes ago.`
- subheadings that complete a heading: heading `approach` + subheading `coordinates pending verification.`

fragments become a problem when:

- the user needs explicit instructions (error recovery steps should be complete sentences)
- the context is formal (terms of service, legal notices, accessibility labels)
- the reader needs to understand cause and effect (`the connection timed out because the server did not respond in time.`)

---

## Things This Voice Is Not

**not brutalist.** brutalist design is deliberately confrontational or ugly. this voice is precise and restrained, but not hostile. it respects the reader.

**not corporate.** it doesn't use words like `leverage`, `streamline`, `solution`, `empower`, `robust`, or `seamless`. it doesn't have a friendly chirpy mascot voice.

**not hacker/edgy.** it doesn't use `warez`, `h4x`, `l33t`, or deliberately broken spelling for effect. the instrument metaphor is earnest, not ironic.

**not dramatic for its own sake.** the references to signals, coordinates, missions, and archives are a consistent metaphorical frame — not melodrama. the voice is calm and professional within that frame. if a feature is just a text editor, don't call it `the transmission module` unless the rest of the interface supports that language consistently.

**not apologetic.** the system doesn't say `sorry`, `unfortunately`, `we're having trouble`, or `oops`. it states conditions directly and provides a path forward.

---

→ documentation complete. start at [INSTALL.md](../INSTALL.md) to set up your project.

<!-- =========================================================
  hyvui // COMPONENT LIBRARY
  Svelte 5. Dark by default. Operator-adjacent.
========================================================== -->

<pre align="center">
 ██╗  ██╗██╗   ██╗██╗   ██╗    ██╗   ██╗██╗
 ██║  ██║╚██╗ ██╔╝██║   ██║    ██║   ██║██║
 ███████║ ╚████╔╝ ██║   ██║    ██║   ██║██║
 ██╔══██║  ╚██╔╝  ╚██╗ ██╔╝    ██║   ██║██║
 ██║  ██║   ██║    ╚████╔╝      ╚████╔╝ ██║
 ╚═╝  ╚═╝   ╚═╝     ╚═══╝        ╚═══╝  ╚═╝
</pre>

<p align="center">
  <sub><code>svelte 5 · typescript · tailwind v4 · dark by default</code></sub>
</p>

<br/>

<table>
  <tr>
    <td width="52%" valign="top">

`01 / what it is`

<pre lang="txt">
[ OK ] component library for svelte 5
[ OK ] token-driven, no hardcoded values
[ OK ] operator aesthetic, not startup aesthetic
[WARN] opinionated about how things should feel
</pre>

<sub><i>built for interfaces that should feel like they are paying attention.</i></sub>

    </td>
    <td width="48%" valign="top">

`02 / what it is not`

- a general-purpose design system
- configurable to any aesthetic
- optimized for light mode
- trying to look like everything else

<sub>the palette is two colors and they do not negotiate.</sub>

    </td>
  </tr>
</table>

---

`03 / install`

```sh
npm install hyvui
```

```svelte
<script>
  import { Button, Text, FloatCard } from 'hyvui';
</script>
```

import the styles once at the root of your app:

```ts
// app.css or root layout
import 'hyvui/styles';
```

---

`04 / structure`

<table>
  <tr>
    <td valign="top" width="33%">

**primitives**
```
Text        Label
Icon        Divider
Surface
```

**inputs**
```
Button      Input
Textarea    Select
Checkbox    Toggle
FileUpload
```

**feedback**
```
Alert       Toast
StatusDot   StatusLine
Skeleton    EmptyState
ErrorState
```

    </td>
    <td valign="top" width="33%">

**layout**
```
Stack       Grid
Card        Panel
Modal       Drawer
Popover
```

**navigation**
```
Topbar      SidebarNav
Tabs        Breadcrumb
DropdownMenu
```

**display**
```
Badge       Avatar
Table       CodeBlock
MetricCard  Blockquote
```

    </td>
    <td valign="top" width="33%">

**ambient**
```
GridOverlay   CornerBrackets
ScanBand      Vignette
ParallaxLayer SignalRing
GlyphMark     DataStream
ThreadLine
```

**depth**
```
DepthStage  DepthLayer
FloatCard   HorizonGrid
Plinth
```

**scenes**
```
NarrativeScene  ReadoutScene
StageScene      ArchiveScene
LogScene
```

    </td>
  </tr>
</table>

---

`05 / layers`

the library is organized in three additive layers. each one works without the next.

<pre lang="txt">
[ base ]       42 components. tokens. css custom properties throughout.
               nothing hardcoded. nothing fighting your cascade.

[ expressive ] registers shift the ambient mood of a section.
               expressions carry semantic intent through typography.
               four actions compose onto any element.

[ spatial ]    CSS 3D depth system. perspective stages. tilt on pointer.
               receding grids. a plinth to stand things on.
</pre>

---

`06 / registers`

registers are named aesthetic states. apply one and the ambient properties shift.

```svelte
<script>
  import { applyRegister } from 'hyvui';
  onMount(() => applyRegister('mission-control'));
</script>
```

| register | character |
|---|---|
| `field-notebook` | warm, worn, analog |
| `mission-control` | cold, precise, dense |
| `archive` | flat, institutional, drained |

---

`07 / expressions`

text expressions carry intent beyond variant. pass them to any `Text` component.

```svelte
<Text expression="title-card">the coordinates are empty now</Text>
<Text expression="readout">signal: –42 dbm</Text>
<Text expression="manifesto">something was here before we arrived.</Text>
```

---

`08 / depth`

```svelte
<DepthStage perspective="mid">
  <DepthLayer level="ground">
    <HorizonGrid rows={16} cols={10} vanishY={0.35} />
  </DepthLayer>
  <DepthLayer level="raised">
    <FloatCard tiltMax={6}>
      <Label color="muted">signal strength</Label>
      <Text variant="heading" color="primary">–42 dbm</Text>
    </FloatCard>
  </DepthLayer>
</DepthStage>
```

all 3D transforms are disabled under `prefers-reduced-motion`.

---

`09 / tokens`

two accent colors. everything else is neutral.

```css
--accent      /* gold  — #c79c57 — warmth, action, age      */
--signal      /* teal  — #79a6a3 — data, status, precision  */
```

override per-section with `--reg-*` properties. documented in `override-template.css`.

---

<details>
  <summary><code>10 / notes</code></summary>
  <br/>

  the library assumes you want the interface to have a mood.
  <br/>
  if you do not want that, it will still work. it will just feel a little contained.
  <br/><br/>
  svelte 5 only. no compatibility shims.

</details>
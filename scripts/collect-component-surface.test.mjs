import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import {
  collectComponentSurface,
  renderMarkdown,
} from "./collect-component-surface.mjs";

test("collects sorted component capabilities from Svelte source", () => {
  const root = mkdtempSync(join(tmpdir(), "hyvui-surface-"));
  const components = join(root, "components");

  writeFileSync(join(root, "fixture.mjs"), "");

  const write = (file, source) => {
    const target = join(components, file);
    const directory = dirname(target);
    return { target, directory, source };
  };

  const first = write(
    "layout/Zed.svelte",
    `<script lang="ts">
      interface Props {
        /** Number of items. */
        count?: number;
        /** Content. */
        children?: Snippet;
      }
    </script>
    <div use:surface style="transform: translateY(2px)">{#if children}{@render children()}{/if}</div>
    <style>:global([data-theme='arcane']) .zed { color: var(--arc-magenta); }</style>`,
  );
  const second = write(
    "primitives/Alpha.svelte",
    `<script lang="ts">
      interface Props {
        /** Element tag. */
        as?: string;
      }
    </script>
    <svelte:element this={as} class="alpha" />`,
  );

  for (const file of [first, second]) {
    mkdirSync(file.directory, { recursive: true });
    writeFileSync(file.target, file.source);
  }

  const result = collectComponentSurface(components);

  assert.deepEqual(
    result.map((item) => item.name),
    ["Alpha", "Zed"],
  );
  assert.deepEqual(result[0].group, "primitives");
  assert.deepEqual(
    result[0].props.map((prop) => prop.name),
    ["as"],
  );
  assert.deepEqual(
    result[1].props.map((prop) => prop.name),
    ["count", "children"],
  );
  assert.equal(result[1].signals.usesActions, true);
  assert.equal(result[1].signals.usesTransforms, true);
  assert.equal(result[1].signals.usesThemeSelectors, true);
  assert.equal(result[1].signals.usesCssVariables, true);
});

test("renders generated markdown with one terminal newline", () => {
  const markdown = renderMarkdown([]);

  assert.equal(markdown.endsWith("\n\n"), false);
  assert.equal(markdown.endsWith("\n"), true);
});

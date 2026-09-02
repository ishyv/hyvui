import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { resizeCanvasBackingStore } from "../src/lib/system/runtime.js";

const repo = process.cwd();

test("generated token outputs stay in parity with the canonical source", () => {
  execFileSync(process.execPath, ["scripts/generate-tokens.mjs", "--check"], {
    cwd: repo,
    stdio: "pipe",
  });
});

test("automatic Grid remains CSS-native", () => {
  const source = readFileSync(
    join(repo, "src/lib/components/layout/Grid.svelte"),
    "utf8",
  );

  assert.match(source, /repeat\(auto-fit/);
  assert.match(source, /--hyv-grid-min-col/);
  assert.doesNotMatch(
    source,
    /maxCols|ResizeObserver|getBoundingClientRect|computedStyle/,
  );
});

test("field ids are authored or nested, never randomly generated", () => {
  const fieldSources = [
    "Input.svelte",
    "Textarea.svelte",
    "Select.svelte",
    "Checkbox.svelte",
    "Toggle.svelte",
    "FileUpload.svelte",
  ];
  for (const file of fieldSources) {
    const source = readFileSync(
      join(repo, "src/lib/components/inputs", file),
      "utf8",
    );
    assert.doesNotMatch(source, /Math\.random|crypto\.randomUUID/);
  }
});

test("appearance and theme styles do not depend on html:has", () => {
  const sources = [
    "src/lib/tokens/hextech.css",
    "src/lib/tokens/arcane.css",
    "src/lib/system/grades.css",
  ];
  for (const file of sources) {
    assert.doesNotMatch(readFileSync(join(repo, file), "utf8"), /:has\(/);
  }
});

test("canvas backing stores cap DPR and preserve CSS-pixel drawing coordinates", () => {
  const canvas = { width: 0, height: 0 } as HTMLCanvasElement;
  const transforms: number[][] = [];
  const context = {
    setTransform(...values: number[]) {
      transforms.push(values);
    },
  } as unknown as CanvasRenderingContext2D;

  const normal = resizeCanvasBackingStore(canvas, context, 400, 200, 3);
  assert.equal(normal.scale, 2);
  assert.deepEqual([normal.width, normal.height], [800, 400]);
  assert.deepEqual(transforms.at(-1), [2, 0, 0, 2, 0, 0]);

  const capped = resizeCanvasBackingStore(canvas, context, 5000, 5000, 3);
  assert.ok(capped.scale < 1);
  assert.ok(capped.width * capped.height <= 8_000_000);
});

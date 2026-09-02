import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const repo = process.cwd();
const documentedActionFiles = ["docs/actions.md", "docs/recipes.md"];

test("documented actions are attached to DOM elements, not Svelte components", () => {
  const violations = documentedActionFiles.flatMap((file) => {
    const source = readFileSync(join(repo, file), "utf8");
    return [
      ...source.matchAll(
        /<([A-Z][A-Za-z0-9]*)[^>]*\buse:(?:surface|echo|reveal|resolve|track)\b[^>]*>/gs,
      ),
    ].map((match) => `${file}: <${match[1]}>`);
  });

  assert.deepEqual(violations, []);
});

test("the documented ResolveAction type is public", () => {
  const barrel = readFileSync(join(repo, "src/lib/index.ts"), "utf8");
  assert.match(
    barrel,
    /export type \{[^}]*ResolveAction[^}]*\} from ["']\.\/system\/actions\/resolve\.js["']/s,
  );
});

import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = process.env.OUTPUT_DIR ?? tmpdir();
mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const cases = [
  ["frontispiece-desktop", "/", 1600, 900, false],
  ["scene-bridge-desktop", "/examples/bridge", 1600, 900, false],
  ["scene-keeper-320", "/examples/keeper", 320, 900, false],
  ["material-hextech-desktop", "/showcase/hextech", 1600, 900, false],
  ["material-arcane-mobile", "/showcase/arcane", 375, 900, false],
  ["field-guide-mobile", "/docs", 375, 900, false],
  ["condition-atlas-desktop", "/system", 1600, 900, false],
  ["condition-cinematic-desktop", "/system/cinematic", 1600, 900, false],
  ["stress-observatory-tablet", "/lab", 768, 900, false],
  ["research-witness-desktop", "/next-lab/witness", 1600, 900, true],
  ["research-experiment-mobile", "/next-lab/experiment", 375, 900, true],
];

try {
  for (const [name, route, width, height, reducedMotion] of cases) {
    const page = await browser.newPage({ viewport: { width, height } });
    try {
      await page.emulateMedia({
        reducedMotion: reducedMotion ? "reduce" : "no-preference",
      });
      await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts?.ready);
      await page.screenshot({
        path: join(outputDir, `hyvui-${name}.png`),
        fullPage: true,
      });
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`captured=${cases.length}`);

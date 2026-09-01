import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:4173";
const outputDir = process.env.OUTPUT_DIR ?? tmpdir();
mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const cases = [
  ["bridge-viewport-desktop", "/examples/bridge", 1600, 900, false],
  ["hextech-viewport-desktop", "/showcase/hextech", 1600, 900, false],
  ["docs-viewport-mobile", "/docs", 375, 900, false],
  ["keeper-viewport-320", "/examples/keeper", 320, 900, false],
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
        fullPage: false,
      });
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log(`captured=${cases.length}`);

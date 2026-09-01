import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { showcaseManifests } from "../src/lib/showcase/showcaseManifest.js";

/** @typedef {import("@playwright/test").Page} PlaywrightPage */
/**
 * @typedef RouteMatrixEntry
 * @property {string} id
 * @property {string} href
 * @property {string} family
 * @property {string} status
 * @property {string|null} weight
 * @property {string|null} theme
 * @property {string|null} grade
 * @property {number} width
 * @property {number} height
 * @property {boolean} reducedMotion
 */

export const viewportWidths = [1600, 1440, 1024, 768, 480, 375, 320];
export const viewportHeight = 900;
export const reducedMotionViewports = [
  { width: 1600, height: viewportHeight },
  { width: 375, height: viewportHeight },
];

export function buildRouteMatrix() {
  return showcaseManifests.flatMap((manifest) =>
    viewportWidths.map((width) => ({
      id: manifest.id,
      href: manifest.href,
      family: manifest.family,
      status: manifest.status,
      weight: manifest.weight ?? null,
      theme: manifest.theme ?? null,
      grade: manifest.grade ?? null,
      width,
      height: viewportHeight,
      reducedMotion: false,
    })),
  );
}

export function buildReducedMotionRouteMatrix() {
  return showcaseManifests.flatMap((manifest) =>
    reducedMotionViewports.map(({ width, height }) => ({
      id: manifest.id,
      href: manifest.href,
      family: manifest.family,
      status: manifest.status,
      weight: manifest.weight ?? null,
      theme: manifest.theme ?? null,
      grade: manifest.grade ?? null,
      width,
      height,
      reducedMotion: true,
    })),
  );
}

/**
 * @param {PlaywrightPage} page
 * @param {RouteMatrixEntry} entry
 * @param {string} baseURL
 */
export async function measureRoute(page, entry, baseURL) {
  await page.setViewportSize({ width: entry.width, height: entry.height });
  await page.emulateMedia({
    reducedMotion: entry.reducedMotion ? "reduce" : "no-preference",
  });

  const response = await page.goto(new URL(entry.href, baseURL).toString(), {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(
    ({ id, weight, theme, grade }) => {
      const shell = document.querySelector("[data-showcase-shell]");
      /** @param {string} name */
      const attribute = (name) => document.body.getAttribute(name);
      return (
        shell?.getAttribute("data-showcase-id") === id &&
        attribute("data-weight") === weight &&
        attribute("data-theme") === theme &&
        attribute("data-grade") === grade
      );
    },
    {
      id: entry.id,
      weight: entry.weight,
      theme: entry.theme,
      grade: entry.grade,
    },
    { timeout: 5_000 },
  );
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  const dom = await page.evaluate(() => {
    const shell = document.querySelector("[data-showcase-shell]");
    const focusable = document.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    return {
      shell: shell
        ? {
            id: shell.getAttribute("data-showcase-id"),
            family: shell.getAttribute("data-showcase-family"),
            status: shell.getAttribute("data-showcase-status"),
            host: shell.getAttribute("data-showcase-host"),
          }
        : null,
      mainCount: document.querySelectorAll("main").length,
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      focusableCount: focusable.length,
      bodyRegisters: {
        weight: document.body.getAttribute("data-weight"),
        theme: document.body.getAttribute("data-theme"),
        grade: document.body.getAttribute("data-grade"),
      },
      staticFallback: Boolean(
        document.querySelector(
          '[data-static-fallback], [data-passage-mode="static"], [data-reduced-motion-fallback]',
        ),
      ),
    };
  });

  return {
    ...entry,
    httpStatus: response?.status() ?? 0,
    ...dom,
  };
}

export async function measureShowcaseRoutes({
  baseURL = process.env.BASE_URL ?? "http://127.0.0.1:4173",
  includeReducedMotion = true,
} = {}) {
  const entries = includeReducedMotion
    ? [...buildRouteMatrix(), ...buildReducedMotionRouteMatrix()]
    : buildRouteMatrix();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const measurements = [];

  try {
    for (const entry of entries) {
      measurements.push(await measureRoute(page, entry, baseURL));
    }
  } finally {
    await browser.close();
  }

  return measurements;
}

async function main() {
  const output = process.argv.includes("--output")
    ? process.argv[process.argv.indexOf("--output") + 1]
    : null;
  const baseUrl = process.argv.includes("--base-url")
    ? process.argv[process.argv.indexOf("--base-url") + 1]
    : undefined;
  const includeReducedMotion = !process.argv.includes("--no-reduced-motion");
  const measurements = await measureShowcaseRoutes({
    baseURL: baseUrl,
    includeReducedMotion,
  });
  const failures = measurements.filter(
    (measurement) =>
      measurement.httpStatus !== 200 ||
      measurement.mainCount !== 1 ||
      measurement.scrollWidth > measurement.viewportWidth + 1 ||
      measurement.shell?.id !== measurement.id ||
      measurement.shell?.family !== measurement.family ||
      measurement.shell?.status !== measurement.status,
  );
  const report = {
    generatedAt: new Date().toISOString(),
    routeCount: showcaseManifests.length,
    measurementCount: measurements.length,
    failures,
    measurements,
  };

  if (output) {
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  console.log(
    JSON.stringify({
      routeCount: report.routeCount,
      measurementCount: report.measurementCount,
      failureCount: failures.length,
      output,
    }),
  );

  if (failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}

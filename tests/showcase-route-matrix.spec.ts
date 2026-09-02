import { expect, test } from "@playwright/test";
import {
  buildReducedMotionRouteMatrix,
  buildRouteMatrix,
  measureRoute,
} from "../scripts/measure-showcase-routes.mjs";
import type { Page } from "@playwright/test";

type RouteMatrixEntry = ReturnType<typeof buildRouteMatrix>[number];

async function verifyEntries(page: Page, entries: RouteMatrixEntry[]) {
  for (const entry of entries) {
    const measurement = await measureRoute(
      page,
      entry,
      "http://127.0.0.1:4173",
    );

    expect(
      measurement.httpStatus,
      `${entry.id} @ ${entry.width}px status`,
    ).toBe(200);
    expect(
      measurement.shell,
      `${entry.id} @ ${entry.width}px shell`,
    ).toMatchObject({
      id: entry.id,
      family: entry.family,
      status: entry.status,
    });
    expect(
      measurement.mainCount,
      `${entry.id} @ ${entry.width}px main count`,
    ).toBe(1);
    expect(
      measurement.scrollWidth,
      `${entry.id} @ ${entry.width}px overflow`,
    ).toBeLessThanOrEqual(entry.width + 1);
    expect(
      measurement.focusableCount,
      `${entry.id} @ ${entry.width}px focusable controls`,
    ).toBeGreaterThan(0);
    expect(measurement.bodyRegisters.weight).toBe(entry.weight);
    expect(measurement.bodyRegisters.theme).toBe(entry.theme);
    expect(measurement.bodyRegisters.grade).toBe(entry.grade);
  }
}

async function verifyConsoleHealth(page: Page) {
  const entries = buildRouteMatrix().filter((entry) => entry.width === 1600);

  for (const entry of entries) {
    const messages: string[] = [];
    const onConsole = (message: { type(): string; text(): string }) => {
      if (message.type() === "error" || message.type() === "warning") {
        messages.push(`${message.type()}: ${message.text()}`);
      }
    };
    const onPageError = (error: Error) => {
      messages.push(`pageerror: ${error.message}`);
    };

    page.on("console", onConsole);
    page.on("pageerror", onPageError);

    try {
      await measureRoute(page, entry, "http://127.0.0.1:4173");
      expect(messages, `${entry.id} browser messages`).toEqual([]);
    } finally {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    }
  }
}

test.describe("showcase route matrix", () => {
  test("keeps every route identified and contained at approved widths", async ({
    page,
  }) => {
    test.setTimeout(600_000);
    await verifyEntries(page, buildRouteMatrix());
  });

  test("keeps every route equivalent under reduced motion", async ({
    page,
  }) => {
    test.setTimeout(600_000);
    await verifyEntries(page, buildReducedMotionRouteMatrix());
  });

  test("keeps every canonical route free of browser messages", async ({
    page,
  }) => {
    test.setTimeout(600_000);
    await verifyConsoleHealth(page);
  });
});

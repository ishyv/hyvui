import { expect, test } from "@playwright/test";

test.describe("focus and context", () => {
  test("renders a full-viewport observation field with an accessible reading rail", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/witness", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    const root = page.locator("[data-witness]");
    await expect(root).toHaveAttribute("data-view-mode", "focus");
    await expect(root).toHaveAttribute("data-active-observation", "horizon");
    await expect(root.locator("h1")).toHaveText("focus and context");
    await expect(root.locator("[data-witness-target]")).toHaveCount(3);
    await expect(root.locator("[data-witness-reading]")).toContainText(
      "the signal sits at the boundary",
    );
    await expect(
      root.locator("[data-witness-focus-connection]"),
    ).toHaveAttribute("data-focus-connection", "horizon");
    await expect(root.locator("[data-witness-field]")).toBeVisible();

    const verticalSpacing = await root.evaluate((element) => {
      const railElement = element.querySelector<HTMLElement>(".witness-record");
      const rail = railElement?.getBoundingClientRect();
      const footer = element
        .querySelector(".witness-footer")
        ?.getBoundingClientRect();
      return {
        intersects:
          Boolean(rail && footer) &&
          rail!.right > footer!.left &&
          rail!.left < footer!.right &&
          rail!.bottom > footer!.top &&
          rail!.top < footer!.bottom,
        railScrollHeight: railElement?.scrollHeight ?? 0,
        railClientHeight: railElement?.clientHeight ?? 0,
      };
    });
    expect(verticalSpacing.intersects).toBe(false);
    expect(verticalSpacing.railScrollHeight).toBeLessThanOrEqual(
      verticalSpacing.railClientHeight + 1,
    );

    const geometry = await root.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        viewport: window.innerWidth,
      };
    });
    expect(geometry.height).toBeGreaterThanOrEqual(899);
    expect(geometry.width).toBeLessThanOrEqual(geometry.viewport + 1);
  });

  test("changes the act of looking without losing the selected evidence", async ({
    page,
  }) => {
    await page.goto("/next-lab/witness", { waitUntil: "networkidle" });

    await page.locator('[data-witness-target="canopy"]').click();
    await expect(page.locator("[data-witness]")).toHaveAttribute(
      "data-active-observation",
      "canopy",
    );
    await expect(page.locator("[data-witness-reading]")).toContainText(
      "pale mark holds",
    );
    await expect(page.locator("[data-witness-trail]")).toContainText(
      "upper field",
    );

    await page.locator('[data-witness-mode="context"]').click();
    await expect(page.locator("[data-witness]")).toHaveAttribute(
      "data-view-mode",
      "context",
    );
    await expect(page.locator("[data-witness-certainty]")).toHaveText(
      "three markers / lower certainty",
    );
    await expect(
      page.locator('[data-witness-marker-state="visible"]'),
    ).toHaveCount(3);
    await expect(
      page.locator('[data-witness-focus-connection="canopy"]'),
    ).toHaveCount(1);
    await expect(page.locator("[data-witness-reading]")).toContainText(
      "the upper edge carries a route",
    );
  });

  test("supports arrow-key traversal through the same observation targets", async ({
    page,
  }) => {
    await page.goto("/next-lab/witness", { waitUntil: "networkidle" });
    const field = page.locator('[data-witness-marker-id="horizon"]');

    await field.focus();
    await field.press("ArrowRight");
    await expect(page.locator("[data-witness]")).toHaveAttribute(
      "data-active-observation",
      "ground",
    );
    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("[data-witness]")).toHaveAttribute(
      "data-active-observation",
      "horizon",
    );
  });

  test("keeps the observation field contained and still under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/witness", { waitUntil: "networkidle" });

    const geometry = await page
      .locator("[data-witness]")
      .evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          right: rect.right,
          viewport: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          transition: getComputedStyle(element).transitionDuration,
        };
      });
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.viewport + 1);
    expect(geometry.transition).toBe("0s");
    await expect(page.locator("[data-witness-reading]")).toBeVisible();
    await expect(page.locator("[data-witness-field]")).toBeVisible();
  });

  test("gives the reading rail enough type and spacing to breathe", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/witness", { waitUntil: "networkidle" });

    const rhythm = await page.locator("[data-witness]").evaluate((element) => {
      const rail = element.querySelector<HTMLElement>(".witness-record");
      const label = element.querySelector<HTMLElement>(".record-label");
      const reading = element.querySelector<HTMLElement>(
        "[data-witness-reading] p",
      );
      const row = element.querySelector<HTMLElement>(
        ".observation-list button",
      );
      if (!rail || !label || !reading || !row)
        throw new Error("witness rhythm missing");

      return {
        railGap: parseFloat(getComputedStyle(rail).rowGap),
        labelSize: parseFloat(getComputedStyle(label).fontSize),
        readingLineHeight: parseFloat(getComputedStyle(reading).lineHeight),
        rowHeight: row.getBoundingClientRect().height,
      };
    });

    expect(rhythm.railGap).toBeGreaterThanOrEqual(22);
    expect(rhythm.labelSize).toBeGreaterThanOrEqual(13.5);
    expect(rhythm.readingLineHeight).toBeGreaterThanOrEqual(20);
    expect(rhythm.rowHeight).toBeGreaterThanOrEqual(48);
  });
});

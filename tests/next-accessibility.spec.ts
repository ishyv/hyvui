import { expect, test } from "@playwright/test";

test.describe("artistic composition accessibility contracts", () => {
  test("keeps frame history, labels, focus targets, and semantic order native", async ({
    page,
  }) => {
    await page.goto("/next-lab/frames", { waitUntil: "networkidle" });

    const frames = page.locator("[data-frame]");
    await expect(frames).toHaveCount(2);
    await expect(frames.nth(0)).toHaveAttribute(
      "aria-labelledby",
      "arrival-label",
    );
    await expect(frames.nth(1)).toHaveAttribute(
      "aria-labelledby",
      "departure-label",
    );
    await expect(frames.nth(1)).toHaveAttribute("tabindex", "-1");

    await page.locator('[data-frame-index] a[href="#departure"]').click();
    await expect(page).toHaveURL(/\/next-lab\/frames#departure$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/next-lab\/frames$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/next-lab\/frames#departure$/);

    await page.locator("#departure").focus();
    await expect(page.locator("#departure")).toBeFocused();
  });

  test("keeps passage content singular and progress perceivable", async ({
    page,
  }) => {
    await page.goto("/next-lab/passage?mode=scroll", {
      waitUntil: "networkidle",
    });

    await expect(page.locator("[data-passage]")).toHaveAttribute(
      "aria-labelledby",
      "ecological-absorption-label",
    );
    await expect(page.locator("[data-passage-step]")).toHaveCount(3);
    await expect(
      page.locator('[data-passage-progress][aria-live="polite"]'),
    ).toBeVisible();
    await expect(page.locator("[data-passage] [data-wheel-trap]")).toHaveCount(
      0,
    );

    const stepIds = await page
      .locator("[data-passage-step]")
      .evaluateAll((steps) =>
        steps.map((step) => step.getAttribute("data-passage-step")),
      );
    expect(new Set(stepIds).size).toBe(3);
  });

  test("preserves passage meaning in static reduced-motion mode on mobile", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/passage?mode=static", {
      waitUntil: "networkidle",
    });

    await expect(
      page.locator('[data-passage][data-passage-mode="static"]'),
    ).toBeVisible();
    await expect(
      page.locator("[data-passage-static] [data-passage-step]"),
    ).toHaveCount(3);
    const geometry = await page
      .locator("[data-passage]")
      .evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { right: rect.right, viewport: window.innerWidth };
      });
    expect(geometry.right).toBeLessThanOrEqual(geometry.viewport + 1);
  });
});

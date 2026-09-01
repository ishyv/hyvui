import { expect, test } from "@playwright/test";

test.describe("scroll-native passage", () => {
  test("uses native scroll for ecological absorption and exposes progress", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/passage", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    const passage = page.locator("[data-passage]");
    await expect(passage).toHaveAttribute("data-passage-mode", "scroll");
    await expect(passage).toHaveAttribute(
      "data-passage-progress-mode",
      "intersection",
    );
    await expect(passage.locator("[data-passage-step]")).toHaveCount(3);
    await expect(passage.locator("[data-passage-progress]")).toContainText(
      "step 1 / 3",
    );
    await expect(page.locator("[data-wheel-trap]")).toHaveCount(0);

    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(250);
    const after = await page.evaluate(() => window.scrollY);
    expect(after).toBeGreaterThan(before);
  });

  test("renders the same passage as ordinary static reading when requested", async ({
    page,
  }) => {
    await page.goto("/next-lab/passage?mode=static", {
      waitUntil: "networkidle",
    });

    const passage = page.locator("[data-passage]");
    await expect(passage).toHaveAttribute("data-passage-mode", "static");
    await expect(passage.locator("[data-passage-static]")).toHaveCount(1);
    await expect(passage.locator("[data-passage-scroll]")).toHaveCount(0);
    await expect(passage.locator("[data-passage-step]")).toHaveCount(3);
    await expect(passage.locator("[data-passage-progress]")).toContainText(
      "step 1 / 3",
    );
    await expect(passage.locator("[data-passage-supplement]")).toHaveCount(3);
  });

  test("keeps a focused passage contained on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/passage", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => {
      const passage = document.querySelector<HTMLElement>("[data-passage]");
      const step = document.querySelector<HTMLElement>("[data-passage-step]");
      if (!passage || !step) throw new Error("passage missing");
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        passageWidth: passage.getBoundingClientRect().width,
        stepWidth: step.getBoundingClientRect().width,
      };
    });

    expect(result.overflow).toBeLessThanOrEqual(1);
    expect(result.passageWidth).toBeLessThanOrEqual(375);
    expect(result.stepWidth).toBeLessThanOrEqual(375);
  });
});

import { expect, test } from "@playwright/test";

test.describe("native frame sequence", () => {
  test("renders semantic full-viewport frames with hash navigation", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/frames", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    const sequence = page.locator("[data-frame-sequence]");
    const frames = page.locator("[data-frame]");
    await expect(sequence).toHaveCount(1);
    await expect(frames).toHaveCount(2);
    await expect(sequence.locator("[data-frame-index]")).toHaveCount(1);
    await expect(sequence.locator("[data-frame-index] a")).toHaveCount(2);
    await expect(frames.nth(0)).toHaveAttribute(
      "data-frame-transition",
      "approach",
    );
    await expect(frames.nth(1)).toHaveAttribute(
      "data-frame-transition",
      "release",
    );

    const geometry = await frames.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { height: rect.height, width: rect.width, top: rect.top };
      }),
    );
    expect(geometry.every((item) => item.height >= 899)).toBe(true);
    expect(geometry[1].top).toBeGreaterThanOrEqual(geometry[0].top + 899);
    expect(await page.locator("[data-wheel-trap]").count()).toBe(0);

    await sequence.locator('[data-frame-index] a[href="#departure"]').click();
    await expect(page).toHaveURL(/\/next-lab\/frames#departure$/);
    await page.locator("#departure").focus();
    expect(await page.evaluate(() => document.activeElement?.id)).toBe(
      "departure",
    );
    await expect(
      sequence.locator('[data-frame-index] a[href="#departure"]'),
    ).toHaveAttribute("aria-current", "page");
    await expect(frames.nth(1)).toHaveAttribute("data-frame-active", "true");
  });

  test("keeps the frame sequence contained on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/frames", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => {
      const sequence = document.querySelector<HTMLElement>(
        "[data-frame-sequence]",
      );
      const frame = document.querySelector<HTMLElement>("[data-frame]");
      if (!sequence || !frame) throw new Error("frame sequence missing");
      const rect = frame.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        frameWidth: rect.width,
        sequenceWidth: sequence.getBoundingClientRect().width,
      };
    });

    expect(result.overflow).toBeLessThanOrEqual(1);
    expect(result.frameWidth).toBeLessThanOrEqual(375);
    expect(result.sequenceWidth).toBeLessThanOrEqual(375);
  });

  test("replaces movement with an immediate state change for reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/next-lab/frames", { waitUntil: "networkidle" });

    const transition = await page
      .locator('[data-frame="departure"]')
      .evaluate((frame) => {
        const style = getComputedStyle(frame);
        return {
          duration: style.transitionDuration,
          animation: style.animationName,
        };
      });

    expect(transition.duration).toBe("0s");
    expect(transition.animation).toBe("none");
  });
});

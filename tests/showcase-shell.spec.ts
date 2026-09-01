import { expect, test } from "@playwright/test";

test.describe("showcase curatorial shell", () => {
  test("orients the witness route without replacing its inner composition", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/witness", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    const shell = page.locator("[data-showcase-shell]");
    await expect(shell).toHaveCount(1);
    await expect(shell).toHaveAttribute("data-showcase-id", "next-witness");
    await expect(shell).toHaveAttribute(
      "data-showcase-family",
      "research-archive",
    );
    await expect(shell).toHaveAttribute("data-showcase-status", "experimental");
    await expect(shell).toHaveAttribute("data-showcase-density", "compact");
    await expect(shell).toHaveAttribute("data-showcase-layout", "overlay");
    await expect(shell).toHaveAttribute("data-showcase-viewer", "investigator");
    await expect(shell).toHaveAttribute("data-showcase-relation", "reveal");
    await expect(shell.locator("[data-showcase-premise]")).toContainText(
      "focus shows one marker",
    );

    await expect(shell.locator('a[href="#showcase-content"]')).toHaveCount(1);
    await expect(shell.locator("[data-showcase-nav]")).toHaveCount(1);
    await expect(
      shell.locator('[data-showcase-nav] a[aria-current="page"]'),
    ).toHaveAttribute("href", "/next-lab/witness");
    await expect(
      shell.locator('[data-showcase-nav] a[href="/next-lab/baseline"]'),
    ).toHaveCount(1);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("[data-witness]")).toBeVisible();
    const titleBox = await page
      .locator("[data-witness] h1")
      .evaluate((title) => {
        const rect = title.getBoundingClientRect();
        return {
          top: rect.top,
          bottom: rect.bottom,
          viewport: window.innerHeight,
        };
      });
    expect(titleBox.top).toBeGreaterThanOrEqual(0);
    expect(titleBox.bottom).toBeLessThanOrEqual(titleBox.viewport);
  });

  test("keeps shell orientation contained on mobile and under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/witness", { waitUntil: "networkidle" });

    const result = await page
      .locator("[data-showcase-shell]")
      .evaluate((shell) => ({
        right: shell.getBoundingClientRect().right,
        viewport: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        transition: getComputedStyle(shell).transitionDuration,
      }));

    expect(result.right).toBeLessThanOrEqual(result.viewport + 1);
    expect(result.scrollWidth).toBeLessThanOrEqual(result.viewport + 1);
    expect(result.transition).toBe("0s");
    await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
      "data-showcase-status",
      "experimental",
    );
    await expect(page.locator("[data-showcase-content]")).toBeVisible();
  });
});

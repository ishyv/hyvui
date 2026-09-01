import { expect, test } from "@playwright/test";

test.describe("field guide", () => {
  test("keeps documentation utility inside the anthology shell", async ({
    page,
  }) => {
    const response = await page.goto("/docs", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    const shell = page.locator("[data-showcase-shell]");
    await expect(shell).toHaveAttribute("data-showcase-id", "docs");
    await expect(shell).toHaveAttribute("data-showcase-family", "field-guide");
    await expect(shell).toHaveAttribute("data-showcase-status", "utility");
    await expect(shell).toHaveAttribute(
      "data-showcase-host",
      "deconstructed-editorial",
    );
    await expect(page.locator("main")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "documentation" }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("find a component")).toBeVisible();
    await expect(page.locator('a[href="#overview"]')).toHaveCount(1);
    await expect(page.locator('a[href="#scenes"]')).toHaveCount(1);
    await expect(page.getByText("the index")).toBeVisible();
  });

  test("keeps the field guide contained on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/docs", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      mainCount: document.querySelectorAll("main").length,
    }));

    expect(result.width).toBeLessThanOrEqual(result.viewport + 1);
    expect(result.mainCount).toBe(1);
    await expect(
      page.getByRole("heading", { name: "documentation" }),
    ).toBeVisible();
  });

  test("reflows long primitive labels and readout scenes on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/docs", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => {
      const main = document.querySelector("#scenes .hyvui-readout-main");
      const sidebar = document.querySelector("#scenes .hyvui-readout-sidebar");
      const longLabel = [
        ...document.querySelectorAll("#primitives .hyvui-label"),
      ].find(
        (element) =>
          element.textContent?.trim() === "label + divider primitives",
      );
      if (!main || !sidebar || !longLabel) return null;

      const mainRect = main.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      return {
        mainWidth: mainRect.width,
        sidebarTop: sidebarRect.top,
        mainBottom: mainRect.bottom,
        labelScrollWidth: longLabel.scrollWidth,
        labelClientWidth: longLabel.clientWidth,
      };
    });

    expect(result).not.toBeNull();
    expect(result!.mainWidth).toBeGreaterThan(0);
    expect(result!.sidebarTop).toBeGreaterThanOrEqual(result!.mainBottom);
    expect(result!.labelScrollWidth).toBeLessThanOrEqual(
      result!.labelClientWidth,
    );
  });
});

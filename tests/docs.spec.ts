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
    await expect(page.locator('.docs-sidebar a[href="#scenes"]')).toHaveCount(
      1,
    );
    await expect(page.getByText("the index")).toBeVisible();
  });

  test("starts with a teachable path and an executable relation step", async ({
    page,
  }) => {
    await page.goto("/docs", { waitUntil: "networkidle" });

    await expect(page.locator('a[href="#start-here"]')).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "start here" }),
    ).toBeVisible();
    await expect(page.locator("[data-docs-field-guide]")).toContainText(
      "install",
    );
    await expect(page.locator("[data-docs-field-guide]")).toContainText(
      "smallest composition",
    );
    await expect(page.locator("[data-docs-field-guide]")).toContainText(
      "one relation",
    );
    await expect(
      page
        .locator("[data-docs-field-guide]")
        .getByRole("link", { name: "open relation workbench" }),
    ).toHaveAttribute("href", "/workbench");
  });

  test("keeps the field guide contained on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/docs", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      bodyWidth: document.body.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      mainCount: document.querySelectorAll("main").length,
    }));

    expect(result.width).toBeLessThanOrEqual(result.viewport + 1);
    expect(result.bodyScrollWidth).toBeLessThanOrEqual(result.bodyWidth + 1);
    expect(result.mainCount).toBe(1);
    await expect(
      page.getByRole("heading", { name: "documentation" }),
    ).toBeVisible();
  });

  test("keeps the route note secondary on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/docs", { waitUntil: "networkidle" });

    await expect(page.locator(".showcase-context")).not.toHaveAttribute("open");
    await expect(
      page.getByRole("heading", { name: "documentation" }),
    ).toBeVisible();
  });

  test("gives the docs search a usable mobile topbar row", async ({ page }) => {
    for (const width of [375, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/docs", { waitUntil: "networkidle" });

      const result = await page.evaluate(() => {
        const inner = document.querySelector<HTMLElement>(
          ".docs-topbar .hyvui-topbar-inner",
        );
        const search = document.querySelector<HTMLElement>(".docs-search");
        if (!inner || !search) return null;

        return {
          trackCount: getComputedStyle(inner)
            .gridTemplateColumns.trim()
            .split(/\s+/).length,
          searchWidth: search.getBoundingClientRect().width,
          clientWidth: document.documentElement.clientWidth,
        };
      });

      expect(result).not.toBeNull();
      expect(result!.trackCount).toBe(1);
      expect(result!.searchWidth).toBeGreaterThan(result!.clientWidth * 0.65);
    }
  });

  test("renders documentation specimens without browser console errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto("/docs", { waitUntil: "networkidle" });

    expect(consoleErrors).toEqual([]);
  });

  test("keeps tabs warning-free and transfers keyboard focus", async ({
    page,
  }) => {
    const warnings: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "warning") warnings.push(message.text());
    });

    await page.goto("/docs", { waitUntil: "networkidle" });

    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    await tabs.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await expect(tabs.nth(2)).toBeFocused();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(tabs.nth(0)).toBeFocused();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    expect(
      warnings.filter((warning) => warning.includes("non_reactive")),
    ).toEqual([]);
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

import { expect, test } from "@playwright/test";

const conditions = [
  "drifting",
  "cooling",
  "forbidden",
  "gateway",
  "interrupted",
  "lost",
  "maintenance",
  "offline",
  "pending",
  "redirecting",
  "unauthorized",
];

test.describe("condition atlas", () => {
  test("presents ordered system conditions as an atlas", async ({ page }) => {
    const response = await page.goto("/system", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    const shell = page.locator("[data-showcase-shell]");
    await expect(shell).toHaveAttribute("data-showcase-id", "system");
    await expect(shell).toHaveAttribute(
      "data-showcase-family",
      "condition-atlas",
    );
    await expect(shell).toHaveAttribute("data-showcase-status", "utility");
    await expect(page.locator("[data-condition-atlas]")).toHaveCount(1);
    await expect(page.locator("[data-condition-entry]")).toHaveCount(11);
    await expect(
      page.locator("[data-condition-entry]").first(),
    ).toHaveAttribute("href", "/drifting");
    await expect(page.locator("[data-condition-entry]").last()).toHaveAttribute(
      "href",
      "/unauthorized",
    );
    await expect(page.locator("main")).toHaveCount(1);
  });

  test("keeps a condition route truthful inside the same atlas family", async ({
    page,
  }) => {
    const response = await page.goto("/lost", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
      "data-showcase-id",
      "lost",
    );
    await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
      "data-showcase-family",
      "condition-atlas",
    );
    await expect(page.locator("[data-condition-state]")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("link", { name: /home|index|retry|return/i }).first(),
    ).toBeVisible();
  });

  test("orients system demonstration routes without hiding their controls", async ({
    page,
  }) => {
    for (const route of ["/system/cinematic", "/system/ornament-patterns"]) {
      const response = await page.goto(route, { waitUntil: "networkidle" });
      expect(response?.status()).toBe(200);
      await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
        "data-showcase-family",
        "condition-atlas",
      );
      await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
        "data-showcase-status",
        "utility",
      );
      await expect(page.locator("main")).toHaveCount(1);
      await expect(page.getByRole("button").first()).toBeVisible();
    }
  });

  test("shows route defaults and restores the global light angle", async ({
    page,
  }) => {
    await page.goto("/system/cinematic", { waitUntil: "networkidle" });
    await expect(
      page.getByRole("button", { name: "field-notebook" }),
    ).toHaveClass(/tk-on/);
    await expect(page.getByRole("button", { name: "twilight" })).toHaveClass(
      /tk-on/,
    );

    const slider = page.locator('input[type="range"]');
    await slider.fill("200");
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.style.getPropertyValue("--key-light-angle"),
        ),
      )
      .toBe("200deg");

    await page.locator('a[href="/system"]').first().click();
    await expect(page).toHaveURL(/\/system$/);
    await expect
      .poll(() =>
        page.evaluate(() =>
          document.documentElement.style.getPropertyValue("--key-light-angle"),
        ),
      )
      .toBe("");
  });

  test("keeps the atlas contained on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/system", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      entries: document.querySelectorAll("[data-condition-entry]").length,
    }));

    expect(result.scrollWidth).toBeLessThanOrEqual(result.viewport + 1);
    expect(result.entries).toBe(11);
  });
});

import { expect, test } from "@playwright/test";

test.describe("stress observatory", () => {
  test("keeps fixed-width stress cases inside the utility shell", async ({
    page,
  }) => {
    const response = await page.goto("/lab", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    const shell = page.locator("[data-showcase-shell]");
    await expect(shell).toHaveAttribute("data-showcase-id", "lab");
    await expect(shell).toHaveAttribute(
      "data-showcase-family",
      "stress-observatory",
    );
    await expect(shell).toHaveAttribute("data-showcase-status", "utility");
    await expect(page.locator("main.lab")).toHaveCount(1);
    await expect(page.locator("[data-width]")).toHaveCount(8);
    await expect(
      page.getByRole("heading", { name: "stress lab" }),
    ).toBeVisible();
    await expect(page.getByText("container queries")).toBeVisible();
  });

  test("keeps the observatory contained on mobile while preserving case widths", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/lab", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      widths: [...document.querySelectorAll<HTMLElement>("[data-width]")].map(
        (element) => Number(element.dataset.width),
      ),
    }));

    expect(result.scrollWidth).toBeLessThanOrEqual(result.viewport + 1);
    expect(result.widths).toEqual([280, 320, 375, 480, 640, 768, 1024, 1440]);
  });
});

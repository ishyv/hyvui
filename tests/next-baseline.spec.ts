import { expect, test } from "@playwright/test";

const cases = [
  "sparse",
  "dense",
  "image-dominant",
  "type-dominant",
  "atmospheric-motion",
];

test.describe("current-library composition control", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const caseId of cases) {
    test(`${caseId} control renders with a stable composition identity`, async ({
      page,
    }) => {
      await page.goto(`/next-lab/baseline?case=${caseId}`, {
        waitUntil: "networkidle",
      });

      await expect(
        page.locator(`[data-composition-case="${caseId}"]`),
      ).toBeVisible();
      await expect(page.locator("[data-layout-signature]")).toHaveAttribute(
        "data-layout-signature",
        new RegExp(`^baseline-${caseId}$`),
      );
      await expect(page.locator("[data-case-nav]")).toBeVisible();
    });
  }
});

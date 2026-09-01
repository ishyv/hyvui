import { expect, test } from "@playwright/test";

const cases = [
  "sparse",
  "dense",
  "image-dominant",
  "type-dominant",
  "atmospheric-motion",
];
const modes = ["disabled", "suggest", "apply"];
type Inspection = {
  nodes: unknown[];
  decisions: Array<{ status: string }>;
};

async function readInspection(
  page: import("@playwright/test").Page,
): Promise<Inspection> {
  return page
    .locator("[data-composition-inspector]")
    .textContent()
    .then((value) => JSON.parse(value ?? "{}") as Inspection);
}

test.describe("static composition experiment", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const caseId of cases) {
    test(`${caseId} exposes nodes, relations, and inspection data`, async ({
      page,
    }) => {
      await page.goto(`/next-lab/experiment?case=${caseId}&mode=suggest`, {
        waitUntil: "networkidle",
      });

      await expect(
        page.locator(`[data-experiment-case="${caseId}"]`),
      ).toBeVisible();
      await expect(page.locator("[data-next-composition]")).toHaveAttribute(
        "data-adaptation",
        "suggest",
      );
      await expect(page.locator("[data-composition-node]")).not.toHaveCount(0);
      await expect(page.locator("[data-composition-inspector]")).toHaveCount(1);

      const inspection = await readInspection(page);

      expect(inspection.nodes.length).toBeGreaterThan(1);
      expect(inspection.decisions.length).toBeGreaterThan(0);
      expect(
        inspection.decisions.every((decision) =>
          ["suggested", "rejected"].includes(decision.status),
        ),
      ).toBe(true);
      expect(
        inspection.decisions.some(
          (decision) => decision.status === "suggested",
        ),
      ).toBe(true);
    });
  }

  for (const mode of modes) {
    test(`preserves ${mode} adaptation policy in the DOM and inspector`, async ({
      page,
    }) => {
      await page.goto(`/next-lab/experiment?case=sparse&mode=${mode}`, {
        waitUntil: "networkidle",
      });

      await expect(page.locator("[data-next-composition]")).toHaveAttribute(
        "data-adaptation",
        mode,
      );

      const inspection = await readInspection(page);
      const statuses = inspection.decisions.map((decision) => decision.status);

      if (mode === "disabled") expect(statuses).toEqual(["rejected"]);
      if (mode === "suggest") expect(statuses).toEqual(["suggested"]);
      if (mode === "apply") expect(statuses).toEqual(["applied"]);
    });
  }

  test("manual placement rejects an applied relation and explains why", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=type-dominant&mode=apply", {
      waitUntil: "networkidle",
    });

    await expect(page.locator('[data-relation-status="rejected"]')).toHaveCount(
      1,
    );
    await expect(page.locator("[data-composition-inspector]")).toContainText(
      "manual placement",
    );
  });

  test("repeated renders preserve seeded node variation", async ({ page }) => {
    await page.goto("/next-lab/experiment?case=sparse&mode=suggest", {
      waitUntil: "networkidle",
    });
    const first = await page
      .locator('[data-composition-node="signal"]')
      .getAttribute("style");

    await page.reload({ waitUntil: "networkidle" });
    const second = await page
      .locator('[data-composition-node="signal"]')
      .getAttribute("style");

    expect(first).toBe(second);
  });
});

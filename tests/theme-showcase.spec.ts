import { expect, test } from "@playwright/test";

const studies = [
  {
    id: "hextech",
    href: "/showcase/hextech",
    host: "operational-apparatus",
    weight: "mission-control",
    theme: "hextech",
    grade: "interrogation",
    inner: ".forge",
    heading: "ignition · 03:14",
  },
  {
    id: "arcane",
    href: "/showcase/arcane",
    host: "ceremonial-reliquary",
    weight: "field-notebook",
    theme: "arcane",
    grade: "twilight",
    inner: ".chamber",
    heading: "the manifest",
  },
] as const;

test.describe("theme material studies", () => {
  for (const study of studies) {
    test(`${study.id} keeps its material identity inside the anthology shell`, async ({
      page,
    }) => {
      const response = await page.goto(study.href, {
        waitUntil: "networkidle",
      });
      expect(response?.status()).toBe(200);

      const shell = page.locator("[data-showcase-shell]");
      await expect(shell).toHaveAttribute("data-showcase-id", study.id);
      await expect(shell).toHaveAttribute(
        "data-showcase-family",
        "material-study",
      );
      await expect(shell).toHaveAttribute("data-showcase-host", study.host);
      await expect(page.locator(study.inner)).toHaveCount(1);
      await expect(
        page.getByRole("heading", { name: study.heading }),
      ).toBeVisible();
      await expect(page.locator("body")).toHaveAttribute(
        "data-weight",
        study.weight,
      );
      await expect(page.locator("body")).toHaveAttribute(
        "data-theme",
        study.theme,
      );
      await expect(page.locator("body")).toHaveAttribute(
        "data-grade",
        study.grade,
      );
    });
  }

  test("keeps hextech and arcane as different inner compositions", async ({
    page,
  }) => {
    const signatures: string[] = [];

    for (const study of studies) {
      await page.goto(study.href, { waitUntil: "networkidle" });
      signatures.push(
        await page
          .locator("[data-showcase-content]")
          .evaluate((content) =>
            [...content.children].map((child) => child.className).join("/"),
          ),
      );
    }

    expect(new Set(signatures).size).toBe(2);
  });

  test("keeps the hextech focal crystal in the initial desktop viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto("/showcase/hextech", { waitUntil: "networkidle" });

    const crystal = page.locator(".rig-svg .crystal-inner");
    const box = await crystal.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height).toBeLessThanOrEqual(900);
  });
});

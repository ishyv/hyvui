import { expect, test } from "@playwright/test";

const scenes = [
  {
    slug: "studio-console",
    title: "studio console",
    weight: "mission-control",
    theme: null,
  },
  {
    slug: "field-report",
    title: "field report",
    weight: "field-notebook",
    theme: null,
  },
  {
    slug: "archive-gallery",
    title: "archive gallery",
    weight: "archive",
    theme: null,
  },
  {
    slug: "signal-lost",
    title: "signal lost",
    weight: "field-notebook",
    theme: null,
  },
  {
    slug: "hextech-forge",
    title: "hextech forge",
    weight: "field-notebook",
    theme: "hextech",
  },
  {
    slug: "arcane-shard",
    title: "arcane shard",
    weight: "archive",
    theme: "arcane",
  },
];

test.describe("showcase anthology", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("homepage leads with the cinematic scene anthology", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.getByRole("heading", { name: "hyvui" })).toBeVisible();
    await expect(page.getByText("scene anthology")).toBeVisible();

    for (const scene of scenes) {
      await expect(
        page.getByRole("link", { name: new RegExp(scene.title, "i") }),
      ).toBeVisible();
    }

    await expect(
      page.getByRole("link", { name: /observation deck/i }),
    ).toHaveCount(0);
  });

  for (const scene of scenes) {
    test(`${scene.slug} renders with split weight/theme attributes`, async ({
      page,
    }) => {
      await page.goto(`/examples/${scene.slug}`, { waitUntil: "networkidle" });

      await expect(
        page.getByRole("heading", { name: scene.title }),
      ).toBeVisible();
      await expect(page.locator("body")).toHaveAttribute(
        "data-weight",
        scene.weight,
      );

      if (scene.theme) {
        await expect(page.locator("body")).toHaveAttribute(
          "data-theme",
          scene.theme,
        );
      } else {
        await expect(page.locator("body")).not.toHaveAttribute("data-theme");
      }

      await expect(page.locator("body")).not.toHaveAttribute("data-register");
    });
  }
});

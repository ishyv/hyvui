import { expect, test } from "@playwright/test";

const scenes = [
  {
    slug: "bridge",
    heading: "night watch",
    weight: "mission-control",
    theme: "hextech",
  },
  {
    slug: "keeper",
    heading: "the marbry estate",
    weight: "archive",
    theme: null,
  },
  {
    slug: "correspondence",
    heading: "for lior, in the spring",
    weight: "field-notebook",
    theme: null,
  },
  {
    slug: "watchhouse",
    heading: "logbook · brun",
    weight: "field-notebook",
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
    await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
      "data-showcase-id",
      "home",
    );
    await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
      "data-showcase-family",
      "frontispiece",
    );
    await expect(page.locator("[data-frontispiece]")).toHaveCount(1);
    await expect(page.locator("[data-scene-procession]")).toHaveCount(1);
    await expect(page.locator("[data-threshold-departure]")).toHaveCount(4);
    expect(
      await page
        .locator("[data-threshold-departure]")
        .evaluateAll((links) =>
          links.every((link) => !link.closest('[aria-hidden="true"]')),
        ),
    ).toBe(true);
    await expect(page.locator(".scene-grid")).toHaveCount(0);

    for (const scene of scenes) {
      await expect(
        page.locator(`[data-scene-entry="${scene.slug}"]`),
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
        page.getByRole("heading", { name: scene.heading }),
      ).toBeVisible();
      await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
        "data-showcase-id",
        scene.slug,
      );
      await expect(page.locator("[data-showcase-shell]")).toHaveAttribute(
        "data-showcase-family",
        "scene",
      );
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

  test("keeps the bridge primary contact aligned with its bearing", async ({
    page,
  }) => {
    await page.goto("/examples/bridge", { waitUntil: "networkidle" });

    const point = page.locator('[data-bridge-contact="PAULSEN-9"]');
    await expect(point).toHaveAttribute("data-bearing", "240");
    const coordinates = await point.evaluate((element) => ({
      x: Number(element.getAttribute("cx")),
      y: Number(element.getAttribute("cy")),
    }));

    expect(coordinates.x).toBeLessThan(100);
    expect(coordinates.y).toBeGreaterThan(100);
  });
});

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

  test("makes authored scenes the first authored entry", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const firstAction = page.locator(".thesis-actions a").first();
    await expect(firstAction).toHaveAttribute("href", "/examples/bridge");
    await expect(firstAction).toContainText("enter the scenes");
  });

  test("explains the library beside its authored scenes", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.getByText(/svelte 5 component library/i)).toBeVisible();
    await expect(page.getByText(/96 components/i)).toBeVisible();

    const proof = page.locator("[data-library-proof]");
    await expect(proof).toHaveCount(1);
    await expect(proof.locator(".hyvui-surface")).toHaveCount(1);
    await expect(proof.locator(".hyvui-status-dot")).toHaveCount(1);
    await expect(proof.locator('a[href="/docs"]')).toHaveCount(1);
  });

  test("gives the shared kit specimen deliberate space and action weight", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const geometry = await page
      .locator("[data-library-proof] .library-proof-card")
      .evaluate((card) => {
        const cardBox = card.getBoundingClientRect();
        const status = card.querySelector<HTMLElement>(".library-proof-status");
        const parts = card.querySelector<HTMLElement>(".library-proof-parts");
        const action = card.querySelector<HTMLElement>('a[href="/docs"]');
        const badges = Array.from(
          card.querySelectorAll<HTMLElement>(".library-proof-parts > *"),
        );
        if (!status || !parts || !action || badges.length !== 3) {
          throw new Error("shared kit specimen structure missing");
        }

        return {
          leftInset: status.getBoundingClientRect().left - cardBox.left,
          topInset: status.getBoundingClientRect().top - cardBox.top,
          statusPartsGap:
            parts.getBoundingClientRect().top -
            status.getBoundingClientRect().bottom,
          partsActionGap:
            action.getBoundingClientRect().top -
            parts.getBoundingClientRect().bottom,
          bottomInset: cardBox.bottom - action.getBoundingClientRect().bottom,
          badgeCenters: badges.map((badge) => {
            const box = badge.getBoundingClientRect();
            return box.left + box.width / 2;
          }),
          cardWidth: cardBox.width,
          actionHeight: action.getBoundingClientRect().height,
          actionBorder: getComputedStyle(action).borderStyle,
        };
      });

    expect(geometry.leftInset).toBeGreaterThanOrEqual(12);
    expect(geometry.topInset).toBeGreaterThanOrEqual(12);
    expect(geometry.statusPartsGap).toBeGreaterThanOrEqual(8);
    expect(geometry.partsActionGap).toBeGreaterThanOrEqual(8);
    expect(geometry.bottomInset).toBeGreaterThanOrEqual(12);
    expect(geometry.badgeCenters[1] - geometry.badgeCenters[0]).toBeGreaterThan(
      geometry.cardWidth * 0.2,
    );
    expect(geometry.badgeCenters[2] - geometry.badgeCenters[1]).toBeGreaterThan(
      geometry.cardWidth * 0.2,
    );
    expect(geometry.actionHeight).toBeGreaterThanOrEqual(32);
    expect(geometry.actionBorder).not.toBe("none");
  });

  test("gives each scene one readable relation cue", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.locator(".scene-entry-relation")).toHaveText([
      "persistent contact",
      "index and detail",
      "margin and reveal",
      "log and recurrence",
    ]);
  });

  test("does not append a duplicate route note to the homepage", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(page.locator(".showcase-context")).toHaveCount(0);
    await expect(page.locator("[data-scene-procession]")).toBeVisible();
  });

  test("keeps the public threshold inside the narrow content box", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });

    const geometry = await page.locator(".threshold").evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        right: box.right,
        contentWidth: document.documentElement.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        bodyClientWidth: document.body.clientWidth,
      };
    });

    expect(geometry.right).toBeLessThanOrEqual(geometry.contentWidth + 1);
    expect(geometry.bodyScrollWidth).toBeLessThanOrEqual(
      geometry.bodyClientWidth + 1,
    );
  });

  test("places the visual charter at the frontispiece threshold", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const charterLink = page.locator("[data-threshold-charter]");
    await expect(charterLink).toHaveCount(1);
    await expect(charterLink).toHaveAttribute("href", "/next-lab/biomes");
    await expect(charterLink).toContainText("research / visual charter");
    await expect(
      page.locator('[data-frontispiece] a[href="/next-lab/biomes"]'),
    ).toHaveCount(3);
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

  test("keeps scene titles complete and word-safe on narrow screens", async ({
    page,
  }) => {
    for (const scene of scenes.filter(({ slug }) =>
      ["bridge", "watchhouse"].includes(slug),
    )) {
      await page.setViewportSize({ width: 375, height: 900 });
      await page.goto(`/examples/${scene.slug}`, { waitUntil: "networkidle" });

      const heading = page.getByRole("heading", { name: scene.heading });
      await expect(heading).toBeVisible();
      const metrics = await heading.evaluate((element, expectedText) => {
        const characters = Array.from(
          element.querySelectorAll<HTMLElement>(".hyvui-kt-unit"),
        );
        let offset = 0;
        const words = expectedText.split(/\s+/).map((word) => {
          const wordCharacters = characters.slice(offset, offset + word.length);
          offset += word.length;
          return {
            word,
            tops: wordCharacters.map(
              (character) => character.getBoundingClientRect().top,
            ),
          };
        });

        return {
          text: element.textContent?.trim(),
          words,
        };
      }, scene.heading);

      expect(metrics.text).toBe(scene.heading);
      expect(
        metrics.words.every(
          ({ tops }) => Math.max(...tops) - Math.min(...tops) <= 1,
        ),
        JSON.stringify(metrics.words),
      ).toBe(true);
    }
  });

  test("preserves telegraph text when motion is reduced", async ({ page }) => {
    await page.goto("/system/cinematic", { waitUntil: "networkidle" });

    const telegraph = page.locator(".kt-mono");
    expect((await telegraph.textContent())?.trim()).toBe("ACK ACK NAK ACK");
    await expect(telegraph).toBeVisible();
  });

  test("keeps documented overhanging marks visible on surfaces", async ({
    page,
  }) => {
    await page.goto("/examples/keeper", { waitUntil: "networkidle" });

    const surface = page.locator(".detail-card").first();
    const tape = surface.locator(".hyvui-tape-mark");
    await expect(tape).toBeAttached();
    await expect(surface).toHaveCSS("overflow", "visible");

    const bounds = await surface.evaluate((element) => {
      const host = element.getBoundingClientRect();
      const mark = element
        .querySelector(".hyvui-tape-mark")
        ?.getBoundingClientRect();
      return { hostTop: host.top, markTop: mark?.top ?? host.top };
    });
    expect(bounds.markTop).toBeLessThan(bounds.hostTop);
  });
});

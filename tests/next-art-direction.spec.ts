import { expect, test } from "@playwright/test";

test.describe("strong art direction", () => {
  test("reliquary exposes a thesis, visual authority, and atmospheric layer", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });

    const composition = page.locator("[data-next-composition]");
    await expect(composition).toHaveAttribute("data-art-authority", "strong");
    await expect(composition).toHaveAttribute("data-art-gesture", "reliquary");
    await expect(composition).toHaveAttribute(
      "data-art-thesis",
      "the signal is being swallowed by weather",
    );
    await expect(composition).toHaveAttribute(
      "data-art-palette",
      "cold-to-warm-rupture",
    );
    await expect(
      composition.locator('[data-art-layer="atmosphere"]'),
    ).toHaveCount(1);
    await expect(
      composition.locator("[data-art-director-inspector]"),
    ).toContainText('"gesture": "reliquary"');

    const semanticOrder = await composition.evaluate((root) =>
      [...root.querySelectorAll<HTMLElement>("[data-composition-node]")].map(
        (node) => node.dataset.compositionNode,
      ),
    );
    expect(semanticOrder.slice(0, 3)).toEqual(["weather", "beacon", "trace"]);
  });

  test("strong art direction can move visual planes without changing DOM semantics", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });

    const planes = await page
      .locator("[data-composition-node]")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          id: node.getAttribute("data-composition-node"),
          plane: node.getAttribute("data-art-plane"),
          z: getComputedStyle(node).zIndex,
        })),
      );

    expect(planes.find((node) => node.id === "beacon")?.plane).toBe("focal");
    expect(planes.find((node) => node.id === "weather")?.plane).toBe(
      "atmosphere",
    );
    expect(planes.find((node) => node.id === "beacon")?.z).not.toBe(
      planes.find((node) => node.id === "weather")?.z,
    );

    await expect(
      page.locator('[data-composition-node="beacon"]'),
    ).toHaveAttribute("style", /--hyv-art-x: 41%/);
  });

  test("reliquary gives typography, palette, and foreground a visual role", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });

    const composition = page.locator("[data-next-composition]");
    await expect(composition).toHaveAttribute(
      "data-art-typography",
      "monumental-whisper",
    );
    await expect(
      composition.locator('[data-art-actor="foreground-veil"]'),
    ).toHaveCount(1);

    const visualState = await composition.evaluate((root) => {
      const heading = root.querySelector("[data-composition-node=beacon] h3");
      const veil = root.querySelector('[data-art-actor="foreground-veil"]');
      return {
        headingSize: heading
          ? Number.parseFloat(getComputedStyle(heading).fontSize)
          : 0,
        headingTransform: heading
          ? getComputedStyle(heading).transform
          : "none",
        veilOpacity: veil
          ? Number.parseFloat(getComputedStyle(veil).opacity)
          : 0,
        palette: getComputedStyle(root)
          .getPropertyValue("--hyv-art-glow")
          .trim(),
      };
    });

    expect(visualState.headingSize).toBeGreaterThan(48);
    expect(visualState.headingTransform).not.toBe("none");
    expect(visualState.veilOpacity).toBeGreaterThan(0);
    expect(visualState.palette).not.toBe("");
  });

  test("mobile reliquary keeps required focal text inside the field", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });

    const result = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>(
        "[data-next-composition]",
      );
      const heading = root?.querySelector<HTMLElement>(
        '[data-composition-node="beacon"] h3',
      );
      if (!root || !heading) throw new Error("mobile focal text missing");

      const rootRect = root.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const textRange = document.createRange();
      textRange.selectNodeContents(heading);
      const textRight = Math.max(
        ...[...textRange.getClientRects()].map((rect) => rect.right),
      );
      return {
        left: headingRect.left,
        right: headingRect.right,
        textRight,
        rootLeft: rootRect.left,
        rootRight: rootRect.right,
      };
    });

    expect(result.left).toBeGreaterThanOrEqual(result.rootLeft - 2);
    expect(result.right).toBeLessThanOrEqual(result.rootRight + 2);
    expect(result.textRight).toBeLessThanOrEqual(result.rootRight + 2);
  });

  test("suggest mode exposes the art plan without applying visual authority", async ({
    page,
  }) => {
    await page.goto(
      "/next-lab/experiment?case=atmospheric-motion&mode=suggest",
      { waitUntil: "networkidle" },
    );

    const composition = page.locator("[data-next-composition]");
    await expect(composition).toHaveAttribute("data-art-authority", "strong");
    await expect(composition).toHaveAttribute("data-art-gesture", "reliquary");
    await expect(
      composition.locator('[data-art-layer="atmosphere"]'),
    ).toHaveCount(0);
    await expect(composition.locator('[data-art-pose="resolved"]')).toHaveCount(
      0,
    );
    await expect(
      composition.locator('[data-composition-node="beacon"]'),
    ).toHaveCSS("z-index", "2");
  });
});

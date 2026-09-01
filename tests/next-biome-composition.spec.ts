import { expect, test } from "@playwright/test";

test.describe("biome composition integration", () => {
  test("projects the resolved biome plan without changing semantic node order", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/biome-plan", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    const composition = page.locator("[data-next-composition]");
    await expect(composition).toHaveAttribute(
      "data-biome-host",
      "machine-ecology",
    );
    await expect(composition).toHaveAttribute(
      "data-biome-grafts",
      "operational-apparatus:information",
    );
    await expect(composition).toHaveAttribute(
      "data-biome-time",
      "continuous flow, vibration, leakage, repair, decay, and accumulation",
    );
    await expect(composition).toHaveAttribute(
      "data-biome-focal-policy",
      "polycentric",
    );
    await expect(composition).toHaveAttribute("data-biome-material", "pipe");
    await expect(composition).toHaveAttribute(
      "data-biome-typography",
      "equipment code",
    );
    await expect(composition).toHaveAttribute("data-biome-atmosphere", "flow");
    await expect(composition).toHaveAttribute(
      "data-biome-atmosphere-mode",
      "motion",
    );
    await expect(
      composition.locator("[data-biome-composition-inspector]"),
    ).toContainText('"hostBiome": "machine-ecology"');
    await expect(
      composition.locator("[data-biome-composition-inspector]"),
    ).toContainText(
      '"visualOrder": [\n    "route",\n    "signal",\n    "habitat"',
    );

    const semanticOrder = await composition
      .locator("[data-composition-node]")
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute("data-composition-node")),
      );
    expect(semanticOrder).toEqual(["signal", "route", "habitat"]);

    await expect(
      page.locator('[data-composition-node="signal"]'),
    ).toHaveAttribute("data-biome-host", "machine-ecology");
    await expect(
      page.locator('[data-composition-node="signal"]'),
    ).toHaveAttribute("data-biome-focal", "true");
  });
});

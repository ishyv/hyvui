import { expect, test } from "@playwright/test";

test.describe("visual composition postprocessing", () => {
  test("keeps a partial overlap inside an intentional edge budget", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=sparse&mode=apply", {
      waitUntil: "networkidle",
    });

    const result = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>(
        "[data-next-composition]",
      );
      const source = document.querySelector('[data-composition-node="signal"]');
      const target = document.querySelector('[data-composition-node="note"]');
      if (!root || !source || !target)
        throw new Error("sparse composition nodes missing");

      const rootRect = root.getBoundingClientRect();
      const sourceRect = source.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const intersection = {
        width: Math.max(
          0,
          Math.min(sourceRect.right, targetRect.right) -
            Math.max(sourceRect.left, targetRect.left),
        ),
        height: Math.max(
          0,
          Math.min(sourceRect.bottom, targetRect.bottom) -
            Math.max(sourceRect.top, targetRect.top),
        ),
      };
      const overlapArea = intersection.width * intersection.height;
      const smallerArea = Math.min(
        sourceRect.width * sourceRect.height,
        targetRect.width * targetRect.height,
      );

      return {
        overlapRatio: smallerArea ? overlapArea / smallerArea : 0,
        hasOverlap: overlapArea > 0,
        sourceInsideRoot: sourceRect.bottom <= rootRect.bottom + 2,
        targetInsideRoot: targetRect.bottom <= rootRect.bottom + 2,
        adaptation: root.dataset.autoAdaptation ?? null,
      };
    });

    expect(result.hasOverlap).toBe(true);
    expect(result.overlapRatio).toBeLessThanOrEqual(0.26);
    expect(result.sourceInsideRoot).toBe(true);
    expect(result.targetInsideRoot).toBe(true);
    expect(result.adaptation).toBe("applied");
  });

  test("applies overflow scale to non-manual nodes", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/next-lab/experiment?case=dense&mode=apply", {
      waitUntil: "networkidle",
    });

    const result = await page
      .locator("[data-composition-node]")
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          id: node.getAttribute("data-composition-node"),
          scale: Number(
            (node as HTMLElement).style.getPropertyValue("--hyv-auto-scale"),
          ),
          transformScale: (() => {
            const transform = new DOMMatrix(getComputedStyle(node).transform);
            return Math.hypot(transform.a, transform.b);
          })(),
        })),
      );

    const scaled = result.find((node) => node.scale < 1);
    expect(scaled).toBeDefined();
    expect(scaled?.transformScale).toBeLessThan(0.99);
    expect(scaled?.transformScale).toBeCloseTo(scaled?.scale ?? 0, 1);
  });

  test("keeps type-led composition inside its field", async ({ page }) => {
    await page.goto("/next-lab/experiment?case=type-dominant&mode=apply", {
      waitUntil: "networkidle",
    });

    const result = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>(
        "[data-next-composition]",
      );
      const statement = document.querySelector(
        '[data-composition-node="statement"]',
      );
      if (!root || !statement)
        throw new Error("type composition nodes missing");
      const rootRect = root.getBoundingClientRect();
      const statementRect = statement.getBoundingClientRect();
      return {
        rootBottom: rootRect.bottom,
        statementBottom: statementRect.bottom,
        overflowState: statement.getAttribute("data-composition-overflow"),
      };
    });

    expect(result.statementBottom).toBeLessThanOrEqual(result.rootBottom + 2);
    expect(result.overflowState).not.toBe("collision");
  });

  test("hover adds a position-aware material response", async ({ page }) => {
    await page.goto("/next-lab/experiment?case=sparse&mode=suggest", {
      waitUntil: "networkidle",
    });

    const signal = page.locator('[data-composition-node="signal"]');
    await expect(signal).toHaveAttribute("data-composition-region", /.+/);
    const before = await signal.evaluate((node) => {
      const style = getComputedStyle(node);
      return { filter: style.filter, transform: style.transform };
    });

    await signal.hover();
    await page.waitForTimeout(40);
    const after = await signal.evaluate((node) => {
      const style = getComputedStyle(node);
      return { filter: style.filter, transform: style.transform };
    });

    expect(after.filter).not.toBe(before.filter);
    expect(after.transform).not.toBe(before.transform);
  });

  test("active art direction responds to pointer movement", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });

    const composition = page.locator("[data-next-composition]");
    await expect(page.locator("body")).toHaveAttribute("data-theme", "arcane");
    const backgroundAnimation = await composition.evaluate(
      (node) => getComputedStyle(node, "::before").animationName,
    );
    expect(backgroundAnimation).not.toBe("none");
    await expect
      .poll(() =>
        composition.evaluate((node) =>
          getComputedStyle(node).getPropertyValue("--hyv-context-light"),
        ),
      )
      .toContain("b845c9");
    const box = await composition.boundingBox();
    if (!box) throw new Error("composition field missing");
    await page.mouse.move(box.x + box.width * 0.82, box.y + box.height * 0.22);

    await expect
      .poll(() =>
        composition.evaluate((node) =>
          getComputedStyle(node).getPropertyValue("--hyv-pointer-x"),
        ),
      )
      .not.toBe("0px");
    await expect(composition).toHaveAttribute("data-pointer-motion", "active");
  });

  test("same-route case navigation refreshes material theme", async ({
    page,
  }) => {
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });
    await expect(page.locator("body")).toHaveAttribute("data-theme", "arcane");

    await page
      .locator('a[href="/next-lab/experiment?case=sparse&mode=apply"]')
      .click();
    await expect(page).toHaveURL(/case=sparse&mode=apply/);
    await expect
      .poll(() => page.locator("body").getAttribute("data-theme"))
      .not.toBe("arcane");
  });

  test("reduced motion disables pointer adaptation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/next-lab/experiment?case=atmospheric-motion&mode=apply", {
      waitUntil: "networkidle",
    });

    const composition = page.locator("[data-next-composition]");
    const box = await composition.boundingBox();
    if (!box) throw new Error("composition field missing");
    await page.mouse.move(box.x + box.width * 0.82, box.y + box.height * 0.22);

    await expect(composition).toHaveAttribute(
      "data-pointer-motion",
      "disabled",
    );
    await expect
      .poll(() =>
        composition.evaluate((node) =>
          getComputedStyle(node).getPropertyValue("--hyv-pointer-x"),
        ),
      )
      .toBe("0px");
  });

  test("mobile layout keeps participants inside the field", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/experiment?case=sparse&mode=apply", {
      waitUntil: "networkidle",
    });

    const result = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>(
        "[data-next-composition]",
      );
      if (!root) throw new Error("composition field missing");
      const rootRect = root.getBoundingClientRect();
      return [
        ...root.querySelectorAll<HTMLElement>("[data-composition-node]"),
      ].map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          id: node.dataset.compositionNode,
          inside:
            rect.left >= rootRect.left - 2 &&
            rect.right <= rootRect.right + 2 &&
            rect.top >= rootRect.top - 2 &&
            rect.bottom <= rootRect.bottom + 2,
        };
      });
    });

    expect(result).toHaveLength(2);
    expect(result.every((node) => node.inside)).toBe(true);
  });
});

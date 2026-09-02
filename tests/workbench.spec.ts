import { expect, test } from "@playwright/test";

test.describe("relation workbench", () => {
  test("each volume exposes one keyboard-selectable relation", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/workbench", { waitUntil: "networkidle" });

    const cases = [
      {
        id: "bridge",
        sourceValue: "KIRA-3",
        target: "bridge-radar",
        expected: "KIRA-3",
      },
      {
        id: "keeper",
        sourceValue: "mbr-i-05",
        target: "keeper-detail",
        expected: "letter book v",
      },
      {
        id: "correspondence",
        sourceValue: "second",
        target: "correspondence-letter",
        expected: "12 march",
      },
      {
        id: "watchhouse",
        sourceValue: "sighting-2",
        target: "watchhouse-entry",
        expected: "roof of the dry stair, lowmarsh",
      },
    ];

    for (const item of cases) {
      const root = page.locator(`[data-workbench-case="${item.id}"]`);
      await expect(root).toBeVisible();
      const source = root.locator(
        `[data-workbench-source="${item.sourceValue}"]`,
      );
      const target = root.locator(`[data-workbench-target="${item.target}"]`);
      const before = await target.textContent();

      await source.focus();
      await page.keyboard.press("Enter");

      await expect(source).toBeFocused();
      await expect(target).not.toHaveText(before ?? "");
      await expect(target).toContainText(item.expected);
    }
  });

  test("collapses source and target in readable order at 320px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/workbench", { waitUntil: "networkidle" });

    const result = await page.evaluate(() => {
      const workbench = document.querySelector(".workbench");
      const roots = [...document.querySelectorAll("[data-workbench-case]")];
      return {
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        cases: roots.map((root) => {
          const source = root.querySelector("[data-workbench-source]");
          const target = root.querySelector("[data-workbench-target]");
          return Boolean(
            source &&
            target &&
            (source.compareDocumentPosition(target) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0,
          );
        }),
        visibleText: workbench?.textContent?.includes("same parts") ?? false,
      };
    });

    expect(result.pageWidth).toBeLessThanOrEqual(result.viewportWidth);
    expect(result.cases).toEqual([true, true, true, true]);
    expect(result.visibleText).toBe(true);
  });
});

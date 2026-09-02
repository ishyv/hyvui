import { expect, test } from "@playwright/test";

const widths = [320, 375, 768, 1024, 1440, 1600];

test.describe("v1 browser foundation", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }) => {
    await page.goto("/foundation");
    await expect(page.locator("[data-foundation-fixture]")).toBeVisible();
    await expect(
      page.locator("[data-foundation-context-probe]"),
    ).toHaveAttribute("data-context-notifications", "1");
  });

  test("keeps appearance channels nearest-scoped and grades out of body filters", async ({
    page,
  }) => {
    await expect(page.locator("body")).toHaveAttribute(
      "data-weight",
      "field-notebook",
    );
    await expect(page.locator("body")).toHaveAttribute("data-theme", "hextech");
    await expect(page.locator("body")).toHaveAttribute("data-grade", "dailies");

    const scoped = page.locator(".foundation-scoped");
    await expect(scoped).toHaveAttribute("data-weight", "archive");
    await expect(scoped).toHaveAttribute("data-theme", "arcane");
    await expect(scoped).toHaveAttribute("data-grade", "twilight");

    expect(
      await page
        .locator("body")
        .evaluate((node) => getComputedStyle(node).filter),
    ).toBe("none");
  });

  test("restores document appearance ownership when a nested shell unmounts", async ({
    page,
  }) => {
    await page.goto("/foundation/ownership");
    await expect(page.locator("[data-foundation-ownership]")).toBeVisible();
    await expect(page.locator("body")).toHaveAttribute(
      "data-weight",
      "field-notebook",
    );
    await expect(page.locator("body")).toHaveAttribute("data-theme", "arcane");
    await expect(page.locator("body")).toHaveAttribute("data-grade", "dailies");

    await page.locator("#foundation-toggle-owner").click();
    await expect(page.locator("body")).toHaveAttribute(
      "data-weight",
      "field-notebook",
    );
    await expect(page.locator("body")).toHaveAttribute("data-theme", "hextech");
    await expect(page.locator("body")).toHaveAttribute("data-grade", "dailies");
  });

  test("notifies only the affected nearest context and preserves independent channels", async ({
    page,
  }) => {
    const scoped = page.locator(".foundation-scoped");
    const probe = page.locator("[data-foundation-context-probe]");
    await expect(probe).toHaveAttribute("data-context-weight", "archive");
    await expect(probe).toHaveAttribute("data-context-theme", "arcane");
    await expect(probe).toHaveAttribute("data-context-grade", "twilight");

    const initialNotifications = Number(
      await probe.getAttribute("data-context-notifications"),
    );
    await page
      .locator(".foundation-reading")
      .evaluate((node) => node.setAttribute("data-theme", "arcane"));
    await expect(probe).toHaveAttribute(
      "data-context-notifications",
      String(initialNotifications),
    );

    await scoped.evaluate((node) => node.removeAttribute("data-weight"));
    await expect(probe).toHaveAttribute(
      "data-context-weight",
      "field-notebook",
    );
    await expect(probe).toHaveAttribute("data-context-theme", "arcane");
    await expect(probe).toHaveAttribute("data-context-grade", "twilight");

    await scoped.evaluate((node) => node.setAttribute("data-grade", "dailies"));
    await expect(probe).toHaveAttribute("data-context-grade", "dailies");
  });

  test("propagates the anchor context into a portalled popover", async ({
    page,
  }) => {
    await page.locator("#foundation-open-popover").click();
    const popover = page.locator(".hyvui-popover");
    await expect(popover).toBeVisible();
    await expect(popover).toHaveAttribute("data-weight", "archive");
    await expect(popover).toHaveAttribute("data-theme", "arcane");
    await expect(popover).toHaveAttribute("data-grade", "twilight");
    await expect(popover).toHaveAttribute("role", "note");

    await page.keyboard.press("Escape");
    await expect(popover).toBeHidden();
  });

  test("snapshots scoped appearance for root-hosted toasts", async ({
    page,
  }) => {
    await page.locator("#foundation-show-toast").click();
    const toast = page.locator(".hyvui-toast").last();
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute("role", "status");
    await expect(toast).toHaveAttribute("data-weight", "archive");
    await expect(toast).toHaveAttribute("data-theme", "arcane");
    await expect(toast).toHaveAttribute("data-grade", "twilight");
  });

  test("forwards native field attributes and keeps source order semantic", async ({
    page,
  }) => {
    const name = page.locator("#foundation-name");
    await expect(name).toHaveAttribute("name", "operator");
    await expect(name).toHaveAttribute("autocomplete", "name");
    await expect(name).toHaveAttribute(
      "aria-describedby",
      "foundation-name-desc",
    );
    await expect(page.locator("label[for='foundation-name']")).toContainText(
      "operator name",
    );

    const nested = page.locator("label.hyvui-textarea-label-nested");
    await expect(nested).toContainText("field note");
    await expect(nested.locator("textarea")).toHaveAttribute("name", "note");

    const headings = await page
      .locator("[data-foundation-fixture] h1, [data-foundation-fixture] h2")
      .allTextContents();
    expect(headings.map((heading) => heading.trim())).toEqual([
      "art needs a floor",
      "the page stays a page",
      "four small instruments",
      "a room can change its weather",
      "stable when the font is late",
    ]);
  });

  test("keeps the intrinsic grid and focal composition inside every target width", async ({
    page,
  }) => {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(40);
      const measurements = await page
        .locator("[data-foundation-grid], [data-foundation-card]")
        .evaluateAll((nodes) =>
          nodes.map((node) => {
            const rect = node.getBoundingClientRect();
            return { left: rect.left, right: rect.right, width: rect.width };
          }),
        );
      expect(measurements[0].left).toBeGreaterThanOrEqual(0);
      expect(
        measurements.every((measurement) => measurement.right <= width + 1),
        JSON.stringify({ width, measurements }),
      ).toBe(true);
      expect(measurements.every((measurement) => measurement.width > 0)).toBe(
        true,
      );
    }
  });

  test("sizes canvas backing stores from CSS pixels with a capped device scale", async ({
    page,
  }) => {
    const result = await page
      .locator(".hyvui-horizon-grid canvas")
      .evaluate((element) => {
        const canvas = element as HTMLCanvasElement;
        return {
          cssWidth: canvas.clientWidth,
          cssHeight: canvas.clientHeight,
          backingWidth: canvas.width,
          backingHeight: canvas.height,
          dpr: window.devicePixelRatio,
        };
      });

    expect(result.cssWidth).toBeGreaterThan(0);
    expect(result.cssHeight).toBeGreaterThan(0);
    expect(result.backingWidth).toBeLessThanOrEqual(
      result.cssWidth * Math.min(result.dpr, 2) + 1,
    );
    expect(result.backingHeight).toBeLessThanOrEqual(
      result.cssHeight * Math.min(result.dpr, 2) + 1,
    );
  });

  test("returns focus from native modal and drawer dialogs", async ({
    page,
  }) => {
    const modalOpener = page.locator("#foundation-open-modal");
    await modalOpener.focus();
    await modalOpener.press("Enter");
    const modal = page.locator("#foundation-modal");
    await expect(modal).toHaveJSProperty("open", true);
    await page.keyboard.press("Escape");
    await expect(modal).toHaveJSProperty("open", false);
    await expect(modalOpener).toBeFocused();

    const drawerOpener = page.locator("#foundation-open-drawer");
    await drawerOpener.focus();
    await drawerOpener.press("Enter");
    const drawer = page.locator("#foundation-drawer");
    await expect(drawer).toHaveJSProperty("open", true);
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveJSProperty("open", false);
    await expect(drawerOpener).toBeFocused();
  });

  test("renders without external font requests when the optional preset is omitted", async ({
    page,
  }) => {
    const externalFontRequests: string[] = [];
    page.on("request", (request) => {
      if (/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(request.url())) {
        externalFontRequests.push(request.url());
      }
    });

    await page.reload();
    expect(externalFontRequests).toEqual([]);
  });

  test("keeps decorative motion quiet under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.reload();
    await expect(page.locator(".hyvui-horizon-grid canvas")).toBeAttached();
    const animationState = await page
      .locator(".foundation-scoped")
      .evaluate((node) => ({
        horizon: getComputedStyle(node.querySelector("canvas") ?? node)
          .animationName,
        bodyOverflow: getComputedStyle(document.body).overflowX,
      }));
    expect(animationState.bodyOverflow).toBe("hidden");
  });

  test("degrades atmospheric materials to forced-color system semantics", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium-foundation-forced-colors",
      "computed forced-color assertions use Chromium emulation",
    );

    await page.emulateMedia({ forcedColors: "active" });
    const forcedColorsActive = await page.evaluate(
      () => matchMedia("(forced-colors: active)").matches,
    );
    test.skip(
      !forcedColorsActive,
      "forced-color assertions only apply to the forced-colors project",
    );

    const state = await page
      .locator("#foundation-open-modal")
      .evaluate((node) => {
        const button = node as HTMLElement;
        button.focus();
        const root = getComputedStyle(document.documentElement);
        const body = getComputedStyle(document.body);
        return {
          rootBackground: root.backgroundColor,
          bodyBackground: body.backgroundColor,
          bodyBackgroundToken: body.getPropertyValue("--bg").trim(),
          atmosphereDisplay: getComputedStyle(document.body, "::before")
            .display,
          outlineStyle: getComputedStyle(button).outlineStyle,
          outlineColor: getComputedStyle(button).outlineColor,
          boxShadow: getComputedStyle(button).boxShadow,
        };
      });

    expect(state.rootBackground).not.toBe("rgba(0, 0, 0, 0)");
    expect(state.bodyBackgroundToken).toBe("Canvas");
    expect(state.atmosphereDisplay).toBe("none");
    expect(state.outlineStyle).toBe("solid");
    expect(state.outlineColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(state.boxShadow).toBe("none");
  });

  test("emits toggle changes from the native switch element", async ({
    page,
  }) => {
    await page.goto("/docs", { waitUntil: "networkidle" });
    const toggle = page.getByRole("switch", { name: "orbit assists" });
    const targetTag = await toggle.evaluate(
      (element) =>
        new Promise<string>((resolve) => {
          const timer = window.setTimeout(() => resolve("timeout"), 500);
          element.addEventListener(
            "change",
            (event) => {
              window.clearTimeout(timer);
              resolve((event.target as HTMLElement | null)?.tagName ?? "null");
            },
            { once: true },
          );
          (element as HTMLButtonElement).click();
        }),
    );

    expect(targetTag).toBe("BUTTON");
  });

  test("keeps the base surface structural instead of decorative", async ({
    page,
  }) => {
    await page.goto("/docs", { waitUntil: "networkidle" });

    const overlay = await page
      .locator(".hyvui-surface-base")
      .first()
      .evaluate(
        (element) => getComputedStyle(element, "::before").backgroundImage,
      );

    expect(overlay).toBe("none");
  });
});

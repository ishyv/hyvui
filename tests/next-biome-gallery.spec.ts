import { expect, test } from "@playwright/test";

const proofs = [
  "ceremonial-reliquary",
  "ecological-elegy",
  "oneiric-object-poetry",
  "machine-ecology",
  "manifesto-print",
  "kinetic-rupture",
];

const sharedTitle = "one observation. six arrangements.";
const sharedBody = "the same words sit under six different spatial rules.";

test.describe("biome proof gallery", () => {
  test("keeps the charter title ahead of the route note plane", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const shell = page.locator("[data-showcase-shell]");
    await expect(shell).toHaveAttribute("data-showcase-layout", "flow");

    const geometry = await page.evaluate(() => {
      const context = document.querySelector<HTMLElement>(".showcase-context");
      const header = document.querySelector<HTMLElement>(
        "[data-biome-gallery] > .gallery-header",
      );
      if (!context || !header) throw new Error("charter geometry missing");
      return {
        contextTop: context.getBoundingClientRect().top,
        headerBottom: header.getBoundingClientRect().bottom,
      };
    });

    expect(geometry.contextTop).toBeGreaterThanOrEqual(geometry.headerBottom);
  });

  test("turns the host index into a horizontal drag rail", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const nav = page.locator("[data-biome-gallery-nav]");
    await expect(nav).toHaveAttribute(
      "aria-describedby",
      "biome-gallery-nav-help",
    );
    const firstHost = nav.locator("a").first();
    await firstHost.focus();
    await expect(firstHost).toBeFocused();
    await expect(nav).toHaveCSS("overflow-x", "auto");
    await expect(nav).toHaveCSS("flex-wrap", "nowrap");
    const edgeTreatment = await nav.evaluate((element) => {
      const styles = getComputedStyle(element);
      return styles.maskImage || styles.webkitMaskImage;
    });
    expect(edgeTreatment).not.toBe("none");

    const metrics = await nav.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
    }));
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);

    const box = await nav.boundingBox();
    if (!box) throw new Error("gallery rail bounds missing");
    await page.mouse.move(box.x + box.width - 12, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + 24, box.y + box.height / 2, { steps: 8 });
    await page.mouse.up();

    await expect
      .poll(() => nav.evaluate((element) => element.scrollLeft))
      .toBeGreaterThan(0);
  });

  test("keeps the route header to its essential title planes", async ({
    page,
  }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    await expect(
      page.locator(
        "[data-biome-gallery] > .gallery-header .witness-proof-link",
      ),
    ).toHaveCount(0);
    await expect(
      page.locator(
        "[data-biome-gallery] > .gallery-header .gallery-header-note",
      ),
    ).toHaveCount(1);
  });

  test("keeps the shared shell navigation compact on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const nav = page.locator("[data-showcase-nav]");
    await expect(nav).toHaveCSS("overflow-x", "auto");
    await expect(nav).toHaveCSS("flex-wrap", "nowrap");
    const edgeTreatment = await nav.evaluate((element) => {
      const styles = getComputedStyle(element);
      return styles.maskImage || styles.webkitMaskImage;
    });
    expect(edgeTreatment).not.toBe("none");

    const metrics = await nav.evaluate((element) => ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(metrics.scrollHeight).toBe(metrics.clientHeight);
  });

  test("places the host rail in the opening composition", async ({ page }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const geometry = await page.evaluate(() => {
      const rail = document.querySelector<HTMLElement>(".gallery-nav-frame");
      const charter = document.querySelector<HTMLElement>(
        "[data-biome-charter]",
      );
      if (!rail || !charter) throw new Error("opening composition missing");
      return {
        railTop: rail.getBoundingClientRect().top,
        charterTop: charter.getBoundingClientRect().top,
      };
    });

    expect(geometry.railTop).toBeLessThan(geometry.charterTop);
  });

  test("introduces the visual charter before the frame studies", async ({
    page,
  }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    await expect(page.locator("[data-biome-charter]")).toHaveCount(1);
    await expect(
      page.getByRole("heading", {
        name: "components are vocabulary. relations give them work.",
      }),
    ).toBeVisible();
    await expect(page.locator("[data-biome-charter-law]")).toHaveCount(4);
    await expect(
      page.locator("[data-biome-charter] .charter-copy > p").first(),
    ).toHaveText(
      "one content corpus passes through six host biomes. each host changes the spatial law, material, typography, attention, and time model. these are rendered studies, not page templates.",
    );
    await expect(
      page.locator("[data-biome-charter] .charter-limit"),
    ).toHaveText(
      "the stable library remains the ground. the next layer makes composition decisions explicit, bounded, and inspectable.",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "a hyvui visual charter. one content corpus passes through six authored host biomes.",
    );
    await expect(
      page.locator('[data-biome-charter] a[href="/next-lab/biome-plan"]'),
    ).toHaveCount(1);
    await expect(
      page.locator(
        '[data-biome-charter] a[href="/next-lab/experiment?case=atmospheric-motion&mode=apply"]',
      ),
    ).toHaveCount(1);
  });

  test("explains the constraint behind host-graft decisions", async ({
    page,
  }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const intro = page.locator("[data-biome-hybrid-intro]");
    await expect(intro).toHaveCount(1);
    await expect(intro).toContainText("named channel");
    await expect(intro).toContainText("fallback");
  });

  test("keeps the hybrid register heading clear of the sticky biome rail", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const register = page.locator("[data-biome-hybrid-register]");
    await register.scrollIntoViewIfNeeded();
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(
        "[data-biome-gallery-nav]",
      );
      const heading = document.querySelector<HTMLElement>(
        "[data-biome-hybrid-register] h2",
      );
      if (!nav || !heading) throw new Error("hybrid register geometry missing");
      return {
        navBottom: nav.getBoundingClientRect().bottom,
        headingTop: heading.getBoundingClientRect().top,
      };
    });

    expect(geometry.headingTop).toBeGreaterThanOrEqual(geometry.navBottom + 4);
  });

  test("keeps a frame title clear when entering a frame by scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    await page.locator("[data-biome-frame]").first().scrollIntoViewIfNeeded();
    const geometry = await page.evaluate(() => {
      const nav = document.querySelector<HTMLElement>(
        "[data-biome-gallery-nav]",
      );
      const title = document.querySelector<HTMLElement>(
        "[data-biome-frame] [data-content=title]",
      );
      if (!nav || !title) throw new Error("frame title geometry missing");
      return {
        navBottom: nav.getBoundingClientRect().bottom,
        titleTop: title.getBoundingClientRect().top,
      };
    });

    expect(geometry.titleTop).toBeGreaterThanOrEqual(geometry.navBottom + 4);
  });

  test("renders six full-viewport frames with native navigation", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/biomes", {
      waitUntil: "networkidle",
    });
    expect(response?.status()).toBe(200);

    const frames = page.locator("[data-biome-frame]");
    await expect(frames).toHaveCount(6);
    await expect(page.locator("[data-biome-gallery-nav]")).toHaveCount(1);
    await expect(
      page.locator('[data-biome-gallery] a[href="/next-lab/witness"]'),
    ).toHaveCount(1);
    await expect(
      page.locator(
        '[data-biome-gallery-nav] a[href="/next-lab/biomes?biome=machine-ecology#machine-ecology"]',
      ),
    ).toHaveCount(1);

    const geometry = await page.evaluate(() => ({
      viewportWidth: document.body.getBoundingClientRect().width,
      items: [
        ...document.querySelectorAll<HTMLElement>("[data-biome-frame]"),
      ].map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          height: rect.height,
          width: rect.width,
          top: rect.top,
          id: element.getAttribute("data-biome"),
        };
      }),
    }));
    const items = geometry.items;
    expect(items.map((item) => item.id)).toEqual(proofs);
    expect(items.every((item) => item.height >= 899)).toBe(true);
    expect(
      items.every((item) => item.width >= geometry.viewportWidth - 2),
    ).toBe(true);
    expect(items[5].top).toBeGreaterThanOrEqual(items[0].top + 5 * 899);
  });

  test("keeps the same content corpus while changing biome laws", async ({
    page,
  }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const corpus = await page
      .locator("[data-biome-frame]")
      .evaluateAll((frames) =>
        frames.map((frame) => ({
          title: frame
            .querySelector('[data-content="title"]')
            ?.textContent?.trim(),
          body: frame
            .querySelector('[data-content="body"]')
            ?.textContent?.trim(),
          host: frame.getAttribute("data-host"),
          law: frame.getAttribute("data-spatial-law"),
          time: frame.getAttribute("data-time-model"),
          viewer: frame.getAttribute("data-viewer-role"),
        })),
      );

    expect(corpus.every((item) => item.title === sharedTitle)).toBe(true);
    expect(corpus.every((item) => item.body === sharedBody)).toBe(true);
    expect(new Set(corpus.map((item) => item.host)).size).toBe(6);
    expect(new Set(corpus.map((item) => item.law)).size).toBe(6);
    expect(
      new Set(corpus.map((item) => item.time)).size,
    ).toBeGreaterThanOrEqual(4);
    expect(
      new Set(corpus.map((item) => item.viewer)).size,
    ).toBeGreaterThanOrEqual(4);
  });

  test("supports a focused frame without losing the gallery index", async ({
    page,
  }) => {
    await page.goto("/next-lab/biomes?biome=machine-ecology", {
      waitUntil: "networkidle",
    });

    await expect(page.locator("[data-biome-frame]")).toHaveCount(1);
    await expect(
      page.locator('[data-biome="machine-ecology"]'),
    ).toHaveAttribute("data-focused", "true");
    await expect(
      page.locator('[data-biome-gallery-nav] a[aria-current="page"]'),
    ).toHaveAttribute(
      "href",
      "/next-lab/biomes?biome=machine-ecology#machine-ecology",
    );
    await expect(page.locator('[data-content="title"]')).toContainText(
      sharedTitle,
    );
  });

  test("uses different composition signatures instead of one renamed template", async ({
    page,
  }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const signatures = await page
      .locator("[data-biome-frame]")
      .evaluateAll((frames) =>
        frames.map((frame) => ({
          id: frame.getAttribute("data-biome"),
          children: [...frame.children].map((child) =>
            child.getAttribute("data-role"),
          ),
          density: frame.getAttribute("data-density"),
          frameMode: frame.getAttribute("data-frame-mode"),
        })),
      );

    expect(
      new Set(signatures.map((item) => item.children.join("/"))).size,
    ).toBe(6);
    expect(
      new Set(signatures.map((item) => item.density)).size,
    ).toBeGreaterThanOrEqual(4);
    expect(
      new Set(signatures.map((item) => item.frameMode)).size,
    ).toBeGreaterThanOrEqual(4);
  });

  test("exposes accepted and rejected host-graft proofs", async ({ page }) => {
    await page.goto("/next-lab/biomes", { waitUntil: "networkidle" });

    const register = page.locator("[data-biome-hybrid-register]");
    await expect(register).toHaveCount(1);
    await expect(
      register.locator('[data-hybrid-status="accepted"]'),
    ).toHaveCount(3);
    await expect(
      register.locator('[data-hybrid-status="rejected"]'),
    ).toHaveCount(1);
    await expect(
      register.locator('[data-hybrid-id="object-poetry-diagnostic"]'),
    ).toContainText("destructive");
  });

  test("preserves mobile containment and semantic controls", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/biomes?biome=manifesto-print", {
      waitUntil: "networkidle",
    });

    const result = await page.evaluate(() => {
      const frame = document.querySelector<HTMLElement>("[data-biome-frame]");
      const title = document.querySelector<HTMLElement>(
        '[data-content="title"]',
      );
      if (!frame || !title) throw new Error("focused mobile frame missing");
      const frameRect = frame.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        frameWidth: frameRect.width,
        titleLeft: titleRect.left,
        titleRight: titleRect.right,
        frameLeft: frameRect.left,
        frameRight: frameRect.right,
        headingCount: frame.querySelectorAll("h1").length,
        navLinks: document.querySelectorAll("[data-biome-gallery-nav] a")
          .length,
      };
    });

    expect(result.overflow).toBeLessThanOrEqual(1);
    expect(result.frameWidth).toBeLessThanOrEqual(375);
    expect(result.titleLeft).toBeGreaterThanOrEqual(result.frameLeft - 1);
    expect(result.titleRight).toBeLessThanOrEqual(result.frameRight + 1);
    expect(result.headingCount).toBe(1);
    expect(result.navLinks).toBe(6);
  });

  test("removes nonessential motion when reduced motion is requested", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/next-lab/biomes?biome=kinetic-rupture", {
      waitUntil: "networkidle",
    });

    const motion = await page
      .locator("[data-biome-frame]")
      .evaluate((frame) => {
        const animated = frame.querySelector<HTMLElement>("[data-motion]");
        if (!animated) throw new Error("motion actor missing");
        const style = getComputedStyle(animated);
        return {
          animationName: style.animationName,
          animationDuration: style.animationDuration,
          transitionDuration: style.transitionDuration,
        };
      });

    expect(motion.animationName).toBe("none");
    expect(motion.animationDuration).toBe("0s");
    expect(motion.transitionDuration).toBe("0s");
  });
});

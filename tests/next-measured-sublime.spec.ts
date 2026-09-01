import { expect, test } from "@playwright/test";

test.describe("measured sublime prototype", () => {
  test("renders one data-derived phenomenon with truthful specimen identity", async ({
    page,
  }) => {
    const response = await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });

    expect(response?.status()).toBe(200);

    const field = page.locator("[data-measured-sublime]");
    const phenomenon = field.locator('[data-phenomenon="decision-specimen"]');
    await expect(field).toHaveAttribute("data-premise-first", "true");
    await expect(phenomenon).toHaveCount(1);
    await expect(field.locator('[data-art-layer="atmosphere"]')).toHaveCount(0);
    await expect(phenomenon.locator("[data-specimen-rupture]")).toHaveCount(1);

    const identity = await field.evaluate((root) => {
      const inspection = root.querySelector<HTMLElement>(
        "[data-measured-sublime-inspector]",
      );
      if (!inspection?.textContent)
        throw new Error("specimen inspector missing");
      const model = JSON.parse(inspection.textContent) as {
        facets: Array<{ nodeId: string }>;
        trace: Array<{ relationId: string }>;
      };
      return {
        modelFacetIds: model.facets.map((facet) => facet.nodeId),
        renderedFacetIds: [
          ...root.querySelectorAll<HTMLElement>("[data-specimen-facet]"),
        ].map((facet) => facet.dataset.specimenFacet),
        modelTraceIds: model.trace.map((segment) => segment.relationId),
        renderedTraceIds: [
          ...root.querySelectorAll<HTMLElement>("[data-specimen-trace]"),
        ].map((segment) => segment.dataset.specimenTrace),
      };
    });

    expect(identity.renderedFacetIds).toEqual(identity.modelFacetIds);
    expect(identity.renderedTraceIds).toEqual(identity.modelTraceIds);
    await expect(phenomenon.locator("title")).toContainText(
      "decision specimen",
    );
    await expect(phenomenon.locator("desc")).toContainText(
      "composition decisions",
    );
  });

  test("stages premise and real decision evidence in a deliberate reading order", async ({
    page,
  }) => {
    await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });

    const field = page.locator("[data-measured-sublime]");
    await expect(field).toContainText(
      "a system can measure every relation except the moment intention becomes form",
    );

    const structure = await field.evaluate((root) => {
      const inspection = root.querySelector<HTMLElement>(
        "[data-measured-sublime-inspector]",
      );
      if (!inspection?.textContent)
        throw new Error("specimen inspector missing");
      const model = JSON.parse(inspection.textContent) as {
        trace: Array<{ relationId: string; reason: string }>;
      };
      return {
        roles: [...root.querySelectorAll<HTMLElement>("[data-role]")].map(
          (node) => node.dataset.role,
        ),
        modelDecisions: model.trace.map((segment) => ({
          id: segment.relationId,
          reason: segment.reason,
        })),
        renderedDecisions: [
          ...root.querySelectorAll<HTMLElement>("[data-decision-id]"),
        ].map((node) => ({
          id: node.dataset.decisionId,
          text: node.textContent?.replace(/\s+/g, " ").trim(),
        })),
      };
    });

    expect(structure.roles).toEqual([
      "field",
      "instrument",
      "phenomenon",
      "trace",
    ]);
    expect(structure.renderedDecisions.map((item) => item.id)).toEqual(
      structure.modelDecisions.map((item) => item.id),
    );
    for (const decision of structure.modelDecisions) {
      expect(
        structure.renderedDecisions.find((item) => item.id === decision.id)
          ?.text,
      ).toContain(decision.reason);
    }
    await expect(page.locator("body")).not.toHaveAttribute("data-theme");
  });

  test("keeps one spectacle and limits notation to real specimen evidence", async ({
    page,
  }) => {
    await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });

    const field = page.locator("[data-measured-sublime]");
    await expect(field.locator(".monument")).toHaveCount(0);
    await expect(field).not.toContainText(/\d+% quiet/i);
    await expect(field).not.toContainText(/relations made visible/i);

    const labels = await field.evaluate((root) => {
      const inspection = root.querySelector<HTMLElement>(
        "[data-measured-sublime-inspector]",
      );
      if (!inspection?.textContent)
        throw new Error("specimen inspector missing");
      const model = JSON.parse(inspection.textContent) as {
        facets: Array<{ nodeId: string }>;
      };
      return {
        model: model.facets.map((facet) => facet.nodeId).sort(),
        rendered: [
          ...root.querySelectorAll<SVGTextElement>(
            "[data-specimen-node-label]",
          ),
        ]
          .map((label) => label.dataset.specimenNodeLabel)
          .sort(),
      };
    });

    expect(labels.rendered).toEqual(labels.model);
  });

  test("decision controls reveal only their matching specimen evidence", async ({
    page,
  }) => {
    await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });

    const field = page.locator("[data-measured-sublime]");
    const control = field.locator(
      '[data-decision-id="decision-reveals-intention"]',
    );
    const fieldTransformBefore = await field.evaluate(
      (node) => getComputedStyle(node).transform,
    );

    await control.focus();
    await control.press("Enter");

    await expect(control).toHaveAttribute("aria-pressed", "true");
    await expect(
      field.locator('[data-phenomenon="decision-specimen"]'),
    ).toHaveAttribute("data-active-evidence", "decision-reveals-intention");
    await expect(
      field.locator('[data-specimen-trace][data-active="true"]'),
    ).toHaveCount(1);
    await expect(
      field.locator(
        '[data-specimen-trace="decision-reveals-intention"][data-active="true"]',
      ),
    ).toHaveCount(1);
    await expect(field.locator("[data-active-annotation]")).toContainText(
      "decision-reveals-intention",
    );
    await expect(field.locator("[data-active-annotation]")).toContainText(
      "expose the moment intention becomes visible form",
    );
    expect(
      await field.evaluate((node) => getComputedStyle(node).transform),
    ).toBe(fieldTransformBefore);

    const materialBounds = await field.evaluate((root) => {
      const body = root.querySelector<SVGGraphicsElement>(".specimen-body");
      const annotation = root.querySelector<HTMLElement>(
        "[data-active-annotation]",
      );
      const constraint = root.querySelector<SVGTextElement>(
        '[data-specimen-node-label="constraint"]',
      );
      const constraintPoint = root.querySelector<SVGCircleElement>(
        '[data-specimen-facet="constraint"] + circle',
      );
      if (!body || !annotation || !constraint || !constraintPoint) {
        throw new Error("specimen material evidence missing");
      }
      const bodyRect = body.getBoundingClientRect();
      const annotationRect = annotation.getBoundingClientRect();
      return {
        annotationLeft: annotationRect.left,
        annotationRight: annotationRect.right,
        bodyLeft: bodyRect.left,
        bodyRight: bodyRect.right,
        constraintX: Number(constraint.getAttribute("x")),
        constraintPointX: Number(constraintPoint.getAttribute("cx")),
      };
    });

    expect(materialBounds.annotationLeft).toBeGreaterThan(
      materialBounds.bodyLeft + 4,
    );
    expect(materialBounds.annotationRight).toBeLessThan(
      materialBounds.bodyRight - 4,
    );
    expect(materialBounds.constraintX).toBeGreaterThan(
      materialBounds.constraintPointX,
    );
  });

  test("only exposed evidence receives a finite state transition", async ({
    page,
  }) => {
    await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });
    await page
      .locator('[data-decision-id="decision-reveals-intention"]')
      .click();

    const transitionState = await page
      .locator('[data-phenomenon="decision-specimen"]')
      .evaluate((root) => {
        const active = root.querySelector<SVGElement>(
          '[data-specimen-trace][data-active="true"]',
        );
        const inactive = root.querySelector<SVGElement>(
          '[data-specimen-trace][data-active="false"]',
        );
        if (!active || !inactive) throw new Error("trace evidence missing");
        return {
          activeDuration: getComputedStyle(active).transitionDuration,
          inactiveDuration: getComputedStyle(inactive).transitionDuration,
          animationName: getComputedStyle(active).animationName,
        };
      });

    expect(Number.parseFloat(transitionState.activeDuration)).toBeGreaterThan(
      0,
    );
    expect(transitionState.inactiveDuration).toBe("0s");
    expect(transitionState.animationName).toBe("none");
  });

  test("reduced motion reveals the same evidence without transition", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });
    await page
      .locator('[data-decision-id="decision-reveals-intention"]')
      .click();

    const active = page.locator(
      '[data-specimen-trace="decision-reveals-intention"][data-active="true"]',
    );
    await expect(active).toHaveCSS("transition-duration", "0s");
    await expect(page.locator("[data-active-annotation]")).toContainText(
      "expose the moment intention becomes visible form",
    );
  });

  test("mobile reinterprets the five forces as a contained vertical sequence", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/next-lab/measured-sublime", {
      waitUntil: "networkidle",
    });

    const geometry = await page.evaluate(() => {
      const field = document.querySelector<HTMLElement>(
        "[data-measured-sublime]",
      );
      if (!field) throw new Error("measured field missing");
      const selectors = {
        premise: '[data-role="field"]',
        instrument: '[data-role="instrument"]',
        phenomenon: '[data-role="phenomenon"]',
        trace: '[data-role="trace"]',
      } as const;
      const entries = Object.entries(selectors).map(([key, selector]) => {
        const element = field.querySelector<HTMLElement>(selector);
        if (!element) throw new Error(`${key} missing`);
        const rect = element.getBoundingClientRect();
        return [
          key,
          {
            top: rect.top,
            bottom: rect.bottom,
            left: rect.left,
            right: rect.right,
            area: rect.width * rect.height,
          },
        ] as const;
      });
      const rects = Object.fromEntries(entries) as Record<
        keyof typeof selectors,
        {
          top: number;
          bottom: number;
          left: number;
          right: number;
          area: number;
        }
      >;
      const fieldRect = field.getBoundingClientRect();
      const requiredText = [
        field.querySelector("h1"),
        ...field.querySelectorAll("[data-decision-id]"),
        field.querySelector('[data-role="trace"]'),
      ].filter(Boolean) as Node[];
      const textRects = requiredText.flatMap((node) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return [...range.getClientRects()].map((rect) => ({
          left: rect.left,
          right: rect.right,
        }));
      });

      return {
        rects,
        fieldLeft: fieldRect.left,
        fieldRight: fieldRect.right,
        textRects,
        quietRatio: Number(field.dataset.quietRatio),
        ruptureCount: field.querySelectorAll("[data-specimen-rupture]").length,
        documentOverflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });

    expect(geometry.rects.premise.bottom).toBeLessThanOrEqual(
      geometry.rects.phenomenon.top,
    );
    expect(geometry.rects.phenomenon.bottom).toBeLessThanOrEqual(
      geometry.rects.instrument.top,
    );
    expect(geometry.rects.instrument.bottom).toBeLessThanOrEqual(
      geometry.rects.trace.top,
    );
    expect(geometry.rects.phenomenon.area).toBeGreaterThan(
      geometry.rects.instrument.area,
    );
    expect(geometry.quietRatio).toBeGreaterThanOrEqual(0.45);
    expect(geometry.ruptureCount).toBe(1);
    expect(geometry.documentOverflow).toBeLessThanOrEqual(1);
    for (const rect of geometry.textRects) {
      expect(rect.left).toBeGreaterThanOrEqual(geometry.fieldLeft - 1);
      expect(rect.right).toBeLessThanOrEqual(geometry.fieldRight + 1);
    }
  });
});

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { chromium } from "@playwright/test";

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function boxesOverlap(first, second) {
  return (
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top
  );
}

function overlapRatio(first, second) {
  const width = Math.max(
    0,
    Math.min(first.right, second.right) - Math.max(first.left, second.left),
  );
  const height = Math.max(
    0,
    Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top),
  );
  const smallerArea = Math.min(
    (first.right - first.left) * (first.bottom - first.top),
    (second.right - second.left) * (second.bottom - second.top),
  );

  return smallerArea === 0 ? 0 : (width * height) / smallerArea;
}

function inspectOverlaps(nodes) {
  const pairs = [];
  for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < nodes.length;
      secondIndex += 1
    ) {
      const first = nodes[firstIndex];
      const second = nodes[secondIndex];
      if (boxesOverlap(first.rect, second.rect)) {
        pairs.push({
          first: first.id,
          second: second.id,
          ratio: Number(overlapRatio(first.rect, second.rect).toFixed(4)),
        });
      }
    }
  }
  return pairs;
}

export function summarizeCompositionSnapshot(snapshot) {
  const roles = unique(snapshot.nodes.map((node) => node.role));
  const relationKinds = unique(
    snapshot.nodes.flatMap((node) => node.relations ?? []),
  );
  const overlaps = inspectOverlaps(snapshot.nodes);
  const signature = [
    snapshot.rootChildren.join("|"),
    snapshot.layoutModes.join(","),
    roles.join(","),
    relationKinds.join(","),
  ].join(" :: ");

  return {
    id: `${snapshot.caseId}:${snapshot.mode}`,
    caseId: snapshot.caseId,
    mode: snapshot.mode,
    nodeCount: snapshot.nodes.length,
    roleCount: roles.length,
    roles,
    relationKinds: relationKinds.length,
    relationKindNames: relationKinds,
    overlapPairs: overlaps.length,
    maxOverlapRatio: Math.max(0, ...overlaps.map((pair) => pair.ratio)),
    overlaps,
    directPositioning: snapshot.directPositioning,
    componentCounts: snapshot.componentCounts,
    signature,
  };
}

async function readPageSnapshot(page, caseId, mode) {
  return page.evaluate(
    ({ currentCase, currentMode }) => {
      const root = document.querySelector("[data-next-composition]");
      if (!root) throw new Error("composition root not found");
      const visualElements = [
        ...root.querySelectorAll("*:not([data-composition-inspector])"),
      ];

      const nodes = [...root.querySelectorAll("[data-composition-node]")].map(
        (element) => {
          const rect = element.getBoundingClientRect();
          const styles = getComputedStyle(element);
          return {
            id: element.getAttribute("data-composition-node"),
            role: element.getAttribute("data-role"),
            relations: (element.getAttribute("data-relations") ?? "")
              .split(" ")
              .filter(Boolean),
            rect: {
              left: rect.left,
              top: rect.top,
              right: rect.right,
              bottom: rect.bottom,
            },
            position: styles.position,
          };
        },
      );

      const componentCounts = {};
      for (const element of visualElements) {
        for (const className of element.classList) {
          const match = className.match(/^hyvui-([a-z0-9-]+)/);
          if (!match) continue;
          const componentName = match[1]
            .split("-")
            .map((part) => part[0].toUpperCase() + part.slice(1))
            .join("");
          componentCounts[componentName] =
            (componentCounts[componentName] ?? 0) + 1;
        }
      }

      return {
        caseId: currentCase,
        mode: currentMode,
        rootChildren: [...root.children]
          .filter(
            (element) => !element.hasAttribute("data-composition-inspector"),
          )
          .map((element) => {
            const className = element.classList[0];
            return `${element.tagName.toLowerCase()}${className ? `.${className}` : ""}`;
          }),
        nodes,
        componentCounts,
        layoutModes: [
          ...new Set(
            visualElements.map((element) => getComputedStyle(element).display),
          ),
        ],
        directPositioning: nodes.filter((node) =>
          ["absolute", "fixed", "sticky"].includes(node.position),
        ).length,
      };
    },
    { currentCase: caseId, currentMode: mode },
  );
}

function parseArguments(argv) {
  const options = {
    baseUrl: "http://127.0.0.1:4173",
    output: "",
    cases: [
      "sparse",
      "dense",
      "image-dominant",
      "type-dominant",
      "atmospheric-motion",
    ],
    modes: ["disabled", "suggest", "apply"],
  };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--base-url") options.baseUrl = argv[++index];
    if (argv[index] === "--output") options.output = argv[++index];
    if (argv[index] === "--cases") options.cases = argv[++index].split(",");
    if (argv[index] === "--modes") options.modes = argv[++index].split(",");
  }

  return options;
}

export async function collectCompositionMetrics(options = {}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
  });
  const cases = options.cases ?? [
    "sparse",
    "dense",
    "image-dominant",
    "type-dominant",
    "atmospheric-motion",
  ];
  const modes = options.modes ?? ["disabled", "suggest", "apply"];
  const results = [];

  try {
    for (const caseId of cases) {
      for (const mode of modes) {
        await page.goto(
          `${options.baseUrl ?? "http://127.0.0.1:4173"}/next-lab/experiment?case=${caseId}&mode=${mode}`,
          {
            waitUntil: "domcontentloaded",
          },
        );
        await page.waitForSelector("[data-next-composition]");
        await page.evaluate(() => document.fonts.ready);
        results.push(
          summarizeCompositionSnapshot(
            await readPageSnapshot(page, caseId, mode),
          ),
        );
      }
    }
  } finally {
    await browser.close();
  }

  return results;
}

if (process.argv[1]?.endsWith("measure-compositions.mjs")) {
  const options = parseArguments(process.argv.slice(2));
  const results = await collectCompositionMetrics(options);
  const revision = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const workingTreeDirty = Boolean(
    execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim(),
  );
  const lockfileHash = createHash("sha256")
    .update(readFileSync("package-lock.json"))
    .digest("hex");
  const payload = `${JSON.stringify(
    {
      generatedBy: "scripts/measure-compositions.mjs",
      metadata: {
        capturedAt: new Date().toISOString(),
        repositoryRevision: revision,
        workingTreeDirty,
        dependencyLockSha256: lockfileHash,
        browser: "chromium",
        viewport: { width: 1600, height: 900 },
        cases: options.cases,
        modes: options.modes,
        fontReady: true,
      },
      results,
    },
    null,
    2,
  )}\n`;
  if (options.output) writeFileSync(options.output, payload);
  else process.stdout.write(payload);
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { format } from "prettier";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const sourcePath = path.join(root, "src/lib/tokens/source/tokens.json");
const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const outputFiles = [
  path.join(root, "src/lib/tokens/tokens.css"),
  path.join(root, "src/lib/tokens/tokens.ts"),
  path.join(root, "src/lib/tokens/registers.generated.ts"),
  path.join(root, "src/lib/system/register.css"),
  path.join(root, "src/lib/tokens/theme-values.css"),
  path.join(root, "src/lib/system/grades.css"),
];

const toKebab = (value) =>
  value
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();

const cssVars = [];
for (const [group, values] of Object.entries(source.base)) {
  for (const [key, value] of Object.entries(values)) {
    const suffix = toKebab(key);
    let name;
    switch (group) {
      case "color":
        name = suffix;
        break;
      case "font":
        name = `font-${suffix}`;
        break;
      case "type":
        name = `text-${suffix}`;
        break;
      case "lighting":
        name = `key-light-${suffix.replace(/^key-light-/, "")}`;
        break;
      case "derived":
        name = suffix;
        break;
      case "shadow":
        name = key === "focusRing" ? "focus-ring" : `shadow-${suffix}`;
        break;
      case "motion":
        name = /^(transition|ease)/.test(suffix) ? suffix : `motion-${suffix}`;
        break;
      case "texture":
        name = `tex-${suffix}`;
        break;
      case "container":
        name = `cq-${suffix}`;
        break;
      default:
        name = `${group}-${suffix}`;
        break;
    }
    cssVars.push([name, value]);
  }
}

const colorNames = new Set(Object.keys(source.base.color).map(toKebab));
const nonColorCssVars = cssVars.filter(([name]) => !colorNames.has(name));

function renderCssVars(entries, indent = "  ") {
  return entries
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join("\n");
}

function renderBaseCss() {
  const colorVars = Object.entries(source.base.color)
    .flatMap(([key, value]) => {
      const name = toKebab(key);
      return [
        `  --hyv-base-${name}: ${value};`,
        `  --${name}: var(--hyv-grade-${name}, var(--hyv-theme-${name}, var(--hyv-base-${name})));`,
      ];
    })
    .join("\n");

  return `/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */
:root {
${colorVars}
${renderCssVars(nonColorCssVars)}

  /* semantic typography roles */
  --reg-font-primary: var(--font-body);
  --reg-font-ui: var(--font-mono);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-allowed: 0;
    --transition-smooth: 0s linear;
    --transition-fast: 0s linear;
  }
}
`;
}

function renderTokensTs() {
  const base = source.base;
  const object = {
    color: base.color,
    font: base.font,
    type: base.type,
    leading: base.leading,
    tracking: base.tracking,
    space: base.space,
    shell: base.shell,
    transition: {
      smooth: base.motion.transitionSmooth,
      fast: base.motion.transitionFast,
    },
  };

  return `/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */
export const tokens = ${JSON.stringify(object, null, 2)} as const;
`;
}

function renderRegistersTs() {
  const weights = Object.keys(source.weights).filter(
    (key) => key !== "default",
  );
  const themes = Object.keys(source.themes);
  const grades = Object.keys(source.grades);
  return `/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */
export const weightRegisters = ${JSON.stringify(weights)} as const;
export type WeightRegister = (typeof weightRegisters)[number];

export const themeRegisters = ${JSON.stringify(themes)} as const;
export type ThemeRegister = (typeof themeRegisters)[number];

export const gradeRegisters = ${JSON.stringify(grades)} as const;
export type GradeRegister = (typeof gradeRegisters)[number];
`;
}

function renderRegisterCss() {
  const renderRegister = (selector, values) =>
    `${selector} {\n${Object.entries(values)
      .map(([key, value]) => `  --reg-${toKebab(key)}: ${value};`)
      .join("\n")}\n}`;

  const defaultValues = source.weights.default;
  const blocks = [
    "/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */",
    renderRegister(":root", defaultValues),
  ];
  for (const [name, values] of Object.entries(source.weights)) {
    if (name === "default") continue;
    blocks.push(renderRegister(`[data-weight="${name}"]`, values));
  }
  return `${blocks.join("\n\n")}\n`;
}

function renderThemeValuesCss() {
  const blocks = [
    "/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */",
  ];
  for (const [name, values] of Object.entries(source.themes)) {
    const semantic = Object.entries(values).filter(([key]) =>
      colorNames.has(toKebab(key)),
    );
    const material = Object.entries(values).filter(
      ([key]) => !colorNames.has(toKebab(key)),
    );
    blocks.push(
      `[data-theme="${name}"] {\n${semantic
        .flatMap(([key, value]) => {
          const token = toKebab(key);
          return [
            `  --hyv-theme-${token}: ${value};`,
            `  --${token}: var(--hyv-grade-${token}, var(--hyv-theme-${token}));`,
          ];
        })
        .concat(
          material.map(([key, value]) => `  --${toKebab(key)}: ${value};`),
        )
        .join("\n")}\n}`,
    );
  }
  return `${blocks.join("\n\n")}\n`;
}

function renderGradesCss() {
  const blocks = [
    "/* generated from src/lib/tokens/source/tokens.json. do not edit by hand. */",
  ];
  for (const [name, recipe] of Object.entries(source.grades)) {
    const recipeVars = Object.entries(recipe)
      .map(([key, value]) => `    --hyv-grade-${toKebab(key)}: ${value};`)
      .join("\n");
    const semanticVars = Object.keys(source.base.color)
      .map((key) => `    --${toKebab(key)}: var(--hyv-grade-${toKebab(key)});`)
      .join("\n");
    blocks.push(
      `@supports (color: color-mix(in srgb, black, white)) {\n  [data-grade="${name}"],\n  [data-grade="${name}"] * {\n${recipeVars}\n${semanticVars}\n  }\n}`,
    );
  }
  return `${blocks.join("\n\n")}\n`;
}

const generated = new Map([
  [outputFiles[0], renderBaseCss()],
  [outputFiles[1], renderTokensTs()],
  [outputFiles[2], renderRegistersTs()],
  [outputFiles[3], renderRegisterCss()],
  [outputFiles[4], renderThemeValuesCss()],
  [outputFiles[5], renderGradesCss()],
]);

for (const [file, content] of generated) {
  const parser = file.endsWith(".css") ? "css" : "typescript";
  generated.set(file, await format(content, { parser }));
}

const checkOnly = process.argv.includes("--check");
let failed = false;
for (const [file, content] of generated) {
  const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
  if (checkOnly) {
    if (current !== content) {
      console.error(`token output is stale: ${path.relative(root, file)}`);
      failed = true;
    }
    continue;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  console.log(`generated ${path.relative(root, file)}`);
}

if (failed) process.exitCode = 1;

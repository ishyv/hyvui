import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const COMPONENT_GROUPS = new Set([
  "ambient",
  "depth",
  "display",
  "feedback",
  "inputs",
  "layout",
  "navigation",
  "orchestration",
  "ornaments",
  "patterns",
  "primitives",
  "scenes",
  "system",
]);

const SIGNAL_PATTERNS = {
  usesActions: /\buse:[a-z][\w-]*/,
  usesAnimations: /@keyframes|\banimation(?:-name)?\s*:|\banimate\s*\(/,
  usesCanvas: /<canvas\b|getContext\s*\(/,
  usesCssVariables: /var\(--[\w-]+\)/,
  usesObservers: /(?:Resize|Mutation|Intersection)Observer/,
  usesPointerInteraction:
    /pointer(?:move|enter|leave|down|up)|mouseenter|mouseleave|onclick|onpointer/,
  usesPositioning: /position\s*:\s*(?:absolute|fixed|relative|sticky)/,
  usesThemeSelectors: /\[data-(?:theme|weight|grade|register)=/,
  usesTransforms:
    /\btransform\s*:|style:transform|translate(?:3d|X|Y)?\s*\(|rotate\s*\(|scale\s*\(/,
  usesCssClipping: /clip-path\s*:|mask(?:-image)?\s*:/,
};

const ROLE_BY_GROUP = {
  ambient: ["atmosphere", "texture", "field"],
  depth: ["spatial material", "depth layer", "focal support"],
  display: ["information material", "datum", "content display"],
  feedback: ["state signal", "status material", "interruption"],
  inputs: ["interactive material", "control", "action"],
  layout: ["spatial organizer", "container", "rhythm"],
  navigation: ["wayfinding", "structure", "orientation"],
  orchestration: ["choreography", "reveal", "motion"],
  ornaments: ["mark", "connector", "frame"],
  patterns: ["composition helper", "workflow", "structure"],
  primitives: ["material", "content", "surface"],
  scenes: ["composition template", "page structure", "sequence"],
  system: ["system shell", "context", "infrastructure"],
};

function walk(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  return entries
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? walk(path) : [path];
    })
    .filter((path) => extname(path) === ".svelte")
    .sort((a, b) => a.localeCompare(b));
}

function parseProps(source) {
  const propsBlock =
    source.match(/interface\s+Props\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";
  const props = [];
  let pendingDescription = "";

  for (const line of propsBlock.split("\n")) {
    const comment = line.match(/^\s*\/\*\*\s*(.*?)\s*\*\//);
    if (comment) {
      pendingDescription = comment[1];
      continue;
    }

    const property = line.match(/^\s*([\w$]+)(\?)?\s*:\s*(.+?);?\s*$/);
    if (!property) continue;

    props.push({
      name: property[1],
      optional: Boolean(property[2]),
      type: property[3].replace(/;$/, "").trim(),
      description: pendingDescription,
    });
    pendingDescription = "";
  }

  return props;
}

function signalInventory(source) {
  return Object.fromEntries(
    Object.entries(SIGNAL_PATTERNS).map(([name, pattern]) => [
      name,
      pattern.test(source),
    ]),
  );
}

function inferEscapeHatches(props, signals) {
  const escapes = [];
  const names = new Set(props.map((prop) => prop.name));

  if (names.has("class")) escapes.push("class extension");
  if (names.has("as")) escapes.push("semantic element selection");
  if (
    names.has("children") ||
    /{@render\s+children/.test(signals.source ?? "")
  ) {
    escapes.push("arbitrary child content");
  }
  if (signals.usesCssVariables)
    escapes.push("CSS custom-property participation");
  if (signals.usesPositioning || signals.usesTransforms)
    escapes.push("spatial CSS override surface");

  return escapes;
}

function componentRecord(file, componentsRoot) {
  const source = readFileSync(file, "utf8");
  const relativePath = relative(componentsRoot, file).replaceAll("\\", "/");
  const group = relativePath.split("/")[0];
  const name = basename(file, ".svelte");
  const props = parseProps(source);
  const signals = signalInventory(source);
  const roles = ROLE_BY_GROUP[group] ?? ["material"];

  return {
    name,
    group: COMPONENT_GROUPS.has(group) ? group : "uncategorized",
    file: `src/lib/components/${relativePath}`,
    props,
    slots: props
      .filter((prop) => /Snippet/.test(prop.type))
      .map((prop) => prop.name),
    roles,
    signals,
    escapes: inferEscapeHatches(props, { ...signals, source }),
  };
}

export function collectComponentSurface(
  componentsRoot = resolve(process.cwd(), "src/lib/components"),
) {
  return walk(componentsRoot)
    .map((file) => componentRecord(file, componentsRoot))
    .sort(
      (a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file),
    );
}

function formatSignals(signals) {
  return (
    Object.entries(signals)
      .filter(([, active]) => active)
      .map(([name]) =>
        name
          .replace(/^uses/, "")
          .replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)
          .trim(),
      )
      .join(", ") || "none detected"
  );
}

export function renderMarkdown(records) {
  const groups = new Map();
  for (const record of records) {
    const list = groups.get(record.group) ?? [];
    list.push(record);
    groups.set(record.group, list);
  }

  const lines = [
    "# Component capability inventory",
    "",
    "This inventory intentionally covers the pre-Next component directory (`src/lib/components/`). It does not include `TravelingParticle` under `src/lib/system/motion/` or the new Next composition modules.",
    "",
    "> generated by `scripts/collect-component-surface.mjs`. This is an audit aid, not a public API contract.",
    "",
    `- components inspected: ${records.length}`,
    `- groups inspected: ${groups.size}`,
    "- source of truth: `src/lib/components/**/*.svelte`",
    "",
    "## reading this inventory",
    "",
    "The current library exposes components as finished visual/layout decisions in many places. `roles` and `escapes` are audit labels used to identify material-like behavior and possible seams; they do not prescribe the HyvUI Next API.",
    "",
  ];

  for (const [group, groupRecords] of [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    lines.push(`## ${group}`, "", `components: ${groupRecords.length}`, "");
    for (const record of groupRecords) {
      const props = record.props.length
        ? record.props
            .map(
              (prop) =>
                `\`${prop.name}${prop.optional ? "?" : ""}\`: ${prop.type}`,
            )
            .join(", ")
        : "none detected";
      lines.push(
        `### ${record.name}`,
        "",
        `- source: \`${record.file}\``,
        `- audit roles: ${record.roles.join(", ")}`,
        `- props: ${props}`,
        `- snippets: ${record.slots.length ? record.slots.map((slot) => `\`${slot}\``).join(", ") : "none detected"}`,
        `- signals: ${formatSignals(record.signals)}`,
        `- escape seams: ${record.escapes.length ? record.escapes.join(", ") : "none detected"}`,
        "",
      );
    }
  }

  return `${lines.join("\n").replace(/\n+$/, "")}\n`;
}

function parseArguments(argv) {
  const options = {
    components: resolve(process.cwd(), "src/lib/components"),
    write: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--components")
      options.components = resolve(argv[++index]);
    if (argv[index] === "--write") options.write = resolve(argv[++index]);
  }

  return options;
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  const options = parseArguments(process.argv.slice(2));
  const markdown = renderMarkdown(collectComponentSurface(options.components));
  if (options.write) {
    mkdirSync(dirname(options.write), { recursive: true });
    writeFileSync(options.write, markdown);
  } else {
    process.stdout.write(markdown);
  }
}

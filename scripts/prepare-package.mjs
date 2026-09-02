import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const distRoot = path.resolve(projectRoot, "dist");
const privateDirectories = [
  "next-experiments",
  "next-lab",
  "showcase",
  "examples",
];
const manifestSource = path.join(distRoot, "next-experiments");
const manifestTarget = path.join(distRoot, "agent-manifest");

if (!fs.existsSync(distRoot)) {
  throw new Error("cannot prepare the package because dist does not exist");
}

const relativeTarget = path.relative(projectRoot, distRoot);
if (path.isAbsolute(relativeTarget) || relativeTarget.startsWith("..")) {
  throw new Error(
    `refusing to prepare an unexpected package directory: ${distRoot}`,
  );
}

const manifestFiles = [
  "capabilities.js",
  "capabilities.d.ts",
  "biomeManifest.js",
  "biomeManifest.d.ts",
  "biomes.js",
  "biomes.d.ts",
  "types.d.ts",
];

for (const file of manifestFiles) {
  const source = path.join(manifestSource, file);
  if (!fs.existsSync(source)) {
    throw new Error(`public agent manifest dependency is missing: ${source}`);
  }
}

fs.mkdirSync(manifestTarget, { recursive: true });
for (const file of manifestFiles) {
  fs.copyFileSync(
    path.join(manifestSource, file),
    path.join(manifestTarget, file),
  );
}

const publicEntry = path.join(distRoot, "agent-manifest.js");
const publicTypes = path.join(distRoot, "agent-manifest.d.ts");
for (const target of [publicEntry, publicTypes]) {
  const contents = fs.readFileSync(target, "utf8");
  fs.writeFileSync(
    target,
    contents.replaceAll(
      "./next-experiments/capabilities.js",
      "./agent-manifest/capabilities.js",
    ),
  );
}

for (const directory of privateDirectories) {
  const target = path.join(distRoot, directory);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

console.log("prepared public package boundary: private experiments excluded");

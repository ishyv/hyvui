export const biomeIds = [
  "operational-apparatus",
  "manifesto-print",
  "deconstructed-editorial",
  "quiet-object-gallery",
  "ceremonial-reliquary",
  "ecological-elegy",
  "oneiric-object-poetry",
  "machine-ecology",
  "celestial-cartography",
  "post-digital-morphology",
  "kinetic-rupture",
  "noise-commons",
] as const;

export type BiomeId = (typeof biomeIds)[number];

export const biomeGraftChannels = [
  "material",
  "light",
  "typography",
  "information",
  "motion",
  "interaction",
  "framing",
] as const;

export type BiomeGraftChannel = (typeof biomeGraftChannels)[number];
export type BiomeGraftMode = "symbiotic" | "tensional";

export type BiomeGraft = {
  biome: BiomeId;
  channel: BiomeGraftChannel;
  mode: BiomeGraftMode;
  reason: string;
};

export type BiomeDefinition = {
  id: BiomeId;
  label: string;
  worldview: string;
  spatialLaw: string;
  attention: string;
  density: string;
  spatialHabitat: string[];
  materials: string[];
  light: string[];
  typography: string[];
  information: string[];
  timeModel: string;
  viewerRole: string;
  interactionVerbs: string[];
  frameModes: string[];
  passageModes: string[];
  compatibleGraftChannels: BiomeGraftChannel[];
  symbioticWith: BiomeId[];
  tensionalWith: BiomeId[];
  destructiveWith: BiomeId[];
  antiPatterns: string[];
  responsiveRule: string;
};

export type BiomeBrief = {
  seed: string;
  premise: string;
  hostBiome: BiomeId;
  grafts: BiomeGraft[];
  contentOrder?: string[];
  requiredContent?: string[];
  withholding?: string;
  focalPolicy?: "singular" | "distributed" | "polycentric";
  framePolicy?: string;
  passagePolicy?: string;
};

export const biomeDefinitions: BiomeDefinition[] = [
  {
    id: "operational-apparatus",
    label: "operational apparatus",
    worldview:
      "systems, evidence, deployment, classification, and controlled technical action",
    spatialLaw:
      "measured grids, rails, specifications, and strong macro/micro scale contrast",
    attention: "one active operation is legible inside a calm evidence field",
    density: "layered evidence",
    spatialHabitat: ["dossier", "plate", "evidence field", "instrument rail"],
    materials: [
      "manual",
      "thermal image",
      "industrial marking",
      "clean vector",
    ],
    light: ["inspection light", "localized signal", "thermal contrast"],
    typography: ["technical instrument", "compact metadata", "neutral mono"],
    information: ["operational", "indexical", "state-based"],
    timeModel: "scanning, deployment, stepped reveal, and state change",
    viewerRole: "operator",
    interactionVerbs: [
      "inspect",
      "target",
      "compare",
      "deploy",
      "filter",
      "expose",
    ],
    frameModes: ["scan-and-hold", "step-through", "precise-cut"],
    passageModes: ["diagnostic-trace", "evidence-sequence"],
    compatibleGraftChannels: [
      "information",
      "light",
      "material",
      "interaction",
      "framing",
    ],
    symbioticWith: [
      "post-digital-morphology",
      "machine-ecology",
      "celestial-cartography",
    ],
    tensionalWith: [
      "ecological-elegy",
      "ceremonial-reliquary",
      "manifesto-print",
    ],
    destructiveWith: ["oneiric-object-poetry", "noise-commons"],
    antiPatterns: [
      "fake telemetry",
      "unrelated reticles",
      "illegible microtype",
    ],
    responsiveRule:
      "preserve the operation and collapse secondary readings before reducing control legibility",
  },
  {
    id: "manifesto-print",
    label: "manifesto print",
    worldview: "statements, declarations, doubt, protest, and public address",
    spatialLaw:
      "a frontal typographic wall with narrow margins and one rhetorical breach",
    attention:
      "language is the primary body and supporting material behaves like marginal evidence",
    density: "ink pressure",
    spatialHabitat: ["broadsheet", "typographic wall", "margin", "proof field"],
    materials: ["newsprint", "xerox", "ink", "registration error"],
    light: ["flat print", "paper shadow", "accent registration"],
    typography: [
      "monumental declaration",
      "marginal witness",
      "interrupted title",
    ],
    information: ["rhetorical", "archival", "communal"],
    timeModel: "hard cuts, speech cadence, print jitter, and repetition",
    viewerRole: "reader",
    interactionVerbs: ["read", "confront", "interrupt", "repeat", "erase"],
    frameModes: ["confront-and-cut", "replace-and-repeat", "printed-hold"],
    passageModes: ["long-form-reading", "rhetorical-sequence"],
    compatibleGraftChannels: [
      "typography",
      "material",
      "information",
      "framing",
    ],
    symbioticWith: ["noise-commons", "deconstructed-editorial"],
    tensionalWith: [
      "ceremonial-reliquary",
      "operational-apparatus",
      "kinetic-rupture",
    ],
    destructiveWith: ["quiet-object-gallery", "oneiric-object-poetry"],
    antiPatterns: [
      "distorted body copy",
      "decorative damage",
      "uniform card rhetoric",
    ],
    responsiveRule:
      "preserve the sentence block and move marginal matter outside its measure before shrinking the statement",
  },
  {
    id: "deconstructed-editorial",
    label: "deconstructed editorial",
    worldview:
      "bodies, brands, sculpture, ambition, labor, and concepts made spatial",
    spatialLaw:
      "asymmetric columns, crop, masking, and controlled type/image tension",
    attention:
      "one editorial proposition is staged by counterweights and deliberate cropping",
    density: "asymmetric spread",
    spatialHabitat: [
      "editorial spread",
      "sculptural column",
      "masked plate",
      "gallery page",
    ],
    materials: ["sculpture", "photography", "cloth", "stone", "paper"],
    light: ["studio contrast", "directional wash", "sculptural shadow"],
    typography: [
      "architectural statement",
      "editorial witness",
      "rotated concept",
    ],
    information: ["narrative", "catalogue", "brand proposition"],
    timeModel: "page succession, image reveal, masking, and reframe",
    viewerRole: "browser",
    interactionVerbs: ["browse", "compare", "reveal", "reframe", "sequence"],
    frameModes: ["page-turn", "mask-and-reveal", "cropped-hold"],
    passageModes: ["editorial-scroll", "image-sequence"],
    compatibleGraftChannels: [
      "typography",
      "material",
      "framing",
      "interaction",
    ],
    symbioticWith: [
      "manifesto-print",
      "quiet-object-gallery",
      "post-digital-morphology",
    ],
    tensionalWith: ["ceremonial-reliquary", "kinetic-rupture"],
    destructiveWith: ["machine-ecology", "noise-commons"],
    antiPatterns: [
      "fashionable crop hiding required content",
      "generic card grid",
      "every text node as a heading",
    ],
    responsiveRule:
      "replace side-by-side tension with a deliberate succession of crop, object, and witness",
  },
  {
    id: "quiet-object-gallery",
    label: "quiet object gallery",
    worldview:
      "ordinary objects made precious through restraint, repetition, and calm order",
    spatialLaw:
      "large neutral fields, isolated object, partial repetition, and generous pauses",
    attention: "one object receives enough quiet to become more than a product",
    density: "radical void",
    spatialHabitat: [
      "gallery void",
      "product plate",
      "object interval",
      "catalogue field",
    ],
    materials: ["ceramic", "glass", "packaging", "paper", "quiet photograph"],
    light: ["soft studio", "diffuse daylight", "quiet reflection"],
    typography: ["sparse label", "catalogue caption", "unspoken title"],
    information: ["catalogue", "commerce", "comparison"],
    timeModel:
      "stillness, gentle rotation, comparison, and small state changes",
    viewerRole: "collector",
    interactionVerbs: ["inspect", "select", "compare", "collect", "purchase"],
    frameModes: ["still-display", "gentle-compare", "object-release"],
    passageModes: ["catalogue-browse", "slow-comparison"],
    compatibleGraftChannels: ["material", "light", "interaction", "framing"],
    symbioticWith: ["deconstructed-editorial", "oneiric-object-poetry"],
    tensionalWith: ["noise-commons", "celestial-cartography"],
    destructiveWith: ["operational-apparatus", "kinetic-rupture"],
    antiPatterns: [
      "atmosphere added to fill the void",
      "dense dashboard overlay",
      "luxury gloss without object meaning",
    ],
    responsiveRule:
      "protect the object interval and convert comparison into a short native sequence on narrow fields",
  },
  {
    id: "ceremonial-reliquary",
    label: "ceremonial reliquary",
    worldview:
      "icons, saints, avatars, jewels, rank, ritual, and charged adornment",
    spatialLaw:
      "an axial shrine with nested frames and concentrated ornamental hierarchy",
    attention:
      "the precious object is approached through witnesses, material, and light",
    density: "ornamental abundance",
    spatialHabitat: ["shrine", "altar", "nested chamber", "icon field"],
    materials: [
      "gem",
      "metal leaf",
      "lace",
      "beadwork",
      "dark textile",
      "weathered icon",
    ],
    light: ["aureole", "internal jewel light", "directional sacred light"],
    typography: [
      "heraldic inscription",
      "liturgical margin",
      "optional absence",
    ],
    information: ["symbolic", "ritual", "archival"],
    timeModel: "icon stillness, slow shimmer, approach, and ritual opening",
    viewerRole: "witness",
    interactionVerbs: [
      "witness",
      "approach",
      "illuminate",
      "open",
      "venerate",
      "equip",
    ],
    frameModes: ["approach-and-hold", "illumination", "ritual-open"],
    passageModes: ["liturgical-sequence", "relic-reveal"],
    compatibleGraftChannels: [
      "material",
      "light",
      "typography",
      "framing",
      "interaction",
    ],
    symbioticWith: ["celestial-cartography", "post-digital-morphology"],
    tensionalWith: [
      "manifesto-print",
      "operational-apparatus",
      "ecological-elegy",
    ],
    destructiveWith: ["quiet-object-gallery", "kinetic-rupture"],
    antiPatterns: [
      "ornament as decoration only",
      "equal sacredness everywhere",
      "fast spectacle",
    ],
    responsiveRule:
      "keep the focal relic and reduce witnesses into layered approach states instead of flattening ornament into a grid",
  },
  {
    id: "ecological-elegy",
    label: "ecological elegy",
    worldview:
      "bodies becoming landscape, mourning, habitat, aftermath, and slow absorption",
    spatialLaw:
      "an enclosed habitat with horizontal body logic and organic thresholds",
    attention:
      "the subject is encountered as a process of absorption rather than displayed as a specimen",
    density: "quiet absorption",
    spatialHabitat: ["wetland", "shoreline", "horizon", "immersive habitat"],
    materials: ["water", "vegetation", "fabric", "flesh", "mud", "oil glaze"],
    light: ["submerged light", "ashen reflection", "dusk haze"],
    typography: ["literary margin", "botanical archive", "quiet absence"],
    information: ["narrative", "environmental", "memory"],
    timeModel: "drift, saturation, sinking, wilting, decomposition, and season",
    viewerRole: "mourner",
    interactionVerbs: [
      "contemplate",
      "remember",
      "discover",
      "linger",
      "adapt",
    ],
    frameModes: ["drift-and-continue", "absorb-and-darken", "seasonal-hold"],
    passageModes: ["ecological-absorption", "slow-literary-scroll"],
    compatibleGraftChannels: [
      "material",
      "light",
      "information",
      "motion",
      "framing",
    ],
    symbioticWith: ["oneiric-object-poetry", "machine-ecology"],
    tensionalWith: [
      "operational-apparatus",
      "ceremonial-reliquary",
      "celestial-cartography",
    ],
    destructiveWith: ["kinetic-rupture", "quiet-object-gallery"],
    antiPatterns: [
      "gamified aftermath",
      "explicitly explained ambiguity",
      "decorative ecology",
    ],
    responsiveRule:
      "retain horizontal flow and habitat continuity, then let the scroll become slower reading rather than compressed choreography",
  },
  {
    id: "oneiric-object-poetry",
    label: "oneiric object-poetry",
    worldview:
      "one impossible conjunction makes the ordinary metaphysical, intimate, or fragile",
    spatialLaw:
      "an iconic object inside nested thresholds and a large negative field",
    attention:
      "one metaphorical object carries the whole world without explanatory overload",
    density: "concentrated island",
    spatialHabitat: [
      "domestic chamber",
      "object void",
      "pocket cosmos",
      "nested vessel",
    ],
    materials: [
      "plastic",
      "water",
      "moonlight",
      "domestic matter",
      "handmade mark",
    ],
    light: ["interior night", "small celestial glow", "soft room shadow"],
    typography: ["sparse poetic caption", "signature", "deliberate absence"],
    information: ["poetic", "metaphorical", "intimate"],
    timeModel: "suspension, sway, slosh, leak, and tiny uncertain changes",
    viewerRole: "holder",
    interactionVerbs: [
      "hold",
      "tilt",
      "release",
      "preserve",
      "puncture",
      "wonder",
    ],
    frameModes: ["tilt-and-release", "suspend-and-settle", "quiet-reveal"],
    passageModes: ["tactile-sequence", "metaphor-unfold"],
    compatibleGraftChannels: ["material", "light", "interaction", "framing"],
    symbioticWith: ["quiet-object-gallery", "ecological-elegy"],
    tensionalWith: ["ceremonial-reliquary", "celestial-cartography"],
    destructiveWith: [
      "operational-apparatus",
      "machine-ecology",
      "noise-commons",
    ],
    antiPatterns: [
      "dashboard explanation",
      "toy interaction",
      "polished generic 3D",
    ],
    responsiveRule:
      "keep the object iconic and let supporting language move beneath it instead of shrinking the metaphor into a thumbnail",
  },
  {
    id: "machine-ecology",
    label: "machine ecology",
    worldview:
      "infrastructure as habitat, maintenance, circulation, opacity, and entropy",
    spatialLaw:
      "a polycentric labyrinth of crossings with no required privileged focal point",
    attention:
      "local mechanisms are legible while the whole remains larger than the viewer",
    density: "polycentric network",
    spatialHabitat: [
      "labyrinth",
      "pipe forest",
      "maintenance habitat",
      "network section",
    ],
    materials: [
      "pipe",
      "corrosion",
      "soot",
      "patch",
      "rubble",
      "mineral residue",
    ],
    light: ["maintenance lamp", "deep shadow", "signal leak"],
    typography: [
      "equipment code",
      "maintenance history",
      "archive label",
      "optional absence",
    ],
    information: ["maintenance", "operational", "archival"],
    timeModel:
      "continuous flow, vibration, leakage, repair, decay, and accumulation",
    viewerRole: "maintainer",
    interactionVerbs: [
      "traverse",
      "trace",
      "listen",
      "maintain",
      "isolate",
      "annotate",
    ],
    frameModes: ["traverse-and-trace", "inherit-flow", "polycentric-hold"],
    passageModes: ["infrastructural-traverse", "maintenance-scroll"],
    compatibleGraftChannels: [
      "material",
      "information",
      "motion",
      "interaction",
      "framing",
    ],
    symbioticWith: [
      "operational-apparatus",
      "ecological-elegy",
      "post-digital-morphology",
    ],
    tensionalWith: ["celestial-cartography", "ceremonial-reliquary"],
    destructiveWith: ["oneiric-object-poetry", "quiet-object-gallery"],
    antiPatterns: [
      "pristine sci-fi dashboard",
      "single hero object",
      "unexplained decorative routes",
    ],
    responsiveRule:
      "preserve multiple active routes and let narrow layouts reveal the network through traversal rather than stacking every node into cards",
  },
  {
    id: "celestial-cartography",
    label: "celestial cartography",
    worldview:
      "navigable cosmos, ornamental knowledge, trajectories, sigils, and exploratory wonder",
    spatialLaw:
      "a hub-and-orbit field with celestial anchors and paths beyond the frame",
    attention:
      "the viewer navigates a correspondence system rather than reading a literal dashboard",
    density: "ornamental constellation",
    spatialHabitat: ["map", "orbit field", "celestial plate", "sigil diagram"],
    materials: [
      "parchment",
      "print ink",
      "star field",
      "symbolic light",
      "atmospheric landscape",
    ],
    light: ["star point", "solar wash", "ink contrast"],
    typography: [
      "map notation",
      "script",
      "poetic fragment",
      "pseudo-information",
    ],
    information: ["symbolic", "poetic", "navigational"],
    timeModel: "orbit, migration, twinkle, line drawing, and slow expansion",
    viewerRole: "explorer",
    interactionVerbs: [
      "navigate",
      "orbit",
      "pan",
      "align",
      "chart",
      "discover",
    ],
    frameModes: ["orbit-and-align", "map-expansion", "celestial-cut"],
    passageModes: ["orbital-pan", "map-excavation"],
    compatibleGraftChannels: [
      "material",
      "light",
      "information",
      "motion",
      "interaction",
      "framing",
    ],
    symbioticWith: [
      "ceremonial-reliquary",
      "operational-apparatus",
      "kinetic-rupture",
    ],
    tensionalWith: ["oneiric-object-poetry", "machine-ecology"],
    destructiveWith: ["quiet-object-gallery"],
    antiPatterns: [
      "literal dashboard diagram",
      "glossy generic space",
      "every orbit as data",
    ],
    responsiveRule:
      "keep the hub and one readable route, then replace wide orbit with a pan or chapter sequence on narrow viewports",
  },
  {
    id: "post-digital-morphology",
    label: "post-digital morphology",
    worldview:
      "bodies, machines, cloth, anatomy, glass, and digital matter becoming one another",
    spatialLaw:
      "a floating specimen with folds, loops, exploded views, and distributed material states",
    attention:
      "the object teaches through transformation and material continuity",
    density: "distributed specimen",
    spatialHabitat: [
      "specimen plate",
      "exploded view",
      "fold field",
      "morphological chamber",
    ],
    materials: [
      "mesh",
      "armor",
      "cable",
      "fabric",
      "bone",
      "resin",
      "synthetic skin",
    ],
    light: ["specimen light", "internal reflection", "edge illumination"],
    typography: ["specimen label", "small diagnostic", "material silence"],
    information: ["morphological", "diagnostic", "material"],
    timeModel: "unfold, breathe, morph, assemble, scan, and rotate",
    viewerRole: "dissector",
    interactionVerbs: [
      "rotate",
      "dissect",
      "reveal",
      "deform",
      "connect",
      "reassemble",
    ],
    frameModes: ["unfold-and-inspect", "morph-and-hold", "explode-and-return"],
    passageModes: ["dissection-scroll", "morph-sequence"],
    compatibleGraftChannels: [
      "material",
      "light",
      "information",
      "motion",
      "interaction",
    ],
    symbioticWith: [
      "operational-apparatus",
      "machine-ecology",
      "kinetic-rupture",
    ],
    tensionalWith: ["ceremonial-reliquary", "ecological-elegy"],
    destructiveWith: ["quiet-object-gallery"],
    antiPatterns: [
      "generic glossy 3D",
      "meaningless diagnostic marks",
      "uniform material polish",
    ],
    responsiveRule:
      "preserve the transformation sequence and replace exploded width with depth and progressive disclosure",
  },
  {
    id: "kinetic-rupture",
    label: "kinetic rupture",
    worldview:
      "fall, acceleration, procession, release, impact, and disintegration",
    spatialLaw:
      "one strong trajectory compresses time into marks against a quiet field",
    attention:
      "a single event changes the path, fragments, and destination around it",
    density: "directional burst",
    spatialHabitat: [
      "trajectory",
      "fall field",
      "processional lane",
      "impact zone",
    ],
    materials: [
      "blur",
      "fragment",
      "smoke",
      "train sequence",
      "flock",
      "scraped print",
    ],
    light: ["impact flare", "directional streak", "afterimage"],
    typography: ["route label", "interrupted title", "residue caption"],
    information: ["temporal", "narrative", "route-based"],
    timeModel: "burst, fall, launch, scatter, procession, and inertia",
    viewerRole: "follower",
    interactionVerbs: [
      "scrub",
      "steer",
      "release",
      "accelerate",
      "interrupt",
      "follow",
    ],
    frameModes: ["scrub-and-release", "impact-cut", "trajectory-inherit"],
    passageModes: ["kinetic-scrub", "processional-scroll"],
    compatibleGraftChannels: [
      "motion",
      "framing",
      "material",
      "interaction",
      "typography",
    ],
    symbioticWith: [
      "celestial-cartography",
      "post-digital-morphology",
      "noise-commons",
    ],
    tensionalWith: ["manifesto-print", "machine-ecology"],
    destructiveWith: [
      "quiet-object-gallery",
      "ecological-elegy",
      "ceremonial-reliquary",
    ],
    antiPatterns: [
      "animation everywhere",
      "several equal vectors",
      "motion without destination",
    ],
    responsiveRule:
      "keep one vector and convert scrub distance into discrete impact states where continuous width is unavailable",
  },
  {
    id: "noise-commons",
    label: "noise commons",
    worldview:
      "collective identity, graffiti, anti-design, collage, media accumulation, and contested surfaces",
    spatialLaw:
      "marks accumulate across boundaries in dense islands and contested layers",
    attention:
      "many voices coexist, but one local act of marking remains legible at a time",
    density: "saturated mark field",
    spatialHabitat: [
      "wall",
      "collage field",
      "sticker surface",
      "contested margin",
    ],
    materials: [
      "spray",
      "xerox",
      "photo fragment",
      "ink",
      "scribble",
      "sticker",
    ],
    light: ["flat collage", "flash photograph", "registration shift"],
    typography: [
      "heterogeneous voices",
      "hand lettering",
      "tag",
      "cropped statement",
    ],
    information: ["communal", "fragmentary", "cumulative"],
    timeModel: "addition, overwrite, erasure, remix, and contribution",
    viewerRole: "contributor",
    interactionVerbs: [
      "mark",
      "remix",
      "layer",
      "tear",
      "annotate",
      "contribute",
    ],
    frameModes: ["accumulate-and-cut", "overwrite", "contested-hold"],
    passageModes: ["collage-scroll", "contribution-sequence"],
    compatibleGraftChannels: [
      "typography",
      "material",
      "information",
      "interaction",
      "motion",
      "framing",
    ],
    symbioticWith: ["manifesto-print", "kinetic-rupture"],
    tensionalWith: ["quiet-object-gallery", "ceremonial-reliquary"],
    destructiveWith: ["deconstructed-editorial", "oneiric-object-poetry"],
    antiPatterns: [
      "cleaned collective surface",
      "every mark as ornament",
      "illegible required copy",
    ],
    responsiveRule:
      "preserve layered voices but stage additions in time on narrow viewports instead of shrinking the entire wall",
  },
];

export function getBiomeDefinition(
  id: string | null | undefined,
): BiomeDefinition | undefined {
  return biomeDefinitions.find((biome) => biome.id === id);
}

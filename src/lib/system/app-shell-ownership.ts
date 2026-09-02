import type {
  GradeRegister,
  ThemeRegister,
  WeightRegister,
} from "./register.js";

type BodyChannel = "weight" | "theme" | "grade";

type BodyOwner = {
  depth: number;
  order: number;
} & Partial<
  Record<BodyChannel, WeightRegister | ThemeRegister | GradeRegister | null>
>;

const bodyOwners = new Map<symbol, BodyOwner>();
let nextOwnerOrder = 0;
let originalBodyAttributes: Record<BodyChannel, string | null> | undefined;
let warnedAboutCompetition = false;
const runtimeMeta = import.meta as ImportMeta & {
  env?: { DEV?: boolean };
};

function createBodyOwner(
  depth: number,
  weight: WeightRegister | null | undefined,
  theme: ThemeRegister | null | undefined,
  grade: GradeRegister | null | undefined,
): BodyOwner {
  const owner: BodyOwner = { depth, order: nextOwnerOrder++ };
  if (weight !== undefined) owner.weight = weight;
  if (theme !== undefined) owner.theme = theme;
  if (grade !== undefined) owner.grade = grade;
  return owner;
}

function syncBodyAttributes() {
  if (typeof document === "undefined" || !document.body) return;

  if (!originalBodyAttributes) {
    originalBodyAttributes = {
      weight: document.body.getAttribute("data-weight"),
      theme: document.body.getAttribute("data-theme"),
      grade: document.body.getAttribute("data-grade"),
    };
  }

  const owners = [...bodyOwners.values()];
  for (const channel of ["weight", "theme", "grade"] as const) {
    const owner = owners
      .filter((candidate) => channel in candidate)
      .sort(
        (left, right) => left.depth - right.depth || left.order - right.order,
      )
      .at(-1);
    let value: string | null | undefined = owner?.[channel] as
      | string
      | null
      | undefined;

    if (value === undefined) value = originalBodyAttributes[channel];

    if (value === null || value === undefined) {
      document.body.removeAttribute(`data-${channel}`);
    } else {
      document.body.setAttribute(`data-${channel}`, value);
    }
  }

  if (runtimeMeta.env?.DEV && owners.length > 1 && !warnedAboutCompetition) {
    warnedAboutCompetition = true;
    console.warn(
      "[hyvui] multiple AppShell instances are competing for document-level appearance. Prefer scoped data attributes for nested compositions.",
    );
  } else if (owners.length <= 1) {
    warnedAboutCompetition = false;
  }
}

export function claimBodyAppearance(
  owner: symbol,
  depth: number,
  weight: WeightRegister | null | undefined,
  theme: ThemeRegister | null | undefined,
  grade: GradeRegister | null | undefined,
) {
  bodyOwners.set(owner, createBodyOwner(depth, weight, theme, grade));
  syncBodyAttributes();
}

export function releaseBodyAppearance(owner: symbol) {
  bodyOwners.delete(owner);
  if (bodyOwners.size === 0) {
    if (
      typeof document !== "undefined" &&
      document.body &&
      originalBodyAttributes
    ) {
      for (const channel of ["weight", "theme", "grade"] as const) {
        const value = originalBodyAttributes[channel];
        if (value === null) {
          document.body.removeAttribute(`data-${channel}`);
        } else {
          document.body.setAttribute(`data-${channel}`, value);
        }
      }
    }
    originalBodyAttributes = undefined;
    warnedAboutCompetition = false;
    return;
  }

  syncBodyAttributes();
}

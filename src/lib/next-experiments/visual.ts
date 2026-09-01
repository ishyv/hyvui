export type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type VisualRegion =
  | "upper-left"
  | "upper-right"
  | "lower-left"
  | "lower-right"
  | "center";

export type Nudge = { x: number; y: number };

function intersection(first: LayoutRect, second: LayoutRect): LayoutRect {
  const x = Math.max(first.x, second.x);
  const y = Math.max(first.y, second.y);
  const right = Math.min(first.x + first.width, second.x + second.width);
  const bottom = Math.min(first.y + first.height, second.y + second.height);

  return {
    x,
    y,
    width: Math.max(0, right - x),
    height: Math.max(0, bottom - y),
  };
}

export function getOverlapRatio(first: LayoutRect, second: LayoutRect): number {
  const shared = intersection(first, second);
  const sharedArea = shared.width * shared.height;
  const smallerArea = Math.min(
    first.width * first.height,
    second.width * second.height,
  );

  return smallerArea === 0 ? 0 : sharedArea / smallerArea;
}

export function resolveOverlapNudge(
  source: LayoutRect,
  target: LayoutRect,
  budget: number,
): Nudge {
  const safeBudget = Math.min(1, Math.max(0, budget));
  const shared = intersection(source, target);
  const currentRatio = getOverlapRatio(source, target);

  if (currentRatio <= safeBudget || shared.width === 0 || shared.height === 0) {
    return { x: 0, y: 0 };
  }

  const smallerArea = Math.min(
    source.width * source.height,
    target.width * target.height,
  );
  const excessArea = shared.width * shared.height - smallerArea * safeBudget;
  const sourceCenter = {
    x: source.x + source.width / 2,
    y: source.y + source.height / 2,
  };
  const targetCenter = {
    x: target.x + target.width / 2,
    y: target.y + target.height / 2,
  };
  const xDirection = sourceCenter.x < targetCenter.x ? -1 : 1;
  const yDirection = sourceCenter.y < targetCenter.y ? -1 : 1;
  const candidates: Nudge[] = [
    {
      x: xDirection * Math.ceil(excessArea / shared.height),
      y: 0,
    },
    {
      x: 0,
      y: yDirection * Math.ceil(excessArea / shared.width),
    },
  ];
  const valid = candidates.filter((candidate) => {
    const moved = {
      ...source,
      x: source.x + candidate.x,
      y: source.y + candidate.y,
    };
    return getOverlapRatio(moved, target) <= safeBudget;
  });

  return (valid.length ? valid : candidates).sort(
    (first, second) =>
      Math.abs(first.x) +
      Math.abs(first.y) -
      (Math.abs(second.x) + Math.abs(second.y)),
  )[0];
}

export function getRegion(
  node: LayoutRect,
  container: LayoutRect,
): VisualRegion {
  const centerX = (node.x + node.width / 2 - container.x) / container.width;
  const centerY = (node.y + node.height / 2 - container.y) / container.height;
  const horizontal =
    centerX < 0.4 ? "left" : centerX > 0.6 ? "right" : "center";
  const vertical = centerY < 0.4 ? "upper" : centerY > 0.6 ? "lower" : "center";

  if (horizontal === "center" || vertical === "center") return "center";
  return `${vertical}-${horizontal}` as VisualRegion;
}

export function resolveOverflowScale(
  node: LayoutRect,
  container: LayoutRect,
  padding = 24,
): number {
  if (node.width <= container.width && node.height <= container.height)
    return 1;

  const availableWidth = Math.max(1, container.width - padding * 2);
  const availableHeight = Math.max(1, container.height - padding * 2);
  return Number(
    Math.min(
      1,
      availableWidth / node.width,
      availableHeight / node.height,
    ).toFixed(2),
  );
}

export function overlapBudget(relation: string | undefined): number {
  if (relation === "edge") return 0.26;
  if (relation === "partial") return 0.42;
  if (relation === "deep" || relation === "field") return 1;
  return 0;
}

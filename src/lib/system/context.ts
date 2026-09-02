import {
  gradeRegisters,
  themeRegisters,
  weightRegisters,
  type GradeRegister,
  type ThemeRegister,
  type WeightRegister,
} from "../tokens/registers.generated.js";

export type AppearanceContext = {
  weight: WeightRegister | "default";
  theme: ThemeRegister | "default";
  grade: GradeRegister | "default";
};

export type AppearanceContextListener = (context: AppearanceContext) => void;

const weightSet = new Set<string>(weightRegisters);
const themeSet = new Set<string>(themeRegisters);
const gradeSet = new Set<string>(gradeRegisters);

type Subscription = {
  listener: AppearanceContextListener;
  last: AppearanceContext;
};

const subscriptions = new Map<Element, Set<Subscription>>();
let observer: MutationObserver | null = null;

function readValue<T extends string>(
  node: Element | null,
  attribute: string,
  allowed: Set<string>,
): T | "default" {
  let current = node;
  while (current) {
    const value = current.getAttribute(attribute);
    if (value && allowed.has(value)) return value as T;
    current = current.parentElement;
  }
  return "default";
}

function equalContext(a: AppearanceContext, b: AppearanceContext) {
  return a.weight === b.weight && a.theme === b.theme && a.grade === b.grade;
}

/** Resolve each appearance channel from the nearest ancestor that defines it. */
export function readAppearanceContext(
  node?: Element | null,
): AppearanceContext {
  if (typeof document === "undefined") {
    return { weight: "default", theme: "default", grade: "default" };
  }

  const root = node ?? document.body;
  return {
    weight: readValue<WeightRegister>(root, "data-weight", weightSet),
    theme: readValue<ThemeRegister>(root, "data-theme", themeSet),
    grade: readValue<GradeRegister>(root, "data-grade", gradeSet),
  };
}

function affected(subscriptionNode: Element, target: Node) {
  if (!(target instanceof Element)) return false;
  return (
    target === subscriptionNode ||
    target.contains(subscriptionNode) ||
    subscriptionNode.contains(target)
  );
}

function affectedByRecord(subscriptionNode: Element, record: MutationRecord) {
  if (affected(subscriptionNode, record.target)) return true;
  if (record.type !== "childList") return false;

  return [...record.addedNodes, ...record.removedNodes].some(
    (node) =>
      node === subscriptionNode ||
      (node instanceof Element && node.contains(subscriptionNode)),
  );
}

function notify(nodes?: Set<Element>) {
  for (const [node, nodeSubscriptions] of subscriptions) {
    if (nodes && !nodes.has(node)) continue;
    const next = readAppearanceContext(node);
    for (const subscription of nodeSubscriptions) {
      if (equalContext(subscription.last, next)) continue;
      subscription.last = next;
      subscription.listener(next);
    }
  }
}

function ensureObserver() {
  if (observer || typeof document === "undefined") return;

  observer = new MutationObserver((records) => {
    const nodes = new Set<Element>();

    for (const record of records) {
      for (const node of subscriptions.keys()) {
        if (affectedByRecord(node, record)) nodes.add(node);
      }
    }

    notify(nodes);
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-weight", "data-theme", "data-grade"],
    childList: true,
    subtree: true,
  });
}

/** Subscribe to context changes affecting a specific rendered element. */
export function onAppearanceChange(
  node: Element,
  listener: AppearanceContextListener,
): () => void {
  const subscription: Subscription = {
    listener,
    last: readAppearanceContext(node),
  };

  let nodeSubscriptions = subscriptions.get(node);
  if (!nodeSubscriptions) {
    nodeSubscriptions = new Set();
    subscriptions.set(node, nodeSubscriptions);
  }

  ensureObserver();
  nodeSubscriptions.add(subscription);
  listener(subscription.last);

  return () => {
    nodeSubscriptions?.delete(subscription);
    if (nodeSubscriptions?.size === 0) subscriptions.delete(node);
    if (subscriptions.size === 0) {
      observer?.disconnect();
      observer = null;
    }
  };
}

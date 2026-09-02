export type Cleanup = () => void;

type MediaQueryListLike = Pick<MediaQueryList, "matches"> & {
  addEventListener?: MediaQueryList["addEventListener"];
  removeEventListener?: MediaQueryList["removeEventListener"];
  addListener?: MediaQueryList["addListener"];
  removeListener?: MediaQueryList["removeListener"];
};

/** Read the current reduced-motion preference without touching browser globals during SSR. */
export function reducedMotionNow(): boolean {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

/** Subscribe to the user's reduced-motion preference without touching the DOM during SSR. */
export function onReducedMotionChange(
  listener: (reduced: boolean) => void,
): Cleanup {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    listener(false);
    return () => undefined;
  }

  const media = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ) as MediaQueryListLike;
  const notify = () => listener(media.matches);
  notify();

  if (media.addEventListener) {
    media.addEventListener("change", notify);
    return () => media.removeEventListener?.("change", notify);
  }

  media.addListener?.(notify);
  return () => media.removeListener?.(notify);
}

/** Subscribe to document visibility. `true` means the document may do work. */
export function onDocumentVisibilityChange(
  listener: (visible: boolean) => void,
): Cleanup {
  if (typeof document === "undefined") {
    listener(true);
    return () => undefined;
  }

  const notify = () => listener(!document.hidden);
  notify();
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}

/** Observe whether an effect's root intersects the viewport. */
export function onIntersectionChange(
  node: Element,
  listener: (visible: boolean) => void,
  options?: IntersectionObserverInit,
): Cleanup {
  if (typeof IntersectionObserver === "undefined") {
    listener(true);
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    ([entry]) => listener(entry?.isIntersecting ?? false),
    options,
  );
  observer.observe(node);
  return () => observer.disconnect();
}

let geometryFrame = 0;
const geometryJobs = new Set<() => void>();

/**
 * Batch geometry reads/writes into one frame. Jobs are one-shot and can be
 * cancelled, which keeps ResizeObserver callbacks from cascading layout work.
 */
export function scheduleGeometry(job: () => void): Cleanup {
  if (typeof window === "undefined") return () => undefined;

  geometryJobs.add(job);
  if (!geometryFrame) {
    geometryFrame = window.requestAnimationFrame(() => {
      geometryFrame = 0;
      const pending = [...geometryJobs];
      geometryJobs.clear();
      for (const pendingJob of pending) pendingJob();
    });
  }

  return () => {
    geometryJobs.delete(job);
    if (geometryJobs.size === 0 && geometryFrame) {
      window.cancelAnimationFrame(geometryFrame);
      geometryFrame = 0;
    }
  };
}

export type FrameLoop = {
  setEnabled(enabled: boolean): void;
  start(): void;
  stop(): void;
  destroy(): void;
};

/**
 * A cancellable RAF loop that pauses when hidden, off-screen, or reduced-motion
 * is active. The callback is never scheduled before the browser exists.
 */
export function createFrameLoop(
  root: Element | null,
  callback: (time: number) => void,
  options: { enabled?: boolean } = {},
): FrameLoop {
  let enabled = options.enabled ?? true;
  let reduced = false;
  let documentVisible = true;
  let viewportVisible = true;
  let frame = 0;
  let destroyed = false;

  const shouldRun = () =>
    !destroyed && enabled && !reduced && documentVisible && viewportVisible;

  const stop = () => {
    if (!frame || typeof window === "undefined") return;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const tick = (time: number) => {
    frame = 0;
    if (!shouldRun()) return;
    callback(time);
    if (shouldRun()) frame = window.requestAnimationFrame(tick);
  };

  const sync = () => {
    if (shouldRun()) {
      if (!frame) frame = window.requestAnimationFrame(tick);
    } else {
      stop();
    }
  };

  const cleanups: Cleanup[] = [
    onReducedMotionChange((value) => {
      reduced = value;
      sync();
    }),
    onDocumentVisibilityChange((value) => {
      documentVisible = value;
      sync();
    }),
  ];

  if (root) {
    cleanups.push(
      onIntersectionChange(root, (value) => {
        viewportVisible = value;
        sync();
      }),
    );
  }

  sync();

  return {
    setEnabled(value) {
      enabled = value;
      sync();
    },
    start() {
      enabled = true;
      sync();
    },
    stop() {
      enabled = false;
      stop();
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stop();
      for (const cleanup of cleanups) cleanup();
    },
  };
}

export type CanvasResolution = {
  cssWidth: number;
  cssHeight: number;
  scale: number;
  width: number;
  height: number;
  changed: boolean;
};

/**
 * Size a canvas backing store from CSS pixels. DPR is capped at 2 and the
 * total backing surface is capped so a decorative effect cannot allocate an
 * unbounded bitmap on a large display or a 3x stress device.
 */
export function resizeCanvasBackingStore(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  cssWidth: number,
  cssHeight: number,
  devicePixelRatio = typeof window === "undefined"
    ? 1
    : window.devicePixelRatio,
  maxPixels = 8_000_000,
): CanvasResolution {
  const safeWidth = Math.max(0, cssWidth);
  const safeHeight = Math.max(0, cssHeight);
  const requestedScale = Math.min(Math.max(devicePixelRatio || 1, 1), 2);
  const area = safeWidth * safeHeight;
  const scale =
    area > 0
      ? Math.min(requestedScale, Math.sqrt(maxPixels / area))
      : requestedScale;
  const width = Math.max(1, Math.round(safeWidth * scale));
  const height = Math.max(1, Math.round(safeHeight * scale));
  const changed = canvas.width !== width || canvas.height !== height;

  if (changed) {
    canvas.width = width;
    canvas.height = height;
  }
  context.setTransform(scale, 0, 0, scale, 0, 0);

  return {
    cssWidth: safeWidth,
    cssHeight: safeHeight,
    scale,
    width,
    height,
    changed,
  };
}

/** Resolve a semantic color from the nearest appearance context root. */
export function readSemanticColor(
  node: Element,
  name: string,
  fallback: string,
): string {
  if (typeof window === "undefined") return fallback;
  const value = window.getComputedStyle(node).getPropertyValue(name).trim();
  return value || fallback;
}

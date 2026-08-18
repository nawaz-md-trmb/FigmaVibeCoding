// @ts-nocheck
import './resizable-card.css';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcProgress,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";

const PATTERN_DEFAULT_MIN_W = 240;
const PATTERN_DEFAULT_MIN_H = 160;

const DEFAULT_COLUMN_SNAP_SELECTOR = "[data-column-snap-grid]";

/** Past this fraction of the gap from snap A toward snap B, we commit to B (wider column). */
const COLUMN_SNAP_COMMIT_RATIO = 0.25;

/** modus-wc-button: borderless tertiary icon-only controls (default variant is filled). */
const RESIZABLE_CARD_CHROME_BUTTON_PROPS = {
  variant: "borderless" as const,
  color: "tertiary" as const,
  shape: "square" as const,
  size: "xs" as const,
  type: "button" as const,
};

function parseGridTrackPx(token: string): number {
  const t = token.trim();
  const px = /^([\d.]+)px$/i.exec(t);
  if (px) return parseFloat(px[1]);
  return Number.NaN;
}

const SNAP_COL_COUNT_ATTR = "data-snap-column-count";
/** When set on the snap grid with {@link SNAP_COL_COUNT_ATTR}="3", inserts half-column snap widths (1 + 1.5 + 2 + 3 logical cols → 50/50 pair). */
const SNAP_HALF_COLUMNS_ATTR = "data-snap-half-columns";

/** Supported column snap spans; 1.5 = half of a 3-col row (pairs with another 1.5). */
export type ColumnSnapSpan = 1 | 1.5 | 2 | 3;

function snapNumeric(s: ColumnSnapSpan): number {
  return s === 1.5 ? 1.5 : s;
}

function compareSnapSpan(a: ColumnSnapSpan, b: ColumnSnapSpan): number {
  return snapNumeric(a) - snapNumeric(b);
}

function clampSpanToAllowList(
  span: ColumnSnapSpan,
  allowed?: ColumnSnapSpan[],
): ColumnSnapSpan {
  if (!allowed || allowed.length === 0) return span;
  const n = snapNumeric(span);
  let best: ColumnSnapSpan | null = null;
  let bestN = -Infinity;
  for (const s of allowed) {
    const sn = snapNumeric(s);
    if (sn <= n && sn > bestN) {
      best = s;
      bestN = sn;
    }
  }
  return best ?? allowed[0]!;
}

function isValidColumnSnapSpan(s: number): s is ColumnSnapSpan {
  return s === 1 || s === 1.5 || s === 2 || s === 3;
}

/** Span label for cumulative width step `index` (0-based) for this target list length. */
function spanForTargetIndex(
  index: number,
  targetCount: number,
): ColumnSnapSpan {
  if (targetCount === 4) {
    const ladder: ColumnSnapSpan[] = [1, 1.5, 2, 3];
    return ladder[Math.min(Math.max(0, index), 3)]!;
  }
  if (targetCount === 3) {
    const ladder: ColumnSnapSpan[] = [1, 2, 3];
    return ladder[Math.min(Math.max(0, index), 2)]!;
  }
  if (targetCount === 2) {
    return index <= 0 ? 1 : 2;
  }
  return 1;
}

export function snapSpanToTargetIndex(
  span: ColumnSnapSpan,
  targetCount: number,
): number {
  if (targetCount === 4) {
    if (span === 1) return 0;
    if (span === 1.5) return 1;
    if (span === 2) return 2;
    return 3;
  }
  if (targetCount === 3) {
    if (span === 1) return 0;
    if (span === 2) return 1;
    return 2;
  }
  if (targetCount === 2) {
    return span === 1 ? 0 : 1;
  }
  return 0;
}

/** Cumulative width at the full 2-column step (for pack squeeze), given 3 or 4 snap targets. */
function twoColFullSnapThreshold(targets: number[]): number {
  if (targets.length >= 4) return targets[2]!;
  if (targets.length >= 2) return targets[1]!;
  return targets[0] ?? 0;
}

/** Horizontal gap between flex columns (row-gap vs column-gap aware). */
function readHorizontalGapPx(style: CSSStyleDeclaration): number {
  const cg = style.columnGap;
  if (cg && cg !== "normal") {
    const n = parseFloat(cg);
    if (Number.isFinite(n)) return n;
  }
  const g = (style.gap || "").trim();
  if (!g || g === "normal") return 0;
  const parts = g.split(/\s+/);
  if (parts.length >= 2) {
    const n = parseFloat(parts[1]!);
    if (Number.isFinite(n)) return n;
  }
  const n = parseFloat(parts[0]!);
  return Number.isFinite(n) ? n : 0;
}

function innerContentWidthPx(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const pl = parseFloat(style.paddingLeft) || 0;
  const pr = parseFloat(style.paddingRight) || 0;
  return Math.max(0, rect.width - pl - pr);
}

/**
 * Use the horizontal flex row that contains the card so W and gap match slot layout. The snap
 * grid ancestor is often a vertical stack (wrong width vs padded content, wrong gap = row spacing).
 */
function snapMeasureBox(
  grid: HTMLElement,
  measureFrom?: HTMLElement | null,
): HTMLElement {
  const row = measureFrom?.closest(".widgets-dashboard-row");
  return (row as HTMLElement | null) ?? grid;
}

function findResizableCardRoot(
  event: React.PointerEvent<HTMLElement>,
  refRoot: HTMLDivElement | null,
): HTMLElement | null {
  if (refRoot?.isConnected) {
    return refRoot;
  }
  const ct = event.currentTarget;
  if (ct instanceof HTMLElement) {
    const fromClosest = ct.closest("[data-resizable-card]");
    if (fromClosest) return fromClosest;
  }
  for (const n of event.nativeEvent.composedPath()) {
    if (n instanceof HTMLElement && n.matches("[data-resizable-card]")) {
      return n;
    }
  }
  return null;
}

/**
 * Cumulative widths for 1…N columns: one track, two tracks + gap, … full row.
 * When the grid has {@link SNAP_COL_COUNT_ATTR}, widths are derived from the grid's
 * full inner width so snapping stays on a fixed column system even if
 * `grid-template-columns` is 1 or 2 tracks on small breakpoints.
 *
 * @param measureFrom Optional element (e.g. card root) used to find `.widgets-dashboard-row` so
 *                    virtual column math uses the row's inner width and horizontal gap.
 */
export function getGridColumnSnapTargets(
  grid: HTMLElement,
  measureFrom?: HTMLElement | null,
): number[] {
  const virtual = grid.getAttribute(SNAP_COL_COUNT_ATTR);
  const colCount = virtual ? parseInt(virtual, 10) : NaN;

  const box = snapMeasureBox(grid, measureFrom);
  const style = getComputedStyle(box);
  const gap = readHorizontalGapPx(style);
  const W = innerContentWidthPx(box);

  const halfAttr = grid.getAttribute(SNAP_HALF_COLUMNS_ATTR);
  const halfSteps =
    grid.hasAttribute(SNAP_HALF_COLUMNS_ATTR) && halfAttr !== "false";

  if (Number.isFinite(colCount) && colCount >= 1 && W > 0) {
    if (colCount === 1) return [W];
    const t = (W - (colCount - 1) * gap) / colCount;
    if (colCount === 3 && halfSteps) {
      const t1 = t;
      const t1_5 = 1.5 * t + 0.5 * gap;
      const t2 = 2 * t + gap;
      const t3 = 3 * t + 2 * gap;
      return [t1, t1_5, t2, t3];
    }
    const targets: number[] = [];
    let sum = 0;
    for (let i = 0; i < colCount; i++) {
      if (i > 0) sum += gap;
      sum += t;
      targets.push(sum);
    }
    return targets;
  }

  const raw = style.gridTemplateColumns;
  if (!raw || raw === "none") return W > 0 ? [W] : [];

  const parts = raw.split(/\s+/).filter(Boolean);
  const trackWidths = parts
    .map(parseGridTrackPx)
    .filter((n) => !Number.isNaN(n) && n > 0);

  if (trackWidths.length === 0) {
    return W > 0 ? [W] : [];
  }

  const targets: number[] = [];
  let sum = 0;
  for (let i = 0; i < trackWidths.length; i++) {
    if (i > 0) sum += gap;
    sum += trackWidths[i];
    targets.push(sum);
  }
  return targets;
}

/**
 * Snap release width to an allowed target: within each interval [low, high], commit to `high`
 * once width is at or past `low + COLUMN_SNAP_COMMIT_RATIO * (high - low)` (generous vs nearest-pixel).
 */
function snapWidthToTargetsWithCommitRatio(
  widthPx: number,
  sortedPool: number[],
  minWidth: number,
): number {
  const w = Math.max(minWidth, widthPx);
  const t = [...sortedPool].sort((a, b) => a - b).filter((x) => Number.isFinite(x));
  if (t.length === 0) return Math.max(minWidth, w);
  if (t.length === 1) {
    return Math.max(minWidth, t[0]);
  }
  if (w <= t[0]) return Math.max(minWidth, t[0]);
  const tMax = t[t.length - 1];
  if (w >= tMax) return Math.max(minWidth, tMax);

  for (let i = 0; i < t.length - 1; i++) {
    const low = t[i];
    const high = t[i + 1];
    if (w <= high) {
      const boundary = low + COLUMN_SNAP_COMMIT_RATIO * (high - low);
      const chosen = w < boundary ? low : high;
      /*
       * Do not Math.round(chosen): rounding the 1.5 cumulative target up can push width past the
       * resolve() commit boundary into span-2; with pack squeeze that becomes reported span 1.
       */
      return Math.max(minWidth, chosen);
    }
  }
  return Math.max(minWidth, tMax);
}

function snapWidthToColumnTargets(
  widthPx: number,
  targets: number[],
  minWidth: number,
  allowedSpans?: ColumnSnapSpan[],
): number {
  if (targets.length === 0) return Math.max(minWidth, Math.round(widthPx));

  let pool = targets;
  if (allowedSpans != null && allowedSpans.length > 0) {
    const filtered = allowedSpans
      .map((s) => targets[snapSpanToTargetIndex(s, targets.length)])
      .filter((t): t is number => typeof t === "number" && !Number.isNaN(t));
    if (filtered.length > 0) pool = filtered;
  }

  /*
   * Always snap against the full ladder (same geometry as resolveColumnSpanToFitWidth during drag).
   * Filtering targets with `t >= minWidth` drops the 1.5 step when it is narrower than minWidth but
   * drag still used it — release then snaps only 1↔2 and collapses back to 1 col.
   */
  return snapWidthToTargetsWithCommitRatio(widthPx, pool, minWidth);
}

/**
 * Column span from width using the same commit zones as release snap: between cumulative
 * targets T[i] and T[i+1], span promotes once width crosses the ratio boundary.
 */
export function resolveColumnSpanToFitWidth(
  widthPx: number,
  targets: number[],
  minWidth: number,
): ColumnSnapSpan {
  const w = Math.max(minWidth, widthPx);
  if (targets.length === 0) return 1;
  if (targets.length === 1) return 1;

  for (let i = 0; i < targets.length - 1; i++) {
    const low = targets[i]!;
    const high = targets[i + 1]!;
    const boundary = low + COLUMN_SNAP_COMMIT_RATIO * (high - low);
    if (w < boundary) {
      return spanForTargetIndex(i, targets.length);
    }
  }
  return spanForTargetIndex(targets.length - 1, targets.length);
}

/**
 * Max width while dragging at a given reported span: allow growth through the commit zone toward
 * the *next* cumulative snap (e.g. span 1 may render up to the 1.5-col target before resolve promotes).
 * Capping at `targets[idx]` pins the shell to the current step and blocks smooth squeeze of siblings.
 */
function clampDragWidthToNextSnapCeiling(
  widthPx: number,
  span: ColumnSnapSpan,
  targets: number[],
  minWidth: number,
): number {
  const w = Math.max(minWidth, widthPx);
  if (targets.length === 0) return w;
  const idx = snapSpanToTargetIndex(span, targets.length);
  const upperIdx = Math.min(idx + 1, targets.length - 1);
  return Math.min(w, targets[upperIdx]!);
}

/**
 * Pack-row squeeze: defer *reported* span 2 until width reaches the full 2-col snap (`twoColFullSnapThreshold`).
 * With a 3-step ladder, map pending span 2 → 1. With a 4-step half-column ladder, map → 1.5 once
 * width is past the 1.5 snap (`targets[1]`); otherwise 2→1 plus clamp-at-span-1 would cap at 1 col and
 * make the 1.5 snap unreachable while resizing.
 */
function applyPackRowSqueezeToReportedSpan(
  span: ColumnSnapSpan,
  widthPx: number,
  targets: number[],
  squeezeActive: boolean,
): ColumnSnapSpan {
  if (!squeezeActive || span !== 2 || targets.length < 2) {
    return span;
  }
  const t2 = twoColFullSnapThreshold(targets);
  if (widthPx >= t2) {
    return span;
  }
  if (targets.length >= 4) {
    const t15 = targets[1]!;
    if (widthPx + 0.5 >= t15) {
      return 1.5;
    }
  }
  return 1;
}

/**
 * 4-target (half-column) ladder: span can promote to 1.5 as soon as width crosses the early commit band
 * from 1-col. Hold reported / pack-layout span at 1 until width reaches the full 1.5-col cumulative snap
 * (`targets[1]`) so paired cards do not switch to half-row layout while the pivot is still short of half width.
 */
function deferReportedSpan15UntilFullSnap(
  span: ColumnSnapSpan,
  widthPx: number,
  targets: number[],
): ColumnSnapSpan {
  if (targets.length < 4 || span !== 1.5) return span;
  const t15 = targets[1]!;
  if (widthPx + 0.5 < t15) return 1;
  return span;
}

/** Live drag: clamp width to span caps; optional pack-row squeeze delays span 2 so flex can shrink siblings first. */
function resolveDragWidthForSnapGrid(
  rawW: number,
  targets: number[],
  minWidth: number,
  allowed?: ColumnSnapSpan[],
  packSqueeze?: { enabled: boolean; packSpan?: ColumnSnapSpan },
): { widthPx: number; span: ColumnSnapSpan } {
  let span = resolveColumnSpanToFitWidth(rawW, targets, minWidth);
  const squeezeActive =
    Boolean(packSqueeze?.enabled) &&
    packSqueeze?.packSpan != null &&
    snapNumeric(packSqueeze.packSpan) <= 1;
  span = applyPackRowSqueezeToReportedSpan(span, rawW, targets, squeezeActive);
  span = clampSpanToAllowList(span, allowed);
  const widthPx = clampDragWidthToNextSnapCeiling(rawW, span, targets, minWidth);
  span = deferReportedSpan15UntilFullSnap(span, widthPx, targets);
  return { widthPx, span };
}

/** Parent span for a committed pixel width (release snap + pack squeeze + allow list). */
function computeReportedColumnSpan(
  widthPx: number,
  grid: HTMLElement,
  minWidth: number,
  columnSnapAllow?: ColumnSnapSpan[],
  packSpan?: ColumnSnapSpan,
  columnSnapPackSqueeze?: boolean,
  measureFrom?: HTMLElement | null,
): ColumnSnapSpan | null {
  const targets = getGridColumnSnapTargets(grid, measureFrom);
  if (targets.length === 0) return null;
  let span = resolveColumnSpanToFitWidth(widthPx, targets, minWidth);
  const squeezeActive =
    Boolean(columnSnapPackSqueeze) &&
    packSpan != null &&
    snapNumeric(packSpan) <= 1;
  span = applyPackRowSqueezeToReportedSpan(
    span,
    widthPx,
    targets,
    squeezeActive,
  );
  span = clampSpanToAllowList(span, columnSnapAllow);
  return span;
}

/**
 * True when `el` sits in the first non-gap `.widgets-dnd-slot` of a pack row (leftmost widget). Used to
 * defer 1.5 *pack* layout so a widening first card keeps three-across flex squeeze on siblings; middle
 * slots skip defer so neighbors pick up 1.5 flex in sync with the shell (see computeLayoutPackColumnSpan).
 */
function isFirstWidgetPackSlotInRow(el: HTMLElement | null | undefined): boolean {
  if (!el) return false;
  const row = el.closest(".widgets-dashboard-row--pack-grid");
  const slot = el.closest(".widgets-dnd-slot");
  if (!row || !slot || !slot.classList.contains("widgets-dnd-slot")) {
    return false;
  }
  const first = row.querySelector(
    ":scope > .widgets-dnd-slot:not(.widgets-dnd-gap)",
  );
  return first === slot;
}

/**
 * Column span from live width only (no pack squeeze). Use so parents can repack rows during drag while
 * {@link onColumnSpanChange} still reports the squeezed span for flex-shrink behavior.
 */
function computeLayoutPackColumnSpan(
  widthPx: number,
  grid: HTMLElement,
  minWidth: number,
  columnSnapAllow?: ColumnSnapSpan[],
  measureFrom?: HTMLElement | null,
): ColumnSnapSpan | null {
  const targets = getGridColumnSnapTargets(grid, measureFrom);
  if (targets.length === 0) return null;
  let span = resolveColumnSpanToFitWidth(widthPx, targets, minWidth);
  span = clampSpanToAllowList(span, columnSnapAllow);
  if (isFirstWidgetPackSlotInRow(measureFrom ?? null)) {
    span = deferReportedSpan15UntilFullSnap(span, widthPx, targets);
  }
  /*
   * Resolve can stay at 1.5 until the commit band into 2-col, while the live shell is already wider than
   * the full half-row snap (targets[1]). Packing 1.5+1.5 then fights the pixel-sized pivot and wraps;
   * lay out as 2+1 so the neighbor slot can shrink (flex 1) to fit the same row.
   */
  if (targets.length >= 4 && span === 1.5) {
    const t15 = targets[1]!;
    if (widthPx > t15 + 0.5) {
      span = 2;
    }
  }
  return span;
}

export interface ResizableModusCardShellGridDragProps {
  onDragStart: React.DragEventHandler<HTMLDivElement>;
  onDragEnd?: React.DragEventHandler<HTMLDivElement>;
}

export interface ResizableModusCardShellProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  /** Appended to ModusWcCard customClass (e.g. overflow-hidden p-0) */
  cardCustomClass?: string;
  /** Extra classes on the outer [data-resizable-card] wrapper */
  className?: string;
  /**
   * When true, width and height default to 100% of the grid/flex parent (original dashboard layout).
   * After the user drags the resize handle, size switches to pixels until changed again.
   */
  fillGridCell?: boolean;
  /**
   * Upper-left move handle: enables HTML drag only after pointer-down on the handle
   * (so resize and card content stay usable). Wire drop targets in the parent grid.
   */
  gridDrag?: ResizableModusCardShellGridDragProps;
  /**
   * After each resize gesture, snap width to cumulative column steps on the nearest ancestor matching
   * {@link columnSnapSelector}. Uses a fractional commit zone between steps (same as live span) so
   * crossing part of the gap toward the next column accepts that size.
   */
  columnSnapToGrid?: boolean;
  /** Ancestor selector for the grid used to measure columns; default `[data-column-snap-grid]`. */
  columnSnapSelector?: string;
  /**
   * Restrict which snap steps are used (1 / 1.5 / 2 / 3 when the grid has `data-snap-half-columns`).
   * Omit to use all steps from {@link getGridColumnSnapTargets}.
   */
  columnSnapAllow?: ColumnSnapSpan[];
  /**
   * In a horizontal flex row, keep `height: auto` and use the resized value as `min-height` so
   * `align-items: stretch` makes every card match the tallest in the row (requires `fillGridCell`).
   */
  matchRowHeight?: boolean;
  /**
   * With `fillGridCell`, fallback span for auto width sync when {@link packSpan} is unset. Also the
   * bootstrap span before the parent passes `packSpan`. After a user resize, auto-updates stop until
   * reset via `userSizedWidthRef` behavior in the shell.
   */
  defaultColumnSpan?: ColumnSnapSpan;
  /**
   * Current logical column span from the parent (e.g. `columnSpans[id]`). When set, drives auto
   * width sync instead of `defaultColumnSpan` so partners updated by half-row sync keep matching px
   * targets without binding `defaultColumnSpan` to live state (which can cause update loops).
   * With {@link columnSnapPackSqueeze}, span can lag visual width during drag.
   */
  packSpan?: ColumnSnapSpan;
  /**
   * When true with `packSpan` ≤ 1, defer *reported* span 2 until width reaches the full 2-col snap
   * (`targets[1]`). While width is in the pre–2-col commit zone but still below that, the card can grow
   * wider while the parent still sees span 1 so siblings can flex-shrink.
   */
  columnSnapPackSqueeze?: boolean;
  /**
   * When `fillGridCell` and width is known (px), reports the minimum column span that fits the width
   * (updates during resize drag so grid tracks expand before the card overflows).
   */
  onColumnSpanChange?: (span: ColumnSnapSpan) => void;
  /**
   * Width-derived column span for **row packing only** (no pack squeeze). Fired on resize pointer-down
   * and move while `columnSnapToGrid` is set; `null` on pointer-up/cancel so parents can clear overrides.
   */
  onPackLayoutSpanChange?: (span: ColumnSnapSpan | null) => void;
}

type DimState = { widthPx: number | null; heightPx: number | null };

/**
 * Reusable shell: Modus Card with bottom-left lock and bottom-right resize handle.
 * Children are slotted content for the card (title slot, body, etc.).
 */
export function ResizableModusCardShell({
  children,
  initialWidth = 320,
  initialHeight = 220,
  minWidth = PATTERN_DEFAULT_MIN_W,
  minHeight = PATTERN_DEFAULT_MIN_H,
  cardCustomClass = "",
  className = "",
  fillGridCell = false,
  gridDrag,
  columnSnapToGrid = false,
  columnSnapSelector = DEFAULT_COLUMN_SNAP_SELECTOR,
  columnSnapAllow,
  matchRowHeight = false,
  defaultColumnSpan,
  packSpan,
  columnSnapPackSqueeze = false,
  onColumnSpanChange,
  onPackLayoutSpanChange,
}: ResizableModusCardShellProps) {
  const [dragEnabled, setDragEnabled] = useState(false);
  const dragArmRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  /** Skips auto layout setState when span + rounded snap width already applied (avoids ResizeObserver storms). */
  const lastAutoLayoutWidthRef = useRef<{
    spanKey: number;
    w: number;
  } | null>(null);
  const userSizedWidthRef = useRef(false);
  const onColumnSpanChangeRef = useRef(onColumnSpanChange);
  onColumnSpanChangeRef.current = onColumnSpanChange;
  const onPackLayoutSpanChangeRef = useRef(onPackLayoutSpanChange);
  onPackLayoutSpanChangeRef.current = onPackLayoutSpanChange;
  const [dimensions, setDimensions] = useState<DimState>(() =>
    fillGridCell
      ? { widthPx: null, heightPx: null }
      : { widthPx: initialWidth, heightPx: initialHeight },
  );
  const [sizeLocked, setSizeLocked] = useState(false);
  /** While dragging resize with grid snap, show live px width; on release width comes from the grid again. */
  const [resizeWidthPreviewActive, setResizeWidthPreviewActive] = useState(false);
  const resizeWidthPreviewActiveRef = useRef(false);
  resizeWidthPreviewActiveRef.current = resizeWidthPreviewActive;

  /** Snap-to-grid width sync: read fresh each render for {@link useLayoutEffect} + window resize. */
  const autoGridWidthApplyRef = useRef<() => void>(() => {});
  autoGridWidthApplyRef.current = () => {
    if (!fillGridCell) return;
    const span =
      packSpan != null && isValidColumnSnapSpan(packSpan)
        ? packSpan
        : defaultColumnSpan;
    if (span == null || !isValidColumnSnapSpan(span)) return;

    const el = rootRef.current;
    if (!el) return;

    const grid = el.closest(columnSnapSelector) as HTMLElement | null;
    if (!grid) return;

    const spanKey = snapNumeric(span);

    if (userSizedWidthRef.current) return;
    if (resizeWidthPreviewActiveRef.current) return;
    const targets = getGridColumnSnapTargets(grid, el);
    if (targets.length === 0) return;
    const effectiveIdx = snapSpanToTargetIndex(span, targets.length);
    const wNext = Math.round(Math.max(minWidth, targets[effectiveIdx]!));
    const last = lastAutoLayoutWidthRef.current;
    if (last && last.spanKey === spanKey && last.w === wNext) {
      return;
    }
    lastAutoLayoutWidthRef.current = { spanKey, w: wNext };
    setDimensions((prev) => {
      if (prev.widthPx === wNext) {
        return prev;
      }
      return { ...prev, widthPx: wNext };
    });
  };

  const handleResizePointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (sizeLocked) return;
      event.preventDefault();
      event.stopPropagation();

      const root = findResizableCardRoot(event, rootRef.current);
      const rect = root?.getBoundingClientRect();
      const measuredW = rect?.width ?? 0;
      const measuredH = rect?.height ?? 0;
      /*
       * Prefer the laid-out width/height from the DOM. With column snap + fill grid, visible width
       * often comes from flex/span while `dimensions.widthPx` can stay stale (previous expand) because
       * inline width is only applied during live preview — using state here causes a jump on the next drag.
       */
      const startW = Math.max(
        minWidth,
        measuredW > 0 ? measuredW : (dimensions.widthPx ?? minWidth),
      );
      const startH = Math.max(
        minHeight,
        measuredH > 0 ? measuredH : (dimensions.heightPx ?? minHeight),
      );

      const startX = event.clientX;
      const startY = event.clientY;

      const dragDimsRef = {
        w: startW,
        h: startH,
      };

      if (fillGridCell && columnSnapToGrid) {
        userSizedWidthRef.current = true;
      }

      setResizeWidthPreviewActive(true);
      setDimensions((prev) => ({ ...prev, widthPx: startW }));

      if (columnSnapToGrid && root && onPackLayoutSpanChangeRef.current) {
        const grid = root.closest(columnSnapSelector) as HTMLElement | null;
        if (grid) {
          const layoutSpan = computeLayoutPackColumnSpan(
            startW,
            grid,
            minWidth,
            columnSnapAllow,
            root,
          );
          if (layoutSpan != null) {
            onPackLayoutSpanChangeRef.current(layoutSpan);
          }
        }
      }

      const onMove = (moveEvent: PointerEvent) => {
        let nextW = Math.max(minWidth, startW + moveEvent.clientX - startX);
        dragDimsRef.h = Math.max(
          minHeight,
          startH + moveEvent.clientY - startY,
        );
        if (columnSnapToGrid && root) {
          const grid = root.closest(columnSnapSelector) as HTMLElement | null;
          if (grid) {
            const targets = getGridColumnSnapTargets(grid, root);
            if (targets.length > 0) {
              const { widthPx, span } = resolveDragWidthForSnapGrid(
                nextW,
                targets,
                minWidth,
                columnSnapAllow,
                columnSnapPackSqueeze
                  ? { enabled: true, packSpan }
                  : undefined,
              );
              nextW = widthPx;
              onColumnSpanChangeRef.current?.(span);
              const layoutSpan = computeLayoutPackColumnSpan(
                nextW,
                grid,
                minWidth,
                columnSnapAllow,
                root,
              );
              if (layoutSpan != null) {
                onPackLayoutSpanChangeRef.current?.(layoutSpan);
              }
            }
          }
        }
        dragDimsRef.w = nextW;
        setDimensions({
          widthPx: dragDimsRef.w,
          heightPx: dragDimsRef.h,
        });
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);

        let nextW = dragDimsRef.w;
        if (columnSnapToGrid && root) {
          const grid = root.closest(columnSnapSelector) as HTMLElement | null;
          if (grid) {
            const targets = getGridColumnSnapTargets(grid, root);
            nextW = snapWidthToColumnTargets(
              nextW,
              targets,
              minWidth,
              columnSnapAllow,
            );
            const span = computeReportedColumnSpan(
              nextW,
              grid,
              minWidth,
              columnSnapAllow,
              packSpan,
              columnSnapPackSqueeze,
              root,
            );
            if (span != null) {
              onColumnSpanChangeRef.current?.(span);
            }
          }
        }
        userSizedWidthRef.current = true;
        onPackLayoutSpanChangeRef.current?.(null);
        setResizeWidthPreviewActive(false);
        setDimensions({
          widthPx: nextW,
          heightPx: dragDimsRef.h,
        });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
    },
    [
      dimensions.heightPx,
      dimensions.widthPx,
      fillGridCell,
      minHeight,
      minWidth,
      sizeLocked,
      columnSnapToGrid,
      columnSnapSelector,
      columnSnapAllow,
      columnSnapPackSqueeze,
      packSpan,
    ],
  );

  /** Grid column span defines width; inline px width would leave dead space in the cell and break gutters. */
  const shellWidthFromGrid = fillGridCell && columnSnapToGrid;
  /**
   * `data-pixel-sized` drives parent slot CSS (`flex: 0 0 auto`). Under grid fill we still store
   * `dimensions.widthPx` for snap bookkeeping while flex + `data-col-span` define layout; marking
   * pixel-sized in that case makes the slot ignore span ratios and size to intrinsic width (e.g. a
   * 2-col min width beside a 1.5 gap after drop).
   */
  const pixelSized =
    dimensions.widthPx != null &&
    (!shellWidthFromGrid ||
      resizeWidthPreviewActive ||
      userSizedWidthRef.current);
  const previewShellPxWidth =
    shellWidthFromGrid && resizeWidthPreviewActive;

  const cardClasses = [
    "resizable-card-pattern__card",
    "!h-full",
    "!w-full",
    "min-h-0",
    "min-w-0",
    fillGridCell ? "flex-1" : "",
    cardCustomClass,
  ]
    .filter(Boolean)
    .join(" ");

  const frameClass = fillGridCell
    ? "resizable-card-pattern__frame relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-visible"
    : "resizable-card-pattern__frame relative flex h-full min-h-0 min-w-0 w-full flex-col overflow-visible";

  const wrapperClass = fillGridCell
    ? [
        "resizable-card-pattern relative min-w-0 flex flex-col min-h-0 self-stretch",
        pixelSized && !shellWidthFromGrid
          ? "w-auto max-w-none shrink-0"
          : previewShellPxWidth
            ? "w-auto max-w-none shrink-0"
            : "w-full flex-1 max-w-full",
        className,
      ]
        .filter(Boolean)
        .join(" ")
    : `resizable-card-pattern relative inline-block max-w-full min-w-0 align-top ${className}`.trim();

  const shellStyle: React.CSSProperties = {
    boxSizing: "border-box",
    minWidth,
  };
  if (!pixelSized || (shellWidthFromGrid && !resizeWidthPreviewActive)) {
    shellStyle.maxWidth = "100%";
  }
  if (
    dimensions.widthPx != null &&
    (!shellWidthFromGrid || resizeWidthPreviewActive)
  ) {
    shellStyle.width = dimensions.widthPx;
  }
  if (matchRowHeight && fillGridCell) {
    shellStyle.height = "auto";
    shellStyle.minHeight =
      dimensions.heightPx != null ? dimensions.heightPx : initialHeight;
  } else {
    if (dimensions.heightPx != null) {
      shellStyle.height = dimensions.heightPx;
    }
    if (fillGridCell && dimensions.heightPx == null) {
      shellStyle.minHeight = initialHeight;
    }
  }

  const handleGridDragStart = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (event) => {
      if (!gridDrag) return;
      dragArmRef.current = false;
      const el = rootRef.current;
      const dt = event.dataTransfer;
      /*
       * Default drag bitmap often ignores overflow/clip and mats transparency to white at the corners.
       * Re-pin the drag image to this node after layout so clip-path + shell background from CSS apply.
       */
      if (
        fillGridCell &&
        el &&
        dt &&
        typeof dt.setDragImage === "function" &&
        el.closest("[data-widgets-dnd-grid]")
      ) {
        try {
          const rect = el.getBoundingClientRect();
          const x = Math.min(
            Math.max(0, event.clientX - rect.left),
            Math.max(0, rect.width - 1),
          );
          const y = Math.min(
            Math.max(0, event.clientY - rect.top),
            Math.max(0, rect.height - 1),
          );
          void el.offsetWidth;
          dt.setDragImage(el, Math.round(x), Math.round(y));
        } catch {
          /* Safari may throw for some drag-image targets */
        }
      }
      gridDrag.onDragStart(event);
    },
    [fillGridCell, gridDrag],
  );

  const handleGridDragEnd = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (event) => {
      dragArmRef.current = false;
      setDragEnabled(false);
      gridDrag?.onDragEnd?.(event);
    },
    [gridDrag],
  );

  /*
   * Drive `dimensions.widthPx` from snap targets before paint when span/preview changes so the first
   * painted frame matches `data-col-span`. (useEffect + rAF ran after span-sync and let a partner card
   * infer span from stale state → `onColumnSpanChange(1)` thrash and flicker.) No ResizeObserver here;
   * window resize still uses rAF below.
   */
  useLayoutEffect(() => {
    if (!fillGridCell) return;
    lastAutoLayoutWidthRef.current = null;
    autoGridWidthApplyRef.current();
  }, [
    fillGridCell,
    defaultColumnSpan,
    packSpan,
    minWidth,
    columnSnapSelector,
    resizeWidthPreviewActive,
  ]);

  useEffect(() => {
    if (!fillGridCell) return;
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        lastAutoLayoutWidthRef.current = null;
        autoGridWidthApplyRef.current();
      });
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [fillGridCell]);

  useEffect(() => {
    if (!fillGridCell || !onColumnSpanChangeRef.current) {
      return;
    }
    /*
     * During live column-snap resize, `pointermove` already calls `onColumnSpanChange` in sync with
     * each `setDimensions`. Running this effect after paint can fire one frame late or disagree
     * slightly (e.g. packSpan timing), so the dashboard repacks with a stale span — visible as a
     * flash of old card positions when expanding. Skip until preview ends, then sync once.
     */
    if (columnSnapToGrid && resizeWidthPreviewActive) {
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    const grid = el.closest(columnSnapSelector) as HTMLElement | null;
    if (!grid) return;
    /*
     * With grid fill + no preview, width comes from flex/`data-col-span`, not inline style — `dimensions`
     * can still hold the previous column’s px until the next rAF. Measuring the shell avoids reporting
     * span 1 while `packSpan` is already 1.5 (partner sync), which repacked the row and caused flicker.
     */
    const useDomWidth =
      columnSnapToGrid && fillGridCell && !resizeWidthPreviewActive;
    const widthPx = useDomWidth
      ? Math.round(el.getBoundingClientRect().width)
      : dimensions.widthPx;
    if (widthPx == null || widthPx <= 0) {
      return;
    }
    const span = computeReportedColumnSpan(
      widthPx,
      grid,
      minWidth,
      columnSnapAllow,
      packSpan,
      columnSnapPackSqueeze,
      el,
    );
    if (span == null) return;
    const declared: ColumnSnapSpan | undefined =
      packSpan != null && isValidColumnSnapSpan(packSpan)
        ? packSpan
        : defaultColumnSpan != null && isValidColumnSnapSpan(defaultColumnSpan)
          ? defaultColumnSpan
          : undefined;
    if (declared !== undefined && span === declared) {
      return;
    }
    /*
     * Pack slots use flex grow, so measured width often does not match logical span: a lone span-1
     * fills the row (reads as 3 cols); two span-1s split 50/50 (reads as 1.5 on a half-step grid).
     * Wider spans must come from the resize gesture, not this effect — only demotions are reported.
     */
    if (
      declared !== undefined &&
      snapNumeric(span) > snapNumeric(declared)
    ) {
      return;
    }
    onColumnSpanChangeRef.current(span);
  }, [
    fillGridCell,
    columnSnapToGrid,
    columnSnapSelector,
    defaultColumnSpan,
    dimensions.widthPx,
    minWidth,
    columnSnapAllow,
    columnSnapPackSqueeze,
    packSpan,
    resizeWidthPreviewActive,
  ]);

  useEffect(() => {
    if (!gridDrag || !dragEnabled) return;
    const cancelArm = () => {
      if (!dragArmRef.current) return;
      dragArmRef.current = false;
      setDragEnabled(false);
    };
    window.addEventListener("pointerup", cancelArm);
    window.addEventListener("pointercancel", cancelArm);
    return () => {
      window.removeEventListener("pointerup", cancelArm);
      window.removeEventListener("pointercancel", cancelArm);
    };
  }, [gridDrag, dragEnabled]);

  const handleMoveHandlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (!gridDrag) return;
      event.stopPropagation();
      dragArmRef.current = true;
      flushSync(() => {
        setDragEnabled(true);
      });
    },
    [gridDrag],
  );

  return (
    <div
      ref={rootRef}
      className={wrapperClass}
      data-resizable-card
      data-fill-grid-cell={fillGridCell ? "true" : undefined}
      data-pixel-sized={pixelSized ? "true" : undefined}
      data-resize-width-preview={previewShellPxWidth ? "true" : undefined}
      data-match-row-height={matchRowHeight && fillGridCell ? "true" : undefined}
      data-resize-active={resizeWidthPreviewActive ? "true" : undefined}
      style={shellStyle}
      draggable={Boolean(gridDrag && dragEnabled)}
      onDragStart={gridDrag ? handleGridDragStart : undefined}
      onDragEnd={gridDrag ? handleGridDragEnd : undefined}
    >
      <div className={frameClass}>
        <ModusWcCard bordered={true} customClass={cardClasses}>
          {children}
        </ModusWcCard>

        <div className="pointer-events-none absolute inset-0 z-12">
          {gridDrag ? (
            <ModusWcButton
              {...RESIZABLE_CARD_CHROME_BUTTON_PROPS}
              customClass="resizable-card-pattern__move-handle !pointer-events-auto !absolute !top-0 !left-0 z-20 touch-none cursor-grab active:cursor-grabbing"
              aria-label="Move card"
              onPointerDown={handleMoveHandlePointerDown}
            >
              <ModusWcIcon name="drag_indicator" size="xs" decorative />
            </ModusWcButton>
          ) : null}

          <ModusWcButton
            {...RESIZABLE_CARD_CHROME_BUTTON_PROPS}
            customClass="resizable-card-pattern__lock !pointer-events-auto !absolute !bottom-0 !left-0 z-20"
            aria-label={sizeLocked ? "Unlock size" : "Lock size"}
            onButtonClick={() => setSizeLocked((v) => !v)}
          >
            <ModusWcIcon
              name={sizeLocked ? "lock" : "lock_open"}
              size="xs"
              decorative
            />
          </ModusWcButton>

          <ModusWcButton
            {...RESIZABLE_CARD_CHROME_BUTTON_PROPS}
            customClass={
              sizeLocked
                ? "resizable-card-pattern__handle !absolute !bottom-0 !right-0 z-20 pointer-events-none cursor-not-allowed opacity-50"
                : "resizable-card-pattern__handle !pointer-events-auto !absolute !bottom-0 !right-0 z-20 touch-none cursor-nwse-resize"
            }
            aria-label="Resize card"
            aria-disabled={sizeLocked}
            onPointerDown={handleResizePointerDown}
          >
            <ModusWcIcon name="drag_corner" size="xs" decorative />
          </ModusWcButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Layout pattern demo: uses {@link ResizableModusCardShell} with sample content.
 */
export function ResizableCardPattern() {
  return (
    <ResizableModusCardShell initialWidth={380} initialHeight={260}>
      <ModusWcTypography
        slot="title"
        hierarchy="h4"
        size="md"
        weight="semibold"
        label="Resizable panel"
      />
      <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" slot="subtitle" hierarchy="p" size="sm" label="Lock the size from the lower left, or drag the lower-right handle to resize when unlocked. The body fills the card and scrolls when space is tight." />
      <div className="flex flex-col flex-1 min-h-0 min-w-0 gap-3 mt-1">
        <ModusWcProgress value={62} max={100} customClass="w-full shrink-0" />
        <div className="flex-1 min-h-0 min-w-0 overflow-auto pr-1">
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content)]" hierarchy="p" size="sm" label="This region grows and shrinks with the card. Smaller heights keep the title and progress visible while this area scrolls." />
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" customClass="mt-2" label="Pattern: wrap Modus Card in a sized container, use flex column with flex-1 min-h-0 on the scrollable section, and CSS so the card article fills 100% height." />
        </div>
      </div>
    </ResizableModusCardShell>
  );
}

export default ResizableCardPattern;

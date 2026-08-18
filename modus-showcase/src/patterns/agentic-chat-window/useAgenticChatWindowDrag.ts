import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const POSITION_STORAGE_KEY = "modus-agentic-chat-window-position";

type Point = { x: number; y: number };

function loadStoredPosition(): Point | null {
  try {
    const raw = localStorage.getItem(POSITION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Point;
    if (
      typeof parsed?.x === "number" &&
      typeof parsed?.y === "number" &&
      Number.isFinite(parsed.x) &&
      Number.isFinite(parsed.y)
    ) {
      return parsed;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function saveStoredPosition(pos: Point) {
  try {
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(pos));
  } catch {
    /* ignore */
  }
}

function clampToBoundary(
  pos: Point,
  panelWidth: number,
  panelHeight: number,
  boundaryWidth: number,
  boundaryHeight: number,
  margin = 8,
): Point {
  return {
    x: Math.max(margin, Math.min(pos.x, boundaryWidth - panelWidth - margin)),
    y: Math.max(margin, Math.min(pos.y, boundaryHeight - panelHeight - margin)),
  };
}

function pointerEventTargetsModusButton(
  e: React.PointerEvent<HTMLElement> | PointerEvent,
): boolean {
  const native = "nativeEvent" in e ? e.nativeEvent : e;
  if (typeof native.composedPath === "function") {
    return native.composedPath().some(
      (node) =>
        node instanceof Element && node.tagName === "MODUS-WC-BUTTON",
    );
  }
  const target = native.target;
  return (
    target instanceof Element && target.closest("modus-wc-button") != null
  );
}

function defaultBottomRightPosition(
  boundaryWidth: number,
  boundaryHeight: number,
  panelWidth: number,
  panelHeight: number,
): Point {
  const margin = 16;
  const fabReserve = 72;
  return clampToBoundary(
    {
      x: boundaryWidth - panelWidth - margin,
      y: boundaryHeight - panelHeight - margin - fabReserve,
    },
    panelWidth,
    panelHeight,
    boundaryWidth,
    boundaryHeight,
    margin,
  );
}

export function useAgenticChatWindowDrag(options: {
  boundaryRef: React.RefObject<HTMLElement | null>;
  panelRef: React.RefObject<HTMLElement | null>;
  disabled?: boolean;
  isOpen?: boolean;
  persistPosition?: boolean;
}) {
  const { boundaryRef, panelRef, disabled, isOpen, persistPosition = true } =
    options;
  const [position, setPosition] = useState<Point | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const measureAndClamp = useCallback(
    (next: Point): Point | null => {
      const boundary = boundaryRef.current;
      const panel = panelRef.current;
      if (!boundary || !panel) return null;
      const bw = boundary.clientWidth;
      const bh = boundary.clientHeight;
      const pw = panel.offsetWidth;
      const ph = panel.offsetHeight;
      if (!pw || !ph) return next;
      return clampToBoundary(next, pw, ph, bw, bh);
    },
    [boundaryRef, panelRef],
  );

  const placeDefault = useCallback(() => {
    const boundary = boundaryRef.current;
    const panel = panelRef.current;
    if (!boundary || !panel) return;
    const stored = persistPosition ? loadStoredPosition() : null;
    const bw = boundary.clientWidth;
    const bh = boundary.clientHeight;
    const pw = panel.offsetWidth || Math.min(bw - 32, 896);
    const ph = panel.offsetHeight || Math.min(bh - 32, 720);
    const next =
      stored != null
        ? clampToBoundary(stored, pw, ph, bw, bh)
        : defaultBottomRightPosition(bw, bh, pw, ph);
    setPosition(next);
  }, [boundaryRef, panelRef, persistPosition]);

  useEffect(() => {
    if (isOpen) return;
    setPosition(null);
    setIsDragging(false);
    dragStartRef.current = null;
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || disabled) return;
    if (position != null) return;
    placeDefault();
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => placeDefault());
    });
    return () => cancelAnimationFrame(raf1);
  }, [isOpen, disabled, placeDefault, position]);

  useEffect(() => {
    if (!isOpen || disabled) return;
    const boundary = boundaryRef.current;
    if (!boundary) return;
    const ro = new ResizeObserver(() => {
      setPosition((prev) => {
        if (prev == null) return prev;
        return measureAndClamp(prev) ?? prev;
      });
    });
    ro.observe(boundary);
    return () => ro.disconnect();
  }, [boundaryRef, disabled, isOpen, measureAndClamp]);

  const onDragHandlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement> | PointerEvent) => {
      if (disabled) return;
      if (e.button !== 0) return;
      if (pointerEventTargetsModusButton(e)) return;
      const panel = panelRef.current;
      const boundary = boundaryRef.current;
      if (!panel || !boundary) return;

      e.preventDefault();
      const captureTarget =
        "currentTarget" in e && e.currentTarget instanceof HTMLElement
          ? e.currentTarget
          : (e.target instanceof Element
              ? e.target.closest("header")
              : null);
      if (captureTarget instanceof HTMLElement) {
        captureTarget.setPointerCapture(e.pointerId);
      }

      const panelRect = panel.getBoundingClientRect();
      const boundaryRect = boundary.getBoundingClientRect();
      const currentX = panelRect.left - boundaryRect.left;
      const currentY = panelRect.top - boundaryRect.top;

      dragStartRef.current = {
        pointerId: e.pointerId,
        offsetX: e.clientX - panelRect.left,
        offsetY: e.clientY - panelRect.top,
      };
      setPosition({ x: currentX, y: currentY });
      setIsDragging(true);
    },
    [boundaryRef, disabled, panelRef],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: PointerEvent) => {
      const start = dragStartRef.current;
      const boundary = boundaryRef.current;
      if (!start || !boundary) return;
      const boundaryRect = boundary.getBoundingClientRect();
      const next = {
        x: e.clientX - boundaryRect.left - start.offsetX,
        y: e.clientY - boundaryRect.top - start.offsetY,
      };
      setPosition(measureAndClamp(next) ?? next);
    };

    const handleUp = (e: PointerEvent) => {
      const start = dragStartRef.current;
      if (!start || e.pointerId !== start.pointerId) return;
      dragStartRef.current = null;
      setIsDragging(false);
      setPosition((prev) => {
        if (prev && persistPosition) saveStoredPosition(prev);
        return prev;
      });
    };

    document.addEventListener("pointermove", handleMove, true);
    document.addEventListener("pointerup", handleUp, true);
    document.addEventListener("pointercancel", handleUp, true);
    return () => {
      document.removeEventListener("pointermove", handleMove, true);
      document.removeEventListener("pointerup", handleUp, true);
      document.removeEventListener("pointercancel", handleUp, true);
    };
  }, [boundaryRef, isDragging, measureAndClamp, persistPosition]);

  const panelStyle: React.CSSProperties | undefined =
    position != null && !disabled
      ? { left: position.x, top: position.y }
      : undefined;

  return {
    position,
    panelStyle,
    isDragging,
    onDragHandlePointerDown,
    placeDefault,
  };
}

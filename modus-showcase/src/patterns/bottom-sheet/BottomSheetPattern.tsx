// @ts-nocheck
import './bottom-sheet-pattern.css';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const PEEK_PX = 56;
const TOP_INSET_PX = 16;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function viewportH() {
  if (typeof window === 'undefined') return 720;
  return Math.round(window.visualViewport?.height ?? window.innerHeight);
}

function maxSheetHeightPx() {
  return Math.max(PEEK_PX, viewportH() - TOP_INSET_PX);
}

function snapHeight(h: number) {
  const maxH = maxSheetHeightPx();
  const twoThirds = Math.round(maxH * (2 / 3));
  const anchors = [PEEK_PX, twoThirds, maxH];
  return anchors.reduce((best, a) =>
    Math.abs(a - h) < Math.abs(best - h) ? a : best,
    anchors[1]);
}

export function BottomSheetPattern() {
  const panelRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const [overlayShown, setOverlayShown] = useState(false);
  const [sheetEntered, setSheetEntered] = useState(false);
  const [hPx, setHPx] = useState(() => Math.round(maxSheetHeightPx() * (2 / 3)));
  const drag = useRef(false);
  const dragY0 = useRef(0);
  const dragH0 = useRef(0);
  const lastH = useRef(hPx);

  useEffect(() => {
    lastH.current = hPx;
  }, [hPx]);

  useEffect(() => {
    const resize = () => setHPx((x) => clamp(x, PEEK_PX, maxSheetHeightPx()));
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const requestClose = useCallback(() => {
    closingRef.current = true;
    setSheetEntered(false);
  }, []);

  const openSheet = useCallback(() => {
    closingRef.current = false;
    setHPx(snapHeight(Math.round(maxSheetHeightPx() * (2 / 3))));
    setSheetEntered(false);
    setOverlayShown(true);
  }, []);

  useLayoutEffect(() => {
    if (!overlayShown) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setSheetEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [overlayShown]);

  useEffect(() => {
    if (!overlayShown) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [overlayShown, requestClose]);

  useEffect(() => {
    if (overlayShown && sheetEntered) {
      panelRef.current?.focus({ preventScroll: true });
    }
  }, [overlayShown, sheetEntered]);

  useEffect(() => {
    if (!closingRef.current || sheetEntered) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) return;
    closingRef.current = false;
    setOverlayShown(false);
  }, [sheetEntered]);

  const begin = useCallback((clientY: number) => {
    drag.current = true;
    dragY0.current = clientY;
    dragH0.current = lastH.current;
  }, []);

  const move = useCallback((clientY: number) => {
    if (!drag.current) return;
    const maxH = maxSheetHeightPx();
    const delta = dragY0.current - clientY;
    const next = clamp(dragH0.current + delta, PEEK_PX, maxH);
    lastH.current = next;
    setHPx(next);
  }, []);

  const end = useCallback(() => {
    if (!drag.current) return;
    drag.current = false;
    setHPx(snapHeight(lastH.current));
  }, []);

  const showChrome = hPx > PEEK_PX + 88;

  const onPanelTransitionEnd = (e: { propertyName: string }) => {
    if (e.propertyName !== 'transform') return;
    if (!closingRef.current) return;
    closingRef.current = false;
    setOverlayShown(false);
  };

  return (
    <>
      <ModusWcButton onButtonClick={openSheet}>
        Open bottom sheet
      </ModusWcButton>

      {overlayShown ? (
        <div className="pointer-events-none fixed inset-0 z-[10050] [&>*]:pointer-events-auto">
          <button
            type="button"
            aria-label="Dismiss sheet"
            className="absolute inset-0 bg-[rgba(15,21,39,0.35)] backdrop-blur-[1px]"
            onClick={requestClose}
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="bottom-sheet-title"
            tabIndex={-1}
            className={
              'modus-bottom-sheet-panel' +
              (sheetEntered ? ' modus-bottom-sheet-panel--open' : '')
            }
            style={{ height: hPx }}
            onTransitionEnd={onPanelTransitionEnd}
          >
            <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-t-xl">
              <div
                role="presentation"
                className="relative flex shrink-0 touch-none cursor-grab active:cursor-grabbing flex-col items-center border-b border-[var(--modus-wc-color-base-200)] pt-3 pb-3"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  begin(e.clientY);
                }}
                onPointerMove={(e) => move(e.clientY)}
                onPointerUp={end}
                onPointerCancel={end}
              >
                <ModusWcTypography
                  hierarchy="span"
                  size="sm"
                  customClass="sr-only"
                  label="Resize the sheet vertically by dragging along the top edge."
                />
                <div className="h-1 w-10 shrink-0 rounded-full bg-[var(--modus-wc-color-base-200)] sm:w-14" />
              </div>

              <div hidden={!showChrome} className="flex min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-1">
                  <ModusWcButton
                    variant="borderless"
                    color="tertiary"
                    shape="square"
                    size="sm"
                    aria-label="Back"
                    customClass="-ml-1 shrink-0"
                    onButtonClick={requestClose}
                  >
                    <ModusWcIcon name="chevron_left" size="xs" decorative />
                  </ModusWcButton>
                  <div className="min-w-0 flex-1 py-1">
                    <ModusWcTypography
                      id="bottom-sheet-title"
                      hierarchy="h2"
                      size="md"
                      weight="semibold"
                      label="Title"
                    />
                    <ModusWcTypography
                      className="text-[var(--modus-wc-color-base-content-low-contrast)]"
                      hierarchy="p"
                      size="sm"
                      label="Subtitle"
                    />
                  </div>
                  <ModusWcButton
                    variant="borderless"
                    color="tertiary"
                    shape="square"
                    size="sm"
                    aria-label="Close sheet"
                    customClass="shrink-0"
                    onButtonClick={requestClose}
                  >
                    <ModusWcIcon name="close" size="xs" decorative />
                  </ModusWcButton>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                  <ModusWcTypography
                    hierarchy="p"
                    size="md"
                    label="Replace this region with scrolling body content."
                  />
                </div>

                <div className="shrink-0 border-t border-[var(--modus-wc-color-base-200)] px-4 pb-[max(env(safe-area-inset-bottom,0px),0.75rem)] pt-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <ModusWcButton
                      variant="outlined"
                      color="tertiary"
                      size="sm"
                      onButtonClick={requestClose}
                    >
                      Cancel
                    </ModusWcButton>
                    <ModusWcButton
                      variant="filled"
                      color="primary"
                      size="sm"
                      onButtonClick={requestClose}
                    >
                      <ModusWcIcon name="save_download" size="xs" decorative />
                      Save
                    </ModusWcButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default BottomSheetPattern;

// @ts-nocheck
/**
 * Patterns → 3D Canvas — multi-anchor floating toolbars over spatial viewports.
 * Reuses the 3D Toolbar shell + `ModusWcToolbar` composition.
 * Docs “Copy code” uses this file via `threeDCanvasPatternCode.ts` (?raw).
 */
import type { ISelectOption } from "@trimble-oss/moduswebcomponents";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import {
  ModusWcButton,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
  ModusWcSelect,
  ModusWcToolbar,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

/** Breakpoint aligned with Tailwind `lg` — draggable column splits only here and up (narrow widths keep the stacking grid). */
const CANVAS_SPLIT_LG_MEDIA = "(min-width: 1024px)";

function subscribeCanvasSplitMq(onChange: () => void): () => void {
  const mq = window.matchMedia(CANVAS_SPLIT_LG_MEDIA);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getCanvasSplitLgMatches(): boolean {
  return typeof window !== "undefined" && window.matchMedia(CANVAS_SPLIT_LG_MEDIA).matches;
}

function getCanvasSplitLgMatchesServerSnapshot(): boolean {
  return false;
}

function useLgViewportForCanvasSplits(): boolean {
  return useSyncExternalStore(
    subscribeCanvasSplitMq,
    getCanvasSplitLgMatches,
    getCanvasSplitLgMatchesServerSnapshot,
  );
}

function closeDropdownMenuFromItemEvent(e: CustomEvent) {
  const host = (e.target as HTMLElement | null)?.closest(
    "modus-wc-dropdown-menu",
  );
  if (host) {
    (host as HTMLElement & { menuVisible: boolean }).menuVisible = false;
  }
}

const WINDOW_COUNT_OPTIONS: ISelectOption[] = [1, 2, 3, 4, 5, 6].map(
  (n) => ({ label: String(n), value: String(n) }),
);

/** Fills gutter space between tiled viewports (grid gaps + splitter column at `lg+`). */
const VIEWPORT_GUTTER_BACKDROP_CLASS =
  "rounded-lg bg-[var(--modus-wc-color-base-200)]";

const shellChrome =
  "rounded-xl border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] p-2";

const toolbarClassH =
  "pattern-3d-toolbar-inner-horizontal flex w-max min-w-0 flex-row flex-nowrap items-center gap-1 bg-transparent border-0 shadow-none p-0";

const clusterClassH =
  "flex min-w-0 flex-row flex-nowrap items-center gap-1";

function windowViewportGridClass(count: number): string {
  const base = "grid w-full min-w-0 gap-1";
  switch (count) {
    case 1:
      return `${base} grid-cols-1`;
    case 2:
      return `${base} grid-cols-1 sm:grid-cols-2`;
    case 3:
      return `${base} grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`;
    case 4:
      return `${base} grid-cols-1 sm:grid-cols-2`;
    case 5:
      // lg: six columns so row 2 is two equal halves (⅓ × 3, then ½ × 2)
      return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-6`;
    case 6:
    default:
      return `${base} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
  }
}

/** Row spans for layouts that need fractional rows (five viewports → 3 + 2). */
function windowViewportCellClass(count: number, index: number): string | undefined {
  if (count !== 5) return undefined;
  const row1 = index < 3;
  const parts = row1 ? ["lg:col-span-2"] : ["lg:col-span-3"];
  if (!row1 && index === 4) {
    parts.push("sm:col-span-2");
  }
  return parts.join(" ");
}

/** Viewport indices per row — matches stacking grid breakpoints at sub-`lg` widths and drives split gutters on large viewports. */
function getViewportRowIndices(windowCount: number): number[][] {
  switch (windowCount) {
    case 1:
      return [[0]];
    case 2:
      return [[0, 1]];
    case 3:
      return [[0, 1, 2]];
    case 4:
      return [
        [0, 1],
        [2, 3],
      ];
    case 5:
      return [
        [0, 1, 2],
        [3, 4],
      ];
    case 6:
      return [
        [0, 1, 2],
        [3, 4, 5],
      ];
    default:
      return [[0]];
  }
}

/** Layout width stays ~2px; `hitAreaMargins` enlarge the draggable hit target without widening the gutter. */
/** Splitter column reserves ~4px (Tailwind `w-1`); hit target still expanded via margins. */
const canvasSplitHitWidthClass = "w-1 shrink-0";

function HorizontalViewportSplits({
  indices,
  renderViewportForIndex,
}: {
  indices: number[];
  renderViewportForIndex: (viewportIndex: number) => ReactNode;
}) {
  const count = indices.length;
  const defaultFrac = count > 0 ? 100 / count : 100;

  if (count <= 1) {
    const only = indices[0] ?? 0;
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:h-full">
        {renderViewportForIndex(only)}
      </div>
    );
  }

  return (
    <PanelGroup
      direction="horizontal"
      className="flex h-full min-h-0 min-w-0 w-full overflow-hidden"
      keyboardResizeBy={8}
    >
      {indices.flatMap((viewportIndex, idx) => {
        const panelEl = (
          <Panel
            key={viewportIndex}
            id={`canvas-viewport-panel-${viewportIndex}`}
            defaultSize={defaultFrac}
            minSize={14}
            className="min-h-0 min-w-0"
          >
            <div className="flex min-h-[200px] min-w-0 flex-1 flex-col lg:min-h-0 lg:h-full">
              {renderViewportForIndex(viewportIndex)}
            </div>
          </Panel>
        );
        if (idx >= indices.length - 1) {
          return [panelEl];
        }
        const nextVi = indices[idx + 1]!;
        const handleEl = (
          <PanelResizeHandle
            key={`split-${viewportIndex}-${nextVi}`}
            aria-label={`Resize width between viewport ${viewportIndex + 1} and viewport ${nextVi + 1}`}
            tabIndex={0}
            className={`pattern-3d-canvas-split-handle ${canvasSplitHitWidthClass}`}
            hitAreaMargins={{ coarse: 12, fine: 8 }}
          >
            <span
              aria-hidden
              className="pattern-3d-canvas-split-handle-grip mx-auto inline-block max-h-[min(18rem,calc(100%-1rem))] min-h-12 w-px shrink-0 rounded-full bg-transparent"
            />
          </PanelResizeHandle>
        );
        return [panelEl, handleEl];
      })}
    </PanelGroup>
  );
}

function ThreeDCanvasResizablePanelsLayout({
  windowCount,
  renderViewportForIndex,
}: {
  windowCount: number;
  renderViewportForIndex: (viewportIndex: number) => ReactNode;
}) {
  const rows = getViewportRowIndices(windowCount);

  if (windowCount <= 1) {
    return <>{renderViewportForIndex(0)}</>;
  }

  const shellOuter =
    `${VIEWPORT_GUTTER_BACKDROP_CLASS} flex w-full min-w-0 flex-col lg:gap-1 lg:h-[min(42rem,72vh)]`;

  return (
    <div key={windowCount} className={shellOuter}>
      {rows.map((indices, rowIdx) => (
        <div
          key={rowIdx}
          className={
            rows.length === 1
              ? "flex min-h-0 flex-1 flex-col lg:h-full lg:min-h-0"
              : "flex min-h-0 min-w-0 flex-1 basis-0 flex-col lg:min-h-0"
          }
        >
          <HorizontalViewportSplits
            indices={indices}
            renderViewportForIndex={renderViewportForIndex}
          />
        </div>
      ))}
    </div>
  );
}

function ThreeDCanvasViewportCell({
  regionLabel,
  centerLabel,
  minHeightClass,
  stretchToRow = false,
}: {
  regionLabel: string;
  centerLabel: string;
  minHeightClass: string;
  stretchToRow?: boolean;
}) {
  const rowStretch =
    stretchToRow ? " lg:h-full lg:min-h-0 lg:overflow-hidden" : "";
  return (
    <div
      className={
        "pattern-3d-canvas-viewport pattern-3d-toolbar-workspace relative w-full overflow-x-auto overflow-y-hidden rounded-lg border border-[var(--modus-wc-color-base-200)] " +
        minHeightClass +
        rowStretch
      }
      role="region"
      aria-label={regionLabel}
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          label={centerLabel}
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)] !m-0"
        />
      </div>

      <div
        className={`pattern-3d-toolbar-shell-horizontal absolute left-4 top-4 z-[1] ${shellChrome}`}
      >
        <ModusWcToolbar aria-label="Scene menu" customClass={toolbarClassH}>
          <div slot="start" className={clusterClassH}>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-label="Main menu"
            >
              <ModusWcIcon name="menu" decorative size="sm" />
            </ModusWcButton>
          </div>
        </ModusWcToolbar>
      </div>

      <div className="pointer-events-none absolute inset-x-4 top-4 z-[1] flex min-w-0 justify-center">
        <div
          className={
            "pattern-3d-toolbar-shell-horizontal pointer-events-auto w-max max-w-full min-w-0 overflow-x-auto overflow-y-visible " +
            shellChrome
          }
        >
          <ModusWcToolbar
            aria-label="View and navigation tools"
            customClass={toolbarClassH}
          >
            <div
              slot="start"
              className={`${clusterClassH} whitespace-nowrap`}
            >
              <ModusWcDropdownMenu
                buttonVariant="borderless"
                buttonColor="tertiary"
                buttonSize="sm"
                buttonShape="square"
                buttonAriaLabel="View mode"
                menuPlacement="bottom-start"
              >
                <div slot="button" className="flex items-center gap-0.5 px-0.5">
                  <ModusWcIcon name="cube" decorative size="sm" />
                  <ModusWcIcon name="expand_more" decorative size="xs" />
                </div>
                <div slot="menu">
                  <ModusWcMenuItem
                    label="Shaded"
                    value="shaded"
                    onItemSelect={closeDropdownMenuFromItemEvent}
                  />
                  <ModusWcMenuItem
                    label="Wireframe"
                    value="wireframe"
                    onItemSelect={closeDropdownMenuFromItemEvent}
                  />
                  <ModusWcMenuItem
                    label="X-Ray"
                    value="xray"
                    onItemSelect={closeDropdownMenuFromItemEvent}
                  />
                </div>
              </ModusWcDropdownMenu>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                shape="square"
                size="sm"
                aria-label="Select"
              >
                <ModusWcIcon name="cursor" decorative size="sm" />
              </ModusWcButton>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                shape="square"
                size="sm"
                aria-label="Pan"
              >
                <ModusWcIcon name="pan" decorative size="sm" />
              </ModusWcButton>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                shape="square"
                size="sm"
                aria-label="Zoom"
              >
                <ModusWcIcon name="zoom_in" decorative size="sm" />
              </ModusWcButton>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                shape="square"
                size="sm"
                aria-label="Layers"
              >
                <ModusWcIcon name="layer" decorative size="sm" />
              </ModusWcButton>
            </div>
          </ModusWcToolbar>
        </div>
      </div>

      <div
        className={`pattern-3d-toolbar-shell-horizontal absolute right-4 top-4 z-[1] ${shellChrome}`}
      >
        <ModusWcToolbar
          aria-label="Notifications"
          customClass={toolbarClassH}
        >
          <div slot="start" className={clusterClassH}>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-label="Alerts"
            >
              <ModusWcIcon name="notifications" decorative size="sm" />
            </ModusWcButton>
          </div>
        </ModusWcToolbar>
      </div>

      <div
        className={
          "pattern-3d-toolbar-shell-horizontal absolute bottom-4 left-4 z-[1] max-w-[calc(100%-8rem)] " +
          shellChrome
        }
      >
        <ModusWcToolbar
          aria-label="Track actions"
          customClass={toolbarClassH}
        >
          <div slot="start" className={clusterClassH}>
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-label="Save"
            >
              <ModusWcIcon name="save_disk" decorative size="sm" />
            </ModusWcButton>
          </div>
        </ModusWcToolbar>
      </div>

      <div className="absolute bottom-4 right-4 z-[1] flex flex-row items-center gap-2">
        <div
          className={`pattern-3d-toolbar-shell-horizontal ${shellChrome}`}
        >
          <ModusWcToolbar
            aria-label="Tool presets"
            customClass={toolbarClassH}
          >
            <div slot="start" className={clusterClassH}>
              <ModusWcDropdownMenu
                buttonVariant="borderless"
                buttonColor="tertiary"
                buttonSize="sm"
                buttonShape="square"
                buttonAriaLabel="Measure presets"
                menuPlacement="top-start"
              >
                <div
                  slot="button"
                  className="flex items-center gap-0.5 px-0.5"
                >
                  <ModusWcIcon name="ruler" decorative size="sm" />
                  <ModusWcIcon name="expand_more" decorative size="xs" />
                </div>
                <div slot="menu">
                  <ModusWcMenuItem
                    label="Distance"
                    value="distance"
                    onItemSelect={closeDropdownMenuFromItemEvent}
                  />
                  <ModusWcMenuItem
                    label="Area"
                    value="area"
                    onItemSelect={closeDropdownMenuFromItemEvent}
                  />
                </div>
              </ModusWcDropdownMenu>
            </div>
          </ModusWcToolbar>
        </div>
        <div
          className={`pattern-3d-toolbar-shell-horizontal ${shellChrome}`}
        >
          <ModusWcToolbar aria-label="Help" customClass={toolbarClassH}>
            <div slot="start" className={clusterClassH}>
              <ModusWcButton
                variant="borderless"
                color="tertiary"
                shape="square"
                size="sm"
                aria-label="Help"
              >
                <ModusWcIcon name="help" decorative size="sm" />
              </ModusWcButton>
            </div>
          </ModusWcToolbar>
        </div>
      </div>
    </div>
  );
}

export function ThreeDCanvasPatternDemo() {
  const [windowCount, setWindowCount] = useState(1);
  const multi = windowCount > 1;
  const lgSplits = useLgViewportForCanvasSplits();

  const viewportMinClass =
    multi && lgSplits
      ? "min-h-[200px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-0"
      : multi
        ? "min-h-[200px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[280px]"
        : "min-h-[480px]";

  const viewportAt = (i: number) => (
    <ThreeDCanvasViewportCell
      regionLabel={
        multi
          ? `3D canvas ${i + 1} of ${windowCount}`
          : "3D canvas with floating toolbars"
      }
      centerLabel={multi ? `Viewport ${i + 1}` : "Viewport"}
      minHeightClass={viewportMinClass}
      stretchToRow={Boolean(multi && lgSplits)}
    />
  );

  return (
    <div className="pattern-3d-canvas-demo pattern-3d-toolbar-demo flex w-full min-w-0 flex-col gap-3">
      <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          weight="semibold"
          customClass="!m-0 text-[var(--modus-wc-color-base-content)]"
          label="Layout"
        />
        <ModusWcSelect
          label="Number of windows"
          name="three-d-canvas-window-count"
          size="sm"
          options={WINDOW_COUNT_OPTIONS}
          value={String(windowCount)}
          customClass="w-full min-w-0 sm:w-[12.5rem] sm:min-w-[12.5rem]"
          onInputChange={(e: CustomEvent) => {
            const v = (e.detail?.target as HTMLSelectElement | undefined)
              ?.value;
            const n = parseInt(v ?? "1", 10);
            if (n >= 1 && n <= 6) {
              setWindowCount(n);
            }
          }}
        />
      </div>

      <div className="w-full min-w-0">
        {!multi ? (
          viewportAt(0)
        ) : lgSplits ? (
          <ThreeDCanvasResizablePanelsLayout
            windowCount={windowCount}
            renderViewportForIndex={viewportAt}
          />
        ) : (
          <div
            className={[VIEWPORT_GUTTER_BACKDROP_CLASS, windowViewportGridClass(windowCount)].join(
              " ",
            )}
          >
            {Array.from({ length: windowCount }, (_, i) => (
              <div
                key={i}
                className={["min-w-0", windowViewportCellClass(windowCount, i)]
                  .filter(Boolean)
                  .join(" ")}
              >
                {viewportAt(i)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreeDCanvasPatternDemo;

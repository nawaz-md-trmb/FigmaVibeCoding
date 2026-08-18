// @ts-nocheck
import { useState } from "react";

/**
 * Patterns → 3D Toolbar — floating Modus toolbar over a spatial workspace.
 * Docs “Copy code” uses this file via `threeDToolbarPatternCode.ts` (?raw).
 */
import type { ISelectOption } from "@trimble-oss/moduswebcomponents";
import {
  ModusWcButton,
  ModusWcDivider,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
  ModusWcSelect,
  ModusWcToolbar,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";

function closeDropdownMenuFromItemEvent(e: CustomEvent) {
  const host = (e.target as HTMLElement | null)?.closest(
    "modus-wc-dropdown-menu",
  );
  if (host) {
    (host as HTMLElement & { menuVisible: boolean }).menuVisible = false;
  }
}

const ORIENTATION_OPTIONS: ISelectOption[] = [
  { label: "Horizontal", value: "horizontal" },
  { label: "Vertical", value: "vertical" },
];

function readOrientationSelect(e: CustomEvent): string {
  return String(
    (e.detail as { target?: HTMLSelectElement })?.target?.value ?? "",
  );
}

/** Floating Modus toolbar over a workspace canvas — horizontal or vertical grouping. */
export function ThreeDToolbarPatternDemo() {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  const shellChrome =
    "rounded-xl border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] p-2";

  const floatingShellClass =
    orientation === "vertical"
      ? "pattern-3d-toolbar-shell-vertical absolute left-4 top-4 z-[1] flex max-h-[calc(100%-2rem)] w-fit max-w-[calc(100%-2rem)] flex-col items-center " +
        shellChrome
      : "pattern-3d-toolbar-shell-horizontal absolute inset-x-4 bottom-4 z-[1] mx-auto w-max max-w-full min-w-0 overflow-x-visible overflow-y-visible " +
        shellChrome;

  const toolbarClass =
    orientation === "vertical"
      ? "pattern-3d-toolbar-inner-vertical flex w-full max-w-full min-w-0 flex-col items-center gap-1 bg-transparent border-0 shadow-none p-0 min-h-0"
      : "pattern-3d-toolbar-inner-horizontal flex w-max min-w-0 flex-row flex-nowrap items-center gap-1 bg-transparent border-0 shadow-none p-0";

  const clusterClass =
    orientation === "vertical"
      ? "flex w-full min-w-0 flex-col items-center gap-1"
      : "flex min-w-0 flex-row flex-nowrap items-center gap-1";

  const toolbar = (
    <ModusWcToolbar aria-label="Modeling tools" customClass={toolbarClass}>
      <div slot="start" className={clusterClass}>
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
          aria-label="Zoom in"
        >
          <ModusWcIcon name="zoom_in" decorative size="sm" />
        </ModusWcButton>

        <ModusWcDivider
          orientation={orientation === "vertical" ? "horizontal" : "vertical"}
          customClass={
            orientation === "vertical" ? "my-1 w-full max-w-[2rem]" : "mx-1 h-6"
          }
        />

        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Undo"
        >
          <ModusWcIcon name="undo" decorative size="sm" />
        </ModusWcButton>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Redo"
        >
          <ModusWcIcon name="redo" decorative size="sm" />
        </ModusWcButton>

        <ModusWcDivider
          orientation={orientation === "vertical" ? "horizontal" : "vertical"}
          customClass={
            orientation === "vertical" ? "my-1 w-full max-w-[2rem]" : "mx-1 h-6"
          }
        />

        <ModusWcDropdownMenu
          buttonVariant="borderless"
          buttonColor="tertiary"
          buttonSize="sm"
          buttonShape="square"
          buttonAriaLabel="Solid modeling tools"
          menuPlacement={
            orientation === "vertical" ? "right-start" : "bottom-start"
          }
        >
          <div slot="button" className="flex items-center gap-0.5 px-0.5">
            <ModusWcIcon name="cube" decorative size="sm" />
            <ModusWcIcon name="expand_more" decorative size="xs" />
          </div>
          <div slot="menu">
            <ModusWcMenuItem
              label="Extrude"
              value="extrude"
              onItemSelect={closeDropdownMenuFromItemEvent}
            />
            <ModusWcMenuItem
              label="Revolve"
              value="revolve"
              onItemSelect={closeDropdownMenuFromItemEvent}
            />
            <ModusWcMenuItem
              label="Sweep"
              value="sweep"
              onItemSelect={closeDropdownMenuFromItemEvent}
            />
          </div>
        </ModusWcDropdownMenu>

        <ModusWcButton
          variant="borderless"
          color="tertiary"
          shape="square"
          size="sm"
          aria-label="Layers"
        >
          <ModusWcIcon name="layer" decorative size="sm" />
        </ModusWcButton>

        <ModusWcDivider
          orientation={orientation === "vertical" ? "horizontal" : "vertical"}
          customClass={
            orientation === "vertical" ? "my-1 w-full max-w-[2rem]" : "mx-1 h-6"
          }
        />

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
  );

  return (
    <div className="pattern-3d-toolbar-demo flex w-full min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <ModusWcSelect
          label="Toolbar orientation"
          size="sm"
          value={orientation}
          options={ORIENTATION_OPTIONS}
          customClass="min-w-[11rem] max-w-xs shrink-0"
          onInputChange={(e: CustomEvent) => {
            const v = readOrientationSelect(e);
            if (v === "horizontal" || v === "vertical") {
              setOrientation(v);
            }
          }}
        />
      </div>

      <div
        className="pattern-3d-toolbar-workspace relative min-h-[420px] w-full overflow-x-auto overflow-y-hidden rounded-lg border border-[var(--modus-wc-color-base-200)]"
        role="region"
        aria-label="Demo workspace with floating toolbar"
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <ModusWcTypography
            hierarchy="p"
            size="sm"
            label="Workspace canvas"
            customClass="text-[var(--modus-wc-color-base-content-low-contrast)] !m-0"
          />
        </div>

        <div className={floatingShellClass}>
          <div
            className={
              orientation === "vertical"
                ? "flex max-h-full min-h-0 w-full flex-col items-center overflow-x-visible overflow-y-auto"
                : "contents"
            }
          >
            {toolbar}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThreeDToolbarPatternDemo;

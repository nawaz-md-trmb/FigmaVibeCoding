// @ts-nocheck
import { useState, type ReactNode } from "react";
import {
  ModusWcSelect,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import type { ISelectOption } from "@trimble-oss/moduswebcomponents/types/components";

export type StatusIndicatorTone = "active" | "warning" | "danger";

const OPTIONS: ISelectOption[] = [
  { label: "Active", value: "active" },
  { label: "Warning", value: "warning" },
  { label: "Danger", value: "danger" },
];

const TONE_DOT: Record<StatusIndicatorTone, string> = {
  active: "bg-[var(--modus-wc-color-success)]",
  warning: "bg-[var(--modus-wc-color-warning)]",
  danger: "bg-[var(--modus-wc-color-error)]",
};

const TONE_PULSE: Record<StatusIndicatorTone, string> = {
  active: "bg-[var(--modus-wc-color-success)]/30",
  warning: "bg-[var(--modus-wc-color-warning)]/30",
  danger: "bg-[var(--modus-wc-color-error)]/30",
};

const TONE_LABEL: Record<StatusIndicatorTone, string> = {
  active: "text-[var(--modus-wc-color-success)]",
  warning: "text-[var(--modus-wc-color-warning)]",
  danger: "text-[var(--modus-wc-color-error)]",
};

function isTone(v: string): v is StatusIndicatorTone {
  return v === "active" || v === "warning" || v === "danger";
}

/**
 * Navbar end-slot style pulse dot ({@link App.tsx} `version-text-wrapper`).
 * The Select is only for this demo; swap it for app state, feature flags, or config.
 */
export function StatusIndicatorPattern(): ReactNode {
  const [tone, setTone] = useState<StatusIndicatorTone>("active");

  const statusLabel =
    OPTIONS.find((o) => o.value === tone)?.label ?? tone;

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 p-4">
      <ModusWcSelect
        label="Status variant"
        value={tone}
        options={OPTIONS}
        size="sm"
        customClass="w-48 max-w-full shrink-0"
        onInputChange={(e: CustomEvent) => {
          const raw = e.detail?.target?.value;
          if (raw && isTone(raw)) setTone(raw);
        }}
      />
      <div
        className="flex min-h-[200px] w-full items-center justify-center rounded-lg bg-(--modus-wc-color-base-200)"
        data-status-indicator-canvas
      >
        <div role="status" className="flex items-center gap-2">
          <div
            className="relative flex h-2 w-2 shrink-0 items-center"
            aria-hidden
          >
            <div
              className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[tone]}`}
            />
            <div
              className={`alpha-pulse absolute inset-0 h-2 w-2 rounded-full ${TONE_PULSE[tone]}`}
            />
          </div>
          <ModusWcTypography
            hierarchy="span"
            size="sm"
            weight="semibold"
            label={statusLabel}
            customClass={`!m-0 ${TONE_LABEL[tone]}`}
          />
        </div>
      </div>
    </div>
  );
}

export default StatusIndicatorPattern;

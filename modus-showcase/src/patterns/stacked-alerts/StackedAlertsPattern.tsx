// @ts-nocheck
import React, { useCallback, useId, useState } from "react";
import {
  ModusWcAlert,
  ModusWcBadge,
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";

export type StackedAlertItem = {
  id: string;
  title: string;
  description?: string;
  variant: "error" | "info" | "success" | "warning";
};

const SAMPLE_ALERTS: Omit<StackedAlertItem, "id">[] = [
  {
    title: "Sync complete",
    description: "Your field data finished uploading.",
    variant: "success",
  },
  {
    title: "Maintenance window",
    description: "Brief downtime Sunday 02:00–04:00 UTC.",
    variant: "warning",
  },
  {
    title: "New comment",
    description: "Jordan mentioned you in Project Atlas.",
    variant: "info",
  },
  {
    title: "Export failed",
    description: "We could not reach the report service.",
    variant: "error",
  },
];

export function stackedAlertIconForVariant(
  variant: StackedAlertItem["variant"],
): string {
  switch (variant) {
    case "error":
      return "alert_outlined";
    case "warning":
      return "warning_filled";
    case "success":
      return "check_circle";
    default:
      return "info_outlined";
  }
}

/** Collapsed stack: at most three layers (front + two peek cards). */
export const MAX_VISIBLE_STACK = 3;

const ALERT_RADIUS =
  "var(--alert-border-radius, var(--modus-wc-border-radius-md, 0.375rem))";

/** Background + border for faux “cards” under the front alert (macOS-style stack). */
export function stackLayerStyle(
  variant: StackedAlertItem["variant"],
): React.CSSProperties {
  const base = "var(--modus-wc-color-base-100)";
  const shadow =
    "0 6px 16px color-mix(in srgb, var(--modus-wc-color-base-content) 10%, transparent), 0 1px 0 color-mix(in srgb, var(--modus-wc-color-base-content) 6%, transparent)";
  const radius = { borderRadius: ALERT_RADIUS };
  switch (variant) {
    case "success":
      return {
        ...radius,
        background: `color-mix(in srgb, var(--modus-wc-color-success) 14%, ${base})`,
        border: `1px solid color-mix(in srgb, var(--modus-wc-color-success) 35%, var(--modus-wc-color-base-200))`,
        boxShadow: shadow,
      };
    case "warning":
      return {
        ...radius,
        background: `color-mix(in srgb, var(--modus-wc-color-warning) 16%, ${base})`,
        border: `1px solid color-mix(in srgb, var(--modus-wc-color-warning) 40%, var(--modus-wc-color-base-200))`,
        boxShadow: shadow,
      };
    case "error":
      return {
        ...radius,
        background: `color-mix(in srgb, var(--modus-wc-color-error) 14%, ${base})`,
        border: `1px solid color-mix(in srgb, var(--modus-wc-color-error) 35%, var(--modus-wc-color-base-200))`,
        boxShadow: shadow,
      };
    default:
      return {
        ...radius,
        background: `color-mix(in srgb, var(--modus-wc-color-primary) 12%, ${base})`,
        border: "1px solid var(--modus-wc-color-base-200)",
        boxShadow: shadow,
      };
  }
}

/**
 * Demo: overlapping toast-style alerts (iOS notification stack) that expand into a scrollable list.
 * Use in pattern docs / CodePreview via {@link renderPatternSpecificPreview}.
 */
export function StackedAlertsPattern() {
  const regionId = useId();
  const [expanded, setExpanded] = useState(false);
  const [alerts, setAlerts] = useState<StackedAlertItem[]>(() => [
    {
      id: "demo-1",
      title: "Invitation accepted",
      description: "You now have access to the shared workspace.",
      variant: "success",
    },
    {
      id: "demo-2",
      title: "License expiring",
      description: "Renew before April 30 to avoid interruption.",
      variant: "warning",
    },
    {
      id: "demo-3",
      title: "Comment on drawing",
      description: "Alex left feedback on sheet A-104.",
      variant: "info",
    },
  ]);

  const addAlert = useCallback(() => {
    const sample = SAMPLE_ALERTS[alerts.length % SAMPLE_ALERTS.length];
    setAlerts((prev) => [
      ...prev,
      {
        ...sample,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      },
    ]);
  }, [alerts.length]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      if (next.length <= 1) {
        setExpanded(false);
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setAlerts([]);
    setExpanded(false);
  }, []);

  /** Newest alert last in `alerts`; collapsed stack shows at most {@link MAX_VISIBLE_STACK} layers. */
  const visibleStack = alerts.slice(-MAX_VISIBLE_STACK).reverse();
  /** Negative margin pulls peek rows under the card above (toast stack at top-right). */
  const stackOverlapClass = "-mt-10";

  return (
    <div className="stacked-alerts-pattern-root flex h-full max-h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--modus-wc-color-base-200)] p-4">
        <ModusWcTypography
          hierarchy="h3"
          size="md"
          weight="semibold"
          label="Stacked Alerts"
        />
        <ModusWcBadge
          variant="filled"
          color="tertiary"
          size="sm"
          aria-label={`${alerts.length} alert${alerts.length === 1 ? "" : "s"}`}
        >
          {alerts.length}
        </ModusWcBadge>
        <div className="ml-auto flex flex-wrap gap-2">
          <ModusWcButton
            size="sm"
            variant="outlined"
            color="tertiary"
            onButtonClick={addAlert}
          >
            Add alert
          </ModusWcButton>
          <ModusWcButton
            size="sm"
            variant="borderless"
            color="tertiary"
            onButtonClick={clearAll}
            disabled={alerts.length === 0}
          >
            Clear all
          </ModusWcButton>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        {alerts.length === 0 ? (
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="sm" label="Add alerts to preview the collapsed stack and expanded list." />
        ) : (
          <>
            <div
              id={regionId}
              className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-end justify-start overflow-hidden"
              role="region"
              aria-label="Alert stack"
            >
              <div
                hidden={expanded}
                className="w-full max-w-[22rem] min-w-0 self-end overflow-visible"
              >
                <button
                  type="button"
                  className="modus-toast-stack-collapse-trigger m-0 w-full min-w-0 max-w-full cursor-pointer rounded-lg border-0 bg-transparent p-0 text-left whitespace-normal shadow-none outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-[var(--modus-wc-color-primary)]"
                  aria-expanded="false"
                  aria-controls={`${regionId}-list`}
                  onClick={() => setExpanded(true)}
                >
                  <ModusWcTypography
                    hierarchy="span"
                    size="sm"
                    customClass="sr-only"
                    label={`Expand alert stack, ${alerts.length} notifications`}
                  />
                  <div
                    className="flex w-full min-w-0 max-w-full flex-col items-stretch pt-0"
                    aria-hidden
                  >
                    {/*
                      Top-right toast stack: newest on top; peek rows overlap upward (-mt)
                      and scale in (macOS-style).
                    */}
                    {visibleStack.map((alert, depth) => {
                      const z = 30 - depth;
                      if (depth > 0) {
                        const scale = Math.max(0.88, 1 - depth * 0.024);
                        return (
                          <div
                            key={alert.id}
                            className={`pointer-events-none relative ${stackOverlapClass} mx-auto flex min-h-[3.5rem] min-w-0 flex-col justify-end px-3 pb-2 pt-1`}
                            style={{
                              width: `calc(100% - ${depth * 14}px)`,
                              maxWidth: "100%",
                              zIndex: z,
                              transform: `scale(${scale})`,
                              transformOrigin: "top center",
                              ...stackLayerStyle(alert.variant),
                            }}
                          >
                            <div
                              className="truncate text-left text-xs font-semibold text-[var(--modus-wc-color-base-content)]"
                              title={alert.title}
                            >
                              {alert.title}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={alert.id}
                          className="relative w-full min-w-0 max-w-full"
                          style={{ zIndex: z }}
                        >
                          <ModusWcAlert
                            variant={alert.variant}
                            icon={stackedAlertIconForVariant(alert.variant)}
                            dismissible={false}
                            alertTitle=""
                            alertDescription={undefined}
                            customClass="shadow-lg"
                          >
                            <div
                              slot="content"
                              className="flex min-w-0 flex-col gap-1"
                            >
                              <div className="flex min-w-0 items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="text-base font-semibold text-[var(--modus-wc-color-base-content)] wrap-break-word">
                                    {alert.title}
                                  </div>
                                  {alert.description ? (
                                    <div className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] wrap-break-word">
                                      {alert.description}
                                    </div>
                                  ) : null}
                                </div>
                                <ModusWcBadge
                                  variant="filled"
                                  color="tertiary"
                                  size="sm"
                                  aria-label={`${alerts.length} alert${alerts.length === 1 ? "" : "s"}`}
                                >
                                  {alerts.length}
                                </ModusWcBadge>
                              </div>
                              <div className="flex items-center gap-1 text-[var(--modus-wc-color-base-content-low-contrast)]">
                                <ModusWcIcon
                                  name="caret_down_bold"
                                  size="sm"
                                  customClass="h-4 w-4"
                                  decorative
                                />
                                <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" label="Tap to expand" />
                              </div>
                            </div>
                          </ModusWcAlert>
                        </div>
                      );
                    })}
                  </div>
                </button>
              </div>

              <div
                id={`${regionId}-list`}
                hidden={!expanded}
                className="flex max-h-full min-h-0 w-full max-w-[22rem] min-w-0 flex-1 flex-col self-end overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-100)] shadow-lg"
              >
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--modus-wc-color-base-200)] px-2 py-2">
                  <ModusWcTypography
                    hierarchy="p"
                    size="sm"
                    weight="semibold"
                    label="All alerts"
                  />
                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                    <ModusWcButton
                      size="sm"
                      variant="borderless"
                      color="tertiary"
                      onButtonClick={() => setExpanded(false)}
                    >
                      Collapse
                    </ModusWcButton>
                    <ModusWcButton
                      size="sm"
                      variant="borderless"
                      color="tertiary"
                      onButtonClick={clearAll}
                    >
                      Clear all
                    </ModusWcButton>
                  </div>
                </div>
                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
                  {[...alerts].reverse().map((alert) => (
                    <ModusWcAlert
                      key={alert.id}
                      variant={alert.variant}
                      icon={stackedAlertIconForVariant(alert.variant)}
                      dismissible
                      alertTitle=""
                      alertDescription={undefined}
                      onDismissClick={() => removeAlert(alert.id)}
                      customClass="shadow-sm"
                    >
                      <div
                        slot="content"
                        className="flex min-w-0 flex-col gap-1"
                      >
                        <div className="text-base font-semibold text-[var(--modus-wc-color-base-content)] wrap-break-word">
                          {alert.title}
                        </div>
                        {alert.description ? (
                          <div className="text-sm text-[var(--modus-wc-color-base-content-low-contrast)] wrap-break-word">
                            {alert.description}
                          </div>
                        ) : null}
                      </div>
                    </ModusWcAlert>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StackedAlertsPattern;

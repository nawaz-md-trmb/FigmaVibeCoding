// @ts-nocheck
import React, { useCallback, useState } from "react";
import {
  ModusWcButton,
  ModusWcChip,
  ModusWcIcon,
} from "@trimble-oss/moduswebcomponents-react";

/** Default overflow set — shared by Follow up + Suggestion demos. */
export const AI_UX_DEFAULT_OVERFLOW_CHIPS = [
  "Last 90 days",
  "Show citations",
  "Shorter answer",
  "Step-by-step",
] as const;

/** Default primary chips for the Follow up pattern demo. */
export const AI_UX_DEFAULT_PRIMARY_CHIPS = [
  "Last 30 days",
  "Bullet list",
  "Include sources",
] as const;

/**
 * Doc snippets for pattern pages — both import `AiUxFollowUpChipRow` from the same module
 * so consumers reuse one implementation (see live previews in AiUxPatternPreviews).
 */

export type AiUxFollowUpChipRowProps = {
  primaryChips: readonly string[];
  overflowChips: readonly string[];
  /** Label on the overflow trigger (default `+${overflowChips.length}`). */
  overflowTriggerLabel?: string;
  className?: string;
};

type ActiveKey = { kind: "p" | "o"; index: number };

export function AiUxFollowUpChipRow({
  primaryChips,
  overflowChips,
  overflowTriggerLabel,
  className = "",
}: AiUxFollowUpChipRowProps) {
  const [active, setActive] = useState<ActiveKey | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const overflowList = [...overflowChips];
  const nOverflow = overflowList.length;
  const triggerLabel =
    overflowTriggerLabel ?? (nOverflow > 0 ? `+${nOverflow}` : null);

  const collapseOverflow = useCallback(() => {
    setOverflowOpen(false);
    setActive((prev) =>
      prev?.kind === "o" ? null : prev,
    );
  }, []);

  const togglePrimary = (index: number) => {
    const next: ActiveKey = { kind: "p", index };
    setActive((prev) =>
      prev?.kind === "p" && prev.index === index ? null : next,
    );
  };

  const toggleOverflow = (index: number) => {
    const next: ActiveKey = { kind: "o", index };
    setActive((prev) =>
      prev?.kind === "o" && prev.index === index ? null : next,
    );
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-2">
        {primaryChips.map((label, index) => (
          <ModusWcChip
            key={`p-${index}-${label}`}
            label={label}
            size="sm"
            variant="outline"
            active={active?.kind === "p" && active.index === index}
            onChipClick={() => togglePrimary(index)}
          />
        ))}
        {overflowOpen ? (
          <>
            {overflowList.map((label, index) => (
              <ModusWcChip
                key={`o-${index}-${label}`}
                label={label}
                size="sm"
                variant="outline"
                active={active?.kind === "o" && active.index === index}
                onChipClick={() => toggleOverflow(index)}
              />
            ))}
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Hide extra options"
              onButtonClick={collapseOverflow}
            >
              <ModusWcIcon name="chevron_left" size="sm" decorative />
            </ModusWcButton>
          </>
        ) : triggerLabel && nOverflow > 0 ? (
          <ModusWcChip
            label={triggerLabel}
            size="sm"
            variant="outline"
            aria-label={`Show ${nOverflow} more options`}
            onChipClick={() => setOverflowOpen(true)}
          />
        ) : null}
      </div>
    </div>
  );
}

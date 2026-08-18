// @ts-nocheck
import React from "react";
import {
  ModusWcBadge,
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";
import { AiUxGradientFrame } from "./AiUxSpecCard";
import "./AiUxSourcesPattern.css";

type AiUxUsedByAiBadgeProps = {
  /**
   * Match raised surfaces (menus, dropdowns): inner fill uses base-100.
   * Default is base-page for standalone card-on-page usage.
   */
  embedded?: boolean;
};

/** Shared with References rows that tag items as in-model context. */
export function AiUxUsedByAiBadge({ embedded = false }: AiUxUsedByAiBadgeProps) {
  return (
    <AiUxGradientFrame
      className="ai-ux-gradient-frame--used-by-ai-badge shrink-0 self-start md:self-center"
      innerClassName={
        embedded
          ? "!bg-[var(--modus-wc-color-base-100)]"
          : "!bg-[var(--modus-wc-color-base-page)]"
      }
    >
      <ModusWcBadge
        variant="outlined"
        color="tertiary"
        size="sm"
        customClass="!m-0 max-w-full rounded-full !min-h-0 !h-auto !items-center"
      >
        <span className="inline-flex items-center gap-1 px-1 leading-none">
          <ModusWcIcon
            name="ai_stars"
            size="xs"
            decorative
            customClass="modus-ai-mark-gradient-icon shrink-0"
          />
          Used by AI
        </span>
      </ModusWcBadge>
    </AiUxGradientFrame>
  );
}

type AiUxSourcesPatternRowProps = {
  title: string;
  meta: string;
  /** Modus icon `name` (e.g. `file_type_pdf`, `link`). */
  icon: string;
  onRemove: () => void;
  removeAriaLabel?: string;
  /** Card sits on a menu/dropdown surface; use base-100 instead of page. */
  embedded?: boolean;
};

/**
 * One row of the ai-ux-sources pattern: source strip with “Used by AI” and remove.
 * Use inside dropdowns, lists, or the standalone preview.
 */
export function AiUxSourcesPatternRow({
  title,
  meta,
  icon,
  onRemove,
  removeAriaLabel,
  embedded = false,
}: AiUxSourcesPatternRowProps) {
  return (
    <div className="ai-ux-sources-pattern-cq w-full min-w-0">
      <div
        className={`ai-ux-sources-pattern-row flex min-w-0 w-full flex-nowrap items-start gap-2 rounded-lg border border-[var(--modus-wc-color-base-200)] px-3 py-2.5 ${
          embedded
            ? "bg-[var(--modus-wc-color-base-100)]"
            : "bg-[var(--modus-wc-color-base-page)]"
        }`}
      >
        <ModusWcIcon
          name={icon}
          size="sm"
          decorative
          customClass="mt-0.5 shrink-0"
        />
        <div
          className="ai-ux-sources-pattern-row__text flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden"
          title={`${title}${meta ? ` — ${meta}` : ""}`}
        >
          <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label={title} customClass="!m-0 min-w-0 max-w-full truncate" />
          <ModusWcTypography className="text-[var(--modus-wc-color-base-content-low-contrast)]" hierarchy="p" size="xs" customClass="!m-0 min-w-0 max-w-full truncate" label={meta} />
        </div>
        <div className="ai-ux-sources-pattern-row__used-by-ai shrink-0">
          <AiUxUsedByAiBadge embedded={embedded} />
        </div>
        <ModusWcButton
          variant="borderless"
          color="tertiary"
          size="sm"
          customClass="!m-0 shrink-0"
          onButtonClick={onRemove}
          aria-label={removeAriaLabel ?? `Remove ${title}`}
        >
          <ModusWcIcon name="close" size="sm" decorative />
        </ModusWcButton>
      </div>
    </div>
  );
}

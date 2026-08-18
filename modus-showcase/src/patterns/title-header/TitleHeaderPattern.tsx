// @ts-nocheck
import { ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

/** Row with leading icon and page title above the main content area. */
export function TitleHeaderPattern({
  embedded = false,
}: {
  /** When true, omit the bottom border (parent uses dividers, e.g. full page header stack). */
  embedded?: boolean;
} = {}) {
  return (
    <div
      className={
        embedded
          ? 'flex w-full min-w-0 items-center gap-2 px-4 py-4'
          : 'flex w-full min-w-0 items-center gap-2 border-b border-[var(--modus-wc-color-base-200)] px-4 py-4'
      }
    >
      <ModusWcIcon
        name="cube"
        size="lg"
        decorative
        className="size-8 shrink-0 translate-y-px"
      />
      <ModusWcTypography
        className="min-w-0 flex-1"
        hierarchy="h2"
        size="2xl"
        weight="bold"
        label="Title"
        customClass="truncate leading-tight !my-0"
      />
    </div>
  );
}

export default TitleHeaderPattern;

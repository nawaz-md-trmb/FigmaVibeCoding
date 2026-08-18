// @ts-nocheck
import { ModusWcChip, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

export function KbdPattern() {
  return (
    <div className={`flex max-w-xl flex-col gap-3 p-6 ${BORDER}`}>
      <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Shortcuts" customClass="!m-0" />
      <div className="flex flex-wrap items-center gap-2">
        {['⌘', 'Shift', 'K'].map((cap) => (
          <ModusWcChip key={cap} variant="outline" size="sm" label={cap} />
        ))}
        <ModusWcTypography
          hierarchy="p"
          size="xs"
          label="Opens command palette"
          customClass="!m-0 inline text-[var(--modus-wc-color-base-content-low-contrast)]"
        />
      </div>
    </div>
  );
}

export default KbdPattern;

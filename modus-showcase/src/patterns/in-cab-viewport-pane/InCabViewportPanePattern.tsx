// @ts-nocheck
import { ModusWcButton, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

export default function InCabViewportPanePattern() {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)]">
      <div className="demo-row justify-between border-b border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-100)] px-3 py-2">
        <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Front camera · Machine 88" />
        <ModusWcButton size="sm" variant="borderless" color="tertiary" aria-label="Expand viewport">
          <ModusWcIcon name="fullscreen" decorative />
        </ModusWcButton>
      </div>
      <div
        className="flex h-48 items-center justify-center bg-[var(--modus-wc-color-base-200)]"
        role="img"
        aria-label="Placeholder machine viewport"
      >
        <ModusWcTypography hierarchy="p" size="sm" label="Live viewport (map / camera / model) sits here." />
      </div>
    </div>
  )
}

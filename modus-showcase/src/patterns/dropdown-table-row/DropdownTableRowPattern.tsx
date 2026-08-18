// @ts-nocheck
import { useState } from 'react'
import {
  ModusWcAlert,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
  ModusWcToast,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react'

const ROWS = [
  { id: 'EQ-88', name: 'Excavator 320' },
  { id: 'EQ-91', name: 'Dozer D6' },
]

export default function DropdownTableRowPattern() {
  const [toast, setToast] = useState('')
  return (
    <div className="demo-stack" style={{ maxWidth: '100%' }}>
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Fleet table: open the overflow menu on a row to inspect, assign, or retire an asset."
      />
      {ROWS.map((row) => (
        <div key={row.id} className="demo-row justify-between rounded-lg border border-[var(--modus-wc-color-base-200)] px-3 py-2">
          <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label={`${row.id} · ${row.name}`} />
          <ModusWcDropdownMenu
            buttonAriaLabel={`Actions for ${row.id}`}
            buttonVariant="borderless"
            buttonColor="tertiary"
            buttonSize="sm"
            menuPlacement="bottom-end"
          >
            <ModusWcIcon slot="button" name="more_vertical" decorative />
            <div slot="menu">
              <ModusWcMenuItem label="Inspect" value="inspect" onItemSelect={() => setToast(`Inspector opened for ${row.id}`)} />
              <ModusWcMenuItem label="Assign crew" value="assign" onItemSelect={() => setToast(`Assign started for ${row.id}`)} />
              <ModusWcMenuItem label="Retire" value="retire" onItemSelect={() => setToast(`${row.id} queued to retire`)} />
            </div>
          </ModusWcDropdownMenu>
        </div>
      ))}
      {toast ? (
        <ModusWcToast position="top-end" delay={2500}>
          <ModusWcAlert variant="info" alertTitle={toast} />
        </ModusWcToast>
      ) : null}
    </div>
  )
}

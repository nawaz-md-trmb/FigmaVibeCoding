// @ts-nocheck
import { useState } from 'react'
import { ModusWcButton, ModusWcTable, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

const ROWS = [
  { id: 'WO-1204', site: 'North Yard', status: 'Open', crews: 3 },
  { id: 'WO-1205', site: 'Harbor Dock', status: 'In progress', crews: 2 },
  { id: 'WO-1206', site: 'Ridge Quarry', status: 'Blocked', crews: 1 },
]

export default function CollapsibleTablePattern() {
  const [openId, setOpenId] = useState<string | null>('WO-1204')
  return (
    <div className="demo-stack" style={{ maxWidth: '100%' }}>
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Foreman view: expand a work order row to see crew notes without leaving the list."
      />
      {ROWS.map((row) => (
        <div key={row.id} className="rounded-lg border border-[var(--modus-wc-color-base-200)] p-3">
          <div className="demo-row" style={{ justifyContent: 'space-between' }}>
            <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label={`${row.id} · ${row.site}`} />
            <ModusWcButton
              size="sm"
              variant="outlined"
              color="tertiary"
              onButtonClick={() => setOpenId(openId === row.id ? null : row.id)}
            >
              {openId === row.id ? 'Collapse' : 'Expand details'}
            </ModusWcButton>
          </div>
          {openId === row.id ? (
            <div className="mt-3">
              <ModusWcTable
                caption={`${row.id} details`}
                zebra
                columns={[
                  { id: 'field', accessor: 'field', header: 'Field' },
                  { id: 'value', accessor: 'value', header: 'Value' },
                ]}
                data={[
                  { field: 'Status', value: row.status },
                  { field: 'Crews', value: String(row.crews) },
                  { field: 'Notes', value: 'Awaiting parts from central stores.' },
                ]}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

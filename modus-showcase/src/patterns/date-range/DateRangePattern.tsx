// @ts-nocheck
import { useState } from 'react'
import { ModusWcDate, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

export default function DateRangePattern() {
  const [start, setStart] = useState('2026-08-18')
  const [end, setEnd] = useState('2026-08-22')
  return (
    <div className="demo-stack">
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Scheduler: pick a start and end date when booking a crew window."
      />
      <ModusWcDate
        label="Starts"
        value={start}
        onInputChange={(event) => setStart(String(event.detail?.target?.value ?? start))}
      />
      <ModusWcDate
        label="Ends"
        value={end}
        min={start}
        onInputChange={(event) => setEnd(String(event.detail?.target?.value ?? end))}
      />
    </div>
  )
}

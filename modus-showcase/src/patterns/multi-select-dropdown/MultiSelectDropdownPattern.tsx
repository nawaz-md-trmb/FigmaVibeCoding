// @ts-nocheck
import { useState } from 'react'
import { ModusWcAutocomplete, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

const TRADES = [
  { value: 'grade', label: 'Grading' },
  { value: 'pave', label: 'Paving' },
  { value: 'util', label: 'Utilities' },
  { value: 'survey', label: 'Survey' },
]

export default function MultiSelectDropdownPattern() {
  const [selected, setSelected] = useState(['grade'])
  return (
    <div className="demo-stack">
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Filter the board by one or more trades. Chips stay on the field until you remove them."
      />
      <ModusWcAutocomplete
        label="Trades"
        placeholder="Add a trade"
        items={TRADES}
        multiSelect
        value={selected}
        onInputChange={(event) => {
          const next = event.detail?.target?.value
          if (Array.isArray(next)) setSelected(next.map(String))
        }}
      />
    </div>
  )
}

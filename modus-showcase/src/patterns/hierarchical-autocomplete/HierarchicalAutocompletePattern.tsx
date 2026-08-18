// @ts-nocheck
import { useState } from 'react'
import { ModusWcAutocomplete, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

const ITEMS = [
  { value: 'west-north', label: 'North Yard', subLabel: 'West region' },
  { value: 'west-harbor', label: 'Harbor Dock', subLabel: 'West region' },
  { value: 'central-ridge', label: 'Ridge Quarry', subLabel: 'Central region' },
  { value: 'east-plant', label: 'East Plant', subLabel: 'East region' },
]

export default function HierarchicalAutocompletePattern() {
  const [value, setValue] = useState('')
  return (
    <div className="demo-stack">
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Jump to a site: type a region or yard. Results stay grouped by sublabel."
      />
      <ModusWcAutocomplete
        label="Site"
        placeholder="Search region or yard"
        items={ITEMS}
        value={value}
        onInputChange={(event) => setValue(String(event.detail?.target?.value ?? ''))}
      />
    </div>
  )
}

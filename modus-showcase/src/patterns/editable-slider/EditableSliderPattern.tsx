// @ts-nocheck
import { useState } from 'react'
import { ModusWcSlider, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

export default function EditableSliderPattern() {
  const [grade, setGrade] = useState(4.5)
  return (
    <div className="demo-stack">
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Grade check: drag the slider (or the paired field in the live pattern) to set target slope in percent."
      />
      <ModusWcSlider
        label={`Target grade ${grade.toFixed(1)}%`}
        min={0}
        max={12}
        step={0.1}
        value={grade}
        onInputChange={(event) => {
          const next = Number(event.detail?.target?.value)
          if (!Number.isNaN(next)) setGrade(next)
        }}
      />
    </div>
  )
}

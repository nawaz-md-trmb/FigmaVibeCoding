// @ts-nocheck
import { ModusWcProgress, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

export default function GradeIndicatorBarPattern() {
  return (
    <div className="demo-stack">
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="In-cab / design check: the bar fills as the blade approaches the design grade."
      />
      <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Cut remaining 18%" />
      <ModusWcProgress value={82} max={100} />
    </div>
  )
}

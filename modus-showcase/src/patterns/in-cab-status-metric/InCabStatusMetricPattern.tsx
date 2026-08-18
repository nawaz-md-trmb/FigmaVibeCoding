// @ts-nocheck
import { ModusWcBadge, ModusWcCard, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react'

export default function InCabStatusMetricPattern() {
  return (
    <ModusWcCard>
      <ModusWcTypography slot="title" hierarchy="h3" size="md" weight="semibold" label="Blade height" />
      <div className="demo-row">
        <ModusWcTypography hierarchy="h2" size="xl" weight="semibold" label="-0.04 m" />
        <ModusWcBadge color="success">On grade</ModusWcBadge>
      </div>
      <ModusWcTypography
        hierarchy="p"
        size="sm"
        label="Shown in the operator display while the machine is moving. Red/amber badges appear when the offset exceeds tolerance."
      />
    </ModusWcCard>
  )
}

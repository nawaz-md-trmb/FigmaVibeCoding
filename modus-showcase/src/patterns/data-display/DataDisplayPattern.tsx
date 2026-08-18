// @ts-nocheck
import { ModusWcCard, ModusWcTypography, ModusWcBadge } from '@trimble-oss/moduswebcomponents-react';

export function DataDisplay() {
  const metrics = [
    { label: 'Total Users', value: '12,345', change: '+5.2%' },
    { label: 'Active Sessions', value: '1,234', change: '+12.1%' },
    { label: 'Revenue', value: '$45,678', change: '+8.7%' }
  ];

  return (
    <div
      className="data-display-container min-w-0 w-full max-w-full"
      style={{ containerType: 'inline-size' }}
      data-data-display
    >
      <div className="data-display-grid grid w-full min-w-0 gap-4">
      {metrics.map((metric, index) => (
        <ModusWcCard key={index}>
          <ModusWcTypography slot="title" hierarchy="h5" size="sm" weight="medium" customClass="text-[var(--muted-foreground)]" label={metric.label} />
          <div>
            <div className="flex items-baseline justify-between gap-2 min-w-0">
              <ModusWcTypography hierarchy="p" size="lg" weight="semibold" label={metric.value} />
              <ModusWcBadge variant="filled" color="success" customClass="text-xs shrink-0">
                {metric.change}
              </ModusWcBadge>
            </div>
          </div>
        </ModusWcCard>
      ))}
    </div>
    </div>
  );
}

export default DataDisplay;

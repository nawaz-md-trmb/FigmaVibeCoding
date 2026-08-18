// @ts-nocheck
import {
  ModusWcBadge,
  ModusWcCard,
  ModusWcProgress,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

export function StatPattern() {
  const rows: Array<{
    label: string;
    value: string;
    badge: string;
    sentiment: 'warning' | 'success' | 'danger';
  }> = [
    { label: 'MTTR', value: '52m', badge: '+6m', sentiment: 'warning' },
    { label: 'Uptime', value: '99.96%', badge: '+0.02%', sentiment: 'success' },
    { label: 'Queues', value: '18', badge: '+3 ops', sentiment: 'danger' },
  ];

  return (
    <div className="grid max-w-3xl gap-3 md:grid-cols-3">
      {rows.map((statRow) => (
        <ModusWcCard key={statRow.label} bordered padding="compact" customClass="rounded-lg overflow-hidden">
          <ModusWcTypography
            slot="title"
            hierarchy="p"
            size="xs"
            weight="semibold"
            customClass="uppercase tracking-wide !m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
            label={statRow.label}
          />
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end gap-2">
              <ModusWcTypography hierarchy="h3" size="2xl" weight="semibold" label={statRow.value} />
              <ModusWcBadge
                variant="filled"
                color={statRow.sentiment === 'danger' ? 'danger' : statRow.sentiment === 'warning' ? 'warning' : 'success'}
                size="sm"
              >
                {statRow.badge}
              </ModusWcBadge>
            </div>
            <ModusWcProgress value={62} max={100} customClass="w-full" />
          </div>
        </ModusWcCard>
      ))}
    </div>
  );
}

export default StatPattern;

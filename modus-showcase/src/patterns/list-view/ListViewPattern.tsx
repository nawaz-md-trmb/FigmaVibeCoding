// @ts-nocheck
import { ModusWcCard, ModusWcTypography, ModusWcBadge } from '@trimble-oss/moduswebcomponents-react';

export function ListView() {
  const listItems = [
    { id: 1, title: 'Item One', description: 'Description for item one', status: 'Active' },
    { id: 2, title: 'Item Two', description: 'Description for item two', status: 'Pending' },
    { id: 3, title: 'Item Three', description: 'Description for item three', status: 'Active' }
  ];

  return (
    <div className="grid grid-cols-1 gap-2">
      {listItems.map((listItem) => (
        <ModusWcCard key={listItem.id} customClass="hover:shadow-md transition-shadow" padding="compact">
          <div className="flex min-w-0 flex-row items-center justify-between gap-3">
            <ModusWcTypography hierarchy="h4" size="md" weight="semibold" customClass="min-w-0 shrink" label={listItem.title} />
            <ModusWcBadge variant="outlined" color="tertiary" customClass="shrink-0">
              {listItem.status}
            </ModusWcBadge>
          </div>
          <ModusWcTypography hierarchy="p" size="sm" customClass="mt-1 text-[var(--muted-foreground)]" label={listItem.description} />
        </ModusWcCard>
      ))}
    </div>
  );
}

export default ListView;

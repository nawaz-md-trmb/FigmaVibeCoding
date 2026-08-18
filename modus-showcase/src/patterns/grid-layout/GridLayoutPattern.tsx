// @ts-nocheck
import { ModusWcCard, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function GridLayout() {
  const items = [
    { id: 1, title: 'Item 1', description: 'Short supporting copy for this card.' },
    { id: 2, title: 'Item 2', description: 'Short supporting copy for this card.' },
    { id: 3, title: 'Item 3', description: 'Short supporting copy for this card.' },
    { id: 4, title: 'Item 4', description: 'Short supporting copy for this card.' },
    { id: 5, title: 'Item 5', description: 'Short supporting copy for this card.' },
    { id: 6, title: 'Item 6', description: 'Short supporting copy for this card.' }
  ];

  return (
    <div
      className="grid-layout-container min-w-0 w-full max-w-full"
      style={{ containerType: 'inline-size' }}
      data-grid-layout
    >
      <div className="grid-layout-grid grid w-full min-w-0 gap-3">
        {items.map((item) => (
          <ModusWcCard key={item.id}>
            <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label={item.title} />
            <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label={item.description} />
          </ModusWcCard>
        ))}
      </div>
    </div>
  );
}

export default GridLayout;

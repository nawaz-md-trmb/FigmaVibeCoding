// @ts-nocheck
import { useState } from 'react';
import { ModusWcTabs, ModusWcCard, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function BasicTabs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabsList = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="w-full">
      <ModusWcTabs
        tabs={tabsList}
        activeTabIndex={activeTabIndex}
        onTabChange={(e) => setActiveTabIndex(e.detail.newTab)}
        customClass="w-full"
      />
      
      {activeTabIndex === 0 && (
        <div className="grid gap-4 mt-4">
          <ModusWcCard>
            <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Overview" />
            <ModusWcTypography slot="subtitle" hierarchy="p" size="sm" label="General information and summary" />
            <ModusWcTypography hierarchy="p" size="sm" label="This is the overview content panel." />
          </ModusWcCard>
        </div>
      )}
      
      {activeTabIndex === 1 && (
        <div className="grid gap-4 mt-4">
          <ModusWcCard>
            <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Analytics" />
            <ModusWcTypography slot="subtitle" hierarchy="p" size="sm" label="Data insights and metrics" />
            <ModusWcTypography hierarchy="p" size="sm" label="Analytics and reporting content goes here." />
          </ModusWcCard>
        </div>
      )}
      
      {activeTabIndex === 2 && (
        <div className="grid gap-4 mt-4">
          <ModusWcCard>
            <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Settings" />
            <ModusWcTypography slot="subtitle" hierarchy="p" size="sm" label="Configuration options" />
            <ModusWcTypography hierarchy="p" size="sm" label="Settings and preferences panel." />
          </ModusWcCard>
        </div>
      )}
    </div>
  );
}

export default BasicTabs;

// @ts-nocheck
import { useState } from 'react';
import { ModusWcSideNavigation, ModusWcMenu, ModusWcMenuItem, ModusWcIcon, ModusWcButton } from '@trimble-oss/moduswebcomponents-react';

export function SidebarNavigation() {
  const [expanded, setExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState('home');

  const handleItemSelect = (e) => {
    if (e.detail && e.detail.value) {
      setSelectedItem(e.detail.value);
    }
  };

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <style>{`
        .sidenav-pattern-demo-container modus-wc-menu-item .modus-wc-menu-item button .modus-wc-menu-item-content .modus-wc-menu-item-labels {
          padding-inline-end: var(--modus-wc-spacing-xs) !important;
          padding-inline-start: var(--modus-wc-spacing-lg) !important;
        }
      `}</style>
      <div className="sidenav-pattern-demo-container flex border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden" style={{ width: '300px', height: '300px' }}>
        <div className="flex flex-col" style={{ width: expanded ? '200px' : '64px', transition: 'width 0.2s ease' }}>
          <div className="flex items-center p-2 border-b border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-100)]">
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              square
              size="sm"
              onButtonClick={toggleSidebar}
              aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ModusWcIcon name="menu" decorative />
            </ModusWcButton>
          </div>
          <ModusWcSideNavigation
            expanded={expanded}
            maxWidth="200px"
            collapseOnClickOutside={false}
            mode="overlay"
            targetContent=".sidenav-demo-content-area"
            customClass="flex-1"
          >
            <ModusWcMenu size="lg">
              <ModusWcMenuItem
                label="Home"
                value="home"
                selected={selectedItem === 'home'}
                onItemSelect={handleItemSelect}
              >
                <ModusWcIcon slot="start-icon" name="home" decorative />
              </ModusWcMenuItem>
              <ModusWcMenuItem
                label="Profile"
                value="profile"
                selected={selectedItem === 'profile'}
                onItemSelect={handleItemSelect}
              >
                <ModusWcIcon slot="start-icon" name="person" decorative />
              </ModusWcMenuItem>
              <ModusWcMenuItem
                label="Settings"
                value="settings"
                selected={selectedItem === 'settings'}
                onItemSelect={handleItemSelect}
              >
                <ModusWcIcon slot="start-icon" name="settings" decorative />
              </ModusWcMenuItem>
            </ModusWcMenu>
          </ModusWcSideNavigation>
        </div>
        <div className="sidenav-demo-content-area flex-1 bg-[var(--modus-wc-color-base-100)]" />
      </div>
    </>
  );
}

export default SidebarNavigation;

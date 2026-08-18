// @ts-nocheck
import {
  ModusWcBreadcrumbs,
  ModusWcButton,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
} from '@trimble-oss/moduswebcomponents-react';

/** Top row: breadcrumbs + trailing utility actions (settings, overflow, primary menu). */
export function BreadcrumbHeaderPattern() {
  return (
    <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-4">
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ModusWcBreadcrumbs
          items={[
            { label: 'Home', url: '#' },
            { label: 'Projects', url: '#' },
            { label: 'Current page' },
          ]}
        />
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        <ModusWcButton
          variant="outlined"
          color="tertiary"
          size="sm"
          shape="square"
          aria-label="Settings"
        >
          <ModusWcIcon name="settings" size="xs" decorative />
        </ModusWcButton>
        <ModusWcButton
          variant="outlined"
          color="tertiary"
          size="sm"
          shape="square"
          aria-label="More actions"
        >
          <ModusWcIcon name="more_vertical" size="xs" decorative />
        </ModusWcButton>
        <ModusWcDropdownMenu
          buttonVariant="filled"
          buttonColor="primary"
          buttonSize="sm"
          menuPlacement="bottom-end"
        >
          <div slot="button" className="flex items-center gap-1">
            <ModusWcIcon name="add" size="xs" decorative />
            Button
            <ModusWcIcon name="expand_more" size="xs" decorative />
          </div>
          <div slot="menu">
            <ModusWcMenuItem label="Action" value="action" />
            <ModusWcMenuItem label="Another action" value="other" />
          </div>
        </ModusWcDropdownMenu>
      </div>
    </header>
  );
}

export default BreadcrumbHeaderPattern;

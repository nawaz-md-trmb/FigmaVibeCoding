// @ts-nocheck
import { ModusWcCard, ModusWcButton, ModusWcIcon, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function EmptyState() {
  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center gap-2">
        <ModusWcIcon 
          name="folder_open" 
          size="md" 
          customClass="text-[var(--muted-foreground)]" 
        />
        <ModusWcTypography hierarchy="h3" size="lg" weight="semibold" label="No items yet" />
        <ModusWcTypography 
          hierarchy="p" 
          size="sm" 
          customClass="text-[var(--muted-foreground)]" 
          label="Get started by creating your first item." 
        />
        <ModusWcButton size="sm">
          <ModusWcIcon name="add" size="sm" customClass="mr-2" decorative />
          Create Item
        </ModusWcButton>
      </div>
    </ModusWcCard>
  );
}

export default EmptyState;

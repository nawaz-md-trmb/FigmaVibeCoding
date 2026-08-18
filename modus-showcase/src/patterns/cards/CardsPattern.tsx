// @ts-nocheck
import { ModusWcCard, ModusWcButton, ModusWcBadge, ModusWcTypography, ModusWcProgress } from '@trimble-oss/moduswebcomponents-react';

export function BasicCard() {
  return (
    <ModusWcCard customClass="w-[350px]">
      <div slot="header" className="px-4 pt-4 pb-0 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Project Alpha" />
          <ModusWcBadge variant="outlined" color="tertiary">Active</ModusWcBadge>
        </div>
        <ModusWcTypography hierarchy="p" size="sm" customClass="pb-4" label="A comprehensive project management solution" />
      </div>
      <div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="Progress" />
            <ModusWcTypography hierarchy="p" size="sm" label="75%" />
          </div>
          <div className="w-full bg-[var(--muted)] rounded-full h-2">
            <div className="bg-[var(--primary)] h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="flex justify-between text-sm">
            <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--muted-foreground)]" label="Due Date" />
            <ModusWcTypography hierarchy="p" size="sm" label="Dec 15, 2024" />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <ModusWcButton size="sm">View Details</ModusWcButton>
          <ModusWcButton variant="outlined" color="tertiary" size="sm">Edit</ModusWcButton>
        </div>
      </div>
    </ModusWcCard>
  );
}

export default BasicCard;

// @ts-nocheck
import { useState } from 'react';
import { ModusWcCard, ModusWcSwitch, ModusWcTypography, ModusWcAlert, ModusWcButton } from '@trimble-oss/moduswebcomponents-react';

export function SafetyControls() {
  const [contentFilter, setContentFilter] = useState(true);
  const [safetyGuardrails, setSafetyGuardrails] = useState(true);
  const [explicitContent, setExplicitContent] = useState(false);

  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="AI Safety Controls" />
      <div className="p-4 space-y-4">
        <ModusWcAlert
          variant="info"
          alertDescription="These controls help ensure AI interactions remain safe and appropriate."
          icon="info_filled"
        />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <ModusWcTypography hierarchy="h5" size="sm" weight="medium" label="Content Filtering" />
              <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--muted-foreground)]" label="Filter inappropriate content" />
            </div>
            <ModusWcSwitch
              value={contentFilter}
              onSwitchChange={(e: CustomEvent) => setContentFilter(e.detail)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <ModusWcTypography hierarchy="h5" size="sm" weight="medium" label="Safety Guardrails" />
              <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--muted-foreground)]" label="Enable safety checks" />
            </div>
            <ModusWcSwitch
              value={safetyGuardrails}
              onSwitchChange={(e: CustomEvent) => setSafetyGuardrails(e.detail)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <ModusWcTypography hierarchy="h5" size="sm" weight="medium" label="Explicit Content" />
              <ModusWcTypography hierarchy="p" size="xs" customClass="text-[var(--muted-foreground)]" label="Allow explicit content (not recommended)" />
            </div>
            <ModusWcSwitch
              value={explicitContent}
              onSwitchChange={(e: CustomEvent) => setExplicitContent(e.detail)}
            />
          </div>
        </div>
        <ModusWcButton customClass="w-full">
          Save Settings
        </ModusWcButton>
      </div>
    </ModusWcCard>
  );
}

export default SafetyControls;

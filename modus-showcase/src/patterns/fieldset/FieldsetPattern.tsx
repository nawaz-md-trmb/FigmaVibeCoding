// @ts-nocheck
import { useState } from 'react';
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcDivider,
  ModusWcIcon,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

export function FieldsetPattern() {
  const [assetNameInput, setAssetNameInput] = useState('');
  const [fleetIdInput, setFleetIdInput] = useState('');

  return (
    <ModusWcCard bordered={false} padding="compact" customClass="max-w-lg">
      <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Register equipment" />

      <form className="flex flex-col gap-4">
        <fieldset
          className="m-0 flex flex-col gap-3 rounded-md border border-[var(--modus-wc-color-base-200)] p-4"
          aria-label="Asset identification"
        >
          <ModusWcTextInput
            label="Display name"
            value={assetNameInput}
            onInputChange={(e) => setAssetNameInput(String(e.detail?.target?.value ?? ''))}
          />
          <ModusWcTextInput
            label="Fleet ID"
            value={fleetIdInput}
            onInputChange={(e) => setFleetIdInput(String(e.detail?.target?.value ?? ''))}
          />
        </fieldset>

        <ModusWcDivider />

        <div className="flex justify-end gap-2">
          <ModusWcButton size="sm" variant="outlined" color="tertiary">
            Cancel
          </ModusWcButton>
          <ModusWcButton size="sm" variant="filled" color="primary">
            <ModusWcIcon name="add" decorative size="xs" />
            Save asset
          </ModusWcButton>
        </div>
      </form>
    </ModusWcCard>
  );
}

export default FieldsetPattern;

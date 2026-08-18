// @ts-nocheck
import { ModusWcCard, ModusWcLoader, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function Spinner() {
  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <div className="p-8 text-center">
        <ModusWcLoader 
          variant="spinner"
          size="md"
          color="primary"
          customClass="mx-auto mb-4" 
          aria-label="Processing"
        />
        <ModusWcTypography hierarchy="h4" size="sm" weight="semibold" label="Processing..." />
      </div>
    </ModusWcCard>
  );
}

export default Spinner;

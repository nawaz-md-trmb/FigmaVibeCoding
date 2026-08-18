// @ts-nocheck
import { ModusWcCard, ModusWcLoader, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function LoadingState() {
  return (
    <ModusWcCard customClass="max-w-md mx-auto">
      <div className="p-8 text-center">
        <ModusWcLoader 
          variant="spinner"
          size="md"
          color="primary"
          customClass="mx-auto mb-4" 
          aria-label="Loading"
        />
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Loading..." />
        <ModusWcTypography 
          hierarchy="p" 
          size="sm" 
          customClass="text-[var(--muted-foreground)] mt-2" 
          label="Please wait while we fetch your data." 
        />
      </div>
    </ModusWcCard>
  );
}

export default LoadingState;

// @ts-nocheck
import { useState } from 'react';
import {
  ModusWcCard,
  ModusWcSwitch,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

export function SwapPattern() {
  const [showMapSwap, setShowMapSwap] = useState(false);

  return (
    <div className={`flex max-w-2xl flex-col gap-4 p-6 ${BORDER}`}>
      <div className="flex items-center gap-4">
        <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Layer" customClass="!m-0" />
        <ModusWcSwitch
          label="Street map overlay"
          value={showMapSwap}
          onInputChange={(e) => setShowMapSwap(Boolean(e.detail?.target?.checked))}
          inputId="layer-swap-demo"
        />
        <ModusWcTypography
          hierarchy="p"
          size="xs"
          label={showMapSwap ? 'Satellite overlays on' : 'Blueprint mode'}
          customClass="!m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div hidden={showMapSwap} aria-hidden={showMapSwap} className="contents">
          <ModusWcCard bordered={false} padding="compact">
            <ModusWcTypography hierarchy="p" weight="semibold" label="2D schematic" slot="title" />
            <ModusWcTypography hierarchy="p" size="xs" label="Vector linework emphasizes structural assets." />
          </ModusWcCard>
        </div>

        <div hidden={!showMapSwap} aria-hidden={!showMapSwap} className="contents">
          <ModusWcCard bordered={false} padding="compact">
            <ModusWcTypography hierarchy="p" weight="semibold" label="Ortho imagery" slot="title" />
            <ModusWcTypography hierarchy="p" size="xs" label="Hybrid tiles show topography with Modus overlays." />
          </ModusWcCard>
        </div>
      </div>
    </div>
  );
}

export default SwapPattern;

// @ts-nocheck
import { useState } from 'react';
import {
  ModusWcBadge,
  ModusWcButton,
  ModusWcCard,
  ModusWcIcon,
  ModusWcRadio,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

export function FilterPattern() {
  const [scopeFilterChoice, setScopeFilterChoice] = useState('all');

  return (
    <ModusWcCard bordered={false} padding="compact" customClass={`max-w-xl ${BORDER}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Fleet jobs" customClass="!m-0" />
        <div className="flex flex-wrap items-center gap-2">
          {scopeFilterChoice !== 'all' ? (
            <>
              <ModusWcBadge key={scopeFilterChoice} variant="filled" color="tertiary" size="sm">
                {`Scope: ${scopeFilterChoice}`}
              </ModusWcBadge>
              <ModusWcButton
                size="sm"
                variant="borderless"
                color="tertiary"
                onButtonClick={() => setScopeFilterChoice('all')}
                aria-label="Reset filter"
              >
                <ModusWcIcon name="cancel_circle" decorative size="xs" />
                Reset filter
              </ModusWcButton>
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Filter jobs by readiness">
        <ModusWcTypography hierarchy="p" size="sm" weight="semibold" label="Readiness state" customClass="!m-0" />
        <div className="flex flex-col gap-3">
          <ModusWcRadio
            name="scope-filter-demo"
            inputId="flt-all"
            label="All queued jobs"
            size="sm"
            value={scopeFilterChoice === 'all'}
            onInputChange={(e) => {
              const t = e.detail?.target;
              if (t && t.checked) setScopeFilterChoice('all');
            }}
          />
          <ModusWcRadio
            name="scope-filter-demo"
            inputId="flt-blocked"
            label="Blocked (needs parts)"
            size="sm"
            value={scopeFilterChoice === 'blocked'}
            onInputChange={(e) => {
              const t = e.detail?.target;
              if (t && t.checked) setScopeFilterChoice('blocked');
            }}
          />
          <ModusWcRadio
            name="scope-filter-demo"
            inputId="flt-active"
            label="Active installs"
            size="sm"
            value={scopeFilterChoice === 'active'}
            onInputChange={(e) => {
              const t = e.detail?.target;
              if (t && t.checked) setScopeFilterChoice('active');
            }}
          />
        </div>
      </div>
    </ModusWcCard>
  );
}

export default FilterPattern;

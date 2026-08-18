// @ts-nocheck
import { useState } from 'react';
import type { ISelectOption } from '@trimble-oss/moduswebcomponents';
import {
  ModusWcSelect,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

const AUDIT_NODES = [
  { label: 'Assigned', caption: 'Crew 12 accepted work order' },
  { label: 'On site', caption: 'Check-in beacon matched' },
  { label: 'Pending QA', caption: 'Awaiting superintendent sign-off' },
];

const STEP_MARKER_CLASS =
  'flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] text-sm font-semibold tabular-nums text-[var(--modus-wc-color-base-content-low-contrast)]';

const LAYOUT_OPTIONS: ISelectOption[] = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
];

export function TimelinePattern() {
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('vertical');

  const labelCluster = (nodeStep: (typeof AUDIT_NODES)[0]) => (
    <div className="flex min-w-0 flex-col gap-2">
      <ModusWcTypography
        hierarchy="p"
        size="xs"
        weight="semibold"
        customClass="uppercase tracking-wide !m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
        label={nodeStep.label}
      />
      <ModusWcTypography hierarchy="p" size="md" weight="semibold" customClass="!m-0" label={nodeStep.caption} />
    </div>
  );

  return (
    <div className={`flex w-full min-w-0 max-w-xl flex-col gap-4 p-4 sm:p-5 ${BORDER}`}>
      <ModusWcSelect
        label="Timeline orientation"
        size="sm"
        value={layout}
        options={LAYOUT_OPTIONS}
        customClass="max-w-xs"
        onInputChange={(e) => {
          const v = String(e.detail?.target?.value ?? 'vertical');
          if (v === 'vertical' || v === 'horizontal') setLayout(v);
        }}
      />
      {layout === 'vertical' ? (
        <ol className="m-0 flex list-none flex-col p-0" aria-label="Activity timeline">
          {AUDIT_NODES.map((nodeStep, timelineIdx) => {
            const isLast = timelineIdx === AUDIT_NODES.length - 1;
            return (
              <li key={nodeStep.label} className="flex list-none min-w-0 gap-3">
                <div className="flex w-9 shrink-0 flex-col items-center pt-0.5">
                  <div aria-hidden="true" className={STEP_MARKER_CLASS}>
                    {timelineIdx + 1}
                  </div>
                  {!isLast ? (
                    <div
                      aria-hidden="true"
                      className="mt-2 w-px flex-1 min-h-[var(--modus-wc-spacing-md,0.75rem)] bg-[var(--modus-wc-color-base-200)]"
                    />
                  ) : null}
                </div>
                <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-6'}`}>{labelCluster(nodeStep)}</div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="max-md:-mx-1 max-md:overflow-x-auto max-md:px-1 md:overflow-visible">
          <ol className="m-0 flex w-full min-w-[17.5rem] list-none flex-row flex-nowrap gap-0 p-0 md:min-w-0" aria-label="Activity timeline">
            {AUDIT_NODES.map((nodeStep, timelineIdx) => (
              <li key={nodeStep.label} className="flex list-none min-w-0 flex-[1_1_0] flex-col pb-2">
                <div className="flex w-full shrink-0 items-center">
                  {timelineIdx > 0 ? (
                    <div
                      aria-hidden="true"
                      className="h-px flex-1 min-w-[var(--modus-wc-spacing-sm,0.75rem)] bg-[var(--modus-wc-color-base-200)]"
                    />
                  ) : (
                    <div className="min-w-[var(--modus-wc-spacing-sm,0.75rem)] flex-1" aria-hidden="true" />
                  )}
                  <div aria-hidden="true" className={STEP_MARKER_CLASS}>
                    {timelineIdx + 1}
                  </div>
                  {timelineIdx < AUDIT_NODES.length - 1 ? (
                    <div
                      aria-hidden="true"
                      className="h-px flex-1 min-w-[var(--modus-wc-spacing-sm,0.75rem)] bg-[var(--modus-wc-color-base-200)]"
                    />
                  ) : (
                    <div className="min-w-[var(--modus-wc-spacing-sm,0.75rem)] flex-1" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-4 flex flex-1 flex-col items-center px-1 text-center">{labelCluster(nodeStep)}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default TimelinePattern;

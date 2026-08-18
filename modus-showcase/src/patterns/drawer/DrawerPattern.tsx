// @ts-nocheck
import { useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcSelect,
  ModusWcTextInput,
  ModusWcTypography,
  ModusWcUtilityPanel,
} from '@trimble-oss/moduswebcomponents-react';

export function DrawerPattern() {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative flex h-[min(640px,78vh)] min-h-[420px] w-full min-w-0 flex-col overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] [transform:translateZ(0)]">
      <div className="relative z-0 flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-4">
        <ModusWcTypography hierarchy="h4" size="md" weight="semibold" label="Work order WO-9821" customClass="!m-0" />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="!m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
          label="Use push-content plus targetElement when the drawer should squeeze the pane; overlays keep demos self-contained inside cards."
        />
        <div className="flex flex-wrap gap-2">
          <ModusWcButton size="sm" variant="filled" color="primary" onButtonClick={() => setOpen(true)} disabled={open}>
            <ModusWcIcon name="toggle_right_panel" decorative size="xs" />
            Open inspector
          </ModusWcButton>
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setOpen(false)} disabled={!open}>
            Hide drawer
          </ModusWcButton>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex justify-end overflow-hidden">
        <ModusWcUtilityPanel
          expanded={open}
          pushContent={false}
          onPanelClosed={() => setOpen(false)}
          customClass={
            'flex h-full w-[min(20rem,100%)] max-w-[20rem] flex-shrink-0 flex-col border-l border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] shadow-md ' +
            (open ? 'pointer-events-auto' : 'pointer-events-none invisible')
          }
        >
          <div slot="header" className="flex w-full min-w-0 items-center justify-between gap-2 border-b border-[var(--modus-wc-color-base-100)] px-4 py-2">
            <ModusWcTypography hierarchy="p" size="md" weight="semibold" label="Details" customClass="!m-0" />
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              shape="square"
              size="sm"
              aria-label="Close drawer"
              onButtonClick={() => setOpen(false)}
            >
              <ModusWcIcon name="cancel_circle" size="xs" decorative />
            </ModusWcButton>
          </div>
          <div slot="body" className="flex min-h-0 flex-col gap-3 overflow-auto p-4">
            <ModusWcTextInput label="Asset tag" placeholder="Scan or type" helperText="Drawers house dense inspectors." bordered />
            <ModusWcSelect
              label="Priority"
              bordered
              options={[
                { label: 'P1 Critical', value: 'p1' },
                { label: 'P2 Routine', value: 'p2' },
              ]}
              placeholder="Pick priority"
              size="sm"
            />
          </div>
          <div slot="footer" className="flex flex-wrap justify-end gap-2 border-t border-[var(--modus-wc-color-base-100)] px-4 py-3">
            <ModusWcButton size="sm" variant="outlined" color="tertiary">
              Discard
            </ModusWcButton>
            <ModusWcButton size="sm" variant="filled" color="primary">
              <ModusWcIcon name="save_download" decorative size="xs" />
              Save changes
            </ModusWcButton>
          </div>
        </ModusWcUtilityPanel>
      </div>
    </div>
  );
}

export default DrawerPattern;

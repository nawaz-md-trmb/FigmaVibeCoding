// @ts-nocheck
import { useState } from 'react';
import {
  ModusWcButton,
  ModusWcIcon,
  ModusWcSelect,
  ModusWcSwitch,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const DOCK_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' as const },
  { id: 'inbox', label: 'Inbox', icon: 'envelope' as const },
  { id: 'settings', label: 'Settings', icon: 'settings' as const },
];

const PLACEMENT_OPTIONS: { value: string; label: string }[] = [
  { value: 'bottom', label: 'Bottom' },
  { value: 'top', label: 'Top' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' },
];

type DockPlacement = 'bottom' | 'top' | 'left' | 'right';

export function DockPattern() {
  const [activeId, setActiveId] = useState('inbox');
  const [showLabels, setShowLabels] = useState(true);
  const [placement, setPlacement] = useState<DockPlacement>('bottom');

  const isHorizontal = placement === 'bottom' || placement === 'top';

  const navClass =
    placement === 'bottom'
      ? 'box-border flex h-12 w-full flex-row items-stretch self-stretch border-t border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]'
      : placement === 'top'
      ? 'box-border flex h-12 w-full flex-row items-stretch self-stretch border-b border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]'
      : placement === 'left'
      ? 'box-border flex h-48 w-14 min-w-14 shrink-0 flex-col items-stretch border-r border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]'
      : 'box-border flex h-48 w-14 min-w-14 shrink-0 flex-col items-stretch border-l border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]';

  const navFirst = placement === 'top' || placement === 'left';

  const dockPreviewChrome =
    'flex min-h-48 min-w-0 w-full flex-1 overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-200)]';

  const indicatorAbsClass =
    placement === 'bottom'
      ? 'absolute inset-x-0 top-0 bottom-auto h-1 '
      : placement === 'top'
      ? 'absolute inset-x-0 bottom-0 top-auto h-1 '
      : placement === 'left'
      ? 'absolute inset-y-0 right-0 left-auto w-1 '
      : 'absolute inset-y-0 left-0 right-auto w-1 ';

  const dockPreviewSpacer =
    isHorizontal
      ? 'min-h-0 min-w-0 w-full shrink-0 flex-1'
      : 'min-h-0 min-w-0 shrink-0 flex-1 self-stretch';

  function renderDockItems() {
    return DOCK_ITEMS.map(({ id, label, icon }) => {
      const active = activeId === id;
      const isVerticalRail = placement === 'left' || placement === 'right';
      const contentPad = isHorizontal ? 'px-2' : 'px-1.5 py-1.5';
      const contentClass =
        'relative box-border flex h-full min-h-0 w-full max-w-full self-stretch min-w-0 ' +
        contentPad +
        (!isHorizontal
          ? ' flex flex-col items-center justify-center'
          : ' flex-col flex-1 min-h-0');
      const innerStackGrow =
        isHorizontal && (placement === 'bottom' || placement === 'top')
          ? ' flex-1 min-h-0'
          : '';
      const horizontalStackClass =
        'flex min-h-0 w-full min-w-0 max-w-full flex-col items-center justify-center self-stretch ' +
        (showLabels ? 'gap-0.5' : 'gap-0') +
        innerStackGrow +
        (placement === 'top' ? ' basis-0 pt-1' : ' basis-0');

      const indClass =
        'pointer-events-none z-[1] ' +
        indicatorAbsClass +
        (active ? 'bg-[var(--modus-wc-color-primary)]' : 'bg-transparent');

      return (
        <div
          key={id}
          className="relative flex min-h-0 min-w-0 flex-1 flex-col self-stretch [&>modus-wc-button]:!block [&>modus-wc-button]:!w-full [&>modus-wc-button]:min-w-0 [&>modus-wc-button]:max-w-none [&>modus-wc-button]:h-full [&>modus-wc-button]:min-h-0 [&>modus-wc-button]:flex-1"
        >
          <ModusWcButton
            variant="borderless"
            color="tertiary"
            size="sm"
            fullWidth
            aria-label={showLabels ? undefined : label}
            aria-current={active ? 'page' : undefined}
            style={{
              display: 'block',
              width: '100%',
              minWidth: 0,
              height: '100%',
              minHeight: 0,
              flex: '1 1 0%',
              alignSelf: 'stretch',
            }}
            customClass={
              'relative !box-border !flex !h-full !min-h-0 !min-w-0 !max-w-none !p-0 !w-full max-h-none flex-1 !items-stretch ' +
              (isHorizontal ? '!flex-col !justify-start ' : '!justify-start ') +
              ' !rounded-none !border-0 transition-colors !bg-transparent hover:!bg-[var(--modus-wc-color-base-200)] ' +
              (active ? 'text-[var(--modus-wc-color-primary)]' : '')
            }
            onButtonClick={() => setActiveId(id)}
          >
            <span className={indClass} aria-hidden="true" />
            <div className={contentClass}>
              {isHorizontal ? (
                placement === 'bottom' ? (
                  <>
                    <div className="h-1 w-full shrink-0" data-dock-indicator-lane aria-hidden="true" />
                    <div className={horizontalStackClass}>
                      <div className="flex w-full shrink-0 justify-center">
                        <ModusWcIcon name={icon} variant="outlined" size="sm" decorative customClass={'shrink-0' + (active ? ' !text-[var(--modus-wc-color-primary)]' : '')} />
                      </div>
                      {showLabels ? (
                        <span className="flex w-full min-w-0 items-center justify-center">
                          <ModusWcTypography hierarchy="span" size="sm" label={label} customClass={'!m-0 w-full min-w-0 max-w-full truncate !text-center' + (isVerticalRail ? ' break-words text-balance' : '') + (active ? ' !text-[var(--modus-wc-color-primary)]' : '')} />
                        </span>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <div className={horizontalStackClass}>
                      <div className="flex w-full shrink-0 justify-center">
                        <ModusWcIcon name={icon} variant="outlined" size="sm" decorative customClass={'shrink-0' + (active ? ' !text-[var(--modus-wc-color-primary)]' : '')} />
                      </div>
                      {showLabels ? (
                        <span className="flex w-full min-w-0 items-center justify-center">
                          <ModusWcTypography hierarchy="span" size="sm" label={label} customClass={'!m-0 w-full min-w-0 max-w-full truncate !text-center' + (isVerticalRail ? ' break-words text-balance' : '') + (active ? ' !text-[var(--modus-wc-color-primary)]' : '')} />
                        </span>
                      ) : null}
                    </div>
                    <div className="h-1 w-full shrink-0" data-dock-indicator-lane aria-hidden="true" />
                  </>
                )
              ) : (
                <div className={'flex min-h-0 w-full min-w-0 max-w-full flex-col items-center justify-center ' + (showLabels ? 'gap-0.5' : 'gap-0')}>
                  <div className="flex w-full shrink-0 justify-center">
                    <ModusWcIcon name={icon} variant="outlined" size="sm" decorative customClass={'shrink-0' + (active ? ' !text-[var(--modus-wc-color-primary)]' : '')} />
                  </div>
                  {showLabels ? (
                    <span className="flex w-full min-w-0 items-center justify-center">
                      <ModusWcTypography hierarchy="span" size="sm" label={label} customClass={'!m-0 w-full min-w-0 max-w-full truncate !text-center' + (isVerticalRail ? ' break-words text-balance' : '') + (active ? ' !text-[var(--modus-wc-color-primary)]' : '')} />
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          </ModusWcButton>
        </div>
      );
    });
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-3">
      <div className="flex w-full flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <ModusWcSelect
            label="Position"
            options={PLACEMENT_OPTIONS}
            value={placement}
            size="sm"
            onInputChange={(e: CustomEvent) => {
              const v = String((e.detail as InputEvent)?.target?.value ?? '');
              if (v === 'bottom' || v === 'top' || v === 'left' || v === 'right') {
                setPlacement(v);
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <ModusWcTypography
            className="text-[var(--modus-wc-color-base-content-low-contrast)]"
            hierarchy="span"
            size="sm"
            label="Labels"
            customClass="!m-0"
          />
          <ModusWcSwitch
            value={showLabels}
            onInputChange={(e: CustomEvent) => {
              const d = e.detail as InputEvent;
              setShowLabels(Boolean(d?.target?.checked));
            }}
          />
        </div>
      </div>
      <div
        data-dock-demo-stage
        className={dockPreviewChrome + (isHorizontal ? ' flex-col' : ' flex-row items-stretch')}
      >
        {navFirst ? (
          <>
            <nav aria-label="Primary" aria-orientation={isHorizontal ? 'horizontal' : 'vertical'} className={navClass + ' shrink-0'}>
              {renderDockItems()}
            </nav>
            <div className={dockPreviewSpacer} aria-hidden="true" />
          </>
        ) : (
          <>
            <div className={dockPreviewSpacer} aria-hidden="true" />
            <nav aria-label="Primary" aria-orientation={isHorizontal ? 'horizontal' : 'vertical'} className={navClass + ' shrink-0'}>
              {renderDockItems()}
            </nav>
          </>
        )}
      </div>
    </div>
  );
}

export default DockPattern;

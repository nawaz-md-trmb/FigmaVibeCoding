// @ts-nocheck
import { useState } from 'react';
import type { ISelectOption } from '@trimble-oss/moduswebcomponents';
import { ModusWcSelect } from '@trimble-oss/moduswebcomponents-react';

const STYLE_OPTIONS: ISelectOption[] = [
  { label: 'macOS', value: 'macos' },
  { label: 'Windows', value: 'windows' },
  { label: 'Web / generic', value: 'web' },
];

export function WindowMockupPattern() {
  const [chrome, setChrome] = useState('macos');

  const demoSrcDoc =
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><style>html,body{height:100%;margin:0}body{display:flex;align-items:center;justify-content:center;background:#f4f2fb;font:13px system-ui,sans-serif}</style></head><body>Embedded preview</body></html>';

  const outerRound = chrome === 'windows' ? 'rounded-none' : 'rounded-t-xl';

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-2 py-3">
      <ModusWcSelect
        label="Title bar style"
        size="sm"
        value={chrome}
        options={STYLE_OPTIONS}
        onInputChange={(e) => setChrome(String(e.detail?.target?.value ?? 'macos'))}
      />

      <div
        role="figure"
        aria-label="Window mockup frame"
        className={`flex w-full min-w-0 flex-col overflow-hidden border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] shadow-[var(--app-elevation-md)] ${outerRound}`}
      >
        <div className="flex h-9 w-full shrink-0 flex-row items-center border-b border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]">
          {chrome === 'windows' ? (
            <>
              <div className="min-w-0 flex-1" />
              <div className="flex shrink-0 flex-row items-center text-[var(--modus-wc-color-base-content)]" aria-hidden="true">
                <span className="flex w-11 items-center justify-center text-lg leading-none">&#8722;</span>
                <span className="flex w-11 items-center justify-center text-sm leading-none">&#9633;</span>
                <span className="flex w-11 items-center justify-center text-lg font-light leading-none">&#10005;</span>
              </div>
            </>
          ) : chrome === 'web' ? (
            <>
              <div className="flex items-center gap-1.5 px-3" aria-hidden="true">
                <span className="size-2.5 shrink-0 rounded-full bg-[var(--modus-wc-color-base-300)]" />
                <span className="size-2.5 shrink-0 rounded-full bg-[var(--modus-wc-color-base-300)]" />
                <span className="size-2.5 shrink-0 rounded-full bg-[var(--modus-wc-color-base-300)]" />
              </div>
              <div className="min-w-0 flex-1" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 px-3" aria-hidden="true">
                <span className="size-3 shrink-0 rounded-full bg-[#ec6b5e]" />
                <span className="size-3 shrink-0 rounded-full bg-[#f4be4f]" />
                <span className="size-3 shrink-0 rounded-full bg-[#61c554]" />
              </div>
              <div className="min-w-0 flex-1" />
            </>
          )}
        </div>

        <div className="w-full min-w-0 bg-[var(--modus-wc-color-base-100)]">
          <iframe
            title="Embedded preview"
            className="block h-[min(320px,45vh)] w-full border-0 bg-[var(--modus-wc-color-base-100)]"
            srcDoc={demoSrcDoc}
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}

export default WindowMockupPattern;

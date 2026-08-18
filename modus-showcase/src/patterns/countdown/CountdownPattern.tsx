// @ts-nocheck
import { useEffect, useState } from 'react';
import {
  ModusWcButton,
  ModusWcCard,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

function pad2(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

export function CountdownPattern() {
  const [totalSec, setTotalSec] = useState(86400 + 3600 + 60 + 1);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTotalSec((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const units = [
    { value: pad2(days), label: 'days' },
    { value: pad2(hours), label: 'hours' },
    { value: pad2(minutes), label: 'minutes' },
    { value: pad2(seconds), label: 'sec' },
  ];

  return (
    <ModusWcCard bordered={false} padding="compact" customClass={`max-w-2xl ${BORDER}`}>
      <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Countdown" />
      <div className="flex flex-col gap-3">
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="sr-only !m-0"
          aria-live="polite"
          aria-atomic="true"
          label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Set countdown duration">
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setTotalSec(86400)}>
            1 day
          </ModusWcButton>
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setTotalSec(3600)}>
            1 hr
          </ModusWcButton>
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setTotalSec(600)}>
            10 mins
          </ModusWcButton>
          <ModusWcButton size="sm" variant="outlined" color="tertiary" onButtonClick={() => setTotalSec(60)}>
            1 minute
          </ModusWcButton>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start" role="group" aria-label="Time remaining">
          {units.map((u) => (
            <div
              key={u.label}
              className="flex min-w-[4.5rem] flex-col items-center justify-center rounded-2xl bg-[var(--modus-wc-color-base-content)] px-4 py-3 text-[var(--modus-wc-color-base-page)] sm:min-w-[5.25rem] sm:px-5 sm:py-4"
            >
              <ModusWcTypography
                hierarchy="p"
                size="2xl"
                weight="bold"
                label={u.value}
                customClass="!m-0 tabular-nums [font-variant-numeric:slashed-zero] leading-none"
              />
              <ModusWcTypography
                hierarchy="p"
                size="sm"
                label={u.label}
                customClass="!m-0 mt-1.5 lowercase leading-none [color:color-mix(in_srgb,var(--modus-wc-color-base-page)_88%,transparent)]"
              />
            </div>
          ))}
        </div>
      </div>
    </ModusWcCard>
  );
}

export default CountdownPattern;

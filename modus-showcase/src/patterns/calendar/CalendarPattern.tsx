// @ts-nocheck
import { useState } from 'react';
import {
  ModusWcCard,
  ModusWcDate,
  ModusWcInputLabel,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

export function CalendarPattern() {
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');

  return (
    <ModusWcCard bordered={false} padding="compact" customClass={`max-w-xl ${BORDER}`}>
      <ModusWcTypography slot="title" hierarchy="h4" size="md" weight="semibold" label="Event window" />
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-2">
            <ModusWcInputLabel forId="cal-start" labelText="Starts" />
            <ModusWcDate
              inputId="cal-start"
              format="yyyy-mm-dd"
              value={eventStartDate}
              placeholder="yyyy-mm-dd"
              onInputChange={(e) => {
                const t = e.detail?.target;
                setEventStartDate(String(t?.value ?? ''));
              }}
              customClass="w-full min-w-0"
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <ModusWcInputLabel forId="cal-end" labelText="Ends" />
            <ModusWcDate
              inputId="cal-end"
              format="yyyy-mm-dd"
              value={eventEndDate}
              placeholder="yyyy-mm-dd"
              onInputChange={(e) => {
                const t = e.detail?.target;
                setEventEndDate(String(t?.value ?? ''));
              }}
              customClass="w-full min-w-0"
            />
          </div>
        </div>
      </div>
    </ModusWcCard>
  );
}

export default CalendarPattern;

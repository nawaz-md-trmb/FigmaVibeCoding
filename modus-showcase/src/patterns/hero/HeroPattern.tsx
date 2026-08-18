// @ts-nocheck
import {
  ModusWcBadge,
  ModusWcButton,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

export function HeroPattern() {
  return (
    <div className={`relative isolate overflow-hidden rounded-2xl ${BORDER}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--modus-wc-color-primary)]/25 via-transparent to-transparent" aria-hidden />
      <div className="relative flex flex-col gap-4 p-8 sm:p-10">
        <div className="flex flex-wrap gap-2">
          <ModusWcBadge variant="filled" color="primary" size="sm">
            Fleet AI preview
          </ModusWcBadge>
          <ModusWcBadge variant="outlined" color="tertiary" size="sm">
            Updated weekly
          </ModusWcBadge>
        </div>
        <ModusWcTypography
          hierarchy="h1"
          size="3xl"
          weight="semibold"
          label="Operational clarity for every technician"
          customClass="max-w-xl !m-0 text-[var(--modus-wc-color-base-content)]"
        />
        <ModusWcTypography
          hierarchy="p"
          size="md"
          label="Modus typography + badges keep oversized headers tied to WCAG-compliant contrast modes even when layering gradients underneath."
          customClass="max-w-2xl !m-0 text-[var(--modus-wc-color-base-content-low-contrast)]"
        />
        <div className="flex flex-wrap gap-2">
          <ModusWcButton size="md" variant="filled" color="primary">
            <ModusWcIcon name="play_circle" decorative size="sm" />
            Watch overview
          </ModusWcButton>
          <ModusWcButton size="md" variant="outlined" color="tertiary">
            Explore modules
          </ModusWcButton>
        </div>
      </div>
    </div>
  );
}

export default HeroPattern;

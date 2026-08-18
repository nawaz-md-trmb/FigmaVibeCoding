// @ts-nocheck
import {
  ModusWcAvatar,
  ModusWcBadge,
  ModusWcCard,
  ModusWcProgress,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const BORDER =
  'border border-[var(--modus-wc-color-base-200)] rounded-lg overflow-hidden';

/** Widget tile pattern (simplified from dashboard resizable shell — uses Modus card + media header). */
export function WidgetPattern() {
  const featured = {
    name: 'Site Prep Phase',
    status: 'active',
    progress: 65,
    owner: 'JD',
    ownerName: 'Jane Doe',
    imageUrl: '/assets/brandImages/25-Deck-Field-01-0J8A2931.jpg',
  };
  const statusLabel = featured.status.charAt(0).toUpperCase() + featured.status.slice(1);

  return (
    <ModusWcCard bordered={false} padding="compact" customClass={`max-w-xl overflow-hidden p-0 ${BORDER}`}>
      <div slot="header" className="w-full aspect-[16/9] overflow-hidden bg-[var(--modus-wc-color-base-200)]">
        <img src={featured.imageUrl} alt="" className="h-full w-full object-cover" />
      </div>
      <div slot="title" className="flex w-full flex-col gap-1">
        <ModusWcTypography hierarchy="h4" size="lg" weight="semibold" label={featured.name} />
        <ModusWcBadge variant="filled" color="success">
          {statusLabel}
        </ModusWcBadge>
        <ModusWcProgress value={featured.progress} max={100} customClass="w-full" />
        <ModusWcTypography
          hierarchy="p"
          size="xs"
          label={`${featured.progress}% complete`}
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
        />
      </div>
      <div slot="actions" className="flex min-w-0 shrink-0 items-center gap-1">
        <ModusWcAvatar size="xs" initials={featured.owner} />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          customClass="truncate text-[var(--modus-wc-color-base-content)]"
          label={featured.ownerName}
        />
      </div>
    </ModusWcCard>
  );
}

export default WidgetPattern;

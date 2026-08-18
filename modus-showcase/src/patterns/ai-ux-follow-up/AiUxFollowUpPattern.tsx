// @ts-nocheck
import { useCallback, useState } from 'react';
import {
  ModusWcButton,
  ModusWcChip,
  ModusWcIcon,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

const DEFAULT_OVERFLOW_CHIPS = [
  'Last 90 days',
  'Show citations',
  'Shorter answer',
  'Step-by-step',
] as const;

const PRIMARY_CHIPS = ['Last 30 days', 'Bullet list', 'Include sources'];

type ActiveKey = { kind: 'p' | 'o'; index: number };

function labelForKey(
  key: ActiveKey,
  primaryChips: readonly string[],
  overflowChips: readonly string[],
): string {
  return key.kind === 'p' ? primaryChips[key.index] ?? '' : overflowChips[key.index] ?? '';
}

type ChipRowProps = {
  primaryChips: readonly string[];
  overflowChips: readonly string[];
  overflowTriggerLabel?: string;
  showSelectedHint?: boolean;
  className?: string;
};

function AiUxFollowUpChipRow({
  primaryChips,
  overflowChips,
  overflowTriggerLabel,
  showSelectedHint = false,
  className = '',
}: ChipRowProps) {
  const [active, setActive] = useState<ActiveKey | null>(null);
  const [overflowOpen, setOverflowOpen] = useState(false);

  const overflowList = [...overflowChips];
  const nOverflow = overflowList.length;
  const triggerLabel = overflowTriggerLabel ?? (nOverflow > 0 ? `+${nOverflow}` : null);

  const collapseOverflow = useCallback(() => {
    setOverflowOpen(false);
    setActive((prev) => (prev?.kind === 'o' ? null : prev));
  }, []);

  const togglePrimary = (index: number) => {
    const next: ActiveKey = { kind: 'p', index };
    setActive((prev) => (prev?.kind === 'p' && prev.index === index ? null : next));
  };

  const toggleOverflow = (index: number) => {
    const next: ActiveKey = { kind: 'o', index };
    setActive((prev) => (prev?.kind === 'o' && prev.index === index ? null : next));
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`.trim()}>
      <div className="flex flex-wrap items-center gap-2">
        {primaryChips.map((label, index) => (
          <ModusWcChip
            key={`p-${index}-${label}`}
            label={label}
            size="sm"
            variant="outline"
            active={active?.kind === 'p' && active.index === index}
            onChipClick={() => togglePrimary(index)}
          />
        ))}
        {overflowOpen ? (
          <>
            {overflowList.map((label, index) => (
              <ModusWcChip
                key={`o-${index}-${label}`}
                label={label}
                size="sm"
                variant="outline"
                active={active?.kind === 'o' && active.index === index}
                onChipClick={() => toggleOverflow(index)}
              />
            ))}
            <ModusWcButton
              variant="borderless"
              color="tertiary"
              size="sm"
              shape="square"
              aria-label="Hide extra options"
              onButtonClick={collapseOverflow}
            >
              <ModusWcIcon name="chevron_left" size="sm" decorative />
            </ModusWcButton>
          </>
        ) : triggerLabel && nOverflow > 0 ? (
          <ModusWcChip
            label={triggerLabel}
            size="sm"
            variant="outline"
            aria-label={`Show ${nOverflow} more options`}
            onChipClick={() => setOverflowOpen(true)}
          />
        ) : null}
      </div>
      {showSelectedHint && active ? (
        <ModusWcTypography
          hierarchy="p"
          size="xs"
          customClass="text-[var(--modus-wc-color-base-content-low-contrast)]"
          label={`Selected: ${labelForKey(active, primaryChips, overflowList)} (demo)`}
        />
      ) : null}
    </div>
  );
}

export function AiUxFollowUpPattern() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <ModusWcIcon name="ai_stars" size="sm" decorative />
        <ModusWcTypography
          hierarchy="p"
          size="sm"
          weight="semibold"
          label="Recommended follow-up actions"
        />
      </div>
      <AiUxFollowUpChipRow
        primaryChips={PRIMARY_CHIPS}
        overflowChips={DEFAULT_OVERFLOW_CHIPS}
        showSelectedHint
      />
    </div>
  );
}

export default AiUxFollowUpPattern;

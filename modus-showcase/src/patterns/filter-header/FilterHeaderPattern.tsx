// @ts-nocheck
import { useCallback, useState } from 'react';
import {
  ModusWcButton,
  ModusWcChip,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
  ModusWcTextInput,
} from '@trimble-oss/moduswebcomponents-react';

function readSearchValue(e: CustomEvent): string {
  return (e.detail?.target as HTMLInputElement | undefined)?.value ?? '';
}

function closeDropdownMenuFromItemEvent(e: CustomEvent) {
  const host = (e.target as HTMLElement | null)?.closest('modus-wc-dropdown-menu');
  if (host) {
    (host as HTMLElement & { menuVisible: boolean }).menuVisible = false;
  }
}

const FILTER_CHIP_IDS = ['1', '2', '3', '4', '5', '6', '7'] as const;

/** Toolbar row: filters toggle, facet chips, search field, and overflow actions. */
export function FilterHeaderPattern() {
  const [query, setQuery] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [activeFilters, setActiveFilters] = useState<ReadonlySet<string>>(
    () => new Set(['1']),
  );

  const toggleFilter = useCallback((id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const removeFilter = useCallback((id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <div className="@container w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col gap-3 px-4 py-4 @lg:flex-row @lg:items-center @lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <ModusWcButton
            variant="outlined"
            color="tertiary"
            size="sm"
            customClass="shrink-0"
            aria-expanded={filtersExpanded}
            aria-controls="filter-header-facet-chips"
            onButtonClick={() => setFiltersExpanded((prev) => !prev)}
          >
            <ModusWcIcon name="filter_list" size="xs" decorative />
            Filters
            <ModusWcIcon
              name={filtersExpanded ? 'expand_less' : 'expand_more'}
              size="xs"
              decorative
            />
          </ModusWcButton>
          <div
            id="filter-header-facet-chips"
            role="group"
            aria-label="Active filters"
            hidden={!filtersExpanded}
            className="flex min-w-0 flex-wrap items-center gap-2"
          >
            {FILTER_CHIP_IDS.map((id) => {
              const active = activeFilters.has(id);
              return (
                <ModusWcChip
                  key={id}
                  label="Filter"
                  size="sm"
                  active={active}
                  variant={active ? 'filled' : 'outline'}
                  showRemove={active}
                  onChipClick={() => toggleFilter(id)}
                  onChipRemove={() => removeFilter(id)}
                  aria-label={
                    active ? 'Filter facet, active. Press remove to clear.' : 'Filter facet'
                  }
                />
              );
            })}
          </div>
        </div>
        <div className="flex w-full min-w-0 items-center gap-2 @lg:max-w-md @lg:shrink-0 @lg:flex-1">
          <div className="min-w-0 flex-1">
            <ModusWcTextInput
              customClass="w-full min-w-0"
              type="search"
              size="sm"
              placeholder="Search"
              value={query}
              includeSearch
              onInputChange={(e: CustomEvent) => setQuery(readSearchValue(e))}
              aria-label="Search"
            />
          </div>
          <div className="shrink-0">
            <ModusWcDropdownMenu
              buttonAriaLabel="More actions"
              buttonShape="square"
              buttonVariant="outlined"
              buttonColor="tertiary"
              buttonSize="sm"
              menuPlacement="bottom-end"
            >
              <div slot="button">
                <ModusWcIcon name="more_vertical" decorative />
              </div>
              <div slot="menu">
                <ModusWcMenuItem
                  label="Export"
                  value="export"
                  onItemSelect={closeDropdownMenuFromItemEvent}
                />
                <ModusWcMenuItem
                  label="Save view"
                  value="save-view"
                  onItemSelect={closeDropdownMenuFromItemEvent}
                />
                <ModusWcMenuItem
                  label="Reset filters"
                  value="reset-filters"
                  onItemSelect={(e) => {
                    setActiveFilters(new Set());
                    closeDropdownMenuFromItemEvent(e);
                  }}
                />
              </div>
            </ModusWcDropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterHeaderPattern;

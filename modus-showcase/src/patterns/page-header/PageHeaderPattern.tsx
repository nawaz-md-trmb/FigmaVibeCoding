// @ts-nocheck
import { useCallback, useState } from "react";
import {
  ModusWcBreadcrumbs,
  ModusWcButton,
  ModusWcChip,
  ModusWcDropdownMenu,
  ModusWcIcon,
  ModusWcMenuItem,
  ModusWcTextInput,
  ModusWcTypography,
} from "@trimble-oss/moduswebcomponents-react";

function readSearchValue(e: CustomEvent): string {
  return (e.detail?.target as HTMLInputElement | undefined)?.value ?? "";
}

function closeDropdownMenuFromItemEvent(e: CustomEvent) {
  const host = (e.target as HTMLElement | null)?.closest("modus-wc-dropdown-menu");
  if (host) {
    (host as HTMLElement & { menuVisible: boolean }).menuVisible = false;
  }
}

/** Top row: breadcrumbs + trailing utility actions (settings, overflow, primary menu). */
export function BreadcrumbHeaderPatternDemo() {
  return (
    <header className="flex w-full min-w-0 flex-wrap items-center justify-between gap-3 px-4 py-4">
      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ModusWcBreadcrumbs
          items={[
            { label: "Home", url: "#" },
            { label: "Projects", url: "#" },
            { label: "Current page" },
          ]}
        />
      </nav>
      <div className="flex shrink-0 items-center gap-2">
        <ModusWcButton
          variant="outlined"
          color="tertiary"
          size="sm"
          shape="square"
          aria-label="Settings"
        >
          <ModusWcIcon name="settings" size="xs" decorative />
        </ModusWcButton>
        <ModusWcButton
          variant="outlined"
          color="tertiary"
          size="sm"
          shape="square"
          aria-label="More actions"
        >
          <ModusWcIcon name="more_vertical" size="xs" decorative />
        </ModusWcButton>
        <ModusWcDropdownMenu
          buttonVariant="filled"
          buttonColor="primary"
          buttonSize="sm"
          menuPlacement="bottom-end"
        >
          <div slot="button" className="flex items-center gap-1">
            <ModusWcIcon name="add" size="xs" decorative />
            Button
            <ModusWcIcon name="expand_more" size="xs" decorative />
          </div>
          <div slot="menu">
            <ModusWcMenuItem label="Action" value="action" />
            <ModusWcMenuItem label="Another action" value="other" />
          </div>
        </ModusWcDropdownMenu>
      </div>
    </header>
  );
}

/** Middle row: leading icon + page title. */
export function TitleHeaderPatternDemo({
  embedded = false,
}: {
  /** When true, omit bottom border (parent uses dividers, e.g. full page header stack). */
  embedded?: boolean;
} = {}) {
  return (
    <div
      className={
        embedded
          ? "flex w-full min-w-0 items-center gap-2 px-4 py-4"
          : "flex w-full min-w-0 items-center gap-2 border-b border-[var(--modus-wc-color-base-200)] px-4 py-4"
      }
    >
      <ModusWcIcon
        name="cube"
        size="lg"
        decorative
        className="size-8 shrink-0 translate-y-px"
      />
      <ModusWcTypography
        className="min-w-0 flex-1"
        hierarchy="h2"
        size="2xl"
        weight="bold"
        label="Title"
        customClass="truncate leading-tight !my-0"
      />
    </div>
  );
}

const FILTER_CHIP_IDS = ["1", "2", "3", "4", "5", "6", "7"] as const;

/** Bottom row: filters control + facet chips + search + overflow. */
export function FilterHeaderPatternDemo() {
  const [query, setQuery] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [activeFilters, setActiveFilters] = useState<ReadonlySet<string>>(
    () => new Set(["1"]),
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
              name={filtersExpanded ? "expand_less" : "expand_more"}
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
                  variant={active ? "filled" : "outline"}
                  showRemove={active}
                  onChipClick={() => toggleFilter(id)}
                  onChipRemove={() => removeFilter(id)}
                  aria-label={
                    active ? "Filter facet, active. Press remove to clear." : "Filter facet"
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

/** Full page header: breadcrumb row, title row, and filter row stacked. */
export function PageHeaderPatternDemo() {
  return (
    <div className="w-full max-w-5xl divide-y divide-[var(--modus-wc-color-base-200)] overflow-hidden rounded-lg border border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)]">
      <BreadcrumbHeaderPatternDemo />
      <TitleHeaderPatternDemo embedded />
      <FilterHeaderPatternDemo />
    </div>
  );
}

/** Default export for CLI / pattern registry. */
export default PageHeaderPatternDemo;

export { PageHeaderPatternDemo as PageHeaderPattern };

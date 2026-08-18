// @ts-nocheck
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ModusWcPagination,
  ModusWcSelect,
  ModusWcTextInput,
  ModusWcTypography,
} from '@trimble-oss/moduswebcomponents-react';

function maxVisibleButtonsForWidth(widthPx: number) {
  if (typeof widthPx !== 'number' || widthPx <= 0) return 5;
  if (widthPx <= 479) return 2;
  if (widthPx <= 767) return 3;
  return 5;
}

export function PaginationFooterPattern() {
  const rowTotal = 523;
  const [pageSize, setPageSize] = useState(50);
  const [page, setPage] = useState(1);
  const [gotoDraft, setGotoDraft] = useState('1');
  const containerRef = useRef<HTMLDivElement>(null);
  const paginationHostRef = useRef<HTMLElement>(null);

  const pageCount = Math.max(1, Math.ceil(rowTotal / pageSize));
  const firstRow = Math.min(rowTotal, (page - 1) * pageSize + 1);
  const lastRow = Math.min(rowTotal, page * pageSize);

  const sizes = [
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
  ];

  const syncPagerWindow = useCallback(() => {
    const el = paginationHostRef.current;
    const wrap = containerRef.current;
    if (!el) return;
    const w = wrap?.getBoundingClientRect().width ?? 0;
    const next = maxVisibleButtonsForWidth(w);
    const host = el as HTMLElement & { maxVisibleButtons?: number; calculateVisiblePages?: () => void };
    host.maxVisibleButtons = next;
    if (typeof host.calculateVisiblePages === 'function') {
      host.calculateVisiblePages();
    }
  }, []);

  useLayoutEffect(() => {
    syncPagerWindow();
  }, [syncPagerWindow, page, pageCount]);

  useEffect(() => {
    const wrap = containerRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => syncPagerWindow());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [syncPagerWindow]);

  useEffect(() => {
    setGotoDraft(String(page));
  }, [page]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  const clampAndSetPageFromField = () => {
    let n = Number.parseInt(gotoDraft, 10);
    if (Number.isNaN(n)) {
      setGotoDraft(String(page));
      return;
    }
    n = Math.min(pageCount, Math.max(1, n));
    setPage(n);
    setGotoDraft(String(n));
  };

  const wideRangeCaption = (
    <p className="m-0 inline-flex shrink-0 items-baseline gap-x-1 whitespace-nowrap text-sm text-[var(--modus-wc-color-base-content)]">
      <span>Showing </span>
      <span className="font-semibold tabular-nums">
        {firstRow}&ndash;{lastRow}
      </span>
      <span> / </span>
      <span className="font-semibold tabular-nums">{rowTotal}</span>
    </p>
  );

  return (
    <div ref={containerRef} className="@container w-full min-w-0" data-pagination-footer-pattern>
      <nav
        aria-label="Table pagination footer"
        className="flex w-full min-w-0 overflow-x-visible overflow-y-visible overscroll-x-contain border-t border-[var(--modus-wc-color-base-200)] bg-[var(--modus-wc-color-base-page)] px-[var(--modus-wc-spacing-md)] py-[var(--modus-wc-spacing-md)] @lg:overflow-x-auto @lg:overflow-y-hidden"
      >
        <div className="flex w-full min-w-0 flex-wrap items-center gap-x-[var(--modus-wc-spacing-sm)] gap-y-[var(--modus-wc-spacing-md)] justify-between @lg:flex-nowrap @lg:gap-x-[var(--modus-wc-spacing-xl)] @lg:gap-y-0">
          <div className="hidden w-full shrink-0 flex-row flex-wrap items-center gap-x-[var(--modus-wc-spacing-sm)] gap-y-[var(--modus-wc-spacing-sm)] @lg:flex @lg:w-auto @lg:max-w-none @lg:flex-nowrap @lg:shrink-0">
            <ModusWcTypography hierarchy="p" size="sm" customClass="hidden !m-0 shrink-0 @md:block @md:whitespace-nowrap" label="Results:" />
            <div className="min-w-[5rem] max-w-[6rem] shrink-0 [&_modus-wc-select]:my-0">
              <ModusWcSelect
                inputId="pagination-footer-rows"
                aria-label="Results per page"
                value={String(pageSize)}
                options={sizes}
                size="sm"
                onInputChange={(e: CustomEvent) => {
                  const raw = String(e.detail?.target?.value ?? '');
                  const next = Number.parseInt(raw, 10);
                  if (!Number.isNaN(next)) {
                    setPageSize(next);
                    setPage(1);
                  }
                }}
              />
            </div>
            <div className="hidden min-w-0 @lg:flex @lg:flex-nowrap @lg:items-center">{wideRangeCaption}</div>
          </div>

          <div className="flex w-full min-w-0 shrink-0 basis-full flex-col items-center gap-y-[var(--modus-wc-spacing-sm)] overflow-x-auto overflow-y-visible overscroll-x-contain py-px @lg:min-w-0 @lg:basis-auto @lg:w-auto @lg:flex-1 @lg:flex-row @lg:flex-nowrap @lg:justify-center @lg:gap-x-[var(--modus-wc-spacing-sm)] @lg:gap-y-0 @lg:overflow-x-visible">
            <ModusWcPagination
              ref={paginationHostRef}
              count={pageCount}
              page={page}
              size="sm"
              customClass="shrink-0"
              ariaLabelValues={{
                firstPage: 'First page',
                lastPage: 'Last page',
                nextPage: 'Next page',
                previousPage: 'Previous page',
                page: 'Page {0}',
              }}
              onPageChange={(e) => setPage(e.detail.newPage)}
            />
          </div>

          <div className="hidden shrink-0 flex-row flex-nowrap items-center justify-end gap-[var(--modus-wc-spacing-sm)] @lg:flex @lg:shrink-0">
            <ModusWcTypography hierarchy="span" size="sm" customClass="hidden !m-0 shrink-0 @md:inline @md:whitespace-nowrap" label="Page" />
            <div data-pagination-footer-page-jump>
              <ModusWcTextInput
                inputId="pagination-footer-jump-wide"
                value={gotoDraft}
                size="sm"
                customClass="min-w-0"
                aria-label="Go to page"
                enterkeyhint="done"
                onInputChange={(e: CustomEvent) => setGotoDraft(String(e.detail?.target?.value ?? ''))}
                onInputBlur={clampAndSetPageFromField}
              />
            </div>
            <ModusWcTypography hierarchy="span" size="sm" customClass="tabular-nums whitespace-nowrap !m-0" label={'/ ' + String(pageCount)} />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default PaginationFooterPattern;

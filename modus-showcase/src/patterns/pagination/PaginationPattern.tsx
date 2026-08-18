// @ts-nocheck
import { useState } from 'react';
import { ModusWcPagination, ModusWcTypography } from '@trimble-oss/moduswebcomponents-react';

export function Pagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="space-y-4">
      <ModusWcPagination
        page={currentPage}
        count={totalPages}
        onPageChange={(e: CustomEvent<{ newPage: number; prevPage: number }>) => setCurrentPage(e.detail.newPage)}
        size="md"
      />
      <ModusWcTypography hierarchy="p" size="sm" customClass="text-[var(--modus-wc-color-base-content-low-contrast)]" label={`Page ${currentPage} of ${totalPages}`} />
    </div>
  );
}

export default Pagination;

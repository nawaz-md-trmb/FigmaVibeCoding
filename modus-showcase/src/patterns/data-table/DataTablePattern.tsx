// @ts-nocheck
import { useRef, useLayoutEffect } from 'react';
import { ModusWcTable } from '@trimble-oss/moduswebcomponents-react';

export function DataTable() {
  const tableRef = useRef(null);

  const tableData = [
    { id: '1', name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Admin' },
    { id: '2', name: 'Bob Smith', email: 'bob.smith@example.com', role: 'User' },
    { id: '3', name: 'Carol Williams', email: 'carol.williams@example.com', role: 'User' },
    { id: '4', name: 'David Brown', email: 'david.brown@example.com', role: 'Manager' },
    { id: '5', name: 'Emma Davis', email: 'emma.davis@example.com', role: 'User' }
  ];

  const tableColumns = [
    { id: 'name', header: 'Name', accessor: 'name', sortable: true },
    { id: 'email', header: 'Email', accessor: 'email', sortable: true },
    { id: 'role', header: 'Role', accessor: 'role', sortable: true }
  ];

  useLayoutEffect(() => {
    if (tableRef.current) {
      tableRef.current.columns = tableColumns;
      tableRef.current.data = tableData;
    }
  }, []);

  return (
    <>
      <style>{`
        .table-page-bg modus-wc-table .modus-wc-table {
          background-color: var(--modus-wc-color-base-page) !important;
        }
        .table-page-bg modus-wc-table table {
          background-color: var(--modus-wc-color-base-page) !important;
        }
      `}</style>
      <div className="table-page-bg">
        <ModusWcTable
          ref={tableRef}
          columns={tableColumns}
          data={tableData}
          sortable={true}
          hover={true}
          customClass="w-full"
        />
      </div>
    </>
  );
}

export default DataTable;

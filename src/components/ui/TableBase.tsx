import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { FaPen, FaTrash } from 'react-icons/fa';
import { useTheme } from '../../shared/context/ThemeContext';

interface GenericTableProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnDef<T, string>[];
  selectRow: (row: T) => void;
  openModal: () => void;
  openDeleteOption: () => void;
  showActions?: boolean;
}

function TableBase<T extends { id: string | number }>({
  data,
  columns,
  selectRow,
  openModal,
  openDeleteOption,
  showActions = true,
}: GenericTableProps<T>) {
  const { theme } = useTheme();
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table
        className="table-auto w-full border-collapse"
        style={{
          border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
        }}
      >
        <thead
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left"
                  style={{
                    border: `1px solid ${
                      theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }`,
                    color: theme === 'dark' ? '#ffffff' : '#111827',
                    fontWeight: '600',
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
              {showActions && (
                <th
                  className="px-4 py-2 text-left"
                  style={{
                    border: `1px solid ${
                      theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }`,
                    color: theme === 'dark' ? '#ffffff' : '#111827',
                    fontWeight: '600',
                  }}
                >
                  Acciones
                </th>
              )}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.original.id}
              className="transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#1f2937' : '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#111827' : '#ffffff';
              }}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-2"
                  style={{
                    border: `1px solid ${
                      theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }`,
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              {showActions && (
                <td
                  className="px-4 py-2 text-right"
                  style={{
                    border: `1px solid ${
                      theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }`,
                  }}
                >
                  <div className="flex items-center justify-end gap-2">
                    <button
                      aria-label="Editar"
                      className="p-2 rounded-full transition"
                      style={{
                        backgroundColor:
                          theme === 'dark' ? '#1e40af' : '#dbeafe',
                        color: theme === 'dark' ? '#bfdbfe' : '#1e40af',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme === 'dark' ? '#1d4ed8' : '#bfdbfe';
                        e.currentTarget.style.color =
                          theme === 'dark' ? '#ffffff' : '#1e3a8a';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme === 'dark' ? '#1e40af' : '#dbeafe';
                        e.currentTarget.style.color =
                          theme === 'dark' ? '#bfdbfe' : '#1e40af';
                      }}
                      onClick={() => {
                        openModal();
                        selectRow(row.original);
                      }}
                    >
                      <FaPen size={14} />
                    </button>
                    <button
                      aria-label="Eliminar"
                      className="p-2 rounded-full transition"
                      style={{
                        backgroundColor:
                          theme === 'dark' ? '#dc2626' : '#fee2e2',
                        color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme === 'dark' ? '#b91c1c' : '#fecaca';
                        e.currentTarget.style.color =
                          theme === 'dark' ? '#ffffff' : '#991b1b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          theme === 'dark' ? '#dc2626' : '#fee2e2';
                        e.currentTarget.style.color =
                          theme === 'dark' ? '#fca5a5' : '#dc2626';
                      }}
                      onClick={() => {
                        openDeleteOption();
                        selectRow(row.original);
                      }}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableBase;

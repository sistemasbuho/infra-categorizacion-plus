import React from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Articulo } from '../../../../hooks/useArticulosLideres';
import { createArticulosColumns } from './ArticulosColumns';
import TableBase from '../../../../utils/table/TableBase';
import { Skeleton } from '../../../../components/ui/Skeleton';

interface ArticulosTableProps {
  articulos: Articulo[];
  isLoading: boolean;
  onDeleteArticle: (article: Articulo) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
}

export const ArticulosTable: React.FC<ArticulosTableProps> = ({
  articulos,
  isLoading,
  onDeleteArticle,
  pageSize,
  onPageSizeChange,
  onPageChange,
}) => {
  const { theme } = useTheme();

  const columns = createArticulosColumns(onDeleteArticle);

  return (
    <div className="space-y-4">
      {/* Selector de tamaño de página */}
      <div className="flex items-center gap-2">
        <span
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Mostrar
        </span>
        <select
          className="rounded p-1"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1);
          }}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          registros
        </span>
      </div>

      {/* Tabla */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <Skeleton columns={columns.length} rows={5} />
        ) : articulos.length > 0 ? (
          <TableBase
            columns={columns}
            data={articulos}
            selectRow={() => {}}
            openModal={() => {}}
            openDeleteOption={() => {}}
            showActions={false}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h2
              className="text-xl font-semibold"
              style={{
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              }}
            >
              No se han encontrado artículos.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

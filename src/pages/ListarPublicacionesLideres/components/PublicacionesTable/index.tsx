import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Publicacion } from '../../hooks/usePublicacionesLideres';
import { createPublicacionesColumns } from './PublicacionesColumns';
import { Skeleton } from '../../../../shared/components/ui/Skeleton';
import TableBase from '../../../../shared/components/ui/TableBase';

interface PublicacionesTableProps {
  publicaciones: Publicacion[];
  isLoading: boolean;
  onDeletePublicacion: (publicacion: Publicacion) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  onPageChange: (page: number) => void;
}

export const PublicacionesTable: React.FC<PublicacionesTableProps> = ({
  publicaciones,
  isLoading,
  onDeletePublicacion,
  pageSize,
  onPageSizeChange,
  onPageChange,
}) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const columns = createPublicacionesColumns(onDeletePublicacion, navigate);

  return (
    <div className="space-y-4">
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

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <Skeleton columns={columns.length} rows={5} />
        ) : publicaciones.length > 0 ? (
          <TableBase
            columns={columns}
            data={publicaciones}
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
              No se han encontrado publicaciones.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

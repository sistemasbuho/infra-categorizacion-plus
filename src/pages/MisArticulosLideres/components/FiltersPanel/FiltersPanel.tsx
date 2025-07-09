import React from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';

interface FiltersPanelProps {
  isOpen: boolean;
  filters: Record<string, any>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  isOpen,
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="p-4 rounded shadow mb-4 grid grid-cols-12 gap-3 max-h-80 overflow-y-auto"
      style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        boxShadow:
          theme === 'dark'
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Fecha del artículo */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Fecha artículo
        </label>
        <div className="flex gap-1">
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['publicado__gte'] || ''}
            onChange={(e) => onFilterChange('publicado__gte', e.target.value)}
          />
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['publicado__lte'] || ''}
            onChange={(e) => onFilterChange('publicado__lte', e.target.value)}
          />
        </div>
      </div>

      {/* Fecha de Categorización */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Fecha categorización
        </label>
        <div className="flex gap-1">
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['fecha_categorizacion__gte'] || ''}
            onChange={(e) =>
              onFilterChange('fecha_categorizacion__gte', e.target.value)
            }
          />
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['fecha_categorizacion__lte'] || ''}
            onChange={(e) =>
              onFilterChange('fecha_categorizacion__lte', e.target.value)
            }
          />
        </div>
      </div>

      {/* Titular */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Titular
        </label>
        <input
          type="text"
          placeholder="Buscar en titular"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.titulo_articulo || ''}
          onChange={(e) => onFilterChange('titulo_articulo', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* URL */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          URL
        </label>
        <input
          type="text"
          placeholder="Buscar en URL"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.url_articulo || ''}
          onChange={(e) => onFilterChange('url_articulo', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Tipo de publicación */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Tipo publicación
        </label>
        <select
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.tipo_publicacion || ''}
          onChange={(e) => onFilterChange('tipo_publicacion', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="noticia">Noticia</option>
          <option value="opinion">Opinión</option>
          <option value="editorial">Editorial</option>
          <option value="entrevista">Entrevista</option>
        </select>
      </div>

      {/* Medio */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Medio
        </label>
        <input
          type="text"
          placeholder="Buscar medio"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.medio || ''}
          onChange={(e) => onFilterChange('medio', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Autor */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Autor
        </label>
        <input
          type="text"
          placeholder="Buscar autor"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.autor || ''}
          onChange={(e) => onFilterChange('autor', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Categorizado */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Categorizado
        </label>
        <select
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.categorizado || ''}
          onChange={(e) => onFilterChange('categorizado', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      {/* Asignado a */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Asignado a
        </label>
        <input
          type="text"
          placeholder="Buscar asignado"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.asignado_a || ''}
          onChange={(e) => onFilterChange('asignado_a', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Proyecto */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Proyecto
        </label>
        <input
          type="text"
          placeholder="Buscar proyecto"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.proyecto || ''}
          onChange={(e) => onFilterChange('proyecto', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Fecha de ingestion */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Fecha ingestion
        </label>
        <div className="flex gap-1">
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['ingestion__gte'] || ''}
            onChange={(e) => onFilterChange('ingestion__gte', e.target.value)}
          />
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['ingestion__lte'] || ''}
            onChange={(e) => onFilterChange('ingestion__lte', e.target.value)}
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="col-span-12 flex justify-end gap-2 mt-2">
        <button
          onClick={onClearFilters}
          className="px-3 py-1 rounded text-xs transition-colors"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            color: theme === 'dark' ? '#ffffff' : '#374151',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#4b5563' : '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#374151' : '#f3f4f6';
          }}
        >
          Limpiar
        </button>
        <button
          onClick={onApplyFilters}
          className="px-3 py-1 rounded text-xs transition-colors"
          style={{
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
            color: '#ffffff',
            border: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#2563eb' : '#1d4ed8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#3b82f6' : '#2563eb';
          }}
        >
          Aplicar
        </button>
      </div>
    </div>
  );
};

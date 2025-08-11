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
      {/* Fecha de publicación */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Fecha publicación
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
            value={filters['fecha_after'] || ''}
            onChange={(e) => onFilterChange('fecha_after', e.target.value)}
          />
          <input
            type="date"
            className="p-1 rounded flex-1 text-xs"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            value={filters['fecha_before'] || ''}
            onChange={(e) => onFilterChange('fecha_before', e.target.value)}
          />
        </div>
      </div>

      {/* URL Publicación */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          URL Publicación
        </label>
        <input
          type="text"
          placeholder="Buscar URL de publicación"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.url_publicacion || ''}
          onChange={(e) => onFilterChange('url_publicacion', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Ubicación */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Ubicación
        </label>
        <input
          type="text"
          placeholder="Buscar ubicación"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.ubicacion || ''}
          onChange={(e) => onFilterChange('ubicacion', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Proyecto */}
      <div className="col-span-3">
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
          placeholder="ID del proyecto"
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.categorizacion_proyecto || ''}
          onChange={(e) =>
            onFilterChange('categorizacion_proyecto', e.target.value)
          }
          onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
        />
      </div>

      {/* Red Social */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Red Social
        </label>
        <select
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.red_social || ''}
          onChange={(e) => onFilterChange('red_social', e.target.value)}
        >
          <option value="">Todas</option>
          <option value="Facebook">Facebook</option>
          <option value="Instagram">Instagram</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="TikTok">TikTok</option>
          <option value="YouTube">YouTube</option>
        </select>
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

      {/* Borrado */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Estado
        </label>
        <select
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.borrado || ''}
          onChange={(e) => onFilterChange('borrado', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="false">Activo</option>
          <option value="true">Eliminado</option>
        </select>
      </div>

      {/* Asignado a */}
      <div className="col-span-3">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Asignado a (email)
        </label>
        <input
          type="text"
          placeholder="Email del asignado"
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

      {/* Asignado */}
      <div className="col-span-2">
        <label
          className="block font-medium text-sm mb-1"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Asignado
        </label>
        <select
          className="p-1 rounded w-full text-xs"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#111827',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          value={filters.asignado || ''}
          onChange={(e) => onFilterChange('asignado', e.target.value)}
        >
          <option value="">Todos</option>
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

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

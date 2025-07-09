import React from 'react';
import { useTheme } from '../../shared/context/ThemeContext';

export type FiltrosTemas = {
  nombre?: string;
  proyecto_id?: string;
  created_gte?: string;
  created_lte?: string;
};

type PanelDeFiltrosProps = {
  isOpen: boolean;
  filtros: FiltrosTemas;
  onChangeFiltro: (key: keyof FiltrosTemas, value: string) => void;
  onClear: () => void;
  onApply?: () => void;
  // flags opcionales para mostrar/ocultar campos
  showNombre?: boolean;
  showProyecto?: boolean;
  showFechaCreado?: boolean;
};

const PanelDeFiltros: React.FC<PanelDeFiltrosProps> = ({
  isOpen,
  filtros,
  onChangeFiltro,
  onClear,
  showNombre = true,
  showProyecto = true,
  showFechaCreado = true,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="p-6 rounded shadow mb-6 grid grid-cols-12 gap-4"
      style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
        border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
      }}
    >
      {showNombre && (
        <div className="col-span-3">
          <label
            className="block font-medium mb-1"
            style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
          >
            Nombre
          </label>
          <input
            type="text"
            value={filtros.nombre || ''}
            onChange={(e) => onChangeFiltro('nombre', e.target.value)}
            className="w-full p-2 rounded transition-colors"
            placeholder="Filtrar por nombre"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#3b82f6' : '#2563eb';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#4b5563' : '#d1d5db';
            }}
          />
        </div>
      )}

      {showProyecto && (
        <div className="col-span-3">
          <label
            className="block font-medium mb-1"
            style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
          >
            Proyecto ID
          </label>
          <input
            type="text"
            value={filtros.proyecto_id || ''}
            onChange={(e) => onChangeFiltro('proyecto_id', e.target.value)}
            className="w-full p-2 rounded transition-colors"
            placeholder="Filtrar por proyecto"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#ffffff' : '#111827',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#3b82f6' : '#2563eb';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor =
                theme === 'dark' ? '#4b5563' : '#d1d5db';
            }}
          />
        </div>
      )}

      {showFechaCreado && (
        <>
          <div className="col-span-3">
            <label
              className="block font-medium mb-1"
              style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
            >
              Creado desde
            </label>
            <input
              type="date"
              value={filtros.created_gte || ''}
              onChange={(e) => onChangeFiltro('created_gte', e.target.value)}
              className="w-full p-2 rounded transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#3b82f6' : '#2563eb';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#4b5563' : '#d1d5db';
              }}
            />
          </div>
          <div className="col-span-3">
            <label
              className="block font-medium mb-1"
              style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
            >
              Creado hasta
            </label>
            <input
              type="date"
              value={filtros.created_lte || ''}
              onChange={(e) => onChangeFiltro('created_lte', e.target.value)}
              className="w-full p-2 rounded transition-colors"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#3b82f6' : '#2563eb';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#4b5563' : '#d1d5db';
              }}
            />
          </div>
        </>
      )}

      <div className="col-span-12 flex justify-end gap-4 mt-2">
        <button
          type="button"
          onClick={onClear}
          className="px-4 py-2 rounded transition"
          style={{
            backgroundColor: 'transparent',
            color: theme === 'dark' ? '#ffffff' : '#374151',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#374151' : '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default PanelDeFiltros;

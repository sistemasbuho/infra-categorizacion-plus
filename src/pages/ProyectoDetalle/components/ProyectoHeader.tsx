import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { ProyectoCompleto } from '../../Proyectos/services/proyectosRequest';

interface ProyectoHeaderProps {
  proyecto: ProyectoCompleto;
  theme: string;
  handleStatusChange: (newStatus: boolean) => void;
  updatingStatus: boolean;
}

export const ProyectoHeader: React.FC<ProyectoHeaderProps> = ({
  proyecto,
  theme,
  handleStatusChange,
  updatingStatus,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Link
          to={'/proyectos'}
          className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 hover:scale-105 cursor-pointer"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            color: theme === 'dark' ? '#d1d5db' : '#374151',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#4b5563' : '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor =
              theme === 'dark' ? '#374151' : '#e5e7eb';
          }}
        >
          <FaArrowLeft size={16} />
          <span className="font-medium">
            {proyecto.proyecto_categorizacion.nombre}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: proyecto.proyecto_categorizacion.activo
                  ? theme === 'dark'
                    ? '#10b981'
                    : '#059669'
                  : theme === 'dark'
                  ? '#6b7280'
                  : '#9ca3af',
              }}
            />
            <span
              className="font-medium"
              style={{
                color: proyecto.proyecto_categorizacion.activo
                  ? theme === 'dark'
                    ? '#10b981'
                    : '#059669'
                  : theme === 'dark'
                  ? '#9ca3af'
                  : '#6b7280',
              }}
            >
              Estado:{' '}
              {proyecto.proyecto_categorizacion.activo ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleStatusChange(!proyecto.proyecto_categorizacion.activo)
              }
              disabled={updatingStatus}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                updatingStatus
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={{
                backgroundColor: proyecto.proyecto_categorizacion.activo
                  ? theme === 'dark'
                    ? '#10b981'
                    : '#059669'
                  : theme === 'dark'
                  ? '#4b5563'
                  : '#d1d5db',
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  proyecto.proyecto_categorizacion.activo
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

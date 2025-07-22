import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Proyecto } from '../../services/proyectosRequest';

interface ProyectosGridProps {
  proyectos: Proyecto[];
  loading: boolean;
  onProyectoClick: (proyecto: Proyecto) => void;
  onEditProyecto?: (proyecto: Proyecto) => void;
  onDeleteProyecto?: (proyecto: Proyecto) => void;
}

export const ProyectosGrid: React.FC<ProyectosGridProps> = ({
  proyectos,
  loading,
  onProyectoClick,
  onEditProyecto,
  onDeleteProyecto,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-lg border animate-pulse"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
              borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            }}
          >
            <div
              className="absolute top-3 left-3 w-3 h-3 rounded-full"
              style={{
                backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
              }}
            />
            <div className="flex items-center justify-center h-full p-4">
              <div
                className="h-4 w-3/4 rounded"
                style={{
                  backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!proyectos || proyectos.length === 0) {
    return (
      <div
        className="text-center py-16 border rounded-lg"
        style={{
          backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
          borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
        }}
      >
        <div className="text-8xl mb-6 opacity-20">📁</div>
        <h3
          className="text-xl font-medium mb-3"
          style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
        >
          No hay proyectos
        </h3>
        <p
          className="text-sm"
          style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
        >
          Crea tu primer proyecto para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
      {proyectos.map((proyecto) => {
        if (!proyecto) return null;
        return (
          <div
            key={proyecto.id}
            onClick={() => onProyectoClick(proyecto)}
            className="relative aspect-[4/3] rounded-lg border cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            }}
          >
            {/* Actions Panel - always visible */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {onEditProyecto && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProyecto(proyecto);
                  }}
                  className="p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                    color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      theme === 'dark' ? '#3b82f6' : '#60a5fa';
                    (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      theme === 'dark' ? '#4b5563' : '#e5e7eb';
                    (e.currentTarget as HTMLElement).style.color =
                      theme === 'dark' ? '#60a5fa' : '#3b82f6';
                  }}
                  title="Editar proyecto"
                >
                  <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              )}
              {onDeleteProyecto && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProyecto(proyecto);
                  }}
                  className="p-1.5 sm:p-2 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
                    color: theme === 'dark' ? '#f87171' : '#ef4444',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      theme === 'dark' ? '#ef4444' : '#f87171';
                    (e.currentTarget as HTMLElement).style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      theme === 'dark' ? '#4b5563' : '#e5e7eb';
                    (e.currentTarget as HTMLElement).style.color =
                      theme === 'dark' ? '#f87171' : '#ef4444';
                  }}
                  title="Eliminar proyecto"
                >
                  <FaTrash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              )}
            </div>

            {/* Status Indicator */}
            <div className="absolute top-3 left-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: proyecto.activo
                    ? theme === 'dark'
                      ? '#10b981'
                      : '#059669'
                    : theme === 'dark'
                    ? '#6b7280'
                    : '#9ca3af',
                }}
                title={proyecto.activo ? 'Activo' : 'Inactivo'}
              />
            </div>

            <div className="flex items-center justify-center h-full p-4 pt-10 pb-4">
              <div className="text-center w-full">
                <h3
                  className="font-medium text-sm md:text-base lg:text-lg leading-tight break-words"
                  style={{
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                  }}
                  title={proyecto.nombre}
                >
                  {proyecto.nombre}
                </h3>

                <div className="mt-3 text-xs opacity-70">
                  <div
                    style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                  >
                    {proyecto.colaboradores_info?.length || 0} colaborador
                    {(proyecto.colaboradores_info?.length || 0) !== 1
                      ? 'es'
                      : ''}
                  </div>
                  {(proyecto.tags_info?.length || 0) > 0 && (
                    <div
                      style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      }}
                      className="mt-1"
                    >
                      {proyecto.tags_info?.length || 0} tag
                      {(proyecto.tags_info?.length || 0) !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-5 rounded-lg transition-all duration-200 pointer-events-none" />
          </div>
        );
      })}
    </div>
  );
};

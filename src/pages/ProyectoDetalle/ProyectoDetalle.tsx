import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../../shared/context/ThemeContext';
import {
  Proyecto,
  Keyword,
  getProyecto,
  updateProyecto,
} from '../Proyectos/services/proyectosRequest';
import { toast } from 'react-hot-toast';
import { ProyectoHeader } from './components/ProyectoHeader';
import { ProyectoDetails } from './components/ProyectoDetails';

export const ProyectoDetalle: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchProyecto = async () => {
      if (!id) {
        setError('ID de proyecto no válido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const proyectoData = await getProyecto(id);
        setProyecto(proyectoData);
      } catch (err: any) {
        console.error('Error fetching proyecto:', err);
        setError('Error al cargar el proyecto');
        toast.error('Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id]);

  const handleStatusChange = async (newStatus: boolean) => {
    if (!proyecto || updatingStatus) return;

    try {
      setUpdatingStatus(true);
      await updateProyecto(proyecto.id, { activo: newStatus });

      setProyecto((prev) => (prev ? { ...prev, activo: newStatus } : null));

      toast.success(
        `Proyecto ${newStatus ? 'activado' : 'desactivado'} correctamente`
      );
    } catch (err: any) {
      console.error('Error updating proyecto status:', err);
      toast.error('Error al cambiar el estado del proyecto');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUpdateProyecto = async (updates: Partial<Proyecto>) => {
    if (!proyecto) return;

    try {
      const apiUpdates: Partial<{
        proyecto_id: string;
        nombre: string;
        keyword?: Keyword;
        colaboradores?: number[];
        tags?: string[];
        activo?: boolean;
      }> = {};

      if (updates.nombre !== undefined) {
        apiUpdates.nombre = updates.nombre;
      }
      if (updates.keyword !== undefined) {
        if (Array.isArray(updates.keyword)) {
          apiUpdates.keyword = { palabras_clave: updates.keyword };
        } else {
          apiUpdates.keyword = updates.keyword;
        }
      }
      if (updates.activo !== undefined) {
        apiUpdates.activo = updates.activo;
      }

      await updateProyecto(proyecto.id, apiUpdates);

      setProyecto((prev) => (prev ? { ...prev, ...updates } : null));

      toast.success('Proyecto actualizado correctamente');
    } catch (err: any) {
      console.error('Error updating proyecto:', err);
      toast.error('Error al actualizar el proyecto');
      throw err;
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen p-6"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div
              className="h-8 w-48 rounded mb-6"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            />
            <div
              className="h-12 w-full rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error || (!loading && !proyecto)) {
    return (
      <div
        className="min-h-screen p-6"
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/proyectos')}
              className="flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 hover:scale-105"
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
              <span className="font-medium">Volver a Proyectos</span>
            </button>
          </div>

          <div className="text-center">
            <h2
              className="text-xl font-semibold mb-2"
              style={{
                color: theme === 'dark' ? '#9ca3af' : '#6b7280',
              }}
            >
              {error || 'Proyecto no encontrado'}
            </h2>
            <p
              style={{
                color: theme === 'dark' ? '#6b7280' : '#9ca3af',
              }}
            >
              {error
                ? 'Hubo un problema al cargar el proyecto.'
                : 'El proyecto solicitado no existe.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
      }}
    >
      <div>
        <ProyectoHeader
          proyecto={proyecto}
          theme={theme}
          handleStatusChange={handleStatusChange}
          updatingStatus={updatingStatus}
        />

        <ProyectoDetails
          proyecto={proyecto}
          theme={theme}
          onUpdateProyecto={handleUpdateProyecto}
        />
      </div>
    </div>
  );
};

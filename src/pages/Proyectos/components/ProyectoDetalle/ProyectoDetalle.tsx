import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaUsers, FaTags, FaCog } from 'react-icons/fa';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { PageContainer } from '../../../../shared/components/Layout/PageContainer';
import { Button } from '../../../../shared/components/ui/Button';
import { Proyecto, getKeywordsArray } from '../../services/proyectosRequest';
import { categorizationPlusRequest } from '../../../../services/axiosRequest';

export const ProyectoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProyecto = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await categorizationPlusRequest<Proyecto>({
          method: 'GET',
          url: `proyecto-categorizacion/${id}/`,
        });
        setProyecto(response);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id]);

  const getKeywords = () => {
    if (!proyecto?.keyword) return [];
    return getKeywordsArray(proyecto.keyword);
  };

  if (loading) {
    return (
      <PageContainer title="Cargando...">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="w-8 h-8 rounded-lg"
              style={{
                backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
              }}
            />
            <div
              className="h-8 w-64 rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
              }}
            />
          </div>
          <div
            className="h-32 rounded-lg"
            style={{
              backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            }}
          />
        </div>
      </PageContainer>
    );
  }

  if (error || !proyecto) {
    return (
      <PageContainer title="Error">
        <div className="text-center py-16">
          <div className="text-6xl mb-4 opacity-20">❌</div>
          <h3
            className="text-xl font-medium mb-3"
            style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
          >
            {error || 'Proyecto no encontrado'}
          </h3>
          <Button onClick={() => navigate('/proyectos')}>
            Volver a Proyectos
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={proyecto.nombre}>
      <></>
      {/* <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/proyectos')}
            className="flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>

        <div
          className="border rounded-lg p-6"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: theme === 'dark' ? '#ffffff' : '#1f2937' }}
              >
                {proyecto.nombre}
              </h1>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    proyecto.activo
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                  }`}
                >
                  {proyecto.activo ? 'Activo' : 'Inactivo'}
                </span>
                <span
                  className="text-sm"
                  style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  ID: {proyecto.proyecto_id}
                </span>
              </div>
            </div>
            <Button
              onClick={() => console.log('Editar proyecto')}
              className="flex items-center gap-2"
            >
              <FaCog className="w-4 h-4" />
              Configurar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3
                className="font-medium mb-2"
                style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
              >
                Fecha de Creación
              </h3>
              <p
                className="text-sm"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                {new Date(proyecto.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <h3
                className="font-medium mb-2"
                style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
              >
                Última Modificación
              </h3>
              <p
                className="text-sm"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                {new Date(proyecto.modified_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>

        <div
          className="border rounded-lg p-6"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
          }}
        >
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: theme === 'dark' ? '#ffffff' : '#1f2937' }}
          >
            <FaUsers className="w-5 h-5 text-blue-500" />
            Colaboradores ({proyecto.colaboradores_info.length})
          </h2>
          {proyecto.colaboradores_info.length > 0 ? (
            <div className="space-y-3">
              {proyecto.colaboradores_info.map((colaborador) => (
                <div
                  key={colaborador.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{
                    backgroundColor: theme === 'dark' ? '#4b5563' : '#f9fafb',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{
                      backgroundColor: theme === 'dark' ? '#6b7280' : '#e5e7eb',
                      color: theme === 'dark' ? '#ffffff' : '#374151',
                    }}
                  >
                    {colaborador.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div
                      className="font-medium"
                      style={{
                        color: theme === 'dark' ? '#d1d5db' : '#374151',
                      }}
                    >
                      {colaborador.nombre}
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                      }}
                    >
                      {colaborador.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p
              className="text-sm text-center py-8"
              style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
            >
              No hay colaboradores asignados
            </p>
          )}
        </div>

        <div
          className="border rounded-lg p-6"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
          }}
        >
          <h2
            className="text-lg font-semibold mb-4 flex items-center gap-2"
            style={{ color: theme === 'dark' ? '#ffffff' : '#1f2937' }}
          >
            <FaTags className="w-5 h-5 text-purple-500" />
            Tags ({proyecto.tags_info.length})
          </h2>
          {proyecto.tags_info.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {proyecto.tags_info.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: theme === 'dark' ? '#6b46c1' : '#ddd6fe',
                    color: theme === 'dark' ? '#ffffff' : '#5b21b6',
                  }}
                >
                  {tag.nombre}
                </span>
              ))}
            </div>
          ) : (
            <p
              className="text-sm text-center py-8"
              style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
            >
              No hay tags asociados
            </p>
          )}
        </div>

        {getKeywords().length > 0 && (
          <div
            className="border rounded-lg p-6"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
              borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
            }}
          >
            <h2
              className="text-lg font-semibold mb-4"
              style={{ color: theme === 'dark' ? '#ffffff' : '#1f2937' }}
            >
              Palabras Clave
            </h2>
            <div className="flex flex-wrap gap-2">
              {getKeywords().map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-sm rounded-full"
                  style={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#f3f4f6',
                    color: theme === 'dark' ? '#d1d5db' : '#374151',
                    border: `1px solid ${
                      theme === 'dark' ? '#4b5563' : '#d1d5db'
                    }`,
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div> */}
    </PageContainer>
  );
};

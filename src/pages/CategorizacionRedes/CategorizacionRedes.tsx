import { useParams } from 'react-router-dom';
import { useTheme } from '../../shared/context/ThemeContext';
import { useCategorizacionRedes } from './hooks/useCategorizacionRedes';
import { Header } from './components/Header/Header';
import { SocialMediaEmbed } from './components/SocialMediaEmbed/SocialMediaEmbed';
import { FormularioCategorizacion } from './components/FormularioCategorizacion/FormularioCategorizacion';
import Loader from '../../shared/components/ui/Loader';

export const CategorizacionRedes = () => {
  const { theme } = useTheme();
  const { id, proyectoId } = useParams<{ id: string; proyectoId: string }>();

  const { data, isLoading, error } = useCategorizacionRedes(
    id || '',
    proyectoId || ''
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader isLoading={true} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {data &&
          data.datos_publicacion &&
          data.datos_publicacion.length > 0 && (
            <>
              <Header publicacion={data.datos_publicacion[0]} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <SocialMediaEmbed
                    url={data.datos_publicacion[0].url}
                    redSocial={data.datos_publicacion[0].red_social}
                  />
                </div>

                <div
                  className="border rounded-lg p-6"
                  style={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                  }}
                >
                  <FormularioCategorizacion
                    formulario={data.formulario}
                    publicacion={data.datos_publicacion[0]}
                  />
                </div>
              </div>
            </>
          )}

        {!data && !isLoading && !error && (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-6 rounded-lg">
            <p>
              No se pudieron cargar los datos. Verifica los parámetros de la
              URL.
            </p>
            <div className="mt-4 text-sm space-y-1">
              <p>
                <strong>ID de Publicación:</strong> {id || 'No disponible'}
              </p>
              <p>
                <strong>ID de Proyecto:</strong> {proyectoId || 'No disponible'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

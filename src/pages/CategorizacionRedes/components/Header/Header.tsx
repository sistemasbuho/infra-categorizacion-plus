import { FaChevronLeft } from 'react-icons/fa';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { DatosPublicacion } from '../../services/categorizacionRedesRequest';
import { Link } from 'react-router-dom';

interface HeaderProps {
  publicacion: DatosPublicacion;
}

export const Header: React.FC<HeaderProps> = ({ publicacion }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? 'Fecha no válida'
        : date.toLocaleString('es-CO');
    } catch {
      return 'Fecha no válida';
    }
  };

  return (
    <div
      className="border-b pb-6 mb-6"
      style={{
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <Link
          to={'/lista-publicaciones-lider'}
          className="flex items-center gap-2 text-lg font-medium transition-colors hover:opacity-80"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          <FaChevronLeft /> Categorización de Publicación de Redes
        </Link>

        <span
          className="text-md font-medium px-2 py-1 rounded-md"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            color: theme === 'dark' ? '#9ca3af' : '#111827',
          }}
        >
          {publicacion.proyecto_nombre}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          <h3 className="font-semibold text-sm mb-2">Información Básica</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Autor:</strong> {publicacion.autor}
            </p>
            <p>
              <strong>Red Social:</strong> {publicacion.red_social}
            </p>
            <p>
              <strong>Ubicación:</strong> {publicacion.ubicacion}
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          <h3 className="font-semibold text-sm mb-2">Fechas</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Publicación:</strong> {formatDate(publicacion.fecha)}
            </p>
            <p>
              <strong>Creación:</strong> {formatDate(publicacion.created_at)}
            </p>
            <p>
              <strong>Modificación:</strong>{' '}
              {formatDate(publicacion.modified_at)}
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          <h3 className="font-semibold text-sm mb-2">Métricas</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Me gusta:</strong> {publicacion.me_gusta}
            </p>
            <p>
              <strong>Comentarios:</strong> {publicacion.comentario}
            </p>
            <p>
              <strong>Compartido:</strong> {publicacion.compartido}
            </p>
            <p>
              <strong>Interacción:</strong> {publicacion.interaccion}
            </p>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
          }}
        >
          <h3 className="font-semibold text-sm mb-2">Estado</h3>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Categorizado:</strong>
              <span
                className={`ml-1 px-2 py-1 rounded text-xs ${
                  publicacion.categorizado
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {publicacion.categorizado ? 'Sí' : 'No'}
              </span>
            </p>
            <p>
              <strong>Asignado:</strong>
              <span
                className={`ml-1 px-2 py-1 rounded text-xs ${
                  publicacion.asignado
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {publicacion.asignado ? 'Sí' : 'No'}
              </span>
            </p>
            <p>
              <strong>Asignado a:</strong> {publicacion.asignado_email}
            </p>
          </div>
        </div>
      </div>

      {publicacion.url && (
        <div
          className="mt-6 pt-4"
          style={{
            borderTop: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div>
                <h4
                  className="font-medium text-sm"
                  style={{ color: theme === 'dark' ? '#f9fafb' : '#111827' }}
                >
                  Publicación Original
                </h4>
                <p
                  className="text-xs"
                  style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  Ver en {publicacion.red_social}
                </p>
              </div>
            </div>
            <a
              href={publicacion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:shadow-md"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#f3f4f6' : '#374151',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#1e3a8a' : '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#4b5563' : '#d1d5db';
                e.currentTarget.style.backgroundColor =
                  theme === 'dark' ? '#374151' : '#ffffff';
              }}
            >
              <span className="text-sm font-medium">Ver original</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

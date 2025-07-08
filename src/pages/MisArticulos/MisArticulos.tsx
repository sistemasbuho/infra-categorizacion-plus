import { useTheme } from '../context/ThemeContext';

export const MisArticulos = () => {
  const { theme } = useTheme();

  return (
    <div
      className="h-screen flex flex-col p-8"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <div className="flex justify-between w-full mb-10">
        <h1
          className="text-4xl font-bold"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
          }}
        >
          Mis Artículos
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div
            className="text-8xl mb-6"
            style={{
              color: theme === 'dark' ? '#4b5563' : '#d1d5db',
            }}
          >
            📄
          </div>
          <h2
            className="text-2xl font-semibold"
            style={{
              color: theme === 'dark' ? '#ffffff' : '#111827',
            }}
          >
            Mis Artículos
          </h2>
          <p
            className="text-lg max-w-md"
            style={{
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            Aquí encontrarás todos los artículos que has creado y gestionado.
          </p>
          <div className="mt-8">
            <button
              className="px-6 py-3 rounded-lg font-semibold transition-all"
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
              Crear Nuevo Artículo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useTheme } from '../context/ThemeContext';

function Home() {
  const { theme } = useTheme();

  return (
    <section
      className="min-h-screen flex items-center justify-center transition-colors"
      style={{
        background:
          theme === 'dark'
            ? 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #d1d5db 100%)',
      }}
    >
      <div className="text-center space-y-8 p-8">
        <h1
          className="text-2xl md:text-5xl font-extrabold mb-4 transition-colors"
          style={{
            color: theme === 'dark' ? '#ffffff' : '#111827',
            textShadow:
              theme === 'dark'
                ? '0 0 20px rgba(255, 255, 255, 0.1)'
                : '0 0 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          Módulo de Categorización
        </h1>
        <p
          className="text-lg md:text-xl max-w-2xl mx-auto"
          style={{
            color: theme === 'dark' ? '#d1d5db' : '#4b5563',
          }}
        >
          Herramienta avanzada para la clasificación y análisis de contenido
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            style={{
              backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              boxShadow:
                theme === 'dark'
                  ? '0 4px 20px rgba(59, 130, 246, 0.3)'
                  : '0 4px 20px rgba(37, 99, 235, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#2563eb' : '#1d4ed8';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#3b82f6' : '#2563eb';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Comenzar
          </button>
          <button
            className="px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            style={{
              backgroundColor: 'transparent',
              color: theme === 'dark' ? '#ffffff' : '#374151',
              border: `2px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#374151' : '#f3f4f6';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Documentación
          </button>
        </div>
      </div>
    </section>
  );
}

export default Home;

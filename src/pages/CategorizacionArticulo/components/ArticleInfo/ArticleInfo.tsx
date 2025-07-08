import { useTheme } from '../../../../context/ThemeContext';
import { FaLink, FaKey, FaFilePdf } from 'react-icons/fa';
import { CiTextAlignCenter } from 'react-icons/ci';
import { GrMultimedia } from 'react-icons/gr';

interface ArticleInfoProps {
  resumen: string;
  palabras_clave: string[];
  finished: boolean;
  state: boolean;
  categorizado: boolean;
  activeSection: string | null;
  toggleSection: (section: string) => void;
}

export const ArticleInfo = ({
  resumen,
  palabras_clave,
  finished,
  state,
  categorizado,
  activeSection,
  toggleSection,
}: ArticleInfoProps) => {
  const { theme } = useTheme();

  const getStatusColor = (status: boolean) => {
    return status
      ? theme === 'dark'
        ? '#22c55e'
        : '#16a34a'
      : theme === 'dark'
      ? '#ef4444'
      : '#dc2626';
  };

  const getStatusBgColor = (status: boolean) => {
    return status
      ? theme === 'dark'
        ? '#166534'
        : '#dcfce7'
      : theme === 'dark'
      ? '#7f1d1d'
      : '#fef2f2';
  };

  return (
    <>
      {/* Resumen */}
      <div
        className="border rounded-lg"
        style={{
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        }}
      >
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between p-4 text-left transition-colors"
          style={{
            backgroundColor:
              activeSection === 'summary'
                ? theme === 'dark'
                  ? '#1f2937'
                  : '#f9fafb'
                : 'transparent',
          }}
        >
          <div className="flex items-center gap-3">
            <CiTextAlignCenter
              style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }}
            />
            <span className="font-medium">Resumen</span>
          </div>
          <div
            className="text-lg transform transition-transform"
            style={{
              transform:
                activeSection === 'summary' ? 'rotate(90deg)' : 'rotate(0deg)',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            ›
          </div>
        </button>

        {activeSection === 'summary' && (
          <div
            className="p-4 border-t"
            style={{
              borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <p className="text-sm leading-relaxed">{resumen}</p>
          </div>
        )}
      </div>

      {/* Palabras clave */}
      <div
        className="border rounded-lg"
        style={{
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        }}
      >
        <button
          onClick={() => toggleSection('keywords')}
          className="w-full flex items-center justify-between p-4 text-left transition-colors"
          style={{
            backgroundColor:
              activeSection === 'keywords'
                ? theme === 'dark'
                  ? '#1f2937'
                  : '#f9fafb'
                : 'transparent',
          }}
        >
          <div className="flex items-center gap-3">
            <FaKey
              style={{ color: theme === 'dark' ? '#fbbf24' : '#f59e0b' }}
            />
            <span className="font-medium">Palabras clave</span>
          </div>
          <div
            className="text-lg transform transition-transform"
            style={{
              transform:
                activeSection === 'keywords' ? 'rotate(90deg)' : 'rotate(0deg)',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            ›
          </div>
        </button>

        {activeSection === 'keywords' && (
          <div
            className="p-4 border-t"
            style={{
              borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <div className="flex flex-wrap gap-2">
              {palabras_clave.length > 0 ? (
                palabras_clave.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: theme === 'dark' ? '#065f46' : '#d1fae5',
                      color: theme === 'dark' ? '#34d399' : '#065f46',
                    }}
                  >
                    {keyword}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">
                  No hay palabras clave disponibles
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Estados */}
      <div
        className="border rounded-lg"
        style={{
          borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        }}
      >
        <button
          onClick={() => toggleSection('status')}
          className="w-full flex items-center justify-between p-4 text-left transition-colors"
          style={{
            backgroundColor:
              activeSection === 'status'
                ? theme === 'dark'
                  ? '#1f2937'
                  : '#f9fafb'
                : 'transparent',
          }}
        >
          <div className="flex items-center gap-3">
            <FaFilePdf
              style={{ color: theme === 'dark' ? '#a78bfa' : '#8b5cf6' }}
            />
            <span className="font-medium">Estado</span>
          </div>
          <div
            className="text-lg transform transition-transform"
            style={{
              transform:
                activeSection === 'status' ? 'rotate(90deg)' : 'rotate(0deg)',
              color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            }}
          >
            ›
          </div>
        </button>

        {activeSection === 'status' && (
          <div
            className="p-4 border-t"
            style={{
              borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Finalizado:</span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: getStatusBgColor(finished),
                    color: getStatusColor(finished),
                  }}
                >
                  {finished ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Activo:</span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: getStatusBgColor(state),
                    color: getStatusColor(state),
                  }}
                >
                  {state ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Categorizado:</span>
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: getStatusBgColor(categorizado),
                    color: getStatusColor(categorizado),
                  }}
                >
                  {categorizado ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

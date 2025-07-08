import { useTheme } from '../../../../context/ThemeContext';
import { FaTimes } from 'react-icons/fa';

interface Fragmento {
  id: string;
  texto: string;
  categoria: string;
  subcategoria?: string;
  tags: string[];
}

interface FragmentsListProps {
  fragmentos: Fragmento[];
  onRemoveFragment: (fragmentId: string) => void;
}

export const FragmentsList = ({
  fragmentos,
  onRemoveFragment,
}: FragmentsListProps) => {
  const { theme } = useTheme();

  if (!fragmentos || fragmentos.length === 0) {
    return null;
  }

  return (
    <div
      className="border rounded-lg mb-6"
      style={{
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      }}
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium">Fragmentos Categorizados</h3>
      </div>
      <div className="p-4 space-y-3">
        {fragmentos.map((fragment) => (
          <div
            key={fragment.id}
            className="p-3 rounded-lg border"
            style={{
              backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb',
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: theme === 'dark' ? '#3b82f6' : '#dbeafe',
                    color: theme === 'dark' ? '#ffffff' : '#1e40af',
                  }}
                >
                  {fragment.categoria}
                </span>
                {fragment.subcategoria && (
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                      color: theme === 'dark' ? '#d1d5db' : '#6b7280',
                    }}
                  >
                    {fragment.subcategoria}
                  </span>
                )}
              </div>
              <button
                onClick={() => onRemoveFragment(fragment.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTimes />
              </button>
            </div>
            <p className="text-sm mb-2">{fragment.texto}</p>
            <div className="flex flex-wrap gap-1">
              {fragment.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: theme === 'dark' ? '#065f46' : '#d1fae5',
                    color: theme === 'dark' ? '#34d399' : '#065f46',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

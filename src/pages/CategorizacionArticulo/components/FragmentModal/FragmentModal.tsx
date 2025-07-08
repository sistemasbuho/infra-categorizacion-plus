import { useTheme } from '../../../../context/ThemeContext';
import { FaTimes } from 'react-icons/fa';

interface FormData {
  categoria: string;
  subcategoria: string;
  tono: string;
  sentimiento: string;
  tags: string;
}

interface FragmentModalProps {
  isOpen: boolean;
  selectedText: string;
  formData: FormData;
  onClose: () => void;
  onFormDataChange: (data: FormData) => void;
  onCreateFragment: () => void;
}

export const FragmentModal = ({
  isOpen,
  selectedText,
  formData,
  onClose,
  onFormDataChange,
  onCreateFragment,
}: FragmentModalProps) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FormData, value: string) => {
    onFormDataChange({
      ...formData,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        style={{
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#111827',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Crear Fragmento</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Texto seleccionado:
            </label>
            <p
              className="text-sm p-2 rounded border"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
              }}
            >
              {selectedText}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <input
              type="text"
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
              placeholder="Ej: Liderazgo, Inversión, Estrategia"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Subcategoría
            </label>
            <input
              type="text"
              value={formData.subcategoria}
              onChange={(e) =>
                handleInputChange('subcategoria', e.target.value)
              }
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
              placeholder="Subcategoría específica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tono</label>
            <select
              value={formData.tono}
              onChange={(e) => handleInputChange('tono', e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
            >
              <option value="">Seleccionar tono</option>
              <option value="Positivo">Positivo</option>
              <option value="Neutro">Neutro</option>
              <option value="Negativo">Negativo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Sentimiento
            </label>
            <select
              value={formData.sentimiento}
              onChange={(e) => handleInputChange('sentimiento', e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
            >
              <option value="">Seleccionar sentimiento</option>
              <option value="Optimista">Optimista</option>
              <option value="Neutro">Neutro</option>
              <option value="Crítico">Crítico</option>
              <option value="Preocupado">Preocupado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className="w-full p-2 border rounded"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
              placeholder="etiqueta1, etiqueta2, etiqueta3"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border"
              style={{
                backgroundColor: 'transparent',
                borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onCreateFragment}
              className="px-4 py-2 rounded text-white"
              style={{
                backgroundColor: theme === 'dark' ? '#3b82f6' : '#2563eb',
              }}
            >
              Crear Fragmento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

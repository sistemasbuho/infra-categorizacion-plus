import React from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Modal } from '../../../../components/ui/Modal';

interface ArticleForModal {
  titulo: string;
  borrado: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  selectedArticle: ArticleForModal | null;
  motivo: string;
  onClose: () => void;
  onMotivoChange: (motivo: string) => void;
  onConfirm: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  selectedArticle,
  motivo,
  onClose,
  onMotivoChange,
  onConfirm,
}) => {
  const { theme } = useTheme();

  // Determinar si el artículo está borrado para mostrar el comportamiento correcto
  const isDeleted = selectedArticle?.borrado || false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isDeleted ? 'Reactivar artículo' : 'Cambiar estado del artículo'}
    >
      <div className="space-y-4">
        <p
          className="text-base"
          style={{
            color: theme === 'dark' ? '#e5e7eb' : '#374151',
          }}
        >
          {isDeleted ? (
            <>
              ¿Estás seguro de reactivar el artículo{' '}
              <span
                className="font-semibold"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                "{selectedArticle?.titulo}"
              </span>
              ?
            </>
          ) : (
            <>
              ¿Estás seguro de cambiar el estado del artículo{' '}
              <span
                className="font-semibold"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                }}
              >
                "{selectedArticle?.titulo}"
              </span>{' '}
              a borrado?
            </>
          )}
        </p>

        {/* Solo mostrar el select de motivo si el artículo no está borrado */}
        {!isDeleted && (
          <div>
            <label
              className="block font-medium mb-2"
              style={{
                color: theme === 'dark' ? '#ffffff' : '#111827',
              }}
            >
              Motivo del cambio:
            </label>
            <select
              className="w-full p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
                color: theme === 'dark' ? '#ffffff' : '#111827',
                border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#3b82f6' : '#2563eb';
                e.currentTarget.style.boxShadow =
                  theme === 'dark'
                    ? '0 0 0 2px rgba(59, 130, 246, 0.3)'
                    : '0 0 0 2px rgba(37, 99, 235, 0.3)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor =
                  theme === 'dark' ? '#4b5563' : '#d1d5db';
                e.currentTarget.style.boxShadow = 'none';
              }}
              value={motivo}
              onChange={(e) => onMotivoChange(e.target.value)}
            >
              <option value="">Selecciona un motivo</option>
              <option value="Incompleto">Incompleto</option>
              <option value="Sin transcripción">Sin transcripción</option>
              <option value="Sin mención">Sin mención</option>
              <option value="Irrelevante (matriz)">Irrelevante (matriz)</option>
              <option value="Repetida">Repetida</option>
              <option value="Ubicación">Ubicación</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            style={{
              backgroundColor: isDeleted ? '#10b981' : '#fb923c',
              color: '#ffffff',
              border: 'none',
              boxShadow:
                theme === 'dark'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isDeleted
                ? '#059669'
                : '#f97316';
              e.currentTarget.style.boxShadow =
                theme === 'dark'
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDeleted
                ? '#10b981'
                : '#fb923c';
              e.currentTarget.style.boxShadow =
                theme === 'dark'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onClick={onConfirm}
          >
            {isDeleted ? 'Pasar a Activo' : 'Cambiar a borrado'}
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            style={{
              backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
              color: theme === 'dark' ? '#ffffff' : '#374151',
              border: `1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'}`,
              boxShadow:
                theme === 'dark'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#4b5563' : '#e5e7eb';
              e.currentTarget.style.boxShadow =
                theme === 'dark'
                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark' ? '#374151' : '#f3f4f6';
              e.currentTarget.style.boxShadow =
                theme === 'dark'
                  ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </Modal>
  );
};

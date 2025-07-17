import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Proyecto } from '../../services/proyectosRequest';
import { Button } from '../../../../shared/components/ui/Button';
import { Modal } from '../../../../shared/components/ui/Modal';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  proyecto: Proyecto | null;
  loading?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  proyecto,
  loading = false,
}) => {
  const { theme } = useTheme();

  if (!proyecto) return null;

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Proyecto">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <FaExclamationTriangle
              className="h-12 w-12 text-red-500"
              aria-hidden="true"
            />
          </div>
          <div className="flex-1">
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
            >
              ¿Estás seguro?
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
            >
              Esta acción eliminará permanentemente el proyecto y no se puede
              deshacer.
            </p>
          </div>
        </div>

        <div
          className="border rounded-lg p-4"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f9fafb',
            borderColor: theme === 'dark' ? '#4b5563' : '#e5e7eb',
          }}
        >
          <h4
            className="font-medium mb-2"
            style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
          >
            Proyecto a eliminar:
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Nombre:
              </span>
              <span
                className="text-sm font-semibold"
                style={{ color: theme === 'dark' ? '#d1d5db' : '#374151' }}
              >
                {proyecto.nombre}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium"
                style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
              >
                Estado:
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  proyecto.activo
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}
              >
                {proyecto.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? 'Eliminando...' : 'Sí, eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

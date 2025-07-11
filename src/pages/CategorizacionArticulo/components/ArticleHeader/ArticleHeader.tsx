import { useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { Link } from 'react-router-dom';
import { DeleteModal } from '../../../MisArticulosLideres/components/ActionsPanel/DeleteModal';

interface ArticleHeaderProps {
  titulo: string;
  url: string;
  proyecto?: string;
  isFinished?: boolean;
  isFinalizingArticle?: boolean;
  borrado?: boolean;
  onCambiarEstadoArticulo?: (accion: boolean, motivo: string) => void;
  onFinalizarCategorizacion?: () => void;
}

export const ArticleHeader = ({
  titulo,
  url,
  proyecto,
  isFinished,
  isFinalizingArticle,
  borrado = false,
  onCambiarEstadoArticulo,
  onFinalizarCategorizacion,
}: ArticleHeaderProps) => {
  const { theme } = useTheme();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [motivo, setMotivo] = useState('');

  const articleForModal = {
    titulo,
    borrado,
  };

  const handleOpenModal = () => {
    setIsDeleteModalOpen(true);
    setMotivo('');
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setMotivo('');
  };

  const handleConfirmStateChange = () => {
    if (onCambiarEstadoArticulo) {
      const accion = !borrado;
      onCambiarEstadoArticulo(accion, motivo);
      setIsDeleteModalOpen(false);
      setMotivo('');
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB',
        }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{
            borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          }}
        >
          <Link
            to={'/mis-articulos-lider'}
            className="flex items-center gap-2 text-lg font-medium transition-colors hover:opacity-80"
            style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
          >
            <FaChevronLeft /> Categorización de Artículo
          </Link>

          <div className="flex items-center gap-2">
            {onCambiarEstadoArticulo && (
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: borrado
                    ? theme === 'dark'
                      ? '#16a34a'
                      : '#15803D'
                    : theme === 'dark'
                    ? '#ef4444'
                    : '#dc2626',
                  color: '#ffffff',
                }}
              >
                {borrado ? 'Activar artículo' : 'Eliminar artículo'}
              </button>
            )}

            {!isFinished && onFinalizarCategorizacion && (
              <button
                onClick={onFinalizarCategorizacion}
                disabled={isFinalizingArticle}
                className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 hover:opacity-90"
                style={{
                  backgroundColor: theme === 'dark' ? '#16a34a' : '#15803D',
                  color: '#ffffff',
                }}
              >
                {isFinalizingArticle ? 'Finalizando...' : 'Finalizar'}
              </button>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group cursor-pointer transition-all duration-200 hover:opacity-80"
            >
              <div className="p-1 rounded bg-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] transition-colors duration-200">
                <span className="text-white text-md">🔗</span>
              </div>
              <h2
                className="text-xl font-medium transition-colors duration-200"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#374151',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color =
                    theme === 'dark' ? '#60a5fa' : '#2563EB';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color =
                    theme === 'dark' ? '#ffffff' : '#374151';
                }}
              >
                {titulo}
              </h2>
            </a>
            {proyecto && (
              <span
                className="text-md font-medium px-2 py-1 rounded-md"
                style={{
                  backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
                  color: theme === 'dark' ? '#9ca3af' : '#111827',
                }}
              >
                {proyecto}
              </span>
            )}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        selectedArticle={articleForModal}
        motivo={motivo}
        onClose={handleCloseModal}
        onMotivoChange={setMotivo}
        onConfirm={handleConfirmStateChange}
      />
    </>
  );
};

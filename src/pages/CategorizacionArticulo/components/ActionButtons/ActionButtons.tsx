import { useTheme } from '../../../../context/ThemeContext';

interface ActionButtonsProps {
  finished: boolean;
  state: boolean;
  isFinalizingArticle: boolean;
  onFinalizarCategorizacion: () => void;
  onCambiarEstado: (estado: boolean) => void;
}

export const ActionButtons = ({
  finished,
  state,
  isFinalizingArticle,
  onFinalizarCategorizacion,
  onCambiarEstado,
}: ActionButtonsProps) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {!finished && (
        <button
          onClick={onFinalizarCategorizacion}
          disabled={isFinalizingArticle}
          className="px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          style={{
            backgroundColor: theme === 'dark' ? '#16a34a' : '#22c55e',
            color: '#ffffff',
          }}
        >
          {isFinalizingArticle ? 'Finalizando...' : 'Finalizar Categorización'}
        </button>
      )}

      <button
        onClick={() => onCambiarEstado(!state)}
        className="px-6 py-3 rounded-lg font-medium border transition-colors"
        style={{
          backgroundColor: state
            ? theme === 'dark'
              ? '#7f1d1d'
              : '#fef2f2'
            : theme === 'dark'
            ? '#166534'
            : '#dcfce7',
          color: state
            ? theme === 'dark'
              ? '#fca5a5'
              : '#dc2626'
            : theme === 'dark'
            ? '#4ade80'
            : '#16a34a',
          borderColor: state
            ? theme === 'dark'
              ? '#dc2626'
              : '#ef4444'
            : theme === 'dark'
            ? '#22c55e'
            : '#16a34a',
        }}
      >
        {state ? 'Desactivar' : 'Activar'} Artículo
      </button>
    </div>
  );
};

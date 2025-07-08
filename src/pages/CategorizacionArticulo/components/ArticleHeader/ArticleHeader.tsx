import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../../context/ThemeContext';
import { FaChevronLeft } from 'react-icons/fa';

interface ArticleHeaderProps {
  titulo: string;
  medio: string;
  fecha: string;
  url: string;
}

export const ArticleHeader = ({
  titulo,
  medio,
  fecha,
  url,
}: ArticleHeaderProps) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => navigate('/mis-articulos-lideres')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
          style={{
            backgroundColor: theme === 'dark' ? '#374151' : '#f3f4f6',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            color: theme === 'dark' ? '#ffffff' : '#374151',
          }}
        >
          <FaChevronLeft />
          <span>Volver a artículos</span>
        </button>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">{titulo}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <span>
            <strong>Medio:</strong> {medio}
          </span>
          <span>
            <strong>Fecha:</strong>{' '}
            {new Date(fecha).toLocaleDateString('es-ES')}
          </span>
        </div>
        <div className="mt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {url}
          </a>
        </div>
      </div>
    </div>
  );
};

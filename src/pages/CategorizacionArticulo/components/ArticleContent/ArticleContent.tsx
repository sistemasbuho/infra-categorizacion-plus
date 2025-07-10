import { useRef } from 'react';
import { useTheme } from '../../../../shared/context/ThemeContext';
import { FaPen, FaPencilRuler, FaPenFancy, FaPenNib } from 'react-icons/fa';

interface Fragmento {
  id: string;
  posicion_inicio: number;
  posicion_fin: number;
  categoria: string;
}

interface ArticleContentProps {
  texto: string;
  fragmentos: Fragmento[];
  activeSection: string | null;
  toggleSection: (section: string) => void;
  onTextSelection: (event: React.MouseEvent<HTMLDivElement>) => void;
  fontSize: number;
}

export const ArticleContent = ({
  texto,
  fragmentos,
  activeSection,
  toggleSection,
  onTextSelection,
  fontSize,
}: ArticleContentProps) => {
  const { theme } = useTheme();
  const articleTextRef = useRef<HTMLDivElement>(null);

  const getHighlightedText = (text: string) => {
    // Validar que text sea válido
    if (!text || typeof text !== 'string') return '';
    if (!fragmentos || fragmentos.length === 0) return text;

    const fragments = [...fragmentos].sort(
      (a, b) => (b.posicion_inicio || 0) - (a.posicion_inicio || 0)
    );
    let highlightedText = text;

    fragments.forEach((fragment) => {
      // Validar que highlightedText sea válido
      if (!highlightedText || typeof highlightedText !== 'string') return;

      const startIndex = fragment.posicion_inicio || 0;
      const endIndex = fragment.posicion_fin || startIndex;

      // Validar que los índices sean válidos
      if (
        startIndex < 0 ||
        endIndex < 0 ||
        startIndex >= highlightedText.length ||
        endIndex > highlightedText.length
      ) {
        return;
      }

      const before = highlightedText.substring(0, startIndex);
      const highlighted = highlightedText.substring(startIndex, endIndex);
      const after = highlightedText.substring(endIndex);

      highlightedText = `${before}<mark id="fragment-${
        fragment.id || 'unknown'
      }" style="background-color: #e9d5ff; color: #581c87; padding: 2px 4px; border-radius: 3px; cursor: pointer; border: 2px solid #a855f7; user-select: none;" title="Fragmento categorizado - Categoría: ${
        fragment.categoria || 'Sin categoría'
      }&#10;Clic para ver detalles&#10;Esta porción ya está fragmentada y no se puede seleccionar nuevamente">${highlighted}</mark>${after}`;
    });

    return highlightedText || '';
  };

  return (
    <div
      className="border rounded-lg mb-6"
      style={{
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
      }}
    >
      <button
        onClick={() => toggleSection('transcription')}
        className="w-full flex items-center justify-between p-4 text-left transition-colors cursor-pointer"
        style={{
          backgroundColor:
            activeSection === 'transcription'
              ? theme === 'dark'
                ? '#1f2937'
                : '#f9fafb'
              : 'transparent',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">✏️</span>
          <span className="font-medium">Transcripción</span>
        </div>
        <div
          className="text-lg transform transition-transform"
          style={{
            transform:
              activeSection === 'transcription'
                ? 'rotate(90deg)'
                : 'rotate(0deg)',
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          }}
        >
          ›
        </div>
      </button>

      {activeSection === 'transcription' && (
        <div
          className="p-4 border-t"
          style={{
            borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          }}
        >
          <div
            ref={articleTextRef}
            id="article-content"
            className="prose max-w-none leading-relaxed cursor-text"
            style={{
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
            }}
            onMouseUp={onTextSelection}
            dangerouslySetInnerHTML={{
              __html: getHighlightedText(texto),
            }}
          />
        </div>
      )}
    </div>
  );
};

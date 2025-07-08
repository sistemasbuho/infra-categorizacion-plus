import { useRef } from 'react';
import { useTheme } from '../../../../context/ThemeContext';

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
}

export const ArticleContent = ({
  texto,
  fragmentos,
  activeSection,
  toggleSection,
  onTextSelection,
}: ArticleContentProps) => {
  const { theme } = useTheme();
  const articleTextRef = useRef<HTMLDivElement>(null);

  const getHighlightedText = (text: string) => {
    if (!fragmentos || fragmentos.length === 0) return text;

    const fragments = [...fragmentos].sort(
      (a, b) => (b.posicion_inicio || 0) - (a.posicion_inicio || 0)
    );
    let highlightedText = text;

    fragments.forEach((fragment) => {
      const startIndex = fragment.posicion_inicio || 0;
      const endIndex = fragment.posicion_fin || startIndex;

      const before = highlightedText.substring(0, startIndex);
      const highlighted = highlightedText.substring(startIndex, endIndex);
      const after = highlightedText.substring(endIndex);

      highlightedText = `${before}<mark style="background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; cursor: pointer;" title="Categoría: ${
        fragment.categoria || 'Sin categoría'
      }">${highlighted}</mark>${after}`;
    });

    return highlightedText;
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
        className="w-full flex items-center justify-between p-4 text-left transition-colors"
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
            className="prose max-w-none text-sm leading-relaxed cursor-text"
            style={{
              color: theme === 'dark' ? '#e5e7eb' : '#374151',
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

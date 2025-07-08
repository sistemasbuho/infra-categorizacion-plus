import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFragmentos } from '../../hooks/useFragmentos';
import Loader from '../../components/ui/Loader';
import { ArticleHeader } from './components/ArticleHeader/ArticleHeader';
import { ArticleInfo } from './components/ArticleInfo/ArticleInfo';
import { ActionButtons } from './components/ActionButtons/ActionButtons';
import { ArticleContent } from './components/ArticleContent/ArticleContent';
import { FragmentsList } from './components/FragmentsList/FragmentsList';
import { FragmentModal } from './components/FragmentModal/FragmentModal';

export const CategorizacionArticulo = () => {
  const { theme } = useTheme();
  const { id, proyectoId } = useParams<{ id: string; proyectoId: string }>();
  const navigate = useNavigate();

  // Hook para manejar los fragmentos y datos del artículo
  const {
    articuloData,
    fragmentos,
    tags,
    temas,
    keywords,
    isLoading,
    error,
    selectedText,
    selectedRange,
    isCreatingFragment,
    isFinalizingArticle,
    createNewFragmento,
    updateExistingFragmento,
    deleteExistingFragmento,
    finalizarCategorizacion,
    cambiarEstadoArticulo,
    handleTextSelection,
    refetchData,
  } = useFragmentos(id || '', proyectoId || '');

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showFragmentModal, setShowFragmentModal] = useState(false);
  const [formData, setFormData] = useState({
    categoria: '',
    subcategoria: '',
    tono: '',
    sentimiento: '',
    tags: '',
  });

  const articleTextRef = useRef<HTMLDivElement>(null);

  // Mostrar loader mientras carga
  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  // Si hay error o no hay datos
  if (error || !articuloData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">
            Error al cargar el artículo
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'No se encontró el artículo'}
          </p>
          <button
            onClick={() => navigate('/mis-articulos-lideres')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Volver a artículos
          </button>
        </div>
      </div>
    );
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handleTextSelectionLocal = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      articleTextRef.current?.contains(selection.anchorNode)
    ) {
      const selectedText = selection.toString().trim();

      if (selectedText.length > 2) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(articleTextRef.current);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        const startIndex = preCaretRange.toString().length;
        const endIndex = startIndex + selectedText.length;

        setShowFragmentModal(true);
        setFormData({
          categoria: '',
          subcategoria: '',
          tono: '',
          sentimiento: '',
          tags: '',
        });
      }
    }
  };

  const createFragment = async () => {
    if (
      selectedText &&
      (formData.categoria || formData.tono || formData.tags)
    ) {
      try {
        await createNewFragmento({
          texto: selectedText,
          posicion_inicio: selectedRange?.start || 0,
          posicion_fin: selectedRange?.end || 0,
          categoria: formData.categoria || 'General',
          subcategoria: formData.subcategoria || undefined,
          tags: formData.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          autor: articuloData.autor || 'Desconocido',
          medio: articuloData.medio.nombre,
          tono: formData.tono || 'Neutro',
          sentimiento: formData.sentimiento || 'Neutro',
        });
        setShowFragmentModal(false);
        setFormData({
          categoria: '',
          subcategoria: '',
          tono: '',
          sentimiento: '',
          tags: '',
        });
      } catch (error) {
        console.error('Error creating fragment:', error);
      }
    }
  };

  const removeFragmentLocal = async (fragmentId: string) => {
    try {
      await deleteExistingFragmento(fragmentId);
    } catch (error) {
      console.error('Error removing fragment:', error);
    }
  };

  const closeModal = () => {
    setShowFragmentModal(false);
    setFormData({
      categoria: '',
      subcategoria: '',
      tono: '',
      sentimiento: '',
      tags: '',
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      {/* Header con navegación y botones de acción */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{
          borderBottomColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        }}
      >
        <button
          onClick={() => navigate('/mis-articulos-lideres')}
          className="flex items-center gap-2 text-lg font-medium"
          style={{ color: theme === 'dark' ? '#ffffff' : '#374151' }}
        >
          ← Categorización de Articulo
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => cambiarEstadoArticulo(!articuloData.state)}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: theme === 'dark' ? '#ef4444' : '#dc2626',
              color: '#ffffff',
            }}
          >
            Activar artículo
          </button>

          {!articuloData.finished && (
            <button
              onClick={finalizarCategorizacion}
              disabled={isFinalizingArticle}
              className="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: theme === 'dark' ? '#16a34a' : '#22c55e',
                color: '#ffffff',
              }}
            >
              {isFinalizingArticle ? 'Finalizando...' : 'Finalizar'}
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Título del artículo con ícono */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white text-sm">🔗</span>
          </div>
          <h2 className="text-xl font-medium">{articuloData.titulo}</h2>
        </div>

        {/* Secciones expandibles verticales */}
        <div className="space-y-4">
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
                <span className="text-xl">🔑</span>
                <span className="font-medium">Palabras clave</span>
              </div>
              <div
                className="text-lg transform transition-transform"
                style={{
                  transform:
                    activeSection === 'keywords'
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
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
                  {articuloData.palabras_clave.length > 0 ? (
                    articuloData.palabras_clave.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor:
                            theme === 'dark' ? '#065f46' : '#d1fae5',
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
                <span className="text-xl">📄</span>
                <span className="font-medium">Resumen</span>
              </div>
              <div
                className="text-lg transform transition-transform"
                style={{
                  transform:
                    activeSection === 'summary'
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
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
                <p className="text-sm leading-relaxed">
                  {articuloData.resumen}
                </p>
              </div>
            )}
          </div>

          {/* Medios */}
          <div
            className="border rounded-lg"
            style={{
              borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            }}
          >
            <button
              onClick={() => toggleSection('medios')}
              className="w-full flex items-center justify-between p-4 text-left transition-colors"
              style={{
                backgroundColor:
                  activeSection === 'medios'
                    ? theme === 'dark'
                      ? '#1f2937'
                      : '#f9fafb'
                    : 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📺</span>
                <span className="font-medium">Medios</span>
              </div>
              <div
                className="text-lg transform transition-transform"
                style={{
                  transform:
                    activeSection === 'medios'
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                  color: theme === 'dark' ? '#9ca3af' : '#6b7280',
                }}
              >
                ›
              </div>
            </button>

            {activeSection === 'medios' && (
              <div
                className="p-4 border-t"
                style={{
                  borderTopColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                }}
              >
                <p className="text-sm">
                  <strong>Medio:</strong> {articuloData.medio.nombre}
                </p>
                <p className="text-sm">
                  <strong>Fecha:</strong>{' '}
                  {new Date(articuloData.fecha).toLocaleDateString('es-ES')}
                </p>
                <a
                  href={articuloData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Ver artículo original
                </a>
              </div>
            )}
          </div>

          {/* Transcripción */}
          <ArticleContent
            texto={articuloData.texto}
            fragmentos={fragmentos}
            activeSection={activeSection}
            toggleSection={toggleSection}
            onTextSelection={handleTextSelectionLocal}
          />

          {/* Lista de fragmentos */}
          <FragmentsList
            fragmentos={fragmentos}
            onRemoveFragment={removeFragmentLocal}
          />
        </div>
      </div>

      {/* Modal de fragmentos */}
      <FragmentModal
        isOpen={showFragmentModal}
        selectedText={selectedText}
        formData={formData}
        onClose={closeModal}
        onFormDataChange={setFormData}
        onCreateFragment={createFragment}
      />
    </div>
  );
};

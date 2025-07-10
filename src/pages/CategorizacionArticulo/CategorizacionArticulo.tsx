import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../shared/context/ThemeContext';
import { useFragmentos } from '../../hooks/useFragmentos';
import Loader from '../../components/ui/Loader';
import { ArticleHeader } from './components/ArticleHeader/ArticleHeader';
import { ArticleInfo } from './components/ArticleInfo/ArticleInfo';
import { ArticleContent } from './components/ArticleContent/ArticleContent';
import { RightSidebar } from './components/RightSidebar/RightSidebar';
import { isOverlappingFragment } from '../../utils/funcs';
import { toast } from 'react-hot-toast';

export const CategorizacionArticulo = () => {
  const { theme } = useTheme();
  const { id, proyectoId } = useParams<{ id: string; proyectoId: string }>();
  const navigate = useNavigate();

  const {
    articuloData,
    fragmentos,
    tags,
    temas,
    isLoading,
    error,
    isFinalizingArticle,
    finalizarCategorizacion,
    cambiarEstadoArticulo,
    createNewFragmento,
    deleteExistingFragmento,
  } = useFragmentos(id || '', proyectoId || '');

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showFragmentModal, setShowFragmentModal] = useState(false);
  const [sidebarActiveTab, setSidebarActiveTab] = useState('info');
  const [transcriptionFontSize, setTranscriptionFontSize] = useState(14);
  const [formData, setFormData] = useState({
    categoria: '',
    subcategoria: '',
    tono: '',
    sentimiento: '',
    tags: '',
  });

  // Function to handle fragment click and scroll to fragment
  const handleFragmentClick = (fragmento: any) => {
    const fragmentElement = document.getElementById(`fragment-${fragmento.id}`);
    if (fragmentElement) {
      // Scroll to the fragment with smooth animation
      fragmentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      // Add a temporary highlight effect
      fragmentElement.style.boxShadow = '0 0 10px #a855f7';
      setTimeout(() => {
        fragmentElement.style.boxShadow = 'none';
      }, 2000);
    }
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

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
            onClick={() => navigate('/mis-articulos-lider')}
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

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    const articleContent = document.getElementById('article-content');

    if (!articleContent?.contains(selection.anchorNode)) {
      return;
    }

    const selectedText = selection.toString().trim();

    if (selectedText.length > 2) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(articleContent);
      preCaretRange.setEnd(range.startContainer, range.startOffset);
      const startIndex = preCaretRange.toString().length;
      const endIndex = startIndex + selectedText.length;

      // Validar que no se superponga con fragmentos existentes
      const fragmentosParaValidacion = fragmentos.map((frag) => ({
        id: parseInt(frag.id) || Date.now(), // Convertir string id a number
        start_index: frag.posicion_inicio,
        article_fragment: frag.texto,
        end_index: frag.posicion_fin,
      }));

      if (
        isOverlappingFragment({
          startIndex,
          length: selectedText.length,
          allFragments: fragmentosParaValidacion,
        })
      ) {
        toast.error(
          'No se puede crear un fragmento que se superponga con uno existente'
        );
        selection.removeAllRanges();
        return;
      }

      // Create fragment automatically
      const newFragmentData = {
        texto: selectedText,
        posicion_inicio: startIndex,
        posicion_fin: endIndex,
        categoria: 'General',
        subcategoria: '',
        tags: [],
        autor: articuloData?.autor || 'Unknown',
        medio: articuloData?.medio?.nombre || 'Unknown',
        tono: 'Neutro',
        sentimiento: 'Neutro',
      };

      // Use createNewFragmento from the hook
      createNewFragmento(newFragmentData);

      // Clear selection
      selection.removeAllRanges();
    }
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden"
      style={{
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#111827',
      }}
    >
      <ArticleHeader
        titulo={articuloData.titulo}
        url={articuloData.url}
        proyecto={articuloData.proyecto}
        isFinished={articuloData.finished}
        isFinalizingArticle={isFinalizingArticle}
        borrado={articuloData.borrado}
        onCambiarEstadoArticulo={(accion: boolean, motivo: string) =>
          cambiarEstadoArticulo(accion, motivo)
        }
        onFinalizarCategorizacion={finalizarCategorizacion}
      />

      <div className="flex flex-1 min-h-0">
        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 px-6 py-4">
            <ArticleInfo
              resumen={articuloData.resumen}
              palabras_clave={articuloData.palabras_clave}
              finished={articuloData.finished}
              state={articuloData.state}
              categorizado={articuloData.finished}
              activeSection={activeSection}
              toggleSection={toggleSection}
            />

            {/* Transcripción */}
            <ArticleContent
              texto={articuloData.texto}
              fragmentos={fragmentos}
              activeSection={activeSection}
              toggleSection={toggleSection}
              onTextSelection={handleTextSelectionLocal}
              fontSize={transcriptionFontSize}
            />
          </div>
        </div>

        {/* Sidebar derecho */}
        <RightSidebar
          articuloData={articuloData}
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
          transcriptionFontSize={transcriptionFontSize}
          setTranscriptionFontSize={setTranscriptionFontSize}
          fragmentos={fragmentos}
          onFragmentClick={handleFragmentClick}
          onDeleteFragment={deleteExistingFragmento}
          tags={tags}
          temas={temas}
          proyectoId={proyectoId}
        />
      </div>
    </div>
  );
};

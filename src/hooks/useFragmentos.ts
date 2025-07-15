import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getFragmentosCategorizacion,
  createFragmento,
  updateFragmento,
  deleteFragmento,
} from '../services/fragmentoRequest';
import { changeEstadoArticulo } from '../services/articulosLideresRequest';
import { isOverlappingFragment } from '../shared/utils/funcs';

interface Fragmento {
  id: string;
  texto: string;
  posicion_inicio: number;
  posicion_fin: number;
  categoria: string;
  subcategoria?: string;
  tags: string[];
  autor: string;
  medio: string;
  tono: string;
  sentimiento: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  temas?: any[];
  tag?: any[];
  activo?: any[];
  pasivo?: any[];
  tonoOriginal?: any;
}

interface ArticuloData {
  id: string;
  titulo: string;
  texto: string;
  url: string;
  fecha: string;
  finished: boolean;
  state: boolean;
  resumen: string;
  palabras_clave: string[];
  medio: {
    id: number;
    nombre: string;
  };
  autor: string | null;
  borrado: boolean;
  categorizado: boolean;
  proyecto: string;
  tipo_publicacion: string | null;
  variables_categorizacion?: any[];
}

interface Tag {
  id: string;
  nombre: string;
}

interface Tema {
  id: string;
  nombre: string;
}

interface Programa {
  id: number;
  nombre: string;
}

interface Tipo {
  id: number;
  nombre: string;
}

interface Keyword {
  nombre: string;
}

interface Tono {
  id: string;
  nombre: string;
}

interface Activo {
  id: string;
  nombre: string;
}

interface Pasivo {
  id: string;
  nombre: string;
}

interface ArticuloCompleto {
  articulo: ArticuloData;
  fragmentos: Fragmento[];
  tags: Array<{
    id: number;
    nombre: string;
    tags: Tag[];
  }>;
  temas: Tema[];
  programa: Programa[];
  tipo: Tipo[];
  keyword: Keyword[];
}

export const useFragmentos = (
  articuloId: string | undefined,
  proyectoId: string | undefined
) => {
  const [articuloData, setArticuloData] = useState<ArticuloData | null>(null);
  const [fragmentos, setFragmentos] = useState<Fragmento[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [temas, setTemas] = useState<Tema[]>([]);
  const [programa, setPrograma] = useState<Programa[]>([]);
  const [tipo, setTipo] = useState<Tipo[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [tonos, setTonos] = useState<Tono[]>([]);
  const [activos, setActivos] = useState<Activo[]>([]);
  const [pasivos, setPasivos] = useState<Pasivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [temporalFragments, setTemporalFragments] = useState<
    Array<{
      id: string;
      texto: string;
      posicion_inicio: number;
      posicion_fin: number;
      categoria: string;
      isTemporary: boolean;
    }>
  >([]);
  const [isCreatingFragment, setIsCreatingFragment] = useState(false);
  const [isFinalizingArticle, setIsFinalizingArticle] = useState(false);

  const fetchArticuloData = async () => {
    if (!articuloId || !proyectoId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await getFragmentosCategorizacion(
        articuloId,
        proyectoId
      );

      if (!response || !response.articulo) {
        throw new Error('No se pudo obtener la información del artículo');
      }

      const transformedArticulo: ArticuloData = {
        id: response.articulo.articulo_id.toString(),
        titulo: response.articulo.titulo,
        texto: response.articulo.contenido,
        url: response.articulo.url,
        fecha: response.articulo.fecha_publicacion,
        finished: response.articulo.categorizado,
        state: !response.articulo.borrado,
        resumen: response.articulo.resumen,
        palabras_clave: response.articulo.keywords || [],
        medio: { id: 1, nombre: response.articulo.medio },
        autor: response.articulo.autor || null,
        borrado: response.articulo.borrado,
        categorizado: response.articulo.categorizado,
        proyecto: response.articulo.proyecto || '',
        tipo_publicacion: response.articulo.tipo_publicacion || null,
        variables_categorizacion: response.variables_categorizacion || [],
      };

      const transformedFragmentos: Fragmento[] =
        response.fragmentos?.map((frag) => ({
          id: frag.id || `temp-${Date.now()}`,
          texto: frag.texto,
          posicion_inicio: parseInt(frag.indice_inicial),
          posicion_fin: parseInt(frag.indice_final),
          categoria:
            frag.temas?.length > 0
              ? typeof frag.temas[0] === 'object'
                ? frag.temas[0].id
                : frag.temas[0]
              : 'General',
          subcategoria: undefined,
          tags: (frag.tag || []).map((tag: any) =>
            typeof tag === 'object' ? tag.id : tag
          ),
          autor: response.articulo.autor || 'Desconocido',
          medio: response.articulo.medio || 'Desconocido',
          tono: (frag.tono as any)?.nombre || frag.tono || 'Neutro',
          sentimiento: 'Neutro',
          fecha_creacion: frag.created_at || new Date().toISOString(),
          fecha_modificacion:
            frag.modified_at || frag.created_at || new Date().toISOString(),
          temas: frag.temas || [],
          tag: frag.tag || [],
          activo: frag.activo_data || frag.activo || [],
          pasivo: frag.pasivo_data || frag.pasivo || [],
          tonoOriginal: frag.tono,
        })) || [];

      setArticuloData(transformedArticulo);
      setFragmentos(transformedFragmentos);

      const variablesCategorizacion = response.variables_categorizacion?.[0];

      setTags(variablesCategorizacion?.tags || []);
      setTemas(variablesCategorizacion?.temas || []);
      setTonos(variablesCategorizacion?.tonos || []);
      setActivos(variablesCategorizacion?.activos || []);
      setPasivos(variablesCategorizacion?.pasivos || []);
      setPrograma(response.programa || []);
      setTipo(response.tipo || []);
      setKeywords(response.variables_categorizacion || []);
    } catch (err) {
      console.error('Error al cargar datos del artículo:', err);
      setError('Error al cargar los datos del artículo');
      toast.error('Error al cargar los datos del artículo');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewFragmento = async (fragmentoData: {
    texto: string;
    indice_inicial: string;
    indice_final: string;
    tema_ids: string[];
    tono_id: string;
    tag_ids: string[];
    pasivo: string[];
    activo: string[];
  }) => {
    if (!articuloId) return;

    try {
      setIsCreatingFragment(true);

      const dataToSend = {
        ...fragmentoData,
        articulo_id: articuloId,
      };

      await createFragmento(dataToSend);

      toast.success('Fragmento creado exitosamente');

      await fetchArticuloData();

      setSelectedText('');
      setSelectedRange(null);
    } catch (err) {
      console.error('Error al crear fragmento:', err);
      toast.error('Error al crear el fragmento');
    } finally {
      setIsCreatingFragment(false);
    }
  };

  const updateExistingFragmento = async (
    fragmentoId: string,
    fragmentoData: {
      texto: string;
      tema_ids: string[];
      tag_ids: string[];
      tono_id: string;
      activo: string[];
      pasivo: string[];
    }
  ) => {
    try {
      await updateFragmento(fragmentoId, fragmentoData);

      toast.success('Fragmento actualizado exitosamente');

      await fetchArticuloData();
    } catch (err) {
      console.error('Error al actualizar fragmento:', err);
      toast.error('Error al actualizar el fragmento');
    }
  };

  const deleteExistingFragmento = async (fragmentoId: string) => {
    try {
      await deleteFragmento(fragmentoId);

      toast.success('Fragmento eliminado exitosamente');

      // Recargar datos
      await fetchArticuloData();
    } catch (err) {
      console.error('Error al eliminar fragmento:', err);
      toast.error('Error al eliminar el fragmento');
    }
  };

  const finalizarCategorizacion = async () => {
    if (!articuloId) return;

    try {
      setIsFinalizingArticle(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setArticuloData((prev) => (prev ? { ...prev, finished: true } : null));

      toast.success('Artículo finalizado exitosamente');
    } catch (err) {
      console.error('Error al finalizar artículo:', err);
      toast.error('Error al finalizar el artículo');
    } finally {
      setIsFinalizingArticle(false);
    }
  };

  const cambiarEstadoArticulo = async (
    accion: boolean,
    motivo: string = ''
  ) => {
    if (!articuloId) return;

    try {
      await changeEstadoArticulo(articuloId, accion, motivo);

      setArticuloData((prev) =>
        prev ? { ...prev, state: !accion, borrado: accion } : null
      );

      toast.success(
        `Artículo ${accion ? 'desactivado' : 'activado'} exitosamente`
      );
    } catch (err) {
      console.error('Error al cambiar estado del artículo:', err);
      toast.error('Error al cambiar el estado del artículo');
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);

      const container = document.getElementById('article-content');
      if (container) {
        const containerText =
          container.textContent || container.innerText || '';

        const beforeRange = document.createRange();
        beforeRange.selectNodeContents(container);
        beforeRange.setEnd(range.startContainer, range.startOffset);

        const beforeText = beforeRange.toString();
        const start = beforeText.length;
        const end = start + selectedText.length;

        const allFragments = [...fragmentos, ...temporalFragments];
        const existingFragments = allFragments.map((fragment) => ({
          start_index: fragment.posicion_inicio,
          article_fragment: fragment.texto,
        }));

        const hasOverlap = isOverlappingFragment({
          startIndex: start,
          length: selectedText.length,
          allFragments: existingFragments,
        });

        if (hasOverlap) {
          toast.error('La selección se superpone con un fragmento existente');
          selection.removeAllRanges();
          return;
        }

        if (start < 0 || end > containerText.length || start >= end) {
          toast.error('Selección inválida. Intenta seleccionar nuevamente.');
          selection.removeAllRanges();
          return;
        }

        const temporalFragment = {
          id: `temporal-${Date.now()}`,
          texto: selectedText,
          posicion_inicio: start,
          posicion_fin: end,
          categoria: 'temporal',
          isTemporary: true,
        };

        setTemporalFragments((prev) => [...prev, temporalFragment]);

        setSelectedText(selectedText);
        setSelectedRange({ start, end });

        selection.removeAllRanges();

        toast.success(
          'Fragmento temporal creado. Haz clic en él para categorizarlo.'
        );
      }
    }
  };

  useEffect(() => {
    fetchArticuloData();
  }, [articuloId]);

  const removeTemporalFragment = (temporalId: string) => {
    setTemporalFragments((prev) =>
      prev.filter((frag) => frag.id !== temporalId)
    );
  };

  const clearTemporalFragments = () => {
    setTemporalFragments([]);
  };

  return {
    articuloData,
    fragmentos,
    temporalFragments,
    tags,
    temas,
    tonos,
    activos,
    pasivos,
    tipo,
    programa,
    keywords,
    selectedText,
    selectedRange,
    isLoading,
    error,
    isCreatingFragment,
    isFinalizingArticle,
    fetchArticuloData,
    createNewFragmento,
    updateExistingFragmento,
    deleteExistingFragmento,
    finalizarCategorizacion,
    cambiarEstadoArticulo,
    handleTextSelection,
    removeTemporalFragment,
    clearTemporalFragments,
  };
};

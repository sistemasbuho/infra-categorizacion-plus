import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getFragmentosCategorizacion,
  createFragmento,
  updateFragmento,
  deleteFragmento,
  finalizarArticulo,
  categorizarArticulo,
  CategorizarArticuloResponse,
  ArticuloAPI,
  FragmentoAPI,
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
}

interface Tag {
  id: number;
  nombre: string;
}

interface Tema {
  id: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectedRange, setSelectedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
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
        id: response.articulo.id.toString(),
        titulo: response.articulo.titulo,
        texto: response.articulo.contenido,
        url: response.articulo.url,
        fecha: response.articulo.fecha_publicacion,
        finished: response.articulo.categorizado,
        state: !response.articulo.borrado,
        resumen: response.articulo.resumen,
        palabras_clave:
          response.variables_categorizacion?.map((k) => k.nombre) || [],
        medio: { id: 1, nombre: response.articulo.medio },
        autor: response.articulo.autor || null,
        borrado: response.articulo.borrado,
        categorizado: response.articulo.categorizado,
        proyecto: response.articulo.proyecto || '',
        tipo_publicacion: response.articulo.tipo_publicacion || null,
      };

      const transformedFragmentos: Fragmento[] =
        response.fragmentos?.map((frag) => ({
          id: frag.id || `temp-${Date.now()}`,
          texto: frag.texto,
          posicion_inicio: parseInt(frag.indice_inicial),
          posicion_fin: parseInt(frag.indice_final),
          categoria: frag.tema?.length > 0 ? frag.tema[0] : 'General',
          subcategoria: undefined,
          tags: frag.tag || [],
          autor: response.articulo.autor || 'Desconocido',
          medio: response.articulo.medio || 'Desconocido',
          tono: frag.tono || 'Neutro',
          sentimiento: 'Neutro',
          fecha_creacion: frag.created_at || new Date().toISOString(),
          fecha_modificacion:
            frag.modified_at || frag.created_at || new Date().toISOString(),
        })) || [];

      setArticuloData(transformedArticulo);
      setFragmentos(transformedFragmentos);

      setTags(response.tags || []);
      setTemas(response.temas || []);
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

  const createNewFragmento = async (
    fragmentoData: Omit<
      Fragmento,
      'id' | 'fecha_creacion' | 'fecha_modificacion'
    >
  ) => {
    try {
      setIsCreatingFragment(true);

      const fragmentosParaValidacion = fragmentos.map((frag) => ({
        id: parseInt(frag.id) || Date.now(),
        start_index: frag.posicion_inicio,
        article_fragment: frag.texto,
        end_index: frag.posicion_fin,
      }));

      if (
        isOverlappingFragment({
          startIndex: fragmentoData.posicion_inicio,
          length: fragmentoData.texto.length,
          allFragments: fragmentosParaValidacion,
        })
      ) {
        toast.error(
          'No se puede crear un fragmento que se superponga con uno existente'
        );
        return;
      }

      const newFragmento: Fragmento = {
        ...fragmentoData,
        id: `frag-${Date.now()}`,
        fecha_creacion: new Date().toISOString(),
        fecha_modificacion: new Date().toISOString(),
      };

      setFragmentos((prev) => [...prev, newFragmento]);

      toast.success('Fragmento creado exitosamente');

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
    fragmentoData: Partial<Fragmento>
  ) => {
    try {
      const updatedFragmento = {
        ...fragmentoData,
        fecha_modificacion: new Date().toISOString(),
      };

      setFragmentos((prev) =>
        prev.map((frag) =>
          frag.id === fragmentoId ? { ...frag, ...updatedFragmento } : frag
        )
      );

      toast.success('Fragmento actualizado exitosamente');
    } catch (err) {
      console.error('Error al actualizar fragmento:', err);
      toast.error('Error al actualizar el fragmento');
    }
  };

  const deleteExistingFragmento = async (fragmentoId: string) => {
    try {
      setFragmentos((prev) => prev.filter((frag) => frag.id !== fragmentoId));

      toast.success('Fragmento eliminado exitosamente');
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
        const containerRange = document.createRange();
        containerRange.selectNodeContents(container);
        containerRange.setEnd(range.startContainer, range.startOffset);
        const start = containerRange.toString().length;
        const end = start + selectedText.length;

        setSelectedText(selectedText);
        setSelectedRange({ start, end });
      }
    }
  };

  useEffect(() => {
    fetchArticuloData();
  }, [articuloId]);

  return {
    articuloData,
    fragmentos,
    tags,
    temas,
    tipo, // Add tipo array
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
  };
};

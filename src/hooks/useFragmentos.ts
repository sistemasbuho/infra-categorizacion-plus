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
import { isOverlappingFragment } from '../utils/funcs';

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

  // Función para cargar datos del artículo
  const fetchArticuloData = async () => {
    if (!articuloId || !proyectoId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Usamos la nueva función categorizarArticulo
      const response = await categorizarArticulo(articuloId, proyectoId);
      const data: CategorizarArticuloResponse = response;

      // Transformamos los datos para que coincidan con la interfaz
      const transformedArticulo: ArticuloData = {
        id: data.articulo.id,
        titulo: data.articulo.titulo,
        texto: data.articulo.contenido,
        url: data.articulo.url,
        fecha: data.articulo.fecha_publicacion,
        finished: data.articulo.categorizado,
        state: !data.articulo.borrado, // Si está borrado, state es false
        resumen: data.articulo.resumen,
        palabras_clave: [], // No viene en la API, podemos dejarlo vacío
        medio: {
          id: 1, // Valor por defecto
          nombre: data.articulo.medio,
        },
        autor: data.articulo.autor,
        borrado: data.articulo.borrado,
        categorizado: data.articulo.categorizado,
        proyecto: data.articulo.proyecto,
        tipo_publicacion: data.articulo.tipo_publicacion,
      };

      // Transformamos los fragmentos
      const transformedFragmentos: Fragmento[] = data.fragmentos.map(
        (frag: FragmentoAPI) => ({
          id: frag.id,
          texto: frag.texto,
          posicion_inicio: parseInt(frag.indice_inicial),
          posicion_fin: parseInt(frag.indice_final),
          categoria: frag.tema?.length > 0 ? frag.tema[0] : 'General',
          subcategoria: undefined,
          tags: frag.tag || [],
          autor: data.articulo.autor,
          medio: data.articulo.medio,
          tono: frag.tono || 'Neutro',
          sentimiento: 'Neutro', // No viene en la API
          fecha_creacion: frag.created_at,
          fecha_modificacion: frag.modified_at || frag.created_at,
        })
      );

      setArticuloData(transformedArticulo);
      setFragmentos(transformedFragmentos);

      // Ahora necesitamos cargar los datos de tags y temas usando una segunda llamada
      // porque la API categorizarArticulo no devuelve estos datos
      try {
        const categorizationData = await getFragmentosCategorizacion(
          articuloId
        );

        if (categorizationData && categorizationData.tags) {
          setTags(categorizationData.tags);
        }

        if (categorizationData && categorizationData.temas) {
          setTemas(categorizationData.temas);
        }

        if (categorizationData && categorizationData.programa) {
          setPrograma(categorizationData.programa);
        }

        if (categorizationData && categorizationData.tipo) {
          setTipo(categorizationData.tipo);
        }

        if (categorizationData && categorizationData.keyword) {
          setKeywords(categorizationData.keyword);
        }
      } catch (categorizationError) {
        console.warn(
          'Error al cargar datos de categorización:',
          categorizationError
        );
        // No lanzamos error aquí porque los datos principales del artículo se cargaron correctamente
        setTags([]);
        setTemas([]);
        setPrograma([]);
        setTipo([]);
        setKeywords([]);
      }
    } catch (err) {
      console.error('Error al cargar datos del artículo:', err);
      setError('Error al cargar los datos del artículo');
      toast.error('Error al cargar los datos del artículo');
    } finally {
      setIsLoading(false);
    }
  };

  // Función para crear un nuevo fragmento
  const createNewFragmento = async (
    fragmentoData: Omit<
      Fragmento,
      'id' | 'fecha_creacion' | 'fecha_modificacion'
    >
  ) => {
    try {
      setIsCreatingFragment(true);

      // Validar que no se superponga con fragmentos existentes
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

      // Comentado para usar datos mock por ahora
      // const response = await createFragmento(fragmentoData);

      // Simulamos la creación del fragmento
      const newFragmento: Fragmento = {
        ...fragmentoData,
        id: `frag-${Date.now()}`,
        fecha_creacion: new Date().toISOString(),
        fecha_modificacion: new Date().toISOString(),
      };

      // Actualizamos el estado local
      setFragmentos((prev) => [...prev, newFragmento]);

      toast.success('Fragmento creado exitosamente');

      // Limpiar selección
      setSelectedText('');
      setSelectedRange(null);
    } catch (err) {
      console.error('Error al crear fragmento:', err);
      toast.error('Error al crear el fragmento');
    } finally {
      setIsCreatingFragment(false);
    }
  };

  // Función para actualizar un fragmento existente
  const updateExistingFragmento = async (
    fragmentoId: string,
    fragmentoData: Partial<Fragmento>
  ) => {
    try {
      // Comentado para usar datos mock por ahora
      // const response = await updateFragmento(fragmentoId, fragmentoData);

      // Simulamos la actualización del fragmento
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

  // Función para eliminar un fragmento
  const deleteExistingFragmento = async (fragmentoId: string) => {
    try {
      // Comentado para usar datos mock por ahora
      // await deleteFragmento(fragmentoId);

      // Simulamos la eliminación del fragmento
      setFragmentos((prev) => prev.filter((frag) => frag.id !== fragmentoId));

      toast.success('Fragmento eliminado exitosamente');
    } catch (err) {
      console.error('Error al eliminar fragmento:', err);
      toast.error('Error al eliminar el fragmento');
    }
  };

  // Función para finalizar la categorización del artículo
  const finalizarCategorizacion = async () => {
    if (!articuloId) return;

    try {
      setIsFinalizingArticle(true);

      // Comentado para usar datos mock por ahora
      // await finalizarArticulo(articuloId);

      // Simulamos la finalización
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Actualizamos el estado local
      setArticuloData((prev) => (prev ? { ...prev, finished: true } : null));

      toast.success('Artículo finalizado exitosamente');
    } catch (err) {
      console.error('Error al finalizar artículo:', err);
      toast.error('Error al finalizar el artículo');
    } finally {
      setIsFinalizingArticle(false);
    }
  };

  // Función para cambiar el estado del artículo
  const cambiarEstadoArticulo = async (
    accion: boolean,
    motivo: string = ''
  ) => {
    if (!articuloId) return;

    try {
      // Usamos la misma lógica que MisArticulosLideres
      // accion: true = borrar, false = reactivar
      await changeEstadoArticulo(articuloId, accion, motivo);

      // Actualizamos el estado local
      // Si accion es true (borrar), el artículo quedará borrado
      // Si accion es false (reactivar), el artículo quedará activo
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

  // Función para manejar selección de texto
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);

      // Calcular posiciones relativas al contenido completo
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

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchArticuloData();
  }, [articuloId]);

  return {
    articuloData,
    fragmentos,
    tags,
    temas,
    programa,
    tipo,
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
    refetchData: fetchArticuloData,
  };
};

import { useEffect, useRef, useState } from 'react';
import { faCloudArrowUp, faPencil } from '@fortawesome/free-solid-svg-icons';
import { isOverlappingFragment } from '../utils/funcs';
import { useFragmentContext } from '../context/FragmentsContext';
import { HighlightSelection } from '../interfaces/generals';
import { useArticleContext } from '../context/ArticleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { editArticleText } from '../utils/asyncFunc';
import { useConfig } from '../context/ConfigContext';

import styles from '../assets/css/article.module.css';
import toast from 'react-hot-toast';

function Article(): JSX.Element {
  const { fontSize } = useConfig();
  const { setArticle, article } = useArticleContext().articleState;

  const { texto } = useArticleContext().articleState.article.articulo;
  const { keys } = useArticleContext().articleState.article;

  const [isEditable, setIsEditable] = useState(false);
  const [fragmentoTextoEditado, setFragmentoTextoEditado] = useState(texto);

  const { allFrags, methods } = useFragmentContext();
  const { allFragments } = allFrags;
  const { create: crearFragmento } = methods;
  const [articuloModificado, setArticuloModificado] = useState(texto);
  const articuloRef = useRef<HTMLParagraphElement | null>(null);
  const textAreaRef = useRef(null);

  const manejarSeleccion = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const seleccion = window.getSelection();
    if (
      seleccion &&
      seleccion.rangeCount > 0 &&
      articuloRef.current?.contains(seleccion.anchorNode)
    ) {
      if (seleccion.getRangeAt(0).toString().length <= 2) {
        return;
      }

      const rango = seleccion.getRangeAt(0);
      const textoSeleccionado = rango.toString();
      const rangoPreSeleccion = rango.cloneRange();
      rangoPreSeleccion.selectNodeContents(articuloRef.current);
      rangoPreSeleccion.setEnd(rango.startContainer, rango.startOffset);
      const indiceInicio = rangoPreSeleccion.toString().length;
      const longitud = textoSeleccionado.length;

      if (
        indiceInicio + longitud <= texto.length &&
        !isOverlappingFragment({
          startIndex: indiceInicio,
          length: longitud,
          allFragments,
        })
      ) {
        const nuevoFragmento = {
          id: Date.now(),
          article_fragment: textoSeleccionado,
          selectionId: Date.now(),
          start_index: indiceInicio,
          tema: [],
          tag: [],
          activo: [],
          pasivo: [],
          tono: null,
        };
        crearFragmento(nuevoFragmento);
      }
    }
  };

  const aplicarSelecciones = (
    texto: string,
    selecciones: HighlightSelection[]
  ) => {
    let textoModificado = texto;

    const palabrasClaveFiltradas = keys.filter((keyword) => {
      return !selecciones.some((seleccion) => {
        return (
          keyword.start_index <
            seleccion.start_index + seleccion.article_fragment.length &&
          keyword.start_index + keyword.article_fragment.length >
            seleccion.start_index
        );
      });
    });

    const seleccionesFinales = [...selecciones, ...palabrasClaveFiltradas].sort(
      (a, b) => b.start_index - a.start_index
    );

    seleccionesFinales.forEach(({ start_index, article_fragment, color }) => {
      const indiceInicio = Number(start_index);

      const antes = textoModificado.substring(0, indiceInicio);
      const seleccionado = textoModificado.substring(
        indiceInicio,
        indiceInicio + article_fragment.length
      );
      const despues = textoModificado.substring(
        indiceInicio + article_fragment.length
      );

      textoModificado = `${antes}<span id='${indiceInicio}_${
        article_fragment.length
      }' style="background-color:${color || 'blueviolet'}; color: ${
        color ? 'black' : 'whitesmoke'
      };">${seleccionado}</span>${despues}`;
    });

    return textoModificado;
  };

  const guardarEdicion = () => {
    editArticleText(article.articulo.id, { texto: fragmentoTextoEditado })
      .then(() => {
        setIsEditable(false);
        toast.success('Texto editado');

        setArticle((prev) => ({
          ...prev,
          articulo: {
            ...prev.articulo,
            texto: fragmentoTextoEditado,
          },
        }));
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ha ocurrido un error');
      });
  };

  useEffect(() => {
    const textoModificado = aplicarSelecciones(texto, allFragments);
    setArticuloModificado(textoModificado);
  }, [article, allFragments]);

  return (
    <>
      {/* <Box>
        {allFragments.length === 0 && (
          <Flex gap={4} my={4}>
            <Button p={4} onClick={() => setIsEditable((prev) => !prev)}>
              {isEditable ? (
                'Cancelar'
              ) : (
                <>
                  <FontAwesomeIcon icon={faPencil} />
                  Editar
                </>
              )}
            </Button>

            {fragmentoTextoEditado !== texto && (
              <Button p={4} onClick={guardarEdicion}>
                <FontAwesomeIcon icon={faCloudArrowUp} />
                Guardar
              </Button>
            )}
          </Flex>
        )}
        {isEditable ? (
          <Textarea
            className={styles.page_editable}
            ref={textAreaRef}
            style={{ fontSize }}
            value={fragmentoTextoEditado}
            onChange={(e) => setFragmentoTextoEditado(e.target.value)}
          />
        ) : (
          <Text
            ref={articuloRef}
            onMouseUp={manejarSeleccion}
            style={{ fontSize }}
          >
            <span dangerouslySetInnerHTML={{ __html: articuloModificado }} />
          </Text>
        )}
      </Box> */}
    </>
  );
}

export default Article;

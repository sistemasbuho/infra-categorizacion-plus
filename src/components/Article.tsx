import { useEffect, useRef, useState } from 'react';
import { isOverlappingFragment } from '../utils/funcs';
import globalStyles from '../assets/css/general.module.css';
import styles from '../assets/css/article.module.css';
import { useConfig } from '../context/ConfigContext';
import { useArticleContext } from '../context/ArticleContext';
import { useFragmentContext } from '../context/FragmentsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

function Article(): JSX.Element {
  const { fontSize } = useConfig();
  const { texto } = useArticleContext().articleState.article.articulo;
  const { keys } = useArticleContext().articleState.article;

  // Fragmento editable
  const [esEditable, setEsEditable] = useState(false);
  const [fragmentoTextoEditado, setFragmentoTextoEditado] = useState(texto);

  const { allFrags, methods } = useFragmentContext();
  const { allFragments } = allFrags;
  const { create: crearFragmento } = methods;
  const [articuloModificado, setArticuloModificado] = useState(texto);
  const articuloRef = useRef<HTMLParagraphElement>(null);

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

  const aplicarSelecciones = (texto: string, selecciones: any[]) => {
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

  useEffect(() => {
    const textoModificado = aplicarSelecciones(texto, allFragments);
    setArticuloModificado(textoModificado);
  }, [texto, allFragments]);

  return (
    <>
      <div className={`${globalStyles.bg_sec}`}>
        <article className={styles.page}>
          <button
            className={styles.edit_btn}
            onClick={() => setEsEditable((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faPencil} />
            Editar
          </button>
          {esEditable ? (
            <div
              style={{ fontSize }}
              className={styles.page_editable}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setFragmentoTextoEditado(e.target.innerHTML)}
              dangerouslySetInnerHTML={{ __html: fragmentoTextoEditado }}
            />
          ) : (
            <p
              ref={articuloRef}
              onMouseUp={manejarSeleccion}
              style={{ fontSize }}
            >
              <span dangerouslySetInnerHTML={{ __html: articuloModificado }} />
            </p>
          )}
        </article>
      </div>
    </>
  );
}

export default Article;

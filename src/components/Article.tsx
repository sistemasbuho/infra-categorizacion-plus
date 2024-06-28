import { useEffect, useRef, useState } from 'react';
import { isOverlappingFragment } from '../utils/funcs';

import globalStyles from '../assets/css/general.module.css';
import styles from '../assets/css/article.module.css';

import { useConfig } from '../context/ConfigContext';
import { useArticleContext } from '../context/ArticleContext';
import { useFragmentContext } from '../context/FragmentsContext';

function Article(): JSX.Element {
  const { fontSize } = useConfig();
  const { texto } = useArticleContext().articleState.article.articulo;
  const { allFrags, methods } = useFragmentContext();

  const { allFragments } = allFrags;
  const { create: createFrag } = methods;
  const [articleModified, setArticleModified] = useState(texto);
  const articleRef = useRef<HTMLParagraphElement>(null);

  const handleSelection = (event: React.MouseEvent<HTMLParagraphElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      articleRef.current?.contains(selection.anchorNode)
    ) {
      if (selection.getRangeAt(0).toString().length <= 2) {
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(articleRef.current);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const startIndex = preSelectionRange.toString().length;
      const length = selectedText.length;

      if (!isOverlappingFragment({ startIndex, length, allFragments })) {
        const newFragment = {
          id: Date.now(),
          article_fragment: selectedText,
          selectionId: Date.now(),
          tema: [],
          start_index: Number(startIndex),
          tag_details: [],
          tema_details: [],
          activo_details: [],
          pasivo_details: [],
          tono: null,
        };
        createFrag(newFragment);
      }
    }
  };

  const applySelections = (text, selections) => {
    let modifiedText = text;
    const sortedSelections = selections.sort(
      (a, b) => b.start_index - a.start_index
    );

    sortedSelections.forEach(({ start_index, article_fragment }) => {
      start_index = Number(start_index);

      const before = modifiedText.substring(0, start_index);
      const selected = modifiedText.substring(
        start_index,
        start_index + article_fragment.length
      );
      const after = modifiedText.substring(
        start_index + article_fragment.length
      );

      modifiedText = `${before}<span id='${start_index}_${article_fragment.length}' style="background-color: blueviolet; color: whitesmoke;">${selected}</span>${after}`;
    });

    return modifiedText;
  };

  useEffect(() => {
    const modifiedText = applySelections(texto, allFragments);
    setArticleModified(modifiedText);
    return () => {};
  }, [allFragments]);

  return (
    <>
      <div className={`${globalStyles.bg_sec}`}>
        <article className={styles.page}>
          <p
            ref={articleRef}
            onMouseUp={handleSelection}
            style={{ fontSize: fontSize }}
          >
            <span dangerouslySetInnerHTML={{ __html: articleModified }} />
          </p>
        </article>
      </div>
    </>
  );
}

export default Article;

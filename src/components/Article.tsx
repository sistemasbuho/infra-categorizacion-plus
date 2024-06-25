import { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Selection } from '../interfaces/generals';
import { isOverlappingFragment } from '../utils/funcs';

import globalStyles from '../assets/css/general.module.css';
import styles from '../assets/css/article.module.css';
import { useConfig } from '../context/ConfigContext';
import { useArticleContext } from '../context/ArticleContext';

interface ArticleProps {
  selections: Selection[];
  newSelections: Selection[];
  setSelections: Dispatch<SetStateAction<Selection[]>>;
  setNewSelections: Dispatch<SetStateAction<Selection[]>>;
}

function Article({
  selections,
  setSelections,
  newSelections,
  setNewSelections,
}: ArticleProps): JSX.Element {
  const { fontSize } = useConfig();
  const { texto } = useArticleContext().articleState.article.articulo;
  const [allSelections, setAllSelections] = useState([]);

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
      const allSelections = [...selections, ...newSelections];

      if (!isOverlappingFragment({ startIndex, length, allSelections })) {
        setNewSelections((prevSelections: Selection[]) => [
          ...prevSelections,
          {
            id: Date.now(),
            article_fragment: selectedText,
            selectionId: Date.now(),
            tema: [],
            startIndex,
          },
        ]);
      }
    }
  };

  const applySelections = (text: string, selections: Selection[]) => {
    let modifiedText = text;

    const sortedSelections = selections.sort(
      (a, b) => b.start_index - a.start_index
    );

    sortedSelections.forEach(({ start_index, article_fragment }) => {
      const before = modifiedText.slice(0, start_index);
      const selected = modifiedText.slice(
        Number(start_index),
        Number(start_index) + article_fragment.length
      );
      const after = modifiedText.slice(article_fragment.length);

      modifiedText = `${before}<span id='${
        start_index + '_' + length
      }' style="background-color: blueviolet; color: whitesmoke;">${selected}</span>${after}`;
    });

    return modifiedText;
  };

  useEffect(() => {
    setSelections((sel) =>
      sel.map((select) => ({ ...select, selectionId: Date.now() }))
    );
    return () => {};
  }, []);

  useEffect(() => {
    setAllSelections([...selections, ...newSelections]);
    return () => {};
  }, [selections, newSelections]);

  useEffect(() => {
    const modifiedText = applySelections(texto, allSelections);
    setArticleModified(modifiedText);
    return () => {};
  }, [allSelections]);

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

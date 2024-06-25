import { Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Selection } from '../interfaces/generals';
import { isOverlappingFragment } from '../utils/funcs';

import globalStyles from '../assets/css/general.module.css';
import styles from '../assets/css/article.module.css';
import { useConfig } from '../context/ConfigContext';

interface ArticleProps {
  text: string;
  selections: Selection[];
  newSelections: Selection[];
  setSelections: Dispatch<SetStateAction<Selection[]>>;
  setNewSelections: Dispatch<SetStateAction<Selection[]>>;
}

function Article({
  text,
  selections,
  setSelections,
  newSelections,
  setNewSelections,
}: ArticleProps): JSX.Element {
  const { fontSize } = useConfig();

  const [articleModified, setArticleModified] = useState(text);
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
            text: selectedText,
            selectionId: Date.now(),
            tema: [],
            startIndex,
            length,
          },
        ]);
      }
    }
  };

  const applySelections = (text: string, selections: Selection[]) => {
    let modifiedText = text;

    const sortedSelections = selections.sort(
      (a, b) => b.startIndex - a.startIndex
    );

    sortedSelections.forEach(({ startIndex, length }) => {
      const before = modifiedText.slice(0, startIndex);
      const selected = modifiedText.slice(
        Number(startIndex),
        Number(startIndex) + length
      );
      const after = modifiedText.slice(startIndex + length);

      modifiedText = `${before}<span id='${
        startIndex + '_' + length
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
    const allSelections = [...selections, ...newSelections];
    const modifiedText = applySelections(text, allSelections);

    setArticleModified(modifiedText);
  }, [newSelections]);

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

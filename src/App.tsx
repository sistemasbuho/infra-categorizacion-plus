import { getArticleData } from './utils/asyncFunc.ts';
import { Selection, NewSelection, article } from './interfaces/generals.ts';
import { useEffect, useState } from 'react';

import GeneralCategorization from './components/GeneralCategorization.tsx';
import HeaderBar from './components/HeaderBar.tsx';
import MinContainer from './components/MinContainer.tsx';
import KeywordSearh from './components/KeywordSearh.tsx';
import SummaryArticle from './components/SummaryArticle.tsx';
import Article from './components/Article.tsx';
import styles from './assets/css/app.module.css';
import Menu from './components/menu/Menu.tsx';

function App() {
  const [isLoading, setsLoading] = useState(false);
  const [articleText, setArticleText] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [selections, setSelections] = useState<Selection[]>([]);
  const [newSelections, setNewSelections] = useState<NewSelection[]>([]);
  const [article, setarticle] = useState<article>(null);

  useEffect(() => {
    async function fetchData() {
      await getArticleData(1204095).then((data) => {
        setarticle(data.articulo);
        setArticleText(data.articulo.texto);
        setSummaryText(data.articulo.resumen);
        setSelections(
          data.fragmentos.map((fragment): Selection => {
            return {
              id: fragment.id,
              startIndex: Number(fragment.start_index),
              length: fragment.articulo.texto.length,
              text: fragment.articulo.texto,
            };
          })
        );
        setsLoading(true);
      });
    }
    fetchData();
  }, []);

  function deleteFragment(frag: NewSelection) {
    setSelections((prev) => prev.filter((fragment) => fragment.id !== frag.id));
    setNewSelections((prev) =>
      prev.filter((fragment) => fragment.selectionId !== frag.selectionId)
    );
  }

  return (
    <>
      {isLoading ? (
        <section className={`${styles.cont_global}`}>
          <section className={styles.cont_article_sections}>
            <div>
              <HeaderBar />

              <div className="pe-3">
                <MinContainer title="Palabras clave" isDeployable>
                  <KeywordSearh />
                </MinContainer>
              </div>
            </div>

            <div className={styles.scrolled_section}>
              <MinContainer title="Resumen" isDeployable>
                <SummaryArticle text={summaryText} />
              </MinContainer>

              <MinContainer title="Visualización PDF" isDeployable>
                <GeneralCategorization />
              </MinContainer>

              <MinContainer title="Transcripción" isDeployable>
                <Article
                  text={articleText}
                  selections={selections}
                  setSelections={setSelections}
                  newSelections={newSelections}
                  setNewSelections={setNewSelections}
                />
              </MinContainer>
            </div>
          </section>

          <Menu
            articulo={article}
            fragments={[...selections, ...newSelections]}
            deleteFragment={deleteFragment}
          />
        </section>
      ) : (
        <p> Cargando</p>
      )}
    </>
  );
}

export default App;

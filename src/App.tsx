import { getArticleData } from './utils/asyncFunc.ts';
import {
  ArticleCategorization,
  Programas,
  Selection,
  Tags,
  Temas,
  Tipos,
  article,
} from './interfaces/generals.ts';
import { useEffect, useState } from 'react';

import GeneralCategorization from './components/GeneralCategorization.tsx';
import HeaderBar from './components/HeaderBar.tsx';
import MinContainer from './components/MinContainer.tsx';
import KeywordSearh from './components/KeywordSearh.tsx';
import SummaryArticle from './components/SummaryArticle.tsx';
import Article from './components/Article.tsx';
import styles from './assets/css/app.module.css';
import Menu from './components/menu/Menu.tsx';
import { ConfigProvider } from './context/ConfigContext.tsx';

function App() {
  const [isLoading, setsLoading] = useState(false);
  const [articleText, setArticleText] = useState<string>('');
  const [summaryText, setSummaryText] = useState<string>('');
  const [selections, setSelections] = useState<Selection[]>([]);
  const [newSelections, setNewSelections] = useState<Selection[]>([]);
  const [article, setarticle] = useState<article>(null);
  const [temas, setTemas] = useState<Temas[]>([]);
  const [tags, setTags] = useState<Tags[]>([]);
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const [programa, setPrograma] = useState<Programas[]>([]);
  const [ArticleCategorization, setArticleCategorization] =
    useState<ArticleCategorization | null>(null);

  function deleteFragment(frag: Selection) {
    setSelections((prev) => prev.filter((fragment) => fragment.id !== frag.id));
    setNewSelections((prev) =>
      prev.filter((fragment) => fragment.selectionId !== frag.selectionId)
    );
  }

  useEffect(() => {
    async function fetchData() {
      await getArticleData(1204095).then((data) => {
        setarticle(data.articulo);
        setArticleText(data.articulo?.texto);
        setSummaryText(data.articulo?.resumen);

        setArticleCategorization({
          tags: data.general[0].tag_data,
          temas: data.general[0].tema_data,
        });
        setTemas(data.temas);
        setTags(data.tags[0].tags);
        setTipos(data.tipo);
        setPrograma(data.programa);
        setSelections(
          data.fragmentos?.map((fragment): Selection => {
            return {
              id: fragment?.id,
              startIndex: Number(fragment?.start_index),
              length: fragment?.article_fragment?.length,
              text: fragment?.article_fragment,
              ...fragment,
            };
          })
        );
        setsLoading(true);
      });
    }
    fetchData();
  }, []);

  return (
    <ConfigProvider>
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
          ArticleCategorization={ArticleCategorization}
            tags={tags}
            temas={temas}
            articulo={article}
            fragments={[...selections, ...newSelections]}
            deleteFragment={deleteFragment}
          />
        </section>
      ) : (
        <p> Cargando</p>
      )}
    </ConfigProvider>
  );
}

export default App;

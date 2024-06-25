import { useEffect, useState } from 'react';

import {
  ArticleCategorization,
  GeneralOption,
  Programas,
  Selection,
  Tags,
  Temas,
  Tipos,
} from './interfaces/generals.ts';

import HeaderBar from './components/HeaderBar.tsx';
import MinContainer from './components/MinContainer.tsx';
import KeywordSearh from './components/KeywordSearh.tsx';
import SummaryArticle from './components/SummaryArticle.tsx';
import Article from './components/Article.tsx';
import styles from './assets/css/app.module.css';
import stylesGeneral from './assets/css/general.module.css';
import Menu from './components/menu/Menu.tsx';
import Loader from './components/Loader.tsx';
import RenderFile from './components/visualizacion/RenderFile.tsx';
import { useArticleContext } from './context/ArticleContext.tsx';
import { useConfig } from './context/ConfigContext.tsx';

function GlobalComponent() {
  const { isLoading } = useArticleContext().loadingState;
  const { article } = useArticleContext().articleState;

  const { darkMode } = useConfig();

  const [selections, setSelections] = useState<Selection[]>([]);
  const [newSelections, setNewSelections] = useState<Selection[]>([]);
  const [temas, setTemas] = useState<Temas[]>([]);
  const [tags, setTags] = useState<Tags[]>([]);
  const [tipos, setTipos] = useState<Tipos[]>([]);
  const [programas, setProgramas] = useState<Programas[]>([]);

  const [ArticleCategorization, setArticleCategorization] =
    useState<ArticleCategorization | null>(null);

  function deleteFragment(frag: Selection) {
    setSelections((prev) => prev.filter((fragment) => fragment.id !== frag.id));
    setNewSelections((prev) =>
      prev.filter((fragment) => fragment.selectionId !== frag.selectionId)
    );
  }

  useEffect(() => {
    if (!isLoading) {
      setArticleCategorization({
        tags: article.forms_data.general?.[0]?.tag_data.map(
          (item: GeneralOption) => ({
            id: item.id,
            nombre: item.nombre,
          })
        ),
        temas: article.forms_data.general?.[0]?.tema_data,
      });
      setTemas(article.forms_data.temas);
      setTags(article.forms_data.tags);
      setTipos(article.forms_data.tipo);
      setProgramas(article.forms_data.programa);

      setSelections(() => {
        return article.fragments.map((fragment) => ({
          id: fragment.id,
          start_index: Number(fragment.start_index),
          article_fragment: fragment.article_fragment,
          ...fragment,
        }));
      });
    }
  }, [article]);

  return (
    <>
      {!isLoading ? (
        <section
          className={`${styles.cont_global} ${stylesGeneral.App} ${
            darkMode && stylesGeneral.dark
          }`}
        >
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
                <SummaryArticle />
              </MinContainer>

              <MinContainer title="Visualización PDF" isDeployable>
                <RenderFile fileUrl={article.articulo.image_media_file} />
              </MinContainer>

              <MinContainer title="Transcripción" isDeployable>
                <Article
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
            tipos={tipos}
            programas={programas}
            tags={tags}
            temas={temas}
            fragments={[...selections, ...newSelections]}
            setSelections={setSelections}
            setNewSelections={setNewSelections}
            deleteFragment={deleteFragment}
          />
        </section>
      ) : (
        <Loader isLoading={isLoading} />
      )}
    </>
  );
}

export default GlobalComponent;

import { useArticleContext } from './context/ArticleContext';
import { useEffect, useRef } from 'react';
import { reportarTiempo } from './utils/asyncFunc';
import { useParams } from 'react-router';

import HeaderBar from './components/HeaderBar';
import MinContainer from './components/MinContainer';
import KeywordSearh from './components/KeywordSearh';
import SummaryArticle from './components/SummaryArticle';
import Article from './components/Article';
import styles from './assets/css/app.module.css';
import Menu from './components/menu/Menu';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import RenderFile from './components/visualizacion/RenderFile';
import usePageAndWindowVisibility from './hooks/usePageAndWindowVisibility';

function ComponentManager() {
  const { image_media_file } =
    useArticleContext().articleState.article.articulo;

  const { isLoading } = useArticleContext().loadingState;
  const { id } = useParams();
  const intervalRef = useRef<number | null>(null);
  const isPageVisible = usePageAndWindowVisibility();

  function enviarSegundo() {
    const update = {
      tiempo_segundos: 1,
      asignado_a: JSON.parse(localStorage.getItem('user_email')),
    };

    reportarTiempo(Number(id), update);
  }

  useEffect(() => {
    if (isPageVisible) {
      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(enviarSegundo, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPageVisible, id]);

  return (
    <>
      {!isLoading ? (
        <div className={styles.component_manager}>
          <Navbar />
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
                  <SummaryArticle />
                </MinContainer>

                <MinContainer
                  title={`Visualización ${
                    image_media_file?.length > 0 ? 'PDF' : 'Multimedia'
                  }`}
                  isDeployable
                >
                  <RenderFile />
                </MinContainer>

                <MinContainer title="Transcripción" isDeployable defaultOpened>
                  <Article />
                </MinContainer>
              </div>
            </section>

            <Menu />
          </section>
        </div>
      ) : (
        <Loader isLoading={isLoading} />
      )}
    </>
  );
}

export default ComponentManager;

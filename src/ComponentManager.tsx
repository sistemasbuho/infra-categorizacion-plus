import { useArticleContext } from './context/ArticleContext.tsx';
import { useEffect, useRef } from 'react';
import { reportarTiempo } from './utils/asyncFunc.ts';

import HeaderBar from './components/HeaderBar.tsx';
import MinContainer from './components/MinContainer.tsx';
import KeywordSearh from './components/KeywordSearh.tsx';
import SummaryArticle from './components/SummaryArticle.tsx';
import Article from './components/Article.tsx';
import styles from './assets/css/app.module.css';
import Menu from './components/menu/Menu.tsx';
import Loader from './components/Loader.tsx';
import Navbar from './components/Navbar.tsx';
import RenderFile from './components/visualizacion/RenderFile.tsx';
import { useParams } from 'react-router';

function ComponentManager() {
  const { isLoading } = useArticleContext().loadingState;
  const { asignado_a } = useArticleContext().articleState.article.articulo;
  const { id } = useParams();
  const intervalRef = useRef(null);

  function enviarSegundo() {
    const update = {
      tiempo_segundos: 1,
      asignado_a,
    };

    reportarTiempo(Number(id), update);
  }

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible' && asignado_a) {
        if (!intervalRef.current) {
          intervalRef.current = setInterval(enviarSegundo, 1000);
        }
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (document.visibilityState === 'visible' && asignado_a) {
      intervalRef.current = setInterval(enviarSegundo, 1000);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [asignado_a, id]);

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

                <MinContainer title="Visualización PDF" isDeployable>
                  <RenderFile />
                </MinContainer>

                <MinContainer title="Transcripción" isDeployable>
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

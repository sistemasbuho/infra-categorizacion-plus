import HeaderBar from './components/HeaderBar.tsx';
import MinContainer from './components/MinContainer.tsx';
import KeywordSearh from './components/KeywordSearh.tsx';
import SummaryArticle from './components/SummaryArticle.tsx';
import Article from './components/Article.tsx';
import styles from './assets/css/app.module.css';
import Menu from './components/menu/Menu.tsx';
import Loader from './components/Loader.tsx';
import { useArticleContext } from './context/ArticleContext.tsx';
import Navbar from './components/Navbar.tsx';

function ComponentManager() {
  const { isLoading } = useArticleContext().loadingState;

  return (
    <>
      {!isLoading ? (
        <>
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

                {/* <MinContainer title="Visualización PDF" isDeployable>
                <RenderFile fileUrl={article.image_media_file} />
              </MinContainer> */}

                <MinContainer title="Transcripción" isDeployable>
                  <Article />
                </MinContainer>
              </div>
            </section>

            <Menu />
          </section>
        </>
      ) : (
        <Loader isLoading={isLoading} />
      )}
    </>
  );
}

export default ComponentManager;

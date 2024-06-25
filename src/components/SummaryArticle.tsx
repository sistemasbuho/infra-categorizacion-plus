import style from '../assets/css/components/sumaryArticle.module.css';
import { useArticleContext } from '../context/ArticleContext';
import { useConfig } from '../context/ConfigContext';

function SummaryArticle() {
  const { fontSize } = useConfig();

  const { articleState } = useArticleContext();

  return (
    <div className={style.container}>
      <p style={{ fontSize: fontSize }}>
        {articleState.article?.articulo?.resumen}
      </p>
    </div>
  );
}

export default SummaryArticle;

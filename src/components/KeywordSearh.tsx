import { useArticleContext } from '../context/ArticleContext';

import styles from '../assets/css/components/keywordSearch.module.css';

function KeywordSearch() {
  const { keywords } = useArticleContext().articleState.article;

  return (
    <div className={styles.container}>
      <p className={styles.text_important}>
        {keywords.map((key, index) => {
          return `${index + 1}. ${key} `;
        })}
      </p>
    </div>
  );
}

export default KeywordSearch;

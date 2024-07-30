import styles from '../assets/css/components/keywordSearch.module.css';
import { useArticleContext } from '../context/ArticleContext';
import Search from './Search';

function KeywordSearch() {
  const { keywords } = useArticleContext().articleState.article;

  return (
    <div className={styles.container}>
      <p className={styles.text_important}>
        {keywords.map((key, index) => {
          return `${index + 1}. ${key} `;
        })}
      </p>
      <div>
        <Search />
      </div>
    </div>
  );
}

export default KeywordSearch;

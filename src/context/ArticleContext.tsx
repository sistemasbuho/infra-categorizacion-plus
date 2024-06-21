import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { article } from '../interfaces/generals';
import { getArticleData } from '../utils/asyncFunc';
import { useParams } from 'react-router';

interface Props {
  children: ReactNode;
}

interface ContextProps {
  article: article;
  setArticle: Dispatch<SetStateAction<article>>;
}

const ArticleContext = createContext(null);

export const ArticleProvider: FC<Props> = ({ children }) => {
  const [article, setArticle] = useState<article | null>(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      await getArticleData(id).then((data) => {
        setArticle(data.articulo);
      });
    }
    fetchData();
  }, []);
  return (
    <ArticleContext.Provider value={{ article, setArticle }}>
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticleContext = (): ContextProps => {
  const context = useContext(ArticleContext);
  if (!context) {
    throw new Error('useArticleContext must be used within an ArticleProvider');
  }
  return context;
};

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
import { article, GeneralOption, Selection } from '../interfaces/generals';
import { getArticleData } from '../utils/asyncFunc';

interface Props {
  children: ReactNode;
}

interface ContextProps {
  loadingState: {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  };

  articleState: {
    article: {
      articulo: article;
      fragments: Selection[];
      forms_data: {
        programa: GeneralOption[];
        tags: GeneralOption[];
        temas: GeneralOption[];
        tipo: GeneralOption[];
        general: {
          tag_data: GeneralOption[];
          tema_data: GeneralOption[];
        };
      };
    };
    setArticle: Dispatch<SetStateAction<article>>;
  };
}

const ArticleContext = createContext(null);

export const ArticleProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      await getArticleData(1204095).then((data) => {
        setArticle({
          articulo: { ...data.articulo },
          fragments: data.fragmentos,
          forms_data: {
            programa: data.programa,
            tags: data.tags,
            temas: data.temas,
            tipo: data.tipo,
            general: data.general,
          },
        });
        setIsLoading(false);
      });
    }
    fetchData();
  }, []);

  return (
    <ArticleContext.Provider
      value={{
        loadingState: { isLoading, setIsLoading },
        articleState: { article, setArticle },
      }}
    >
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

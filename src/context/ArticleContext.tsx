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
import { articleContext, Keywords } from '../interfaces/generals';
import { getArticleData } from '../utils/asyncFunc';
import { useParams } from 'react-router';

const initialArticleState = {
  articulo: {},
  fragments: [],
  siguiente_articulo: null,
  proyecto: '',
  forms_data: {
    programa: [],
    tags: [],
    temas: [],
    tipo: [],
    general: {
      tag: [],
      tema: [],
    },
  },
  keywords: [],
  keys: [],
};

interface Props {
  children: ReactNode;
}

interface ContextProps {
  loadingState: {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  };

  articleState: {
    article: articleContext;
    setArticle: Dispatch<SetStateAction<articleContext>>;
  };
}

const ArticleContext = createContext(null);

export const ArticleProvider: FC<Props> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState(initialArticleState);

  const { id } = useParams();

  function filterKeywordsResult(results: Keywords[]) {
    results.sort((a, b) => a.start_index - b.start_index);

    return results.filter((elemento, index, self) =>
      self.every((otro, otroIndex) => {
        if (index === otroIndex) return true;

        const rangoElemento = {
          inicio: elemento.start_index,
          fin: elemento.start_index + elemento.article_fragment.length,
        };

        const rangoOtro = {
          inicio: otro.start_index,
          fin: otro.start_index + otro.article_fragment.length,
        };

        return !(
          rangoElemento.inicio >= rangoOtro.inicio &&
          rangoElemento.fin <= rangoOtro.fin
        );
      })
    );
  }

  function getIdxAndLengthOfKeywords(
    keywords: string[],
    text: string
  ): Keywords[] {
    const results: Keywords[] = [];

    const lowerCaseString = text.toLowerCase();

    keywords.forEach((keyword) => {
      const lowerCaseKeyword = keyword.toLowerCase();
      let index = lowerCaseString.indexOf(lowerCaseKeyword);
      while (index !== -1) {
        results.push({
          start_index: index,
          article_fragment: lowerCaseKeyword,
          color: 'yellow',
        });
        index = lowerCaseString.indexOf(lowerCaseKeyword, index + 1);
      }
    });

    return filterKeywordsResult(results);
  }

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      await getArticleData(id).then((data) => {
        const tagGeneral = data?.general?.[0]?.tag_data;
        const temaGeneral = data?.general?.[0]?.tema_data;

        document.title = data.articulo.titulo;

        setArticle({
          articulo: {
            ...data?.articulo,
            texto: data.articulo.texto.replace(/\r/g, ''),
          },
          fragments: data?.fragmentos,
          siguiente_articulo: data?.siguiente_articulo || null,
          proyecto: data.proyecto[0].nombre,
          forms_data: {
            programa: data?.programa,
            tags: data?.tags[0]?.tags,
            temas: data?.temas,
            tipo: data?.tipo,
            general: {
              tag: tagGeneral,
              tema: temaGeneral,
            },
          },
          keywords: data.keyword.map((item) => item.nombre),
          keys: getIdxAndLengthOfKeywords(
            [...data.keyword.map((item) => item.nombre)],
            data?.articulo.texto.replace(/\r/g, '')
          ),
        });

        setIsLoading(false);
      });
    }
    fetchData();
  }, [id]);

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

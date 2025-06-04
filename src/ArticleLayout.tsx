import { useArticleContext } from './context/ArticleContext';
import { useEffect, useRef } from 'react';
import { CiTextAlignCenter } from 'react-icons/ci';
import { reportarTiempo } from './utils/asyncFunc';
import { useParams } from 'react-router';
import { Accordion, Flex } from '@chakra-ui/react';
import { FaKey, FaPencilAlt } from 'react-icons/fa';
import { GrMultimedia } from 'react-icons/gr';
import { FaFilePdf } from 'react-icons/fa6';

import HeaderBar from './components/HeaderBar';
import KeywordSearh from './components/KeywordSearh';
import SummaryArticle from './components/SummaryArticle';
import Article from './components/Article';
import Loader from './components/Loader';
import RenderFile from './components/visualizacion/RenderFile';
import usePageAndWindowVisibility from './hooks/usePageAndWindowVisibility';
import AcordeonItem from './components/AcordeonItem';

function ArticleLayout() {
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
        <Flex
          h={'full'}
          flexDir={'column'}
          gap={4}
          p={8}
          overflow={'hidden'}
          overflowY={'auto'}
        >
          {/*  keywords */}
          <HeaderBar />

          <Accordion.Root collapsible variant={'subtle'} multiple>
            <AcordeonItem title="Palabras clave" icon={FaKey}>
              <KeywordSearh />
            </AcordeonItem>

            {/* Secciones de categorización */}
            <AcordeonItem title="Resumen" icon={CiTextAlignCenter}>
              <SummaryArticle />
            </AcordeonItem>

            <AcordeonItem
              title={`Visualización ${
                image_media_file?.length > 0 ? 'PDF' : 'Multimedia'
              }`}
              icon={image_media_file?.length > 0 ? FaFilePdf : GrMultimedia}
            >
              <RenderFile />
            </AcordeonItem>

            <AcordeonItem title="Transcripción" icon={FaPencilAlt}>
              <Article />
            </AcordeonItem>
          </Accordion.Root>
        </Flex>
      ) : (
        <Loader isLoading={isLoading} />
      )}
    </>
  );
}

export default ArticleLayout;

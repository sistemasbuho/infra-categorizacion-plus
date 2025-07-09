import { finishArticle as finishArticleFunc } from '../utils/asyncFunc';
import { useArticleContext } from '../shared/context/ArticleContext';
import { useColorModeValue } from './ui/color-mode';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { FaChevronLeft, FaLink } from 'react-icons/fa';

import ConfirmDeleteArticle from './menu/options/ConfirmDeleteArticle';
import toast from 'react-hot-toast';
import Menu from './menu/Menu';

function HeaderBar() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { articulo: article, siguiente_articulo } =
    useArticleContext().articleState.article;

  const navigate = useNavigate();

  function exit() {
    navigate(-1);
  }

  async function finishArticle() {
    if (
      !article.tipo_articulo?.id ||
      article.medio.length <= 0 ||
      article.autor.length <= 0
    ) {
      return toast.error('Encabezado del articulo sin completar');
    }

    return await finishArticleFunc(article.id).then(() => {
      toast.success('Articulo finalizado', {
        position: 'bottom-center',
      });
      setTimeout(() => {
        if (siguiente_articulo?.[0]?.id)
          navigate(`/articulo/${siguiente_articulo[0].id}`);
      }, 2000);
    });
  }

  return (
    <>
      {/* <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'} onClick={exit}>
          <FaChevronLeft />
          <Text>Atrás</Text>
        </Flex>

        <Flex gap={4}>
          <Button onClick={() => setShowDeleteModal(true)} p={2}>
            {article?.state ? 'Activar articulo' : 'Eliminar articulo'}
          </Button>
          <Button p={2} onClick={finishArticle}>
            Finalizar
          </Button>
          <Menu />
        </Flex>
      </Flex>

      <Flex
        gap={2}
        alignItems={'center'}
        bg={useColorModeValue('blue.300', 'green.400')}
        p={2}
        borderRadius={'md'}
      >
        <IconButton
          variant={'ghost'}
          colorScheme={'blue'}
          onClick={() =>
            window.open(article.url, '_blank', 'noopener,noreferrer')
          }
          aria-label="Abrir enlace del artículo"
          title="Abrir enlace del artículo"
        >
          <FaLink />
        </IconButton>

        <Text truncate>{article.titulo}</Text>
      </Flex>

      {showDeleteModal && (
        <ConfirmDeleteArticle article={article} setShow={setShowDeleteModal} />
      )} */}
    </>
  );
}

export default HeaderBar;

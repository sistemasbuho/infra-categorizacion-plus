import { useArticleContext } from '../context/ArticleContext';

import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Flex, Heading, Text } from '@chakra-ui/react';

function Navbar() {
  const { titulo, url } = useArticleContext().articleState.article.articulo;
  const { proyecto } = useArticleContext().articleState.article;

  function goToOriginalLink() {
    if (url) {
      window.open(url, '_blank');
    }
  }

  return (
    <Flex justifyContent={'space-between'}>
      <Button variant={'plain'}>
        <FontAwesomeIcon
          icon={faArrowUpRightFromSquare}
          onClick={goToOriginalLink}
        />

        <Heading truncate onDoubleClick={goToOriginalLink} title={titulo}>
          {titulo}
        </Heading>
      </Button>
      <Text>{proyecto}</Text>
    </Flex>
  );
}

export default Navbar;

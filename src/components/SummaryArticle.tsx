import { Box, Text } from '@chakra-ui/react';
import style from '../assets/css/components/sumaryArticle.module.css';
import { useArticleContext } from '../context/ArticleContext';
import { useConfig } from '../context/ConfigContext';

function SummaryArticle() {
  const { fontSize } = useConfig();

  const { articleState } = useArticleContext();

  return (
    <Box className={style.container}>
      <Text style={{ fontSize: fontSize }}>
        {articleState.article?.articulo?.resumen}
      </Text>
    </Box>
  );
}

export default SummaryArticle;

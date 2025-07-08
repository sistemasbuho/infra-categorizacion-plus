import { useArticleContext } from '../context/ArticleContext';

function KeywordSearch() {
  const { keywords } = useArticleContext().articleState.article;

  return (
    <></>
    // <Flex gap={2} p={2} flexWrap={'wrap'}>
    //   {(keywords as unknown as string[]).map((key, index) => {
    //     return (
    //       <Badge key={index} p={2} variant={'outline'}>
    //         {key}
    //       </Badge>
    //     );
    //   })}
    // </Flex>
  );
}

export default KeywordSearch;

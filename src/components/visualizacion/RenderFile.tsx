import { useArticleContext } from '../../context/ArticleContext';

import RenderPDF from './renders/RenderPDF';
import RenderVideo from './renders/RenderVideo';

function RenderFile(): React.ReactElement {
  const { image_media_file, audio_media_file } =
    useArticleContext().articleState.article.articulo;

  return (
    <></>
    // <Flex alignItems={'center'} justifyContent={'center'}>
    //   <Box w={'breakpoint-md'}>
    //     {image_media_file?.length > 0 && (
    //       <RenderPDF pdfUrl={image_media_file} />
    //     )}
    //     {audio_media_file?.length > 0 && <RenderVideo url={audio_media_file} />}
    //   </Box>
    // </Flex>
  );
}

export default RenderFile;

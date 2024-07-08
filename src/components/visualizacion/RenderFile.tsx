import { useArticleContext } from '../../context/ArticleContext';
import RenderPDF from './renders/RenderPDF';


function RenderFile(): React.ReactElement {
  const { image_media_file}= useArticleContext().articleState.article.articulo

  return (
    <>
      <RenderPDF pdfUrl={image_media_file} />
    </>
  );
}

export default RenderFile;

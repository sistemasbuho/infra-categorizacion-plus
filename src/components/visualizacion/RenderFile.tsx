import RenderPDF from './renders/RenderPDF';

interface Props {
  fileUrl: string;
}

function RenderFile({ fileUrl }: Props): React.ReactElement {
  return (
    <>
      <RenderPDF pdfUrl={fileUrl} />
    </>
  );
}

export default RenderFile;

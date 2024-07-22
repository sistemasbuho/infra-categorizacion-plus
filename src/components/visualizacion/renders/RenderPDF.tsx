import styles from '../../../assets/css/components/render/pdf.module.css';

interface Props {
  pdfUrl: string | undefined;
}

function RenderPDF({ pdfUrl }: Props): React.ReactElement {
  return (
    <>
      <iframe className={styles.pdf_cont} src={pdfUrl}></iframe>
    </>
  );
}

export default RenderPDF;

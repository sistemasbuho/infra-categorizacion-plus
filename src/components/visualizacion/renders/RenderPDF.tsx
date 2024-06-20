import styles from '../../../assets/css/components/render/pdf.module.css';

interface Props {
  pdfUrl: string;
}

function RenderPDF({ pdfUrl }: Props): React.ReactElement {
  console.log(pdfUrl);

  return (
    <>
      <iframe
        className={styles.pdf_cont}
        src="https://www.colomos.ceti.mx/documentos/goe/mujeresQueAmanDemasiado.pdf"
      ></iframe>
    </>
  );
}

export default RenderPDF;

import style from '../assets/css/components/keywordSearch.module.css';
import { useConfig } from '../context/ConfigContext';

function SummaryArticle({ text }) {
  const { fontSize } = useConfig();

  return (
    <div className={style.container}>
      <p style={{ fontSize: fontSize }}>{text}</p>
    </div>
  );
}

export default SummaryArticle;
